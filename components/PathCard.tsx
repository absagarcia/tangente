import React from 'react';
import { ConceptNode, PathType } from '../types';
import { ArrowDown, GitCommit, Sparkles } from 'lucide-react';

interface PathCardProps {
  node: ConceptNode;
  isLast: boolean;
  delayIndex: number;
}

export const PathCard: React.FC<PathCardProps> = ({ node, isLast, delayIndex }) => {
  const isTangent = node.type === PathType.TANGENT;
  
  return (
    <div 
      className={`relative flex flex-col items-center opacity-0 animate-fade-in-up`}
      style={{ animationDelay: `${delayIndex * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div 
        className={`
          w-full max-w-sm p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105
          ${isTangent 
            ? 'bg-purple-900/20 border-purple-500/30 hover:border-purple-400/60 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
            : 'bg-blue-900/20 border-blue-500/30 hover:border-blue-400/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
          }
        `}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-lg font-bold ${isTangent ? 'text-purple-300' : 'text-blue-300'}`}>
            {node.title}
          </h3>
          {isTangent ? <Sparkles size={18} className="text-purple-400" /> : <GitCommit size={18} className="text-blue-400" />}
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          {node.description}
        </p>
      </div>

      {!isLast && (
        <div className="h-8 flex items-center justify-center">
          <ArrowDown 
            size={20} 
            className={`animate-bounce ${isTangent ? 'text-purple-500/50' : 'text-blue-500/50'}`} 
            style={{ animationDuration: '2s' }}
          />
        </div>
      )}
    </div>
  );
};
