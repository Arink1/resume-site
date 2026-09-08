-- Resume Portfolio Database Schema
-- Run this in your Supabase SQL Editor

-- Profile table (single row)
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  title text not null default '',
  bio text not null default '',
  email text not null default '',
  github_url text default '',
  linkedin_url text default '',
  resume_url text default '',
  avatar_url text default ''
);

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  long_description text default '',
  image_url text default '',
  tech_stack text[] default '{}',
  category text not null default 'Web App',
  github_url text default '',
  live_url text default '',
  video_url text default '',
  features text[] default '{}',
  featured boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Project media table (gallery images/videos per project)
create table if not exists project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  url text not null,
  type text not null default 'image',
  caption text default '',
  sort_order integer default 0
);

-- Skills table
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Other',
  proficiency integer default 50 check (proficiency >= 0 and proficiency <= 100),
  icon_name text default '',
  sort_order integer default 0
);

-- Experiences table
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  description text not null default '',
  start_date date not null,
  end_date date,
  sort_order integer default 0
);

-- Messages table (for contact form)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profile enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table experiences enable row level security;
alter table messages enable row level security;
alter table project_media enable row level security;

-- Public read policies
create policy "Public can read profile" on profile for select using (true);
create policy "Public can read projects" on projects for select using (true);
create policy "Public can read skills" on skills for select using (true);
create policy "Public can read experiences" on experiences for select using (true);
create policy "Public can read project_media" on project_media for select using (true);

-- Public can insert messages (contact form)
create policy "Public can send messages" on messages for insert with check (true);

-- Authenticated users can do everything
create policy "Auth users manage profile" on profile for all using (auth.role() = 'authenticated');
create policy "Auth users manage projects" on projects for all using (auth.role() = 'authenticated');
create policy "Auth users manage skills" on skills for all using (auth.role() = 'authenticated');
create policy "Auth users manage experiences" on experiences for all using (auth.role() = 'authenticated');
create policy "Auth users manage messages" on messages for all using (auth.role() = 'authenticated');
create policy "Auth users manage project_media" on project_media for all using (auth.role() = 'authenticated');

-- Insert sample profile
insert into profile (name, title, bio, email, github_url, linkedin_url)
values (
  'Your Name',
  'Full Stack Developer',
  'I am a passionate developer who loves building things for the web. With experience across the full stack, I enjoy turning complex problems into simple, beautiful solutions.',
  'hello@example.com',
  'https://github.com/yourusername',
  'https://linkedin.com/in/yourusername'
);

-- Insert sample projects
insert into projects (title, description, long_description, tech_stack, category, github_url, live_url, video_url, features, featured, sort_order) values
('Survival Horror Game', 'An atmospheric survival horror game built in Unreal Engine 5.', 'A first-person survival horror experience featuring photorealistic environments, dynamic AI enemies, and an immersive sound design system. Built with Unreal Engine 5 using Nanite and Lumen for stunning visuals.', '{"Unreal Engine 5","C++","Blueprints","MetaHuman","Niagara"}', 'Game', 'https://github.com/user/horror-game', '', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '{"Photorealistic environments with Nanite","Dynamic AI with behavior trees","Procedural audio system","Inventory & crafting system","Save/load system"}', true, 1),
('E-Commerce Platform', 'A full-featured online store with cart, checkout, and admin panel.', 'Built a complete e-commerce solution with product management, shopping cart, Stripe integration, and an admin dashboard for inventory management.', '{"Next.js","TypeScript","PostgreSQL","Stripe","Tailwind CSS"}', 'Web App', 'https://github.com/user/ecommerce', 'https://ecommerce-demo.vercel.app', '', '{"Product catalog with search & filters","Shopping cart with real-time updates","Stripe payment integration","Admin dashboard for inventory","Order tracking system"}', true, 2),
('Task Management App', 'Real-time collaborative task board with drag-and-drop.', 'A Trello-like task management application featuring real-time updates, drag-and-drop card reordering, team collaboration, and project organization.', '{"React","Node.js","Socket.io","MongoDB","Redux"}', 'Web App', 'https://github.com/user/taskapp', 'https://taskapp-demo.vercel.app', '', '{"Real-time collaborative editing","Drag-and-drop card reordering","Team workspaces","Activity feed & notifications"}', true, 3),
('AI Chat Bot', 'Intelligent chatbot powered by machine learning.', 'An AI-powered chatbot that can answer questions, provide recommendations, and have natural conversations using modern language models.', '{"Python","FastAPI","React","OpenAI","Docker"}', 'AI/ML', 'https://github.com/user/chatbot', '', '', '{"Natural language understanding","Context-aware responses","Multi-turn conversations","API integration"}', false, 4);

-- Insert sample skills
insert into skills (name, category, proficiency, sort_order) values
('React', 'Frontend', 95, 1),
('Next.js', 'Frontend', 90, 2),
('TypeScript', 'Frontend', 90, 3),
('Tailwind CSS', 'Frontend', 85, 4),
('HTML/CSS', 'Frontend', 95, 5),
('Node.js', 'Backend', 88, 6),
('Python', 'Backend', 80, 7),
('PostgreSQL', 'Backend', 85, 8),
('REST APIs', 'Backend', 90, 9),
('GraphQL', 'Backend', 70, 10),
('Git', 'DevOps', 90, 11),
('Docker', 'DevOps', 75, 12),
('AWS', 'DevOps', 70, 13),
('CI/CD', 'DevOps', 75, 14),
('Vercel', 'DevOps', 85, 15);

-- Insert sample experiences
insert into experiences (company, role, description, start_date, end_date, sort_order) values
('Tech Corp', 'Senior Full Stack Developer', 'Led development of customer-facing web applications serving 100k+ users. Mentored junior developers and established code review processes.', '2022-06-01', null, 1),
('StartupXYZ', 'Full Stack Developer', 'Built and maintained multiple React applications. Implemented CI/CD pipelines and improved deployment reliability by 40%.', '2020-03-01', '2022-05-31', 2),
('Freelance', 'Web Developer', 'Designed and developed websites for small businesses. Managed client relationships and delivered projects on time and within budget.', '2018-09-01', '2020-02-28', 3);
