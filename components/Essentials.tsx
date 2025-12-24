
import React from 'react';

interface EssentialsProps {
  onStartAssessment: () => void;
}

const Essentials: React.FC<EssentialsProps> = ({ onStartAssessment }) => {
  const products = [
    { name: "Chimdum Bitters", desc: "Helps your belly feel good and cleans your system." },
    { name: "Ghanga Tonic", desc: "Gives you long-lasting energy and helps with stress." },
    { name: "Immune Booster", desc: "Helps you stay strong so you don't feel run-down." }
  ];

  const bundles = [
    { name: "Vitality Duo", items: "Ghanga Tonic + Immune Booster", desc: "For energy and strength." },
    { name: "Daily Reset", items: "Bitters + Immune Booster", desc: "For a clean body and high power." },
    { name: "Total Balance", items: "All Three", desc: "The best way to feel brand new." }
  ];

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 italic">The Essentials</h2>
        <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs">Pure Plant Support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {products.map((p, i) => (
          <div key={i} className="glass-card p-8 group hover:border-[#C5A059]/50 transition-all">
            <div className="w-12 h-12 gold-bg rounded-full mb-6 flex items-center justify-center text-black font-black">0{i+1}</div>
            <h3 className="text-2xl font-bold text-white mb-4">{p.name}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{p.desc}</p>
            <div className="text-[#C5A059] text-[10px] font-bold uppercase tracking-widest">Core Product</div>
          </div>
        ))}
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Official Bundles</h2>
        <p className="text-zinc-500 text-sm">Better results when used together.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {bundles.map((b, i) => (
          <div key={i} className="bg-zinc-900/50 border border-white/5 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-tighter">Popular</div>
            <h3 className="text-xl font-bold text-[#C5A059] mb-2">{b.name}</h3>
            <p className="text-white text-xs font-medium mb-4 uppercase tracking-widest">{b.items}</p>
            <p className="text-zinc-500 text-sm mb-8">{b.desc}</p>
            <button className="w-full py-4 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Learn More
            </button>
          </div>
        ))}
      </div>

      <div className="mt-24 p-12 border border-[#C5A059]/30 text-center">
        <h3 className="text-2xl font-bold text-white mb-6 italic">Not sure which one to pick?</h3>
        <button 
          onClick={onStartAssessment}
          className="px-12 py-6 gold-bg text-black font-bold uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-transform"
        >
          Let the Guide Help You
        </button>
      </div>
    </div>
  );
};

export default Essentials;
