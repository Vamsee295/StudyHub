'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { learnService, SubjectDetails } from '@/lib/services/learnService';

export const ProgrammingCurriculumView = () => {
  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCurriculum() {
      try {
        const data = await learnService.getSubjectDetails('programming-fundamentals');
        setSubject(data);
      } catch (err) {
        console.error("Failed to load curriculum", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCurriculum();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 sm:p-10 border-[1.5px] border-hair shadow-card flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!subject) return null;

  const totalLessons = subject.modules.reduce((acc, mod) => acc + mod.topics.length, 0);

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-hair/60">
        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider font-sans">
          Course Curriculum
        </h3>
      </div>

      <div className="flex items-center gap-6 text-[13px] font-mono text-body mb-2 bg-paper-2/50 p-3 rounded-lg border-[1.5px] border-hair">
        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-accent-line"></div>{subject.modules.length} Modules</span>
        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-accent-line"></div>{totalLessons} Lessons</span>
        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-accent-line"></div>~15 hours</span>
      </div>
      
      <div className="flex flex-col gap-2">
        {subject.modules.map((module, index) => {
          return (
            <div key={module.id} className="flex items-center justify-between py-2 border-b border-hair/40 last:border-0 group">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[14px] text-mute font-bold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[14px] font-semibold text-ink group-hover:text-accent-ink transition-colors">
                  {module.title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-mute font-mono">
                <span>{module.topics.length} lessons</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-4 pt-4 border-t border-hair">
        <Link
          href={`/learn/${subject.slug}`}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-ink active:scale-[0.99] text-paper px-5 py-3 rounded-lg text-[13px] font-semibold transition-all"
        >
          <span>VIEW FULL CURRICULUM</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
