import React, { useState } from 'react';
import { useDataBridge } from '../context/DataContext';
import { Pipeline } from '../types/databridge';
import {
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  Shield,
  Layers,
  FileCode,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PipelinesViewProps {
  onOpenNewPipeline: () => void;
  setActiveTab: (tab: string) => void;
}

export const PipelinesView: React.FC<PipelinesViewProps> = ({ onOpenNewPipeline, setActiveTab }) => {
  const { pipelines, sources, triggerPipelineRun, runningPipelineId } = useDataBridge();
  const [expandedPipelineId, setExpandedPipelineId] = useState<string | null>(pipelines[0]?.id || null);

  const getSourceName = (sourceId: string) => {
    return sources.find((s) => s.id === sourceId)?.name || 'Direct Source Stream';
  };

  const toggleExpand = (id: string) => {
    setExpandedPipelineId(expandedPipelineId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Automated Ingestion & Validation Pipelines</h2>
          <p className="text-xs text-slate-400 mt-1">
            Declarative data pipelines enforcing invariant contracts, continuous reconciliation, and zero-loss quarantine across disparate systems.
          </p>
        </div>
        <button
          onClick={onOpenNewPipeline}
          className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Ingestion Pipeline</span>
        </button>
      </div>

      {/* Pipelines List */}
      <div className="space-y-4">
        {pipelines.map((pipeline) => {
          const isRunning = runningPipelineId === pipeline.id;
          const isExpanded = expandedPipelineId === pipeline.id;

          return (
            <div
              key={pipeline.id}
              className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden transition-colors"
            >
              {/* Pipeline Summary Bar */}
              <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white">{pipeline.name}</h3>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        isRunning
                          ? 'bg-cyan-950 text-cyan-400 border-cyan-800 animate-pulse'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-900'
                      }`}
                    >
                      {isRunning ? 'Running Execution...' : pipeline.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500">Source:</span>
                      <span className="text-slate-300 font-medium">{getSourceName(pipeline.sourceId)}</span>
                    </span>
                    <span className="text-slate-700">→</span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500">Target Schema:</span>
                      <span className="text-cyan-400 font-mono text-[11px]">{pipeline.targetSchemaName}</span>
                    </span>
                    <span className="text-slate-700">·</span>
                    <span className="text-slate-400">Schedule: {pipeline.schedule}</span>
                  </div>
                </div>

                {/* Quantitative Stats & Actions */}
                <div className="flex items-center gap-6">
                  <div className="grid grid-cols-3 gap-4 text-xs font-mono tabular-nums">
                    <div>
                      <div className="text-[11px] text-slate-500">Pass Rate</div>
                      <div className="text-emerald-400 font-bold">{pipeline.qualityPassRate}%</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Quarantined</div>
                      <div
                        className={`font-bold ${
                          pipeline.quarantinedCount > 0 ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {pipeline.quarantinedCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Processed</div>
                      <div className="text-slate-200">{pipeline.recordsProcessedToday.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerPipelineRun(pipeline.id)}
                      disabled={isRunning}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-colors rounded flex items-center gap-1.5"
                    >
                      <Play className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                      <span>{isRunning ? 'Running...' : 'Run Pipeline'}</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(pipeline.id)}
                      className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                      title={isExpanded ? 'Collapse Details' : 'Expand Details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Inspection Drawer */}
              {isExpanded && (
                <div className="border-t border-slate-800 bg-slate-950/60 p-4 space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Transformation Rules Applied */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="font-semibold text-slate-200">
                          Active Transformation Rules ({pipeline.transformRules.length})
                        </span>
                        <button
                          onClick={() => setActiveTab('mapper')}
                          className="text-cyan-400 hover:underline text-[11px]"
                        >
                          Edit Schema Mappings →
                        </button>
                      </div>

                      <div className="space-y-1.5 font-mono text-[11px]">
                        {pipeline.transformRules.map((rule) => (
                          <div
                            key={rule.id}
                            className="p-1.5 bg-slate-950 border border-slate-800 rounded flex items-center justify-between"
                          >
                            <span className="text-slate-400">{rule.sourceField}</span>
                            <span className="text-slate-600">→</span>
                            <span className="text-cyan-300 font-semibold">{rule.targetField}</span>
                            <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                              {rule.transformType}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quality Invariants Checked */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded p-3 text-xs space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="font-semibold text-slate-200">
                          Data Invariants & Quarantine Gates ({pipeline.qualityRules.length})
                        </span>
                        <button
                          onClick={() => setActiveTab('quarantine')}
                          className="text-cyan-400 hover:underline text-[11px]"
                        >
                          View Quarantine Log →
                        </button>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        {pipeline.qualityRules.map((rule) => (
                          <div
                            key={rule.id}
                            className="p-1.5 bg-slate-950 border border-slate-800 rounded flex items-start justify-between gap-2"
                          >
                            <div>
                              <div className="font-medium text-slate-300">{rule.description}</div>
                              <div className="font-mono text-[10px] text-slate-500">
                                Target: {rule.field} · Rule: {rule.ruleType}
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/40 border border-amber-900 px-1 py-0.5 rounded shrink-0">
                              {rule.failureCount} violations caught
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Execution Trace Stream */}
                  <div className="bg-slate-900/80 border border-slate-800/80 rounded p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <span className="font-semibold text-slate-200">Recent Execution Trace Logs</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Last Run: {pipeline.lastRunAt} (Duration: {pipeline.lastRunDurationSec}s)
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-[11px] max-h-40 overflow-y-auto pr-1">
                      {pipeline.recentLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2 py-0.5 text-slate-300">
                          <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                          <span
                            className={`uppercase text-[10px] px-1 py-0.2 rounded shrink-0 ${
                              log.level === 'success'
                                ? 'text-emerald-400 bg-emerald-950'
                                : log.level === 'warn'
                                ? 'text-amber-400 bg-amber-950'
                                : 'text-slate-400 bg-slate-800'
                            }`}
                          >
                            [{log.stage}]
                          </span>
                          <span className="flex-1">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
