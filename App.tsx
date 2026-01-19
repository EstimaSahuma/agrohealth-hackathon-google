
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MediaUpload from './components/MediaUpload';
import AnalysisResult from './components/AnalysisResult';
import { MediaItem, PlantAnalysis } from './types';
import { analyzePlantHealth } from './services/geminiService';

const App: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMediaAdded = useCallback((newItems: MediaItem[]) => {
    setMediaItems(prev => [...prev, ...newItems]);
    setError(null);
  }, []);

  const handleRemoveMedia = useCallback((index: number) => {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAnalyze = async () => {
    if (mediaItems.length === 0) {
      setError("Please add at least one photo or video first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const files = mediaItems.map(item => item.file);
      const analysis = await analyzePlantHealth(files);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "We had a small problem checking your plant. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {!result && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                Find and Fix Your <span className="text-emerald-600">Plant Problems</span> Instantly
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                Is your crop looking unwell? Just take a photo or video. We'll tell you exactly what’s wrong and how to fix it.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100">
              <MediaUpload 
                mediaItems={mediaItems} 
                onMediaAdded={handleMediaAdded}
                onRemove={handleRemoveMedia}
                disabled={isAnalyzing}
              />

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 rounded-r-lg">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || mediaItems.length === 0}
                  className={`w-full py-5 px-6 rounded-2xl font-bold text-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                    isAnalyzing || mediaItems.length === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Checking your plant...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-leaf"></i>
                      Check My Plant
                    </>
                  )}
                </button>
                {isAnalyzing && (
                  <p className="text-center text-sm text-gray-500 mt-4 animate-pulse">
                    Please wait while our expert AI looks for signs of trouble...
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: 'fa-bug', title: 'Find Pests', desc: 'Spot aphids, caterpillars, and hidden bugs.' },
                { icon: 'fa-vial', title: 'Check Nutrition', desc: 'See if your soil needs more nutrients.' },
                { icon: 'fa-bacteria', title: 'Stop Diseases', desc: 'Identify blights, spots, and rots early.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i className={`fa-solid ${item.icon} text-emerald-600 text-xl`}></i>
                  </div>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 leading-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && <AnalysisResult result={result} />}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">PlantDoctor AI</p>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Our AI is helpful but sometimes makes mistakes. For big decisions, it’s always good to talk to your local farming advisor.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
