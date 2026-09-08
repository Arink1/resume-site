import { Profile, Project, Skill, Experience as ExperienceType } from "@/lib/types";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import {
  sampleProfile,
  sampleProjects,
  sampleSkills,
  sampleExperiences,
} from "@/lib/sample-data";

export const dynamic = "force-dynamic";

async function getData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured =
    supabaseUrl && !supabaseUrl.includes("your-supabase");

  if (!isConfigured) {
    return {
      profile: sampleProfile,
      projects: sampleProjects,
      skills: sampleSkills,
      experiences: sampleExperiences,
    };
  }

  const { createServerClient } = await import("@/lib/supabase");
  const supabase = createServerClient();

  const [profileRes, projectsRes, skillsRes, experiencesRes] =
    await Promise.all([
      supabase.from("profile").select("*").single<Profile>(),
      supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .returns<Project[]>(),
      supabase
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true })
        .returns<Skill[]>(),
      supabase
        .from("experiences")
        .select("*")
        .order("sort_order", { ascending: true })
        .returns<ExperienceType[]>(),
    ]);

  return {
    profile: profileRes.data || sampleProfile,
    projects: projectsRes.data || [],
    skills: skillsRes.data || [],
    experiences: experiencesRes.data || [],
  };
}

export default async function Home() {
  const { profile, projects, skills, experiences } = await getData();

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Projects projects={projects} />
      <Skills skills={skills} />
      <Experience experiences={experiences} />
      <Contact email={profile?.email} />
    </>
  );
}
