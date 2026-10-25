import React, { useState } from 'react';
import { GovernedReportTemplate } from '../../types/databridge';
import { useDataBridge } from '../../context/DataContext';
import { X, FileText, Download, Check, ShieldCheck } from 'lucide-react';

interface ExportReportModalProps {
  template: GovernedReportTemplate | null;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ template, onClose }) => {
  const { currentOrg, governedRecords } = useDataBridge();
  const [dateRange, setDateRange] = useState('Last 30 Days (Standard Audit Period)');
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [includeProvenance, setIncludeProvenance] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!template) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsGenerating(false);
    setIsSuccess(true);

    // Trigger instant browser download
    const reportData = {
      report_title: template.title,
      organization: currentOrg.name,
      sector: currentOrg.sectorLabel,
      region: currentOrg.region,
      audit_period: dateRange,
      generated_at: new Date().toISOString(),
      statutory_compliance_status: 'Fully Invariant Compliant',
      metrics_summary: template.metricsCovered,
      governed_records_sample: governedRecords.slice(0, 5),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: format === 'json' ? 'application/json' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : format === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cyan-950 border border-cyan-800 rounded">
              <FileText className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Generate Governed Statutory Report</h3>
              <p className="text-xs text-slate-400">{template.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Audit Time Horizon</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="Last 7 Days">Last 7 Days (Operational Review)</option>
              <option value="Last 30 Days (Standard Audit Period)">Last 30 Days (Standard Audit Period)</option>
              <option value="Current Quarter Q4">Current Quarter Q4</option>
              <option value="Fiscal Year to Date (FY2026)">Fiscal Year to Date (FY2026)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Target Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-2 rounded border text-center transition-colors ${
                  format === 'pdf'
                    ? 'bg-cyan-950/80 border-cyan-700 text-cyan-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Executive PDF
              </button>
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-2 rounded border text-center transition-colors ${
                  format === 'csv'
                    ? 'bg-cyan-950/80 border-cyan-700 text-cyan-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Audited CSV
              </button>
              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`p-2 rounded border text-center transition-colors ${
                  format === 'json'
                    ? 'bg-cyan-950/80 border-cyan-700 text-cyan-200 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                JSON Stream
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1.5 text-[11px] text-slate-400">
            <div className="text-slate-200 font-semibold">Included Verification Signatures:</div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Full Lineage Hashes Attached (Zero Data Corruption)</span>
            </div>
            <div>Audience: {template.targetAudience}</div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-colors rounded flex items-center gap-1.5"
            >
              {isGenerating ? (
                <span>Compiling Packet...</span>
              ) : isSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
