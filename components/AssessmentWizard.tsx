
import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { UserAnswers } from '../types';
import { useAnswerValidation } from '../hooks/useAnswerValidation';

interface AssessmentWizardProps {
  onComplete: (answers: UserAnswers) => void;
  onCancel: () => void;
}

const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const { validate } = useAnswerValidation();

  const currentQuestion = QUESTIONS[currentIndex];

  const handleSelect = (value: string) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Validate all answers before completing
      if (validate(updatedAnswers)) {
        onComplete(updatedAnswers);
      } else {
        // If validation fails, go back to first unanswered question
        // This shouldn't happen in normal flow, but provides safety
        console.warn('Validation failed, but all questions should be answered');
        onComplete(updatedAnswers);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onCancel();
    }
  };

  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      {currentIndex === 0 && (
        <div className="mb-16 p-8 glass-card border-none rounded-none border-l-4 border-[#C5A059] text-center md:text-left">
           <p className="text-zinc-300 text-lg leading-relaxed font-light italic">
             “Hi there. I will ask a few simple questions to see how you are feeling. This will help me suggest plant-based support based on Dr. Chimdum's ideas.”
           </p>
        </div>
      )}

      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <button 
            onClick={handleBack}
            className="text-zinc-500 hover:text-[#C5A059] transition-all text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 focus:ring-offset-black rounded"
            aria-label={currentIndex > 0 ? `Go back to question ${currentIndex}` : 'Cancel assessment'}
          >
            ← Back
          </button>
          <div className="text-right">
            <span className="text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.3em]">
              Step {currentIndex + 1}
            </span>
          </div>
        </div>
        <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
          <div 
            className="h-full bg-[#C5A059] transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="glass-card rounded-none p-10 md:p-16 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#C5A059]/20" />
        
        <h2 id="question-text" className="text-3xl md:text-5xl font-bold text-white mb-14 leading-tight">
          {currentQuestion.text}
        </h2>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Question {currentIndex + 1} of {QUESTIONS.length}
        </div>

        <div className="grid grid-cols-1 gap-6" role="radiogroup" aria-labelledby="question-text">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="w-full text-left p-8 border border-white/5 hover:border-[#C5A059]/50 hover:bg-white/5 transition-all group flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 focus:ring-offset-black"
              role="radio"
              aria-checked={answers[currentQuestion.id] === option.value}
              aria-label={`${currentQuestion.text}: ${option.label}`}
              tabIndex={answers[currentQuestion.id] === option.value ? 0 : -1}
            >
              <span className="text-xl text-zinc-400 group-hover:text-white transition-colors font-light">
                {option.label}
              </span>
              <div className="w-4 h-4 rounded-full border border-zinc-700 group-hover:border-[#C5A059] transition-colors" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
      
      <p className="mt-12 text-center text-zinc-600 text-[10px] uppercase tracking-[0.4em]">
        Chimdum Wellness Guide
      </p>
    </div>
  );
};

export default AssessmentWizard;
