export interface Education {
  degree: string;
  major: string;
  university: string;
  year: number;
}

export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;
  poster?: string;
}

export interface Project {
  title: string;
  role: string;
  year: number;
  description: string;
  tags: string[];
  link: string;
  card_gradient_angle: number;
  media?: ProjectMedia;
}

export interface TeamMember {
  slug: string;
  name: string;
  display_name_bg: string;
  role: string;
  avatar: string;
  avatar_alt: string;
  linkedin: string;
  github: string;
  skills: string[];
  tools: string[];
  languages: string[];
  education: Education;
  bio_short: string;
  projects: Project[];
  order: number;
  body: string;
}
