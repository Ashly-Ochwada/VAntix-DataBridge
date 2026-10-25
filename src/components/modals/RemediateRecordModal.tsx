import React, { useState, useEffect } from 'react';
import { useDataBridge } from '../../context/DataContext';
import { QuarantinedRecord } from '../../types/databridge';
import { X, AlertTriangle, CheckCircle, Trash2, ArrowRight, Wrench } from 'lucide-react';

interface RemediateRecordModalProps {
  record: QuarantinedRecord | null;
  onClose: () => void;
}

export const RemediateRecordModal: React.FC<RemediateRecordModalProps> = ({ record, onClose }) => {
  const { remediateRecord } = useDataBridge();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'form' | 'json'>('form');
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setFormData({ ...record.rawPayload });
      setJsonText(JSON.stringify(record.rawPayload, null, 2));
      setJsonError(null);
    }
  }, [record]);

  if (!record) return null;

  const handleFieldChange = (key: string, value: string) => {
    let parsedVal: any = value;
    if (!isNaN(Number(value)) && value.trim() !== '') {
      parsedVal = Number(value);
    }
    const updated = { ...formData, [key]: parsedVal };
    setFormData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setFormData(parsed);
      setJsonError(null);
    } catch (err: any) {
      setJsonError('Invalid JSON format');
    }
  };

  const handleRemediate = () => {
    if (jsonError) return;
    remediateRecord(record.id, formData, 'remediate');
    onClose();
  };

  const handleDiscard = () => {
    remediateRecord(record.id, formData, 'discard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full p-6 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-950 border border-amber-800 rounded">
              <Wrench className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Quarantine Exception Remediation</h3>
              <p className="text-xs text-slate-400">
                Source: {record.sourceSystem} · Trapped: {record.quarantinedAt}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Violated Invariant Banner */}
        <div className="p-3 bg-rose-950/40 border border-rose-900/80 rounded-md text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Violated Invariant Rule:</span>
          </div>
          <div className="font-mono text-[11px] text-rose-200 pl-5">
            {record.violatedRules[0]}
          </div>
          {record.suggestedFix && (
            <div className="text-[11px] text-cyan-300 pl-5 pt-0.5">
              <strong>Recommended Action:</strong> {record.suggestedFix}
            </div>
          )}
        </div>

        {/* Switch between Form Editor and JSON Editor */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-semibold text-slate-300">Correct Record Payload:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-2 py-0.5 rounded ${
                activeTab === 'form' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Form View
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-2 py-0.5 rounded ${
                activeTab === 'json' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
              }`}
            >
              Raw JSON
            </button>
          </div>
        </div>

        {activeTab === 'form' ? (
          <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1 text-xs">
            {Object.entries(formData).map(([key, val]) => (
              <div key={key} className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400 truncate block">{key}</label>
                <input
                  type="text"
                  value={val !== null && val !== undefined ? String(val) : ''}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-2.5 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono text-[11px]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <textarea
              rows={8}
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] p-3 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            {jsonError && <div className="text-[11px] text-rose-400 mt-1">{jsonError}</div>}
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Discard As Corrupted</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRemediate}
              disabled={!!jsonError}
              className="px-4 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Validate & Ingest to Lakehouse</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
