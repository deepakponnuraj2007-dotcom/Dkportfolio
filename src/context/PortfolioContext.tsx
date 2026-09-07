import React, { createContext, useContext, useState, useEffect } from 'react';
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
  resetToDefaults: () => void;
  exportJSON: () => string;
  importJSON: (jsonStr: string) => boolean;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Basic schema integrity check
        if (parsed.personalInfo && parsed.projects && parsed.experiences && parsed.skillCategories && parsed.feats) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load saved portfolio data from localStorage:', err);
    }
    return INITIAL_PORTFOLIO_DATA;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save portfolio data to localStorage:', err);
    }
  }, [data]);

  // Personal info methods
  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...info,
      },
    }));
  };

  const setCustomAvatar = (dataUrl: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        customAvatarUrl: dataUrl,
      },
    }));
  };

  const resetAvatar = () => {
    setData((prev) => {
      const nextInfo = { ...prev.personalInfo };
      delete nextInfo.customAvatarUrl;
      return {
        ...prev,
        personalInfo: nextInfo,
      };
    });
  };

  // Projects CRUD
  const addProject = (project: Omit<ProjectItem, 'id'> & { id?: string }) => {
    const newProject: ProjectItem = {
      ...project,
      id: project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
  };

  const updateProject = (id: string, updatedFields: Partial<ProjectItem>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  // Experiences CRUD
  const addExperience = (experience: Omit<ExperienceItem, 'id'> & { id?: string }) => {
    const newExp: ExperienceItem = {
      ...experience,
      id: experience.id || `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
  };

  const updateExperience = (id: string, updatedFields: Partial<ExperienceItem>) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  // Skills CRUD
  const addSkillCategory = (category: Omit<SkillCategoryItem, 'id'> & { id?: string }) => {
    const newCat: SkillCategoryItem = {
      ...category,
      id: category.id || `skillcat_${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      skillCategories: [...prev.skillCategories, newCat],
    }));
  };

  const updateSkillCategory = (id: string, updatedFields: Partial<SkillCategoryItem>) => {
    setData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)),
    }));
  };

  const deleteSkillCategory = (id: string) => {
    setData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.filter((c) => c.id !== id),
    }));
  };

  // Feats CRUD
  const addFeat = (feat: Omit<FeatItem, 'id'> & { id?: string }) => {
    const newFeat: FeatItem = {
      ...feat,
      id: feat.id || `feat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setData((prev) => ({
      ...prev,
      feats: [newFeat, ...prev.feats],
    }));
  };

  const updateFeat = (id: string, updatedFields: Partial<FeatItem>) => {
    setData((prev) => ({
      ...prev,
      feats: prev.feats.map((f) => (f.id === id ? { ...f, ...updatedFields } : f)),
    }));
  };

  const deleteFeat = (id: string) => {
    setData((prev) => ({
      ...prev,
      feats: prev.feats.filter((f) => f.id !== id),
    }));
  };

  // Reset & Backup
  const resetToDefaults = () => {
    setData(INITIAL_PORTFOLIO_DATA);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const exportJSON = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.personalInfo && parsed.projects && parsed.experiences && parsed.skillCategories && parsed.feats) {
        setData(parsed);
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
