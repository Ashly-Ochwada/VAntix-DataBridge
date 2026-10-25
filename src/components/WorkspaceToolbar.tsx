import React from 'react';
import { useDataBridge } from '../context/DataContext';
import { ChevronRight, Building2, Shield, Clock, Layers } from 'lucide-react';

interface WorkspaceToolbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewConnector: () => void;
  onOpenNewPipeline: () => void;
}

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewConnector,
  onOpenNewPipeline,
}) => {
  const { orgPresets, selectedOrgId, setOrgId, currentOrg, sources, pipelines, quarantinedRecords } = useDataBridge();

  const tabTitles: Record<string, string> = {
    overview: 'Data Mesh Architecture & Live Pipeline Orchestrator',
    sources: 'Heterogeneous Connectors & System Ingestion Endpoints',
    pipelines: 'Automated ELT Pipelines & Ingestion Logs',
    quarantine: 'Data Inconsistencies & Dead-Letter Quarantine Inspector',
    mapper: 'Canonical Schema Transformation & Field Normalizer',
    analytics: 'Governed Analytics Warehouse & Statutory Reporting',
    commercials: 'Enterprise Implementation Contract & Engineering Retainer',
  };

  const pendingAnomalies = quarantinedRecords.filter((r) => r.status === 'pending').length;

  return (
    <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Sector Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Enterprise Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-medium">{tabTitles[activeTab] || 'Workspace'}</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          {/* Industry Niche Preset Switcher */}
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400">Target Industry Niche:</span>
            <select
              value={selectedOrgId}
              onChange={(e) => setOrgId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-100 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {orgPresets.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-100">
                  {preset.name} ({preset.sectorLabel})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Operational Health & Retainer Quick Stats */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">SLA:</span>
            <span className="font-semibold text-slate-200">{currentOrg.slaTier}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Retainer:</span>
            <span className="font-semibold text-slate-200 tabular-nums">
              {currentOrg.retentionHoursUsed} / {currentOrg.retentionHoursMonthly} hrs used
            </span>
          </div>

          {pendingAnomalies > 0 && (
            <button
              onClick={() => setActiveTab('quarantine')}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/60 px-2 py-0.5 rounded text-xs transition-colors"
            >
              <span className="font-semibold tabular-nums">{pendingAnomalies}</span>
              <span>Anomalies to Review</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewConnector}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded transition-colors"
            >
              + New Connector
            </button>
            <button
              onClick={onOpenNewPipeline}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded transition-colors"
            >
              + New Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Domain Context Banner: Shows current niche focus */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="font-medium text-slate-300">Niche Deployment Objective:</span>
          <span className="text-slate-400 truncate">{currentOrg.nicheFocus}</span>
        </div>
        <div className="shrink-0 text-slate-400 font-mono text-[11px] tabular-nums hidden md:block">
          {sources.length} Connected Systems · {pipelines.length} Active Pipelines · {currentOrg.region}
        </div>
      </div>
    </div>
  );
};
