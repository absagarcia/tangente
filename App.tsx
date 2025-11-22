import React, { useState, useCallback } from 'react';
import { BrainCircuit, Search, RefreshCw, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { exploreTopic } from './services/gemini';
import { ExplorationResult } from './types';
import { PathCard } from './components/PathCard';
import { DivergenceChart } from './components/DivergenceChart';

// Custom keyframes styles added via style tag in render
const AnimationStyles = () => (
  <style>{`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translate3d(0, 20px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }
  `}</style>
);

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExplorationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExplore = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await exploreTopic(topic);
      setResult(data);
    } catch (err) {
      setError("Could not explore the tangent. Ensure your API key is valid and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  const handleSuggestion = (t: string) => {
    setTopic(t);
    // Small timeout to allow state to set before triggering
    setTimeout(() => {
        // We can't easily call handleExplore due to closure staleness without useEffect, 
        // but clicking the button manually is fine for UX.
        // Or we can refactor handleExplore to accept an arg.
        // For simplicity in this pattern, let's just set topic and let user click Go.
    }, 0);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-purple-500/30">
      <AnimationStyles />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Tangente
            </span>
          </div>
          <a 
            href="https://ai.google.dev" 
            target="_blank" 
            rel="noreferrer" 
            className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            Powered by Gemini
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Hero / Input Section */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Explore the <span className="text-blue-400">Logic</span> vs. the <span className="text-purple-400">Tangent</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Visualize where a conversation stays on track, and where it drifts into creativity.
          </p>

          <form onSubmit={handleExplore} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur"></div>
            <div className="relative flex items-center bg-slate-900 rounded-xl p-2">
              <Search className="ml-4 text-slate-500" size={20} />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g., 'Coffee', 'Quantum Physics', 'Tacos')"
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-2 text-lg"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                <span>Go</span>
              </button>
            </div>
          </form>

          {!result && !isLoading && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-slate-500">Try:</span>
              {['The Roman Empire', 'Artificial Intelligence', 'Bananas', 'Remote Work'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleSuggestion(t)}
                  className="text-sm px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-lg mx-auto mb-12 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in-up">
            
            {/* Analysis Header */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Analysis: <span className="text-indigo-400 capitalize">{result.rootTopic}</span></h2>
                <p className="text-slate-400">
                  Divergence Score: <span className="text-white font-mono font-bold">{result.divergenceScore}/100</span>
                </p>
              </div>
              <div className="w-full md:w-1/3 h-32">
                <DivergenceChart data={result} />
              </div>
            </div>

            {/* Paths Grid */}
            <div className="grid md:grid-cols-2 gap-8 relative">
              
              {/* Linear Column */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="flex items-center justify-center gap-2 mb-8">
                  <BrainCircuit className="text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-100">The Straight Path</h3>
                </div>
                <div className="space-y-0">
                  {result.linearPath.map((node, idx) => (
                    <PathCard 
                      key={node.id} 
                      node={node} 
                      isLast={idx === result.linearPath.length - 1}
                      delayIndex={idx}
                    />
                  ))}
                </div>
              </div>

              {/* Divider (Mobile only essentially, hidden on desktop usually by grid gap, but let's add a visual separator) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 -translate-x-1/2"></div>

              {/* Tangent Column */}
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="flex items-center justify-center gap-2 mb-8">
                  <Sparkles className="text-purple-400" />
                  <h3 className="text-xl font-bold text-purple-100">The Tangent</h3>
                </div>
                <div className="space-y-0">
                  {result.tangentPath.map((node, idx) => (
                    <PathCard 
                      key={node.id} 
                      node={node} 
                      isLast={idx === result.tangentPath.length - 1}
                      delayIndex={idx + 4} // Stagger animation after linear path
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;