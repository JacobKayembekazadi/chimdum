import React, { useEffect, useState } from 'react';

import { generateWellnessRecommendation, DeepSeekServiceError } from '../services';
import { UserAnswers } from '../types';

import ErrorDisplay from './ErrorDisplay';

interface ResultsViewProps {
  answers: UserAnswers;
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ answers, onRestart }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchRecommendation = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await generateWellnessRecommendation(answers);
        setContent(result);
      } catch (err) {
        const errorMessage =
          err instanceof DeepSeekServiceError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Failed to generate recommendation. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [answers]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 sm:py-24 md:py-32 px-4 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-6 sm:mb-8 md:mb-10 relative">
          <div className="absolute inset-0 border-t-2 border-[#C5A059] rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-2 border-[#C5A059]/30 rounded-full animate-spin-slow"></div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-4">
          Thinking for You...
        </h2>
        <p className="text-zinc-500 tracking-widest uppercase text-[9px] sm:text-[10px] px-4">
          Looking at old wisdom for your body
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Unable to Generate Recommendation"
        message={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          generateWellnessRecommendation(answers)
            .then(result => {
              setContent(result);
              setLoading(false);
            })
            .catch(err => {
              const errorMessage =
                err instanceof DeepSeekServiceError
                  ? err.message
                  : 'Failed to generate recommendation. Please try again.';
              setError(errorMessage);
              setLoading(false);
            });
        }}
        onDismiss={onRestart}
        showRetry={true}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 md:py-20 px-4">
      <div className="bg-[#0a0a0a] border border-white/5 rounded-none overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
        <div className="gold-bg p-8 sm:p-10 md:p-12 text-black text-center relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 relative z-10 italic">
            Your Natural Plan
          </h2>
          <p className="text-black/60 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] relative z-10">
            Dr. Chimdum&apos;s Top Choice for You
          </p>
        </div>

        <div className="p-6 sm:p-8 md:p-10 lg:p-20">
          <div className="prose prose-invert prose-lg max-w-none">
            {content.split('\n').map((line, i) => {
              const upperLine = line.toUpperCase();

              if (upperLine.includes('BODY INSIGHT')) {
                return (
                  <h3
                    key={i}
                    className="text-[#C5A059] font-bold mt-0 mb-8 text-[11px] uppercase tracking-[0.5em] border-b border-white/5 pb-4"
                  >
                    01. How You Feel
                  </h3>
                );
              }
              if (upperLine.includes('RECOMMENDED SUPPORT')) {
                return (
                  <h3
                    key={i}
                    className="text-[#C5A059] font-bold mt-16 mb-8 text-[11px] uppercase tracking-[0.5em] border-b border-white/5 pb-4"
                  >
                    02. Best Choice for You
                  </h3>
                );
              }
              if (upperLine.includes('SIMPLE DAILY ROUTINE')) {
                return (
                  <h3
                    key={i}
                    className="text-[#C5A059] font-bold mt-16 mb-8 text-[11px] uppercase tracking-[0.5em] border-b border-white/5 pb-4"
                  >
                    03. Your Easy Routine
                  </h3>
                );
              }
              if (upperLine.includes('WHY THIS MAY HELP')) {
                return (
                  <h3
                    key={i}
                    className="text-[#C5A059] font-bold mt-16 mb-8 text-[11px] uppercase tracking-[0.5em] border-b border-white/5 pb-4"
                  >
                    04. Why This Works
                  </h3>
                );
              }
              if (upperLine.includes('NEXT STEP CTA') || upperLine.includes('NEXT STEPS')) {
                return (
                  <h3
                    key={i}
                    className="text-[#C5A059] font-bold mt-16 mb-6 text-[11px] uppercase tracking-[0.5em] border-b border-white/5 pb-4"
                  >
                    05. What to do Next
                  </h3>
                );
              }
              if (upperLine.includes('DISCLAIMER')) {
                return (
                  <div
                    key={i}
                    className="mt-20 pt-10 border-t border-white/5 text-[9px] text-zinc-600 uppercase tracking-[0.4em] text-center leading-loose"
                  >
                    {line}
                  </div>
                );
              }

              if (!line.trim()) return <div key={i} className="h-4" />;

              const cleanLine = line
                .replace(/^\d+\.\s*/, '')
                .replace(/^\d+\)\s*/, '')
                .replace(/^- /, '• ');

              return (
                <p
                  key={i}
                  className="text-zinc-400 leading-[1.8] sm:leading-[2] mb-4 sm:mb-6 text-base sm:text-lg font-light tracking-wide"
                >
                  {cleanLine}
                </p>
              );
            })}
          </div>

          <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button className="flex-1 bg-white text-black px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 font-bold uppercase tracking-[0.2em] hover:bg-[#C5A059] transition-all shadow-xl active:scale-95 text-sm touch-manipulation min-h-[48px]">
              Get Started
            </button>
            <button
              onClick={onRestart}
              className="flex-1 bg-transparent text-zinc-500 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 font-bold border border-white/10 uppercase tracking-[0.2em] hover:text-white hover:border-white transition-all active:scale-95 text-sm touch-manipulation min-h-[48px]"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 md:mt-20 text-center">
        <p className="text-zinc-700 text-[9px] sm:text-[10px] uppercase tracking-[0.6em] sm:tracking-[0.8em]">
          End of Session
        </p>
      </div>
    </div>
  );
};

export default ResultsView;
