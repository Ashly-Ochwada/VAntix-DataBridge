import React, { useState } from 'react';
import { useDataBridge } from '../context/DataContext';
import { GovernedRecord, GovernedReportTemplate } from '../types/databridge';
import {
  Database,
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  Shield,
  Eye,
} from 'lucide-react';

interface AnalyticsViewProps {
  onOpenExportReportModal: (template: GovernedReportTemplate) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onOpenExportReportModal }) => {
  const { currentOrg, governedRecords, reportTemplates } = useDataBridge();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<GovernedRecord | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'lakehouse' | 'reports'>('lakehouse');

  const filteredRecords = governedRecords.filter((rec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchId = rec.canonicalId.toLowerCase().includes(q);
    const matchType = rec.entityType.toLowerCase().includes(q);
    const matchSource = rec.originSource.toLowerCase().includes(q);
    const matchData = JSON.stringify(rec.data).toLowerCase().includes(q);
    return matchId || matchType || matchSource || matchData;
  });

  const handleExportCSV = () => {
    if (governedRecords.length === 0) return;
    const sample = governedRecords[0].data;
    const headers = ['canonical_id', 'entity_type', 'origin_source', 'ingested_at', ...Object.keys(sample)];
    const rows = governedRecords.map((r) => [
      r.canonicalId,
      r.entityType,
      r.originSource,
      r.ingestedAt,
      ...Object.keys(sample).map((k) => `"${r.data[k] ?? ''}"`),
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vantix_governed_${currentOrg.sector}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(governedRecords, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vantix_governed_${currentOrg.sector}_lakehouse.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Governed Analytics Layer & Reporting Studio</h2>
          <p className="text-xs text-slate-400 mt-1">
            Reconciled canonical data models ready for business intelligence, external audit inspection, donor compliance, and statutory filings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Lakehouse JSON</span>
          </button>
        </div>
      </div>

      {/* Sub navigation segmented buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveSubTab('lakehouse')}
          className={`px-3 py-1.5 text-xs rounded transition-colors ${
            activeSubTab === 'lakehouse'
              ? 'bg-slate-800 text-cyan-400 font-semibold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Canonical Lakehouse Explorer ({governedRecords.length} records)
        </button>
        <button
          onClick={() => setActiveSubTab('reports')}
          className={`px-3 py-1.5 text-xs rounded transition-colors ${
            activeSubTab === 'reports'
              ? 'bg-slate-800 text-cyan-400 font-semibold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Reusable Statutory & Audit Reports ({reportTemplates.length})
        </button>
      </div>

      {activeSubTab === 'lakehouse' ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search canonical ID, grower, beneficiary, or reference..."
                className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono tabular-nums">
              Showing {filteredRecords.length} governed entries
            </div>
          </div>

          {/* Table of Canonical Records */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                  <tr>
                    <th className="py-2.5 px-4">Canonical ID</th>
                    <th className="py-2.5 px-4">Entity Model</th>
                    <th className="py-2.5 px-4">Reconciled Attributes</th>
                    <th className="py-2.5 px-4">Origin Provenance</th>
                    <th className="py-2.5 px-4">Audit Signature</th>
                    <th className="py-2.5 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        {rec.canonicalId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200">{rec.entityType}</span>
                        <div className="text-[11px] text-slate-500">{rec.verifiedAt}</div>
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <div className="space-y-0.5 text-[11px]">
                          {Object.entries(rec.data).slice(0, 3).map(([k, v]) => (
                            <div key={k} className="truncate">
                              <span className="text-slate-500 font-mono">{k}: </span>
                              <span className="text-slate-300 font-medium">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                        {rec.originSource}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-emerald-400 whitespace-nowrap">
                        <span className="bg-emerald-950/60 border border-emerald-900/60 px-1.5 py-0.5 rounded">
                          {rec.hashSignature}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedRecordForDetail(rec)}
                          className="px-2 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View JSON</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Record Detail Modal */}
          {selectedRecordForDetail && (
            <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-xl w-full p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Canonical Lineage Audit Trail</h3>
                    <div className="text-xs text-cyan-400 font-mono mt-0.5">
                      {selectedRecordForDetail.canonicalId}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRecordForDetail(null)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Origin Silo:</span>
                    <span className="text-slate-200">{selectedRecordForDetail.originSource}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Verified Timestamp:</span>
                    <span className="font-mono text-slate-200">{selectedRecordForDetail.verifiedAt}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tamper-Proof Hash:</span>
                    <span className="font-mono text-emerald-400">{selectedRecordForDetail.hashSignature}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-1">Normalized Record Payload:</div>
                  <pre className="bg-slate-950 p-3 rounded border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto max-h-60">
                    {JSON.stringify(selectedRecordForDetail.data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Reusable Reporting Models */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-lg p-5 flex flex-col justify-between transition-colors space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {template.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{template.frequency}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{template.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{template.description}</p>

                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <div>
                    <strong className="text-slate-400">Target Audience:</strong> {template.targetAudience}
                  </div>
                  <div>
                    <strong className="text-slate-400">Last Generated:</strong> {template.lastGenerated}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1.5">
                    Governed Invariant Metrics
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.metricsCovered.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] bg-slate-950 text-cyan-300 px-2 py-0.5 rounded border border-slate-800 font-mono"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Format: {template.format}</span>
                <button
                  onClick={() => onOpenExportReportModal(template)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
