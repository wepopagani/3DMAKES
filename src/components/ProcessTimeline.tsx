import React from 'react';
import { GrowLine } from '@/components/anteprima/PageBlocks';
import { InteractiveCard, Reveal } from '@/components/anteprima/primitives';
import { cn } from '@/lib/utils';

interface Step {
  step: number;
  title: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: Step[];
  title?: string;
}

/** Passi alternati a sinistra e destra su desktop, in colonna su mobile; la linea si disegna allo scroll. */
const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ steps, title }) => {
  return (
    <div className="mx-auto max-w-4xl">
      {title && <h2 className="mb-12 text-center text-3xl font-bold text-brand-blue">{title}</h2>}

      <div className="relative">
        <GrowLine
          axis="y"
          delay={0.1}
          className="absolute bottom-5 left-[19px] top-5 w-0.5 rounded-full bg-brand-accent/30 md:left-1/2 md:-ml-px"
        />

        <ol className="space-y-8 md:space-y-12">
          {steps.map((step, index) => {
            const right = index % 2 === 1;
            return (
              <li key={index} className="relative flex items-start gap-5 md:block">
                <Reveal
                  y={0}
                  delay={0.1}
                  className="relative z-10 shrink-0 md:absolute md:left-1/2 md:top-5 md:-ml-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent font-bold text-white shadow-lg shadow-brand-accent/30">
                    {step.step}
                  </span>
                </Reveal>
                <Reveal
                  x={right ? 40 : -40}
                  y={0}
                  delay={0.15}
                  className={cn('min-w-0 flex-1 md:w-1/2', right ? 'md:ml-auto md:pl-14' : 'md:pr-14')}
                >
                  <InteractiveCard
                    lift={6}
                    className={cn(
                      'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-brand-blue/5 transition-shadow duration-300 hover:shadow-xl md:p-6',
                      !right && 'md:text-right'
                    )}
                  >
                    <h3 className="mb-2 text-xl font-semibold text-brand-blue">{step.title}</h3>
                    <p className="leading-relaxed text-brand-gray">{step.description}</p>
                  </InteractiveCard>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default ProcessTimeline;
