export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  resume_url: string;
  avatar_url: string;
  expertise?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string;
  image_url: string;
  tech_stack: string[];
  category: string;
  github_url: string;
  live_url: string;
  video_url: string;
  features: string[];
  featured: boolean;
  sort_order: number;
  created_at: string;
  media?: ProjectMedia[];
  iframe_url?: string;
  code_snippet?: string;
  code_language?: string;
  images?: string[];
  compliance?: string[];
  security_features?: string[];
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  url: string;
  type: "image" | "video";
  caption: string;
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency?: number;
  icon_name?: string;
  sort_order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string | null;
  sort_order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}
