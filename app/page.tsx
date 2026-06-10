import { HeroCarousel } from '@/components/ui/HeroCarousel';
import { ProjectsScrollSection } from '@/components/ui/ProjectsScrollSection';
import { AboutSection } from '@/components/ui/AboutSection';
import { FeedbackForm } from '@/components/ui/FeedbackForm';
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

      {/* Page 4 — feedback */}
      <section
        id="feedback"
        style={{
          background: 'var(--color-bg)',
          padding: 'clamp(6rem, 15vh, 12rem) clamp(1.25rem, 5vw, 5rem)',
        }}
      >
        <p style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Leave a note
        </p>
        <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2.5rem', maxWidth: '480px', lineHeight: 1.2 }}>
          What did you think?
        </h2>
        <div style={{ maxWidth: '560px' }}>
          <FeedbackForm />
        </div>
      </section>
    </>
  );
}
