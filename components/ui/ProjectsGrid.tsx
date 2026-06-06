import { CardReveal } from '@/components/animation/CardReveal';
import { SkewedProjectCard } from '@/components/ui/SkewedProjectCard';
import { TextCharReveal } from '@/components/animation/TextCharReveal';
import type { TeamMember } from '@/types/team';

export interface ProjectsGridProps {
  members: TeamMember[];
}

interface ProjectEntry {
  project: TeamMember['projects'][number];
  memberName: string;
}

export function ProjectsGrid({ members }: ProjectsGridProps) {
  const allProjects: ProjectEntry[] = members.flatMap((m) =>
    m.projects.map((p) => ({ project: p, memberName: m.name }))
  );

  return (
    <section id="work" className="section-padding">
      <div className="max-w-content mx-auto">
        {/* Section heading with char reveal */}
        <div className="mb-16 overflow-hidden">
          <TextCharReveal
            text="WORKS"
            as="h2"
            className="font-display uppercase"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              lineHeight: 1.2,
            }}
          />
        </div>

        {/* Card grid with perspective */}
        <div
          className="card-grid grid gap-16"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
          }}
        >
          {allProjects.map(({ project, memberName }, i) => (
            <CardReveal key={`${memberName}-${project.title}`} delay={i * 0.15}>
              <SkewedProjectCard project={project} memberName={memberName} />
            </CardReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
