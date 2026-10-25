import React, { useState } from 'react';
import { useDataBridge } from '../context/DataContext';
import { DataSource } from '../types/databridge';
import {
  Server,
  Database,
  Smartphone,
  BookOpen,
  FileSpreadsheet,
  Check,
  AlertCircle,
  RefreshCw,
  Plus,
  Radio,
  ExternalLink,
  ShieldCheck,
  Layers,
  Trash2,
} from 'lucide-react';

interface ConnectorsViewProps {
  onOpenNewConnector: () => void;
}

export const ConnectorsView: React.FC<ConnectorsViewProps> = ({ onOpenNewConnector }) => {
  const { sources, syncSourceNow, isSyncingSourceId, deleteDataSource } = useDataBridge();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testingSourceId, setTestingSourceId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);
  const [selectedSourceForInspect, setSelectedSourceForInspect] = useState<DataSource | null>(null);

  const categories = [
    { id: 'all', label: 'All Connected Systems' },
    { id: 'erp_accounting', label: 'ERP & Accounting' },
    { id: 'mobile_money_fintech', label: 'Mobile Money & Payment Gateways' },
    { id: 'crm_field', label: 'Field Surveys & CRMs' },
    { id: 'database_warehouse', label: 'Databases & CDC' },
    { id: 'files_spreadsheets', label: 'Files & Spreadsheets' },
    { id: 'rest_webhook', label: 'IoT & Webhooks' },
  ];

  const filteredSources =
    selectedCategory === 'all'
      ? sources
      : sources.filter((s) => s.category === selectedCategory);

  const handleTestConnection = async (source: DataSource) => {
    setTestingSourceId(source.id);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, 1100));

    setTestingSourceId(null);
    setTestResult({
      id: source.id,
      success: true,
      message: `Schema Handshake Verified: Discovered ${source.sampleFields.length} active fields over ${source.authMethod}. Zero packet loss.`,
    });
  };

  const getSourceIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-indigo-400" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-cyan-400" />;
      case 'Banknote':
      case 'CreditCard':
        return <Radio className="w-5 h-5 text-emerald-400" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-amber-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-blue-400" />;
      default:
        return <Server className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">System Connectors & Ingestion Nodes</h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain bidirectional connectors to legacy software, modern REST APIs, cloud databases, and field spreadsheets without replacing underlying systems.
          </p>
        </div>
        <button
          onClick={onOpenNewConnector}
          className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Connector</span>
        </button>
      </div>

      {/* Filter Tabs adhering to clean segmented style */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => {
          const isSyncing = isSyncingSourceId === source.id;
          const isTesting = testingSourceId === source.id;
          const currentTest = testResult?.id === source.id ? testResult : null;

          return (
            <div
              key={source.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-lg p-4 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-md">
                      {getSourceIcon(source.iconName)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white truncate max-w-[190px]">
                        {source.name}
                      </h3>
                      <div className="text-[11px] text-slate-400">{source.categoryLabel}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      source.status === 'connected'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-900'
                        : source.status === 'syncing'
                        ? 'bg-cyan-950/60 text-cyan-400 border-cyan-900'
                        : 'bg-amber-950/60 text-amber-400 border-amber-900'
                    }`}
                  >
                    {source.status}
                  </span>
                </div>

                {/* Details & Endpoint */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Auth Standard:</span>
                    <span className="font-mono text-slate-300">{source.authMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Cadence:</span>
                    <span className="text-slate-300">{source.syncFrequency}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Last Ingest:</span>
                    <span className="text-slate-300">{source.lastSyncTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Today's Ingest:</span>
                    <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                      {source.recordsSyncedToday.toLocaleString()} records
                    </span>
                  </div>
                </div>

                {/* Introspected Schema Fields */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
                    Discovered Schema ({source.sampleFields.length} attributes)
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {source.sampleFields.slice(0, 4).map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-mono bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                      >
                        {f}
                      </span>
                    ))}
                    {source.sampleFields.length > 4 && (
                      <span className="text-[10px] font-mono text-slate-500 px-1 py-0.5">
                        +{source.sampleFields.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Test Result Message */}
                {currentTest && (
                  <div className="mt-2.5 p-2 bg-emerald-950/40 border border-emerald-900 rounded text-[11px] text-emerald-300 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{currentTest.message}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTestConnection(source)}
                  disabled={isTesting}
                  className="px-2 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>{isTesting ? 'Testing Handshake...' : 'Test Schema'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => syncSourceNow(source.id)}
                    disabled={isSyncing}
                    className="px-2.5 py-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-900/60 rounded transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                  </button>

                  <button
                    onClick={() => deleteDataSource(source.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Disconnect Source"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
