import React from 'react';
import { useDataBridge } from '../context/DataContext';
import { Layers, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewPipeline: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenNewPipeline }) => {
  const { currentOrg, pipelines, triggerPipelineRun, runningPipelineId } = useDataBridge();

  const handleSyncAll = () => {
    if (pipelines.length > 0 && !runningPipelineId) {
      triggerPipelineRun(pipelines[0].id);
    }
  };

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <a href="#overview" onClick={() => setActiveTab('overview')} className="text-base font-bold tracking-tight text-white whitespace-nowrap">
          VAntix DataBridge
        </a>
      </div>

      {/* Zone 2: Concise single-line navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('overview')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'overview' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Data Mesh Overview
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'sources' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Connectors Hub
        </button>
        <button
          onClick={() => setActiveTab('pipelines')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'pipelines' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Pipelines & Ingestion
        </button>
        <button
          onClick={() => setActiveTab('quarantine')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'quarantine' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Quality & Quarantine
        </button>
        <button
          onClick={() => setActiveTab('mapper')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'mapper' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Schema Reconciliation
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'analytics' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Governed Lakehouse
        </button>
        <button
          onClick={() => setActiveTab('commercials')}
          className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
            activeTab === 'commercials' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Enterprise Retainer
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleSyncAll}
          disabled={!!runningPipelineId}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:hover:bg-cyan-400 transition-colors rounded-md shadow-sm shadow-cyan-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <span>{runningPipelineId ? 'Sync In Progress...' : 'Run Ingestion'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
