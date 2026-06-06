import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { ProjectsScrollSection } from '@/components/ui/ProjectsScrollSection';
import { AboutSection } from '@/components/ui/AboutSection';
import { getAllTeamMembers } from '@/lib/team';

export default async function HomePage() {
  const members = await getAllTeamMembers();

  return (
    <>
      {/* Page 1 — full-viewport hero carousel */}
      <HeroCarousel members={members} />

      {/* Page 2 — scroll-linked vertical carousel, #f8f8f8 */}
      <ProjectsScrollSection members={members} />

      {/* Page 3 — scroll-locked about section, #2a0d25 */}
      <AboutSection />
    </>
  );
}
