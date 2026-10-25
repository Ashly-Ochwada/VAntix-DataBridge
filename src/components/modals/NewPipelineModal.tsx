import React, { useState } from 'react';
import { useDataBridge } from '../../context/DataContext';
import { X, Layers, ArrowRight } from 'lucide-react';

interface NewPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPipelineModal: React.FC<NewPipelineModalProps> = ({ isOpen, onClose }) => {
  const { sources, addPipeline } = useDataBridge();

  const [name, setName] = useState('');
  const [sourceId, setSourceId] = useState(sources[0]?.id || '');
  const [targetSchemaName, setTargetSchemaName] = useState('CanonicalIntegratedEntity');
  const [schedule, setSchedule] = useState('Every 15 minutes');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sourceId) return;

    addPipeline({
      name,
      sourceId,
      targetSchemaName,
      schedule,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cyan-950 border border-cyan-800 rounded">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Create Ingestion & Invariant Pipeline</h3>
              <p className="text-xs text-slate-400">Automate continuous validation and transformation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Pipeline Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Field Scale Batch Intake & Outgrower Settlement"
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Origin Source Connector</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {sources.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Ingestion Schedule</label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Real-time Event Stream">Real-time Event Stream</option>
                <option value="Every 5 minutes">Every 5 minutes</option>
                <option value="Every 15 minutes">Every 15 minutes</option>
                <option value="Hourly Batch">Hourly Batch</option>
                <option value="Daily 06:00">Daily 06:00</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Target Canonical Schema</label>
            <input
              type="text"
              required
              value={targetSchemaName}
              onChange={(e) => setTargetSchemaName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded text-slate-400 space-y-1 text-[11px]">
            <div className="text-slate-300 font-semibold">Standard Invariant Gates Applied:</div>
            <div>· Primary Identifier Not-Null Constraint</div>
            <div>· Cryptographic SHA256 Lineage Hash Generation</div>
            <div>· Quarantine Routing on Schema Drift or Range Violation</div>
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
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-colors rounded flex items-center gap-1.5"
            >
              <span>Deploy Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
