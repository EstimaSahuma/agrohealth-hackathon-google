
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
      setError("Please upload at least one photo or video.");
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
      setError(err.message || "An unexpected error occurred during analysis.");
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
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Is your plant <span className="text-emerald-600">unwell?</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload media and let Gemini 3 identify pests, diseases, and nutrient deficiencies in seconds.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100">
              <MediaUpload 
                mediaItems={mediaItems} 
                onMediaAdded={handleMediaAdded}
                onRemove={handleRemoveMedia}
                disabled={isAnalyzing}
              />

              {error && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || mediaItems.length === 0}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                    isAnalyzing || mediaItems.length === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-200'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      Consulting Expert AI...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-microscope"></i>
                      Analyze Health Now
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Educational Section */}
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: 'fa-bug', title: 'Pest Detection', desc: 'Identify aphids, mites, caterpillars and more.' },
                { icon: 'fa-vial', title: 'Soil Nutrition', desc: 'Detect nitrogen, potassium or iron deficiencies.' },
                { icon: 'fa-bacteria', title: 'Disease Diagnosis', desc: 'Find fungal blights, viral spots, and rot.' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
                  <i className={`fa-solid ${item.icon} text-emerald-600 text-2xl mb-3`}></i>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && <AnalysisResult result={result} />}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © 2024 AgroLens AI. Built for the modern farmer using Gemini 3 Vision.
          </p>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
            AI can make mistakes. Always consult a local agricultural extension officer for critical decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
