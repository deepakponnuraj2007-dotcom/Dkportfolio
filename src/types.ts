export type SectionId = 'home' | 'experience' | 'projects' | 'about' | 'skills' | 'feats' | 'admin';

export type DKFontStyle = 'unbounded' | 'syne' | 'cinzel' | 'space' | 'mono';

export interface PersonalInfo {
  name: string;
  fullName: string;
  initials: string;
  dkFontStyle?: DKFontStyle;
  degree: string;
  college: string;
  academicYear: string;
  careerGoal: string;
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter?: string;
  youtube?: string;
  leetcode: string;
  bioShort: string;
  bioLong: string[];
  customAvatarUrl?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  isDark?: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  type: string;
  location: string;
  description: string;
  tags: string[];
  points: string[];
}

export interface SkillCategoryItem {
  id: string;
  title: string;
  tagline: string;
  codeInHeader: string;
  codeInList: string[];
  toolsHeader: string;
  toolsList: string[];
}

export interface FeatItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  subtitle: string;
  date?: string;
  link?: string;
  type: 'leetcode' | 'card' | 'cert';
  stats?: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
    rating: number;
    globalRank: string;
  };
  imageType?: string;
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  skillCategories: SkillCategoryItem[];
  feats: FeatItem[];
}
