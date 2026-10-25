import React from 'react';
import { useDataBridge } from '../context/DataContext';
import {
  Layers,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  Server,
  Play,
  RotateCw,
  FileText,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface OverviewViewProps {
  setActiveTab: (tab: string) => void;
  onOpenNewConnector: () => void;
  onOpenNewPipeline: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  setActiveTab,
  onOpenNewConnector,
  onOpenNewPipeline,
}) => {
  const {
    currentOrg,
    sources,
    pipelines,
    quarantinedRecords,
    governedRecords,
    triggerPipelineRun,
    runningPipelineId,
  } = useDataBridge();

  const totalRecordsToday = sources.reduce((acc, s) => acc + s.recordsSyncedToday, 0);
  const avgQualityPassRate =
    pipelines.length > 0
      ? (pipelines.reduce((acc, p) => acc + p.qualityPassRate, 0) / pipelines.length).toFixed(1)
      : '100.0';
  const pendingQuarantineCount = quarantinedRecords.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* KPI Quantitative Strip adhering to zero-pill & tabular-nums */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-lg overflow-hidden">
        <div className="bg-slate-900/90 p-4">
          <div className="text-xs text-slate-400 font-medium">Ingested Records Today</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {totalRecordsToday.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {sources.length} active fragmented endpoints
          </div>
        </div>

        <div className="bg-slate-900/90 p-4">
          <div className="text-xs text-slate-400 font-medium">Data Invariants Pass Rate</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
            {avgQualityPassRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Automated schema validation checks
          </div>
        </div>

        <div className="bg-slate-900/90 p-4">
          <div className="text-xs text-slate-400 font-medium">Quarantined Inconsistencies</div>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                pendingQuarantineCount > 0 ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              {pendingQuarantineCount}
            </span>
            {pendingQuarantineCount > 0 && (
              <button
                onClick={() => setActiveTab('quarantine')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
              >
                Inspect
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Trapped before contaminating lakehouse
          </div>
        </div>

        <div className="bg-slate-900/90 p-4">
          <div className="text-xs text-slate-400 font-medium">Governed Reconciled Entities</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {governedRecords.length.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Cryptographically signed & verified
          </div>
        </div>
      </div>

      {/* Visual End-to-End Data Mesh Flow */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-white">Live Data Integration Topology</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Connects legacy silos and modern APIs without forcing system replacements
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 tabular-nums">
            Cluster: {currentOrg.region} · {currentOrg.nodeCount} Ingestion Nodes
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Column 1: Fragmented Source Systems */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 pb-1">
              <span>01. Fragmented Silos ({sources.length})</span>
              <button
                onClick={() => setActiveTab('sources')}
                className="text-cyan-400 hover:underline text-[11px]"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-md hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 truncate pr-2">
                      {src.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                      {src.recordsSyncedToday.toLocaleString()} r/d
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span>{src.systemType}</span>
                    <span className="text-slate-400">{src.authMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Ingestion & Validation Gateway */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 pb-1">
              <span>02. Validation & Quality Gates ({pipelines.length})</span>
              <button
                onClick={() => setActiveTab('pipelines')}
                className="text-cyan-400 hover:underline text-[11px]"
              >
                Pipelines
              </button>
            </div>

            <div className="space-y-2">
              {pipelines.map((pipe) => {
                const isRunning = runningPipelineId === pipe.id;
                return (
                  <div
                    key={pipe.id}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-md hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 truncate pr-2">
                        {pipe.name}
                      </span>
                      <button
                        onClick={() => triggerPipelineRun(pipe.id)}
                        disabled={isRunning}
                        className="p-1 text-slate-400 hover:text-cyan-400 disabled:opacity-40 transition-colors"
                        title="Trigger Pipeline Now"
                      >
                        <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin text-cyan-400' : ''}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-900 text-[11px]">
                      <div>
                        <div className="text-slate-500">Pass Rate</div>
                        <div className="font-mono text-emerald-400 font-semibold tabular-nums">
                          {pipe.qualityPassRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Quarantine</div>
                        <div className="font-mono text-amber-400 font-semibold tabular-nums">
                          {pipe.quarantinedCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Last Duration</div>
                        <div className="font-mono text-slate-300 tabular-nums">
                          {pipe.lastRunDurationSec}s
                        </div>
                      </div>
                    </div>

                    {isRunning && (
                      <div className="mt-2 text-[11px] text-cyan-400 font-mono animate-pulse">
                        Executing multi-stage invariant check...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Governed Lakehouse & Reports */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400 pb-1">
              <span>03. Governed Lakehouse & Output</span>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-cyan-400 hover:underline text-[11px]"
              >
                Explorer
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
                <div className="text-xs font-semibold text-slate-200">
                  Reconciled Canonical Entities
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Single source of truth with immutable lineage tracking and provenance signatures.
                </div>
                <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{governedRecords.length} Reconciled Records</span>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    View Entities →
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-md">
                <div className="text-xs font-semibold text-slate-200">
                  Reusable Reporting & Audit Packets
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Automated statutory packets for donors, tax authorities, and internal finance.
                </div>
                <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Statutory Compliance</span>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Generate Report →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Pipeline Telemetry & Dead Letter Quarantine Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Execution Log Stream */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h3 className="text-xs font-semibold text-white">Live Execution Telemetry & Logs</h3>
            <span className="text-[11px] font-mono text-slate-500">Real-time Stream</span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-72 overflow-y-auto pr-1">
            {pipelines.flatMap((p) => p.recentLogs).map((log, idx) => (
              <div
                key={idx}
                className="p-2 bg-slate-950 border border-slate-800/80 rounded text-[11px] flex items-start gap-2.5"
              >
                <span className="text-slate-500 shrink-0 tabular-nums">{log.timestamp}</span>
                <span
                  className={`uppercase text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                    log.level === 'success'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                      : log.level === 'warn'
                      ? 'bg-amber-950 text-amber-400 border border-amber-900'
                      : log.level === 'error'
                      ? 'bg-rose-950 text-rose-400 border border-rose-900'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {log.stage}
                </span>
                <span className="text-slate-300 flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inconsistencies & Quarantine Watch */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold text-white">Trapped Inconsistencies</h3>
              <span className="text-xs font-mono text-amber-400 tabular-nums">
                ({quarantinedRecords.filter((r) => r.status === 'pending').length} Action Required)
              </span>
            </div>
            <button
              onClick={() => setActiveTab('quarantine')}
              className="text-xs text-cyan-400 hover:text-cyan-300"
            >
              Open Quarantine Console →
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {quarantinedRecords.slice(0, 3).map((rec) => (
              <div
                key={rec.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-md text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{rec.sourceSystem}</span>
                  <span className="text-[11px] text-slate-500 font-mono">{rec.quarantinedAt}</span>
                </div>
                <div className="text-[11px] text-rose-300/90 font-mono">
                  {rec.violatedRules[0]}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="truncate max-w-[280px]">Fix: {rec.suggestedFix}</span>
                  <button
                    onClick={() => setActiveTab('quarantine')}
                    className="text-cyan-400 hover:text-cyan-300 shrink-0 font-medium ml-2"
                  >
                    Remediate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
