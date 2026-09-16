import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  PortfolioData,
  PersonalInfo,
  ProjectItem,
  ExperienceItem,
  SkillCategoryItem,
  FeatItem
} from '../types';
import { INITIAL_PORTFOLIO_DATA } from '../data/portfolioData';

const LOCAL_STORAGE_KEY = 'dk_portfolio_cms_data_v1';

interface PortfolioContextType {
  data: PortfolioData;
  personalInfo: PersonalInfo;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  skillCategories: SkillCategoryItem[];
  feats: FeatItem[];
  
  // Cloud & Multi-device Sync State
  isCloudSynced: boolean;
  isSavingToCloud: boolean;
  hasUnsavedChanges: boolean;
  lastSyncedTime: Date | null;
  saveToCloud: (dataOverride?: PortfolioData) => Promise<boolean>;
  fetchFromCloud: (force?: boolean) => Promise<boolean>;

  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  setCustomAvatar: (dataUrl: string) => void;
  resetAvatar: () => void;
  
  // Projects
  addProject: (project: Omit<ProjectItem, 'id'> & { id?: string }) => void;
  updateProject: (id: string, project: Partial<ProjectItem>) => void;
  deleteProject: (id: string) => void;
  
  // Experiences
  addExperience: (experience: Omit<ExperienceItem, 'id'> & { id?: string }) => void;
  updateExperience: (id: string, experience: Partial<ExperienceItem>) => void;
  deleteExperience: (id: string) => void;
  
  // Skills
  addSkillCategory: (category: Omit<SkillCategoryItem, 'id'> & { id?: string }) => void;
  updateSkillCategory: (id: string, category: Partial<SkillCategoryItem>) => void;
  deleteSkillCategory: (id: string) => void;
  
  // Feats
  addFeat: (feat: Omit<FeatItem, 'id'> & { id?: string }) => void;
  updateFeat: (id: string, feat: Partial<FeatItem>) => void;
  deleteFeat: (id: string) => void;
  
  // Reset & Backup
  resetToDefaults: () => Promise<void>;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with localStorage cache (or default)
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.personalInfo && parsed.projects && parsed.experiences && parsed.skillCategories && parsed.feats) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load saved portfolio data from localStorage:', err);
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(null);

  // Keep a stable ref to data to prevent dependency loops in effects and callbacks
  const dataRef = useRef<PortfolioData>(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const hasUnsavedChangesRef = useRef<boolean>(false);
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const lastServerTimestampRef = useRef<number>(0);
  const isSavingRef = useRef<boolean>(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to persist to localStorage safely
  const persistLocally = (portfolioData: PortfolioData) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(portfolioData));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  // 1. Save data to Cloud Server (Persisted across all mobiles and devices)
  const saveToCloud = useCallback(async (dataOverride?: PortfolioData): Promise<boolean> => {
    // Clear any pending debounced auto-save since we are saving now
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    const payloadData = dataOverride || dataRef.current;
    isSavingRef.current = true;
    setIsSavingToCloud(true);

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: payloadData }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();

      if (json.success) {
        lastServerTimestampRef.current = json.updatedAt;
        setLastSyncedTime(new Date(json.updatedAt));
        setIsCloudSynced(true);
        setHasUnsavedChanges(false);
        persistLocally(payloadData);

        // Notify other open tabs/windows
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'DATA_UPDATED',
            updatedAt: json.updatedAt,
          });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to save to cloud server:', err);
      return false;
    } finally {
      isSavingRef.current = false;
      setIsSavingToCloud(false);
    }
  }, []);

  // 2. Fetch latest persistent data from Cloud Server
  const fetchFromCloud = useCallback(async (force = false): Promise<boolean> => {
    // Never overwrite if user is actively in the middle of typing or has unsaved changes, unless forced
    if (!force && hasUnsavedChangesRef.current) {
      return false;
    }

    try {
      const res = await fetch('/api/portfolio', {
        headers: { credentials: 'omit' },
        cache: 'no-store',
      });
      if (!res.ok) return false;
      const json = await res.json();
      if (json.success) {
        if (json.data && json.data.personalInfo && json.data.projects) {
          // If server data is newer or on first load
          if (force || json.updatedAt > lastServerTimestampRef.current || lastServerTimestampRef.current === 0) {
            setData(json.data);
            persistLocally(json.data);
            lastServerTimestampRef.current = json.updatedAt || Date.now();
            setLastSyncedTime(new Date(lastServerTimestampRef.current));
            setIsCloudSynced(true);
            setHasUnsavedChanges(false);
            return true;
          }
        } else if (json.data === null) {
          // Server database file is empty or new; seed server with current data
          await saveToCloud(dataRef.current);
          setIsCloudSynced(true);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.warn('Could not fetch cloud data (offline mode active):', err);
      return false;
    }
  }, [saveToCloud]);

  // Schedule auto-save to cloud whenever data is updated
  const applyDataUpdate = (nextData: PortfolioData) => {
    setData(nextData);
    persistLocally(nextData);
    setHasUnsavedChanges(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounced background save so typing is smooth, while header Save button saves immediately
    saveTimeoutRef.current = setTimeout(() => {
      saveToCloud(nextData);
    }, 1200);
  };

  // Initial fetch on mount & background sync listeners
  useEffect(() => {
    // Initial fetch once on mount
    fetchFromCloud(false);

    // Broadcast channel for instantaneous cross-tab sync in same browser
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('deepak_portfolio_sync');
        channel.onmessage = (event) => {
          if (event.data?.type === 'DATA_UPDATED') {
            if (!hasUnsavedChangesRef.current) {
              fetchFromCloud(true);
            }
          }
        };
        broadcastChannelRef.current = channel;
      } catch {
        // BroadcastChannel optional
      }
    }

    // Periodic lightweight polling to detect if another mobile/device made edits
    const interval = setInterval(async () => {
      if (isSavingRef.current || hasUnsavedChangesRef.current) return;
      try {
        const res = await fetch('/api/portfolio/version', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.updatedAt && json.updatedAt > lastServerTimestampRef.current) {
            console.log('[Sync] Remote changes detected from another device. Fetching latest data...');
            fetchFromCloud(true);
          }
        }
      } catch {
        // Silently ignore network hiccups during background poll
      }
    }, 6000);

    // When user switches back to mobile browser / window tab
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' && !isSavingRef.current && !hasUnsavedChangesRef.current) {
        fetchFromCloud(false);
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [fetchFromCloud]);

  // Personal info methods
  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    const next = {
      ...dataRef.current,
      personalInfo: {
        ...dataRef.current.personalInfo,
        ...info,
      },
    };
    applyDataUpdate(next);
  };

  const setCustomAvatar = (dataUrl: string) => {
    const next = {
      ...dataRef.current,
      personalInfo: {
        ...dataRef.current.personalInfo,
        customAvatarUrl: dataUrl,
      },
    };
    applyDataUpdate(next);
  };

  const resetAvatar = () => {
    const nextInfo = { ...dataRef.current.personalInfo };
    delete nextInfo.customAvatarUrl;
    const next = {
      ...dataRef.current,
      personalInfo: nextInfo,
    };
    applyDataUpdate(next);
  };

  // Projects CRUD
  const addProject = (project: Omit<ProjectItem, 'id'> & { id?: string }) => {
    const newProject: ProjectItem = {
      ...project,
      id: project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const next = {
      ...dataRef.current,
      projects: [newProject, ...dataRef.current.projects],
    };
    applyDataUpdate(next);
  };

  const updateProject = (id: string, updatedFields: Partial<ProjectItem>) => {
    const next = {
      ...dataRef.current,
      projects: dataRef.current.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    };
    applyDataUpdate(next);
  };

  const deleteProject = (id: string) => {
    const next = {
      ...dataRef.current,
      projects: dataRef.current.projects.filter((p) => p.id !== id),
    };
    applyDataUpdate(next);
  };

  // Experiences CRUD
  const addExperience = (experience: Omit<ExperienceItem, 'id'> & { id?: string }) => {
    const newExp: ExperienceItem = {
      ...experience,
      id: experience.id || `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const next = {
      ...dataRef.current,
      experiences: [newExp, ...dataRef.current.experiences],
    };
    applyDataUpdate(next);
  };

  const updateExperience = (id: string, updatedFields: Partial<ExperienceItem>) => {
    const next = {
      ...dataRef.current,
      experiences: dataRef.current.experiences.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)),
    };
    applyDataUpdate(next);
  };

  const deleteExperience = (id: string) => {
    const next = {
      ...dataRef.current,
      experiences: dataRef.current.experiences.filter((e) => e.id !== id),
    };
    applyDataUpdate(next);
  };

  // Skills CRUD
  const addSkillCategory = (category: Omit<SkillCategoryItem, 'id'> & { id?: string }) => {
    const newCat: SkillCategoryItem = {
      ...category,
      id: category.id || `skillcat_${Date.now()}`,
    };
    const next = {
      ...dataRef.current,
      skillCategories: [...dataRef.current.skillCategories, newCat],
    };
    applyDataUpdate(next);
  };

  const updateSkillCategory = (id: string, updatedFields: Partial<SkillCategoryItem>) => {
    const next = {
      ...dataRef.current,
      skillCategories: dataRef.current.skillCategories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)),
    };
    applyDataUpdate(next);
  };

  const deleteSkillCategory = (id: string) => {
    const next = {
      ...dataRef.current,
      skillCategories: dataRef.current.skillCategories.filter((c) => c.id !== id),
    };
    applyDataUpdate(next);
  };

  // Feats CRUD
  const addFeat = (feat: Omit<FeatItem, 'id'> & { id?: string }) => {
    const newFeat: FeatItem = {
      ...feat,
      id: feat.id || `feat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const next = {
      ...dataRef.current,
      feats: [newFeat, ...dataRef.current.feats],
    };
    applyDataUpdate(next);
  };

  const updateFeat = (id: string, updatedFields: Partial<FeatItem>) => {
    const next = {
      ...dataRef.current,
      feats: dataRef.current.feats.map((f) => (f.id === id ? { ...f, ...updatedFields } : f)),
    };
    applyDataUpdate(next);
  };

  const deleteFeat = (id: string) => {
    const next = {
      ...dataRef.current,
      feats: dataRef.current.feats.filter((f) => f.id !== id),
    };
    applyDataUpdate(next);
  };

  // Reset & Backup
  const resetToDefaults = async () => {
    setData(INITIAL_PORTFOLIO_DATA);
    persistLocally(INITIAL_PORTFOLIO_DATA);
    setHasUnsavedChanges(false);
    try {
      await fetch('/api/portfolio/reset', { method: 'POST' });
      await saveToCloud(INITIAL_PORTFOLIO_DATA);
    } catch (err) {
      console.error('Failed to reset on cloud server:', err);
    }
  };

  const exportJSON = (): string => {
    return JSON.stringify(dataRef.current, null, 2);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.personalInfo && parsed.projects && parsed.experiences && parsed.skillCategories && parsed.feats) {
        applyDataUpdate(parsed);
        saveToCloud(parsed);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Invalid JSON structure for import:', err);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        personalInfo: data.personalInfo,
        projects: data.projects,
        experiences: data.experiences,
        skillCategories: data.skillCategories,
        feats: data.feats,
        isCloudSynced,
        isSavingToCloud,
        hasUnsavedChanges,
        lastSyncedTime,
        saveToCloud,
        fetchFromCloud,
        updatePersonalInfo,
        setCustomAvatar,
        resetAvatar,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        addSkillCategory,
        updateSkillCategory,
        deleteSkillCategory,
        addFeat,
        updateFeat,
        deleteFeat,
        resetToDefaults,
        exportJSON,
        importJSON,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
