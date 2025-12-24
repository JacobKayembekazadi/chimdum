import React from 'react';

interface PhilosophyProps {
  onStartAssessment: () => void;
}

const Philosophy: React.FC<PhilosophyProps> = ({ onStartAssessment }) => {
  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 italic">
          Our Way of Thinking
        </h2>
        <div className="w-24 h-1 gold-bg mx-auto mb-10" />
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Dr. Chimdum believes that plants have the power to help our bodies stay in balance. We use
          old African secrets to help you feel your best today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
        <div className="glass-card p-10 border-l-4 border-[#C5A059]">
          <h3 className="text-2xl font-bold text-white mb-4">Old Secrets, New Help</h3>
          <p className="text-zinc-400 leading-relaxed">
            For hundreds of years, people in Africa used special plants to stay strong. We take
            those same plants and make them ready for your busy life.
          </p>
        </div>
        <div className="glass-card p-10 border-l-4 border-[#C5A059]">
          <h3 className="text-2xl font-bold text-white mb-4">The Whole You</h3>
          <p className="text-zinc-400 leading-relaxed">
            We don&apos;t just look at one part of you. We look at your energy, your sleep, and your
            belly. When every part is happy, you feel great.
          </p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 p-12 text-center">
        <h3 className="text-3xl font-bold text-white mb-6">
          &quot;Nature is the best teacher.&quot;
        </h3>
        <p className="text-zinc-500 mb-10">- Dr. Chimdum</p>
        <button
          onClick={onStartAssessment}
          className="px-10 py-5 bg-[#C5A059] text-black font-bold uppercase tracking-widest hover:bg-white transition-all"
        >
          Check Your Body Now
        </button>
      </div>
    </div>
  );
};

export default Philosophy;
