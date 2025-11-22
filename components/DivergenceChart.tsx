import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExplorationResult } from '../types';

interface DivergenceChartProps {
  data: ExplorationResult;
}

export const DivergenceChart: React.FC<DivergenceChartProps> = ({ data }) => {
  const chartData = data.linearPath.map((node, index) => ({
    step: `Step ${index + 1}`,
    linear: 10, // Linear stays baseline
    tangent: 10 + (index * (data.divergenceScore / 3)), // Tangent drifts away based on score
    name: node.title
  }));

  return (
    <div className="w-full h-64 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h3 className="text-slate-400 text-xs font-uppercase tracking-wider mb-4">Divergence Velocity</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="step" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
            itemStyle={{ color: '#cbd5e1' }}
          />
          <Area type="monotone" dataKey="linear" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Linear Focus" />
          <Area type="monotone" dataKey="tangent" stackId="2" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} name="Tangent Drift" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
