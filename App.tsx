import React, { useState, useEffect, lazy, Suspense } from 'react';

import ErrorDisplay from './components/ErrorDisplay';
import Hero from './components/Hero';
import Layout from './components/Layout';
import OfflineIndicator from './components/OfflineIndicator';
import { usePageTracking } from './hooks/useAnalytics';
import { UserAnswers } from './types';
import { isEnvironmentValid } from './utils/envValidation';

// Lazy load components for code splitting
const AssessmentWizard = lazy(() => import('./components/AssessmentWizard'));
const ResultsView = lazy(() => import('./components/ResultsView'));
const Philosophy = lazy(() => import('./components/Philosophy'));
const Essentials = lazy(() => import('./components/Essentials'));

export enum View {
  HERO = 'HERO',
  ASSESSMENT = 'ASSESSMENT',
  RESULTS = 'RESULTS',
  PHILOSOPHY = 'PHILOSOPHY',
  ESSENTIALS = 'ESSENTIALS',
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HERO);
  const [answers, setAnswers] = useState<UserAnswers | null>(null);
  const [envError, setEnvError] = useState<string | null>(null);

  // Track page views
  usePageTracking(`/${view.toLowerCase()}`);

  useEffect(() => {
    if (!isEnvironmentValid()) {
      setEnvError(
        'GEMINI_API_KEY is not configured. Please create a .env.local file with your API key.\n' +
          'See .env.example for reference.'
      );
    }
  }, []);

  const startAssessment = () => {
    setView(View.ASSESSMENT);
  };

  const handleAssessmentComplete = (userAnswers: UserAnswers) => {
    setAnswers(userAnswers);
    setView(View.RESULTS);
  };

  const handleAssessmentCancel = () => setView(View.HERO);

  if (envError) {
    return (
      <Layout currentView={view} onViewChange={setView}>
        <ErrorDisplay title="Configuration Error" message={envError} showRetry={false} />
      </Layout>
    );
  }

  return (
    <Layout currentView={view} onViewChange={setView}>
      <OfflineIndicator />
      {view === View.HERO && <Hero onStartText={startAssessment} />}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin border-t-2 border-[#C5A059] rounded-full w-16 h-16"></div>
          </div>
        }
      >
        {view === View.PHILOSOPHY && <Philosophy onStartAssessment={startAssessment} />}
        {view === View.ESSENTIALS && <Essentials onStartAssessment={startAssessment} />}
        {view === View.ASSESSMENT && (
          <AssessmentWizard
            onComplete={handleAssessmentComplete}
            onCancel={handleAssessmentCancel}
          />
        )}
        {view === View.RESULTS && answers && (
          <ResultsView answers={answers} onRestart={() => setView(View.ASSESSMENT)} />
        )}
      </Suspense>
    </Layout>
  );
};

export default App;
