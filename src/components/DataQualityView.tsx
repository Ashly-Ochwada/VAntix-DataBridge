import React, { useState } from 'react';
import { useDataBridge } from '../context/DataContext';
import { QuarantinedRecord } from '../types/databridge';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Wrench,
  Check,
  RotateCcw,
  Eye,
} from 'lucide-react';

interface DataQualityViewProps {
  onOpenRemediateModal: (record: QuarantinedRecord) => void;
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({ onOpenRemediateModal }) => {
  const { quarantinedRecords, pipelines } = useDataBridge();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'remediated' | 'discarded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<QuarantinedRecord | null>(null);

  const filteredRecords = quarantinedRecords.filter((rec) => {
    if (statusFilter !== 'all' && rec.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSource = rec.sourceSystem.toLowerCase().includes(q);
      const matchPipeline = rec.pipelineName.toLowerCase().includes(q);
      const matchRule = rec.violatedRules.some((r) => r.toLowerCase().includes(q));
      const matchPayload = JSON.stringify(rec.rawPayload).toLowerCase().includes(q);
      return matchSource || matchPipeline || matchRule || matchPayload;
    }
    return true;
  });

  const pendingCount = quarantinedRecords.filter((r) => r.status === 'pending').length;
  const remediatedCount = quarantinedRecords.filter((r) => r.status === 'remediated').length;
  const discardedCount = quarantinedRecords.filter((r) => r.status === 'discarded').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Data Quality & Inconsistency Quarantine</h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero-loss dead-letter queue catching schema drift, referential mismatches, corrupted field weights, and broken ledger balances before they pollute downstream reports.
          </p>
        </div>
      </div>

      {/* Quality Invariants Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-lg overflow-hidden">
        <div className="bg-slate-900/90 p-4">
          <div className="text-xs text-slate-400 font-medium">Pending Inconsistencies</div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums mt-1">
            {pendingCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Requiring operator or automated rule fix</div>
        </div>

        <div className="bg-slate-900/90 p-4">
          <div className="text-xs text-slate-400 font-medium">Remediated & Re-ingested</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {remediatedCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Promoted into Governed Lakehouse</div>
        </div>

        <div className="bg-slate-900/90 p-4">
          <div className="text-xs text-slate-400 font-medium">Discarded Junk Records</div>
          <div className="text-2xl font-bold font-mono text-slate-400 tabular-nums mt-1">
            {discardedCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">Purged after verified duplicate checks</div>
        </div>

        <div className="bg-slate-900/90 p-4">
          <div className="text-xs text-slate-400 font-medium">Quality SLA Guarantee</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-1">
            99.9%
          </div>
          <div className="text-xs text-slate-500 mt-1">Zero silent contamination policy</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Inconsistencies ({quarantinedRecords.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'pending'
                ? 'bg-amber-950/60 text-amber-300 font-semibold border border-amber-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending Review ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('remediated')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'remediated'
                ? 'bg-emerald-950/60 text-emerald-300 font-semibold border border-emerald-900'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Remediated ({remediatedCount})
          </button>
          <button
            onClick={() => setStatusFilter('discarded')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              statusFilter === 'discarded'
                ? 'bg-slate-800 text-slate-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Discarded ({discardedCount})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by rule, field, or system..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Quarantined Records Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-lg overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-semibold text-white">No Quarantined Records Found</div>
            <div className="text-xs text-slate-400 max-w-sm mx-auto">
              All incoming data streams meet established schema invariants and validation rules.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Detected At</th>
                  <th className="py-2.5 px-4">Origin Silo</th>
                  <th className="py-2.5 px-4">Violated Data Invariant</th>
                  <th className="py-2.5 px-4">Raw Snippet</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {record.quarantinedAt}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">{record.sourceSystem}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate max-w-[160px]">
                        {record.pipelineName}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-rose-300 font-mono text-[11px] leading-relaxed">
                        {record.violatedRules[0]}
                      </div>
                      {record.suggestedFix && (
                        <div className="text-[11px] text-cyan-400/90 mt-1">
                          Fix suggestion: {record.suggestedFix}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400 max-w-xs">
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-800 truncate">
                        {JSON.stringify(record.rawPayload)}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          record.status === 'pending'
                            ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                            : record.status === 'remediated'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onOpenRemediateModal(record)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Wrench className="w-3 h-3" />
                        <span>{record.status === 'pending' ? 'Remediate' : 'Inspect'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
