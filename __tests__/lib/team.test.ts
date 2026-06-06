import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseTeamMember, getAllTeamMembers } from '@/lib/team';

const fixtureContent = fs.readFileSync(
  path.join(process.cwd(), '__fixtures__/team/alex-nguyen.md'),
  'utf-8'
);

describe('parseTeamMember', () => {
  it('extracts name and role from frontmatter', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.name).toBe('Alex Nguyen');
    expect(member.role).toBe('Data Analyst');
  });

  it('attaches the slug', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.slug).toBe('alex-nguyen');
  });

  it('parses skills array', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.skills).toEqual(['Data Analysis', 'Financial Modelling', 'Business Strategy']);
  });

  it('parses education object', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.education.university).toBe('Ho Chi Minh City University');
    expect(member.education.year).toBe(2026);
  });

  it('parses projects array with card_gradient_angle', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.projects).toHaveLength(1);
    expect(member.projects[0].title).toBe('Supply Chain Optimisation');
    expect(member.projects[0].card_gradient_angle).toBe(135);
  });

  it('extracts markdown body text', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.body).toContain('third-year Business Administration student');
  });

  it('returns order as integer', () => {
    const member = parseTeamMember('alex-nguyen', fixtureContent);
    expect(member.order).toBe(1);
  });

  it('defaults github to empty string when missing', () => {
    const noGithub = fixtureContent.replace('github: "https://github.com/alexnguyen"', 'github: ""');
    const member = parseTeamMember('alex-nguyen', noGithub);
    expect(member.github).toBe('');
  });
});

describe('getAllTeamMembers', () => {
  it('returns members sorted by order field', async () => {
    const members = await getAllTeamMembers();
    for (let i = 1; i < members.length; i++) {
      expect(members[i].order).toBeGreaterThanOrEqual(members[i - 1].order);
    }
  });

  it('excludes template.md', async () => {
    const members = await getAllTeamMembers();
    const slugs = members.map((m) => m.slug);
    expect(slugs).not.toContain('template');
  });
});
