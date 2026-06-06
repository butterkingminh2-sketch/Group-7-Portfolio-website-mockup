import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

import type { TeamMember } from '@/types/team';

const TEAM_DIR = path.join(process.cwd(), 'content', 'team');

export function parseTeamMember(slug: string, fileContent: string): TeamMember {
  const { data, content } = matter(fileContent);
  return {
    slug,
    name: data.name as string,
    display_name_bg: data.display_name_bg as string,
    role: data.role as string,
    avatar: data.avatar as string,
    avatar_alt: data.avatar_alt as string,
    avatar_top: (data.avatar_top as string | undefined) ?? undefined,
    hero_bg: (data.hero_bg as string | undefined) ?? undefined,
    linkedin: (data.linkedin as string) || '',
    github: (data.github as string) || '',
    skills: (data.skills as string[]) || [],
    tools: (data.tools as string[]) || [],
    languages: (data.languages as string[]) || [],
    education: data.education as TeamMember['education'],
    bio_short: data.bio_short as string,
    projects: (data.projects as TeamMember['projects']) || [],
    order: data.order as number,
    body: content.trim(),
  };
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const files = fs
    .readdirSync(TEAM_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'template.md');

  const members = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(TEAM_DIR, file), 'utf-8');
    return parseTeamMember(slug, raw);
  });

  return members.sort((a, b) => a.order - b.order);
}
