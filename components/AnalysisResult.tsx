
import React from 'react';
import { PlantAnalysis, Severity, IssueType } from '../types';

interface AnalysisResultProps {
  result: PlantAnalysis;
}

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const styles = {
    [Severity.LOW]: 'bg-green-100 text-green-800',
    [Severity.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [Severity.HIGH]: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${styles[severity]}`}>
      {severity} Severity
    </span>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  const getIssueIcon = () => {
    switch (result.issueType) {
      case IssueType.PEST: return 'fa-bug';
      case IssueType.DISEASE: return 'fa-virus';
      case IssueType.DEFICIENCY: return 'fa-flask';
      case IssueType.HEALTHY: return 'fa-check-circle';
      default: return 'fa-circle-question';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-emerald-600 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <i className={`fa-solid ${getIssueIcon()} text-white text-2xl`}></i>
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{result.diagnosis}</h2>
              <p className="text-emerald-100 text-sm font-medium">{result.plantName}</p>
            </div>
          </div>
          <SeverityBadge severity={result.severity} />
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass text-emerald-600"></i>
                Visual Symptoms
              </h3>
              <ul className="space-y-2">
                {result.symptoms.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <i className="fa-solid fa-circle-check text-emerald-500 mt-1 text-xs"></i>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-comment-dots text-emerald-600"></i>
                The AI's Explanation
              </h3>
              <p className="text-gray-600 leading-relaxed italic border-l-4 border-emerald-200 pl-4 py-1">
                "{result.explanation}"
              </p>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="text-emerald-900 font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-toolbox text-emerald-600"></i>
                Treatment Plan
              </h3>
              <div className="space-y-4">
                {result.treatmentPlan.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-blue-900 font-bold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-blue-600"></i>
                Prevention Strategy
              </h3>
              <ul className="space-y-3">
                {result.preventionTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-blue-800 text-sm">
                    <i className="fa-solid fa-lightbulb text-blue-500 mt-1"></i>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
      
      <div className="text-center p-4">
        <button 
          onClick={() => window.location.reload()}
          className="text-emerald-700 font-semibold hover:underline flex items-center justify-center gap-2 mx-auto"
        >
          <i className="fa-solid fa-rotate-left"></i>
          Start New Analysis
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
