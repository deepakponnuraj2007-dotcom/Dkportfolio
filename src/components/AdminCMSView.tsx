import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Download,
  Upload,
  ArrowLeft,
  Briefcase,
  FolderGit2,
  User,
  Zap,
  Award,
  BookOpen,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Code2,
  Sparkles,
  Lock,
  X,
  Cloud,
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectItem, ExperienceItem, SkillCategoryItem, FeatItem } from '../types';
import { ConfirmDialogModal } from './ConfirmDialogModal';
import { AdminSplitScreenReveal } from './AdminSplitScreenReveal';

interface AdminCMSViewProps {
  onBackToPortfolio: () => void;
  onLockAdmin?: () => void;
  onReplayBoot?: () => void;
}

type AdminTab = 'profile' | 'projects' | 'experience' | 'about' | 'skills' | 'feats' | 'data';

export const AdminCMSView: React.FC<AdminCMSViewProps> = ({
  onBackToPortfolio,
  onLockAdmin,
  onReplayBoot,
}) => {
  const {
    personalInfo,
    projects,
    experiences,
    skillCategories,
    feats,
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
    isCloudSynced,
    isSavingToCloud,
    hasUnsavedChanges,
    saveToCloud,
    fetchFromCloud,
    lastSyncedTime,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [replayRevealKey, setReplayRevealKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(() => {
    return !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Sync fullscreen state with browser events and engage full page mode on entrance
  useEffect(() => {
    const handleFullscreenSync = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenSync);
    document.addEventListener('webkitfullscreenchange', handleFullscreenSync);
    document.addEventListener('mozfullscreenchange', handleFullscreenSync);
    document.addEventListener('MSFullscreenChange', handleFullscreenSync);

    // Request fullscreen on entrance for Admin Page
    const docEl = document.documentElement as any;
    if (!document.fullscreenElement) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen().catch(() => {});
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen().catch(() => {});
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen().catch(() => {});
      }
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenSync);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenSync);
      document.removeEventListener('mozfullscreenchange', handleFullscreenSync);
      document.removeEventListener('MSFullscreenChange', handleFullscreenSync);
    };
  }, []);

  const toggleFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement as any;
    if (isFullscreen) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen().catch(() => {});
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen().catch(() => {});
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen().catch(() => {});
      }
    } else {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen().catch(() => {});
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen().catch(() => {});
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen().catch(() => {});
      }
    }
  };

  // In-app Delete & Destructive Action Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Delete',
    isDestructive: true,
    onConfirm: () => {},
  });

  // Form State for Modals
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<{
    title: string;
    description: string;
    tags: string;
    githubUrl: string;
    liveUrl: string;
  }>({ title: '', description: '', tags: '', githubUrl: '', liveUrl: '' });

  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [experienceForm, setExperienceForm] = useState<{
    company: string;
    role: string;
    period: string;
    type: string;
    location: string;
    description: string;
    tags: string;
    points: string;
  }>({
    company: '',
    role: '',
    period: '',
    type: 'CAREER TRACK',
    location: '',
    description: '',
    tags: '',
    points: '',
  });

  const [editingFeat, setEditingFeat] = useState<FeatItem | null>(null);
  const [isAddingFeat, setIsAddingFeat] = useState(false);
  const [featForm, setFeatForm] = useState<{
    title: string;
    category: string;
    subtitle: string;
    tags: string;
    type: 'leetcode' | 'card' | 'cert';
    date: string;
    link: string;
    leetcodeTotal: number;
    leetcodeEasy: number;
    leetcodeMedium: number;
    leetcodeHard: number;
    leetcodeRating: number;
    leetcodeRank: string;
  }>({
    title: '',
    category: 'Certifications',
    subtitle: '',
    tags: '',
    type: 'cert',
    date: 'Verified',
    link: '',
    leetcodeTotal: 708,
    leetcodeEasy: 219,
    leetcodeMedium: 384,
    leetcodeHard: 105,
    leetcodeRating: 2067,
    leetcodeRank: 'Top 1.8%',
  });

  const [editingSkillCategory, setEditingSkillCategory] = useState<SkillCategoryItem | null>(null);
  const [isAddingSkillCategory, setIsAddingSkillCategory] = useState(false);
  const [skillCatForm, setSkillCatForm] = useState<{
    title: string;
    tagline: string;
    codeInHeader: string;
    codeInList: string;
    toolsHeader: string;
    toolsList: string;
  }>({
    title: '',
    tagline: '',
    codeInHeader: 'I LIKE TO CODE IN',
    codeInList: '',
    toolsHeader: 'TOOLS & FRAMEWORKS',
    toolsList: '',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Safe In-App Confirmation Handlers (Never relies on blocked window.confirm)
  const handleRequestDeleteProject = (proj: ProjectItem) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Project: ${proj.title}?`,
      message: `Are you sure you want to permanently delete "${proj.title}"? This item will be removed from your portfolio projects track.`,
      confirmLabel: 'Delete Project',
      isDestructive: true,
      onConfirm: () => {
        deleteProject(proj.id);
        showToast(`Deleted project "${proj.title}"`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestDeleteExperience = (exp: ExperienceItem) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Experience: ${exp.company}?`,
      message: `Are you sure you want to delete ${exp.role} at ${exp.company}? This record will be removed from your timeline.`,
      confirmLabel: 'Delete Experience',
      isDestructive: true,
      onConfirm: () => {
        deleteExperience(exp.id);
        showToast(`Deleted experience "${exp.company}"`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestDeleteSkillCategory = (cat: SkillCategoryItem) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Category: ${cat.title}?`,
      message: `Are you sure you want to delete the skill category "${cat.title}" and its listed tools?`,
      confirmLabel: 'Delete Category',
      isDestructive: true,
      onConfirm: () => {
        deleteSkillCategory(cat.id);
        showToast(`Deleted skill category "${cat.title}"`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestDeleteFeat = (feat: FeatItem) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Feat: ${feat.title}?`,
      message: `Are you sure you want to delete "${feat.title}"? This achievement will be removed from your profile.`,
      confirmLabel: 'Delete Feat',
      isDestructive: true,
      onConfirm: () => {
        deleteFeat(feat.id);
        showToast(`Deleted "${feat.title}"`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestReset = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Portfolio Data to Default?',
      message: 'Are you sure you want to reset all data back to the default portfolio template? Any custom edits or items you added will be reverted.',
      confirmLabel: 'Yes, Reset Everything',
      isDestructive: true,
      onConfirm: () => {
        resetToDefaults();
        showToast('Reset portfolio data back to defaults!');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleRequestDeleteParagraph = (idx: number) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Paragraph ${idx + 1}?`,
      message: 'Are you sure you want to delete this paragraph from your narrative About story?',
      confirmLabel: 'Delete Paragraph',
      isDestructive: true,
      onConfirm: () => {
        const updated = personalInfo.bioLong.filter((_, i) => i !== idx);
        updatePersonalInfo({ bioLong: updated });
        showToast(`Paragraph ${idx + 1} deleted`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleAddParagraph = () => {
    const updated = [
      ...personalInfo.bioLong,
      'When I am not developing software, I actively participate in hackathons, contribute to open-source software, and explore modern system architecture.',
    ];
    updatePersonalInfo({ bioLong: updated });
    showToast('New narrative paragraph added to About Me');
  };

  // Avatar file upload handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image is too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCustomAvatar(result);
          saveToCloud();
          showToast('Profile photo updated & saved!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Export JSON handler
  const handleExportJSON = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Portfolio configuration exported successfully!');
  };

  // Import JSON handler
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = importJSON(content);
          if (success) {
            showToast('Portfolio data restored successfully!');
          } else {
            showToast('Error: Invalid JSON configuration format');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Projects Handlers
  const handleOpenAddProject = () => {
    setProjectForm({
      title: '',
      description: '',
      tags: '#React, #TypeScript, #Tailwind',
      githubUrl: 'https://github.com',
      liveUrl: 'https://demo.app',
    });
    setEditingProject(null);
    setIsAddingProject(true);
  };

  const handleOpenEditProject = (p: ProjectItem) => {
    setProjectForm({
      title: p.title,
      description: p.description,
      tags: p.tags.join(', '),
      githubUrl: p.githubUrl,
      liveUrl: p.liveUrl || '',
    });
    setEditingProject(p);
    setIsAddingProject(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      showToast('Please provide a project title');
      return;
    }
    const tagsArray = projectForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    if (editingProject) {
      updateProject(editingProject.id, {
        title: projectForm.title,
        description: projectForm.description,
        tags: tagsArray,
        githubUrl: projectForm.githubUrl,
        liveUrl: projectForm.liveUrl,
      });
      showToast(`Project "${projectForm.title}" updated!`);
    } else {
      addProject({
        title: projectForm.title,
        description: projectForm.description,
        tags: tagsArray,
        githubUrl: projectForm.githubUrl,
        liveUrl: projectForm.liveUrl,
      });
      showToast(`New project "${projectForm.title}" added!`);
    }
    setIsAddingProject(false);
    setEditingProject(null);
    saveToCloud();
  };

  // Experiences Handlers
  const handleOpenAddExperience = () => {
    setExperienceForm({
      company: '',
      role: '',
      period: '2025 - Present',
      type: 'CAREER TRACK',
      location: 'Remote / India',
      description: '',
      tags: 'Full-Stack, React, Node.js, System Design',
      points: 'Architected scalable software modules\nOptimized sub-millisecond database queries\nBuilt accessible and responsive frontend UI',
    });
    setEditingExperience(null);
    setIsAddingExperience(true);
  };

  const handleOpenEditExperience = (exp: ExperienceItem) => {
    setExperienceForm({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      type: exp.type,
      location: exp.location,
      description: exp.description,
      tags: exp.tags.join(', '),
      points: exp.points.join('\n'),
    });
    setEditingExperience(exp);
    setIsAddingExperience(true);
  };

  const handleSaveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceForm.company.trim() || !experienceForm.role.trim()) {
      showToast('Company and Role are required');
      return;
    }
    const tagsArray = experienceForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const pointsArray = experienceForm.points
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    if (editingExperience) {
      updateExperience(editingExperience.id, {
        company: experienceForm.company,
        role: experienceForm.role,
        period: experienceForm.period,
        type: experienceForm.type,
        location: experienceForm.location,
        description: experienceForm.description,
        tags: tagsArray,
        points: pointsArray,
      });
      showToast(`Experience "${experienceForm.company}" updated!`);
    } else {
      addExperience({
        company: experienceForm.company,
        role: experienceForm.role,
        period: experienceForm.period,
        type: experienceForm.type,
        location: experienceForm.location,
        description: experienceForm.description,
        tags: tagsArray,
        points: pointsArray,
      });
      showToast(`New experience "${experienceForm.company}" added!`);
    }
    setIsAddingExperience(false);
    setEditingExperience(null);
    saveToCloud();
  };

  // Skill Categories Handlers
  const handleOpenAddSkillCategory = () => {
    setSkillCatForm({
      title: '',
      tagline: '',
      codeInHeader: 'I LIKE TO CODE IN',
      codeInList: 'React, TypeScript, Python, C++, Java, Node.js',
      toolsHeader: 'TOOLS & INFRASTRUCTURE',
      toolsList: 'Docker, PostgreSQL, MongoDB, Redis, Git, Linux',
    });
    setEditingSkillCategory(null);
    setIsAddingSkillCategory(true);
  };

  const handleOpenEditSkillCategory = (cat: SkillCategoryItem) => {
    setSkillCatForm({
      title: cat.title,
      tagline: cat.tagline,
      codeInHeader: cat.codeInHeader,
      codeInList: cat.codeInList.join(', '),
      toolsHeader: cat.toolsHeader,
      toolsList: cat.toolsList.join(', '),
    });
    setEditingSkillCategory(cat);
    setIsAddingSkillCategory(true);
  };

  const handleSaveSkillCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillCatForm.title.trim()) {
      showToast('Skill Category title is required');
      return;
    }
    const codeList = skillCatForm.codeInList.split(',').map((s) => s.trim()).filter(Boolean);
    const toolsList = skillCatForm.toolsList.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingSkillCategory) {
      updateSkillCategory(editingSkillCategory.id, {
        title: skillCatForm.title,
        tagline: skillCatForm.tagline,
        codeInHeader: skillCatForm.codeInHeader,
        codeInList: codeList,
        toolsHeader: skillCatForm.toolsHeader,
        toolsList: toolsList,
      });
      showToast(`Skill category "${skillCatForm.title}" updated!`);
    } else {
      addSkillCategory({
        title: skillCatForm.title,
        tagline: skillCatForm.tagline,
        codeInHeader: skillCatForm.codeInHeader,
        codeInList: codeList,
        toolsHeader: skillCatForm.toolsHeader,
        toolsList: toolsList,
      });
      showToast(`New skill category "${skillCatForm.title}" added!`);
    }
    setIsAddingSkillCategory(false);
    setEditingSkillCategory(null);
    saveToCloud();
  };

  // Feats Handlers
  const handleOpenAddFeat = () => {
    setFeatForm({
      title: '',
      category: 'Certifications',
      subtitle: '',
      tags: '#Award, #Verified, #Credential',
      type: 'cert',
      date: '2025',
      link: '',
      leetcodeTotal: 708,
      leetcodeEasy: 219,
      leetcodeMedium: 384,
      leetcodeHard: 105,
      leetcodeRating: 2067,
      leetcodeRank: 'Top 1.8%',
    });
    setEditingFeat(null);
    setIsAddingFeat(true);
  };

  const handleOpenEditFeat = (feat: FeatItem) => {
    setFeatForm({
      title: feat.title,
      category: feat.category,
      subtitle: feat.subtitle,
      tags: feat.tags.join(', '),
      type: feat.type,
      date: feat.date || '2025',
      link: feat.link || '',
      leetcodeTotal: feat.stats?.total || 708,
      leetcodeEasy: feat.stats?.easy || 219,
      leetcodeMedium: feat.stats?.medium || 384,
      leetcodeHard: feat.stats?.hard || 105,
      leetcodeRating: feat.stats?.rating || 2067,
      leetcodeRank: feat.stats?.globalRank || 'Top 1.8%',
    });
    setEditingFeat(feat);
    setIsAddingFeat(true);
  };

  const handleSaveFeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featForm.title.trim()) {
      showToast('Title is required');
      return;
    }
    const tagsArray = featForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const statsObj =
      featForm.type === 'leetcode'
        ? {
            total: Number(featForm.leetcodeTotal) || 0,
            easy: Number(featForm.leetcodeEasy) || 0,
            medium: Number(featForm.leetcodeMedium) || 0,
            hard: Number(featForm.leetcodeHard) || 0,
            rating: Number(featForm.leetcodeRating) || 0,
            globalRank: featForm.leetcodeRank,
          }
        : undefined;

    if (editingFeat) {
      updateFeat(editingFeat.id, {
        title: featForm.title,
        category: featForm.category,
        subtitle: featForm.subtitle,
        tags: tagsArray,
        type: featForm.type,
        date: featForm.date,
        link: featForm.link,
        stats: statsObj,
      });
      showToast(`Feat "${featForm.title}" updated!`);
    } else {
      addFeat({
        title: featForm.title,
        category: featForm.category,
        subtitle: featForm.subtitle,
        tags: tagsArray,
        type: featForm.type,
        date: featForm.date,
        link: featForm.link,
        stats: statsObj,
      });
      showToast(`New feat "${featForm.title}" added!`);
    }
    setIsAddingFeat(false);
    setEditingFeat(null);
    saveToCloud();
  };

  return (
    <div className="relative w-full h-screen bg-[#0E0E10] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Split-Screen Cinematic Entrance Animation */}
      <AdminSplitScreenReveal
        key={replayRevealKey}
        forceReplay={replayRevealKey > 0}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-white text-black font-mono text-xs font-bold rounded-xl shadow-2xl border-2 border-black animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar for Page 8 Admin CMS */}
      <header className="shrink-0 h-18 border-b border-white/10 px-6 md:px-10 flex items-center justify-between bg-black/60 backdrop-blur-md z-30">
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onBackToPortfolio}
            className="w-10 h-10 rounded-full border border-white/30 bg-black text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-md cursor-pointer shrink-0"
            title="Return to Portfolio View"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {onLockAdmin && (
            <button
              onClick={onLockAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all text-xs font-mono font-bold border border-rose-500/30"
              title="Lock Admin and Exit"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Lock Admin</span>
            </button>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase font-bold">
              Page 8
            </span>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-white font-heading">
              ADMIN CMS CONTROL PANEL
            </h1>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* PROMINENT HEADER SAVE OPTION (User Requested) */}
          <button
            id="admin-header-save-button"
            onClick={async () => {
              const ok = await saveToCloud();
              if (ok) {
                setJustSaved(true);
                setTimeout(() => setJustSaved(false), 3000);
                showToast('✅ Saved successfully! Live across all mobiles and devices.');
              } else {
                showToast('❌ Save failed. Please try again.');
              }
            }}
            disabled={isSavingToCloud}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg active:scale-95 cursor-pointer ${
              justSaved
                ? 'bg-emerald-400 text-black ring-2 ring-emerald-300'
                : hasUnsavedChanges
                ? 'bg-emerald-500 hover:bg-emerald-400 text-black ring-2 ring-emerald-300 animate-pulse shadow-emerald-500/50'
                : isSavingToCloud
                ? 'bg-sky-600 text-white cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 hover:shadow-emerald-600/30'
            }`}
            title="Save all edits and publish live across all mobiles, devices, and website"
          >
            {isSavingToCloud ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Saving...</span>
              </>
            ) : justSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-black" />
                <span>Saved to Live Site!</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="w-4 h-4 text-black" />
                <span>Save Changes</span>
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-white" />
                <span>Save Changes</span>
              </>
            )}
          </button>

          {/* Live Cloud Multi-Device Sync Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
            {isSavingToCloud ? (
              <span className="flex items-center gap-1.5 text-sky-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Cloud...</span>
              </span>
            ) : isCloudSynced ? (
              <span className="flex items-center gap-1.5 text-emerald-400" title="Changes are automatically persisted and available on all devices/mobiles">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live on All Mobiles</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Offline / Local</span>
              </span>
            )}
          </div>

          {/* Full Page Mode (Fullscreen) Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500 hover:text-black'
                : 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-black'
            }`}
            title={isFullscreen ? 'Exit Full Page Mode' : 'Enter Full Page Mode'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-white" />
            )}
            <span>{isFullscreen ? 'Full Page: ON' : 'Full Page Mode'}</span>
          </button>

          {/* Replay Cinematic Entrance Reveal */}
          <button
            onClick={() => setReplayRevealKey((prev) => prev + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-neutral-800 to-neutral-700 hover:from-white hover:to-white text-white hover:text-black transition-all text-xs font-mono font-bold border border-white/20 shadow-md cursor-pointer"
            title="Replay Split-Screen Cinematic Entrance Reveal"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Cinematic Reveal</span>
          </button>

          {onReplayBoot && (
            <button
              onClick={onReplayBoot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-all text-xs font-mono font-bold"
              title="Preview Loading Screen Animation"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Replay Boot</span>
            </button>
          )}

          <button
            onClick={handleExportJSON}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors text-xs font-mono"
            title="Download JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => jsonImportRef.current?.click()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors text-xs font-mono"
            title="Restore from JSON"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>
          <input
            type="file"
            ref={jsonImportRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={handleRequestReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors text-xs font-mono"
            title="Reset to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Main CMS Layout with Sidebar Tabs + Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Navigation Tabs */}
        <nav className="w-56 md:w-64 shrink-0 bg-[#131316] border-r border-white/10 p-4 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
              CMS Sections
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-black shadow-lg font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Page 1 & 7: Profile</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'experience'
                  ? 'bg-white text-black shadow-lg font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Page 2: Experience</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">{experiences.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-white text-black shadow-lg font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4" />
                <span>Page 3: Projects</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">{projects.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'about'
                  ? 'bg-white text-black shadow-lg font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <span>Page 4: About Me</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'skills'
                  ? 'bg-white text-black shadow-lg font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4" />
                <span>Page 5: Skills</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">{skillCategories.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('feats')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'feats'
                  ? 'bg-white text-black shadow-lg font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4" />
                <span>Page 6: Feats & Certs</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">{feats.length}</span>
            </button>
          </div>

          {/* Quick Info Box */}
          <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/20 text-[11px] font-mono text-neutral-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <Cloud className="w-3.5 h-3.5" />
              <span>Multi-Device Sync</span>
            </div>
            <p className="text-[10px] text-neutral-300 leading-tight">
              Changes made here (add, edit, delete) sync immediately to the server. Any mobile or device visiting the site sees your updates instantly!
            </p>
            {lastSyncedTime && (
              <p className="text-[9px] text-emerald-400/80 font-mono">
                Synced: {lastSyncedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </div>
        </nav>

        {/* Right Scrollable Content Pane */}
        <main className="flex-1 bg-[#09090b] overflow-y-auto p-6 md:p-10 no-scrollbar">
          {/* TAB 1: PROFILE & PERSONAL INFO */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl space-y-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                  Personal Information & Avatar (Pages 1 & 7)
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Update your display name, short bio, social links, and profile photo.
                </p>
              </div>

              {/* Photo Upload Section */}
              <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-28 h-36 rounded-xl border-2 border-white/40 overflow-hidden bg-black flex items-center justify-center shrink-0">
                  {personalInfo.customAvatarUrl ? (
                    <img
                      src={personalInfo.customAvatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center text-neutral-400">
                      <ImageIcon className="w-6 h-6 mb-1 text-white/40" />
                      <span className="text-[9px] font-mono">Default Vector Avatar</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-white">Profile Avatar Photo</h4>
                  <p className="text-xs text-neutral-400">
                    Upload your own custom image or retain the default custom illustration.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Image</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {personalInfo.customAvatarUrl && (
                      <button
                        onClick={() => {
                          resetAvatar();
                          showToast('Reset avatar to default illustration');
                        }}
                        className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-mono"
                      >
                        Reset to Default
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details Form */}
              <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-6">
                {/* Monogram & Font Style Picker */}
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Top-Left Logo Initials & Font Style</span>
                      </h4>
                      <p className="text-xs text-neutral-400">
                        Choose your monogram text and custom typographic font family.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-mono text-neutral-400">Initials:</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={personalInfo.initials || 'DK'}
                        onChange={(e) => updatePersonalInfo({ initials: e.target.value.toUpperCase() })}
                        className="w-20 px-3 py-1.5 rounded-lg bg-black border border-white/30 text-white font-black text-center text-sm uppercase tracking-widest focus:border-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Font Style Presets */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2">
                    {[
                      { id: 'unbounded', name: 'Unbounded', font: "'Unbounded', sans-serif", desc: 'Modern Bold', weight: 900 },
                      { id: 'syne', name: 'Syne', font: "'Syne', sans-serif", desc: 'Avant-Garde', weight: 800 },
                      { id: 'cinzel', name: 'Cinzel', font: "'Cinzel', serif", desc: 'Luxury Serif', weight: 800 },
                      { id: 'space', name: 'Space Grotesk', font: "'Space Grotesk', sans-serif", desc: 'Tech Clean', weight: 700 },
                      { id: 'mono', name: 'JetBrains', font: "'JetBrains Mono', monospace", desc: 'Terminal Code', weight: 700 },
                    ].map((fontItem) => {
                      const isSelected = (personalInfo.dkFontStyle || 'unbounded') === fontItem.id;
                      return (
                        <button
                          key={fontItem.id}
                          type="button"
                          onClick={() => {
                            updatePersonalInfo({ dkFontStyle: fontItem.id as any });
                            showToast(`DK logo font changed to ${fontItem.name}`);
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02]'
                              : 'bg-neutral-900/80 hover:bg-neutral-800 text-white/80 hover:text-white border-white/10'
                          }`}
                        >
                          <span
                            className="text-xl tracking-tight leading-none"
                            style={{ fontFamily: fontItem.font, fontWeight: fontItem.weight }}
                          >
                            {(personalInfo.initials || 'DK').toUpperCase()}
                          </span>
                          <span className={`text-[10px] font-mono leading-none ${isSelected ? 'text-black/70 font-semibold' : 'text-neutral-400'}`}>
                            {fontItem.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={personalInfo.name}
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Degree / Major</label>
                    <input
                      type="text"
                      value={personalInfo.degree}
                      onChange={(e) => updatePersonalInfo({ degree: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">College / University</label>
                    <input
                      type="text"
                      value={personalInfo.college}
                      onChange={(e) => updatePersonalInfo({ college: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Career Goal / Target</label>
                    <input
                      type="text"
                      value={personalInfo.careerGoal}
                      onChange={(e) => updatePersonalInfo({ careerGoal: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono text-neutral-400 mb-1">
                      Short Bio (Page 7 Split Hero text)
                    </label>
                    <textarea
                      rows={3}
                      value={personalInfo.bioShort}
                      onChange={(e) => updatePersonalInfo({ bioShort: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={personalInfo.github}
                      onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">LinkedIn URL</label>
                    <input
                      type="url"
                      value={personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={personalInfo.instagram || ''}
                      onChange={(e) => updatePersonalInfo({ instagram: e.target.value })}
                      placeholder="https://instagram.com/username"
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">LeetCode URL</label>
                    <input
                      type="url"
                      value={personalInfo.leetcode}
                      onChange={(e) => updatePersonalInfo({ leetcode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <p className="text-xs font-mono text-neutral-400">
                    {hasUnsavedChanges ? '● Unsaved changes pending' : '✓ All changes saved'}
                  </p>
                  <button
                    onClick={async () => {
                      const ok = await saveToCloud();
                      if (ok) {
                        setJustSaved(true);
                        setTimeout(() => setJustSaved(false), 2500);
                        showToast('Profile details saved & live across all mobiles!');
                      } else {
                        showToast('Save failed. Please retry.');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS (PAGE 3) */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                    Projects Manager (Page 3)
                  </h2>
                  <p className="text-xs font-mono text-neutral-400">
                    Add new projects, edit cards, or delete items from the horizontal swipe track.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProject}
                  className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Add / Edit Project Form Modal */}
              {isAddingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                  <div className="relative w-full max-w-2xl my-8 p-6 md:p-8 rounded-2xl bg-[#18181b] border-2 border-white/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{editingProject ? '✏️ Edit Project' : '➕ Add New Project'}</span>
                        {editingProject && (
                          <span className="text-xs font-mono font-normal text-neutral-400">
                            ({editingProject.title})
                          </span>
                        )}
                      </h3>
                      <button
                        onClick={() => setIsAddingProject(false)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                        title="Close Form"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Distributed Cache Engine"
                            value={projectForm.title}
                            onChange={(e) =>
                              setProjectForm({ ...projectForm, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            placeholder="#React, #TypeScript, #Go, #Redis"
                            value={projectForm.tags}
                            onChange={(e) =>
                              setProjectForm({ ...projectForm, tags: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Description *
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Brief technical summary of the project, architecture, and impact."
                            value={projectForm.description}
                            onChange={(e) =>
                              setProjectForm({ ...projectForm, description: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            GitHub Repository URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://github.com/username/repo"
                            value={projectForm.githubUrl}
                            onChange={(e) =>
                              setProjectForm({ ...projectForm, githubUrl: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Live Demo URL (Optional)
                          </label>
                          <input
                            type="url"
                            placeholder="https://project.demo.app"
                            value={projectForm.liveUrl}
                            onChange={(e) =>
                              setProjectForm({ ...projectForm, liveUrl: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsAddingProject(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-mono"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-lg"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingProject ? 'Save Changes' : 'Add Project'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Projects Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-[#141416] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-base font-bold text-white leading-tight">
                          {proj.title}
                        </h4>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEditProject(proj)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRequestDeleteProject(proj)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-400 font-sans line-clamp-3 mb-4">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {proj.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-white/5 text-neutral-300 border border-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white flex items-center gap-1"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXPERIENCE (PAGE 2) */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                    Experience Manager (Page 2)
                  </h2>
                  <p className="text-xs font-mono text-neutral-400">
                    Manage internships, education tracks, roles, and bullet highlights.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddExperience}
                  className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* Add / Edit Experience Form Modal */}
              {isAddingExperience && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                  <div className="relative w-full max-w-2xl my-8 p-6 md:p-8 rounded-2xl bg-[#18181b] border-2 border-white/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{editingExperience ? '✏️ Edit Experience' : '➕ Add Experience Item'}</span>
                        {editingExperience && (
                          <span className="text-xs font-mono font-normal text-neutral-400">
                            ({editingExperience.company})
                          </span>
                        )}
                      </h3>
                      <button
                        onClick={() => setIsAddingExperience(false)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                        title="Close Form"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveExperience} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Company / Organization *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Google / Microsoft / Zoho"
                            value={experienceForm.company}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, company: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Role *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Software Engineering Intern"
                            value={experienceForm.role}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, role: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Period</label>
                          <input
                            type="text"
                            placeholder="2025 - Present"
                            value={experienceForm.period}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, period: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Type Badge</label>
                          <input
                            type="text"
                            placeholder="CAREER TRACK / INTERNSHIP / ACADEMIC"
                            value={experienceForm.type}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, type: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">Location</label>
                          <input
                            type="text"
                            placeholder="Remote / India / Hybrid"
                            value={experienceForm.location}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, location: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Skills Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            placeholder="Java, Spring Boot, MySQL, Kafka"
                            value={experienceForm.tags}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, tags: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Summary Description
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Overview of core technical responsibilities..."
                            value={experienceForm.description}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, description: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Bullet Highlights (One per line)
                          </label>
                          <textarea
                            rows={4}
                            placeholder="▶ Architected high throughput REST API endpoints&#10;▶ Reduced latency by 45% using Redis caching&#10;▶ Mentored peer developers in competitive programming"
                            value={experienceForm.points}
                            onChange={(e) =>
                              setExperienceForm({ ...experienceForm, points: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsAddingExperience(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-mono"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-lg"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingExperience ? 'Save Changes' : 'Add Experience'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Experience List Cards */}
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-6 rounded-2xl bg-[#141416] border border-white/10 flex flex-col md:flex-row items-start justify-between gap-6"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{exp.company}</h3>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-white/10 text-neutral-300 border border-white/20">
                          {exp.type}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-neutral-200">{exp.role}</p>
                      <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                        <span>{exp.period}</span>
                        <span>•</span>
                        <span>{exp.location}</span>
                      </div>
                      <p className="text-xs text-neutral-300 font-sans">{exp.description}</p>

                      <div className="space-y-1 pt-1">
                        {exp.points.slice(0, 2).map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-neutral-400">
                            <span className="text-white shrink-0">▶</span>
                            <span className="line-clamp-1">{pt}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {exp.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-white/5 text-neutral-400 border border-white/10"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOpenEditExperience(exp)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                        title="Edit Experience"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRequestDeleteExperience(exp)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT ME (PAGE 4) */}
          {activeTab === 'about' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                  About Me Content (Page 4)
                </h2>
                <p className="text-xs font-mono text-neutral-400">
                  Manage the narrative story paragraphs displayed on the starry background About screen.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#141416] border border-white/10 space-y-6">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">
                    Academic Year / Timeline Banner
                  </label>
                  <input
                    type="text"
                    value={personalInfo.academicYear}
                    onChange={(e) => updatePersonalInfo({ academicYear: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-neutral-400">
                      Narrative Story Paragraphs (Page 4)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddParagraph}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors text-xs font-mono flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  {personalInfo.bioLong.map((para, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span className="font-bold text-white">Paragraph {idx + 1}</span>
                        {personalInfo.bioLong.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRequestDeleteParagraph(idx)}
                            className="p-1 rounded-md text-rose-400 hover:text-white hover:bg-rose-500/20 transition-colors flex items-center gap-1 text-[11px]"
                            title="Delete Paragraph"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={para}
                        onChange={(e) => {
                          const updated = [...personalInfo.bioLong];
                          updated[idx] = e.target.value;
                          updatePersonalInfo({ bioLong: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await saveToCloud();
                      if (ok) {
                        setJustSaved(true);
                        setTimeout(() => setJustSaved(false), 2500);
                        showToast('About narrative saved & live across all mobiles!');
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save About Content</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SKILLS & TECH STACK (PAGE 5) */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                    Skills & Tech Stack Manager (Page 5)
                  </h2>
                  <p className="text-xs font-mono text-neutral-400">
                    Manage your skill categories, coding languages, and infrastructure tools.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddSkillCategory}
                  className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Skill Category</span>
                </button>
              </div>

              {/* Add / Edit Skill Category Form Modal */}
              {isAddingSkillCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                  <div className="relative w-full max-w-2xl my-8 p-6 md:p-8 rounded-2xl bg-[#18181b] border-2 border-white/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{editingSkillCategory ? '✏️ Edit Skill Category' : '➕ Add Skill Category'}</span>
                        {editingSkillCategory && (
                          <span className="text-xs font-mono font-normal text-neutral-400">
                            ({editingSkillCategory.title})
                          </span>
                        )}
                      </h3>
                      <button
                        onClick={() => setIsAddingSkillCategory(false)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                        title="Close Form"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveSkillCategory} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Category Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Cloud & DevOps"
                            value={skillCatForm.title}
                            onChange={(e) =>
                              setSkillCatForm({ ...skillCatForm, title: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Tagline / Domain summary
                          </label>
                          <input
                            type="text"
                            placeholder="Building resilient cloud architectures with microservices."
                            value={skillCatForm.tagline}
                            onChange={(e) =>
                              setSkillCatForm({ ...skillCatForm, tagline: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Coding Languages (comma separated)
                          </label>
                          <input
                            type="text"
                            placeholder="React, TypeScript, Python, C++, Java, Node.js"
                            value={skillCatForm.codeInList}
                            onChange={(e) =>
                              setSkillCatForm({ ...skillCatForm, codeInList: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-mono text-neutral-400 mb-1">
                            Tools & Infrastructure (comma separated)
                          </label>
                          <input
                            type="text"
                            placeholder="Docker, Kubernetes, AWS, PostgreSQL, Redis, Linux, GraphQL"
                            value={skillCatForm.toolsList}
                            onChange={(e) =>
                              setSkillCatForm({ ...skillCatForm, toolsList: e.target.value })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsAddingSkillCategory(false)}
                          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-mono"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-lg bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-lg"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{editingSkillCategory ? 'Save Changes' : 'Add Category'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Skill Categories Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-6 rounded-2xl bg-[#141416] border border-white/10 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditSkillCategory(cat)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRequestDeleteSkillCategory(cat)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-400 font-sans mb-4">{cat.tagline}</p>

                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                            {cat.codeInHeader}
                          </span>
                          <p className="text-xs font-medium text-white">{cat.codeInList.join(', ')}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-1">
                            {cat.toolsHeader}
                          </span>
                          <p className="text-xs text-neutral-300">{cat.toolsList.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FEATS & CREDENTIALS (PAGE 6) */}
          {activeTab === 'feats' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                    Feats & Certifications Manager (Page 6)
                  </h2>
                  <p className="text-xs font-mono text-neutral-400">
                    Add certificates, hackathons, awards, or edit your real-time LeetCode problem stats.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddFeat}
                  className="px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Feat / Cert</span>
                </button>
              </div>

              {/* Add / Edit Feat Modal */}
              {isAddingFeat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                  <div className="relative w-full max-w-2xl my-8 p-6 md:p-8 rounded-2xl bg-[#18181b] border-2 border-white/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-white">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{editingFeat ? '✏️ Edit Feat / Cert' : '➕ Add Notable Feat'}</span>
                        {editingFeat && (
                          <span className="text-xs font-mono font-normal text-neutral-400">
                            ({editingFeat.title})
                          </span>
                        )}
                      </h3>
                      <button
                        onClick={() => setIsAddingFeat(false)}
                        className="p-1 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                        title="Close Form"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                  <form onSubmit={handleSaveFeat} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. AWS Certified Solutions Architect"
                          value={featForm.title}
                          onChange={(e) => setFeatForm({ ...featForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Category</label>
                        <input
                          type="text"
                          placeholder="Competitive Programming / Hackathons / Certifications"
                          value={featForm.category}
                          onChange={(e) => setFeatForm({ ...featForm, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Subtitle</label>
                        <input
                          type="text"
                          placeholder="Credential summary or contest achievement details"
                          value={featForm.subtitle}
                          onChange={(e) => setFeatForm({ ...featForm, subtitle: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">Card Type</label>
                        <select
                          value={featForm.type}
                          onChange={(e) =>
                            setFeatForm({
                              ...featForm,
                              type: e.target.value as 'leetcode' | 'card' | 'cert',
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                        >
                          <option value="cert">Verified Certification (Shield icon)</option>
                          <option value="card">General Feat / Award (Trophy icon)</option>
                          <option value="leetcode">LeetCode Stats Card</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-neutral-400 mb-1">
                          Date / Status
                        </label>
                        <input
                          type="text"
                          placeholder="2025 or Verified"
                          value={featForm.date}
                          onChange={(e) => setFeatForm({ ...featForm, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                        />
                      </div>

                      {/* If LeetCode Card, show numeric stat editors */}
                      {featForm.type === 'leetcode' && (
                        <div className="md:col-span-2 p-4 rounded-xl bg-black/60 border border-white/15 space-y-3">
                          <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                            LeetCode Metric Stats
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono text-neutral-400">
                                Total Solved
                              </label>
                              <input
                                type="number"
                                value={featForm.leetcodeTotal}
                                onChange={(e) =>
                                  setFeatForm({ ...featForm, leetcodeTotal: Number(e.target.value) })
                                }
                                className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-emerald-400">Easy</label>
                              <input
                                type="number"
                                value={featForm.leetcodeEasy}
                                onChange={(e) =>
                                  setFeatForm({ ...featForm, leetcodeEasy: Number(e.target.value) })
                                }
                                className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-amber-400">Medium</label>
                              <input
                                type="number"
                                value={featForm.leetcodeMedium}
                                onChange={(e) =>
                                  setFeatForm({ ...featForm, leetcodeMedium: Number(e.target.value) })
                                }
                                className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-rose-400">Hard</label>
                              <input
                                type="number"
                                value={featForm.leetcodeHard}
                                onChange={(e) =>
                                  setFeatForm({ ...featForm, leetcodeHard: Number(e.target.value) })
                                }
                                className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-neutral-400">
                                Contest Rating
                              </label>
                              <input
                                type="number"
                                value={featForm.leetcodeRating}
                                onChange={(e) =>
                                  setFeatForm({ ...featForm, leetcodeRating: Number(e.target.value) })
                                }
                                className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-neutral-400">
                                Global Rank
                              </label>
                              <input
                                type="text"
                                value={featForm.leetcodeRank}
                                onChange={(e) =>
                                  setFeatForm({ ...featForm, leetcodeRank: e.target.value })
                                }
                                className="w-full px-2 py-1.5 rounded-lg bg-black border border-white/20 text-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="md:col-span-2">
                        <label className="block text-xs font-mono text-neutral-400 mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="#Algorithms, #Cloud, #Security"
                          value={featForm.tags}
                          onChange={(e) => setFeatForm({ ...featForm, tags: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-white text-sm focus:border-white focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsAddingFeat(false)}
                        className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 text-xs font-mono"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-lg"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingFeat ? 'Save Changes' : 'Add Feat'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

              {/* Feats Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feats.map((feat) => (
                  <div
                    key={feat.id}
                    className="p-5 rounded-2xl bg-[#141416] border border-white/10 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-white/10 text-neutral-300">
                            {feat.type}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono">{feat.category}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleOpenEditFeat(feat)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                            title="Edit Feat"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRequestDeleteFeat(feat)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                            title="Delete Feat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white leading-tight mb-1">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-sans line-clamp-2">
                        {feat.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span>{feat.tags.slice(0, 2).join(' ')}</span>
                      <span>{feat.date || '2025'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Reusable In-App Confirmation Dialog Modal */}
      <ConfirmDialogModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        itemName={confirmModal.itemName}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
