import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { ProjectsGrid } from '@/components/ui/ProjectsGrid';
import { getAllTeamMembers } from '@/lib/team';

export default async function HomePage() {
  const members = await getAllTeamMembers();

  return (
    <>
      {/* Hero — full-viewport carousel */}
      <HeroCarousel members={members} />

      {/* Projects grid */}
      <ProjectsGrid members={members} />

      {/* About section */}
      <section id="about" className="section-padding">
        <div className="max-w-content mx-auto max-w-2xl">
          <h2
            className="font-heading text-text-primary mb-6"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 600, lineHeight: 1.2 }}
          >
            About Studio 7
          </h2>
          <p
            className="text-text-muted"
            style={{ fontSize: 'clamp(0.9375rem, 1.5vw, 1.0625rem)', lineHeight: 1.65 }}
          >
            We are a group of business administration students combining analytical rigour with
            creative communication. Studio 7 is our shared space for project work, research, and
            professional growth.
          </p>
        </div>
      </section>
    </>
  );
}
