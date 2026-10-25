import React, { useState } from 'react';
import { useDataBridge } from '../context/DataContext';
import { TransformationRule } from '../types/databridge';
import {
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
  Code,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';

export const SchemaMapperView: React.FC = () => {
  const { pipelines, sources, updateFieldMappings } = useDataBridge();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(pipelines[0]?.id || '');

  const activePipeline = pipelines.find((p) => p.id === selectedPipelineId) || pipelines[0];
  const activeSource = sources.find((s) => s.id === activePipeline?.sourceId);

  // New rule draft state
  const [newSourceField, setNewSourceField] = useState<string>('');
  const [newTargetField, setNewTargetField] = useState<string>('');
  const [newTransformType, setNewTransformType] = useState<TransformationRule['transformType']>('direct');
  const [ruleNotes, setRuleNotes] = useState<string>('');

  const handleAddRule = () => {
    if (!newSourceField || !newTargetField || !activePipeline) return;

    const newRule: TransformationRule = {
      id: `tr_${Date.now()}`,
      sourceField: newSourceField,
      targetField: newTargetField,
      transformType: newTransformType,
      notes: ruleNotes || undefined,
    };

    const updated = [...activePipeline.transformRules, newRule];
    updateFieldMappings(activePipeline.id, updated);

    setNewSourceField('');
    setNewTargetField('');
    setRuleNotes('');
  };

  const handleDeleteRule = (ruleId: string) => {
    if (!activePipeline) return;
    const updated = activePipeline.transformRules.filter((r) => r.id !== ruleId);
    updateFieldMappings(activePipeline.id, updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">Schema Reconciliation & Transformation Workbench</h2>
          <p className="text-xs text-slate-400 mt-1">
            Map fragmented, vendor-specific field names into universal canonical enterprise schemas with deterministic type coercion, currency normalization, and PII anonymization.
          </p>
        </div>

        {/* Pipeline Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Target Pipeline:</span>
          <select
            value={selectedPipelineId}
            onChange={(e) => setSelectedPipelineId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {pipelines.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schema Mapping Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Schema Attributes */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                01. Inbound Schema Fields
              </h3>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Source: {activeSource?.name || 'Raw Ingest Stream'}
              </div>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              {activeSource?.sampleFields.length || 0} discovered
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {activeSource?.sampleFields.map((field) => (
              <div
                key={field}
                onClick={() => setNewSourceField(field)}
                className={`p-2 rounded border transition-colors cursor-pointer flex items-center justify-between ${
                  newSourceField === field
                    ? 'bg-cyan-950/80 border-cyan-700 text-cyan-200'
                    : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>{field}</span>
                <span className="text-[10px] text-slate-500 font-sans">Click to map</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transformation Pipes in Middle */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              02. Active Transformation Rules
            </h3>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Deterministic transformation functions
            </div>
          </div>

          {/* Active Rules List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {activePipeline?.transformRules.map((rule) => (
              <div
                key={rule.id}
                className="p-2.5 bg-slate-950 border border-slate-800 rounded-md text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400 truncate max-w-[90px]">{rule.sourceField}</span>
                  <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="text-cyan-300 font-semibold truncate max-w-[110px]">
                    {rule.targetField}
                  </span>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                    title="Remove rule"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                  <span className="bg-slate-900 px-1.5 py-0.2 rounded text-slate-400">
                    {rule.transformType}
                  </span>
                  {rule.notes && <span className="truncate max-w-[140px] italic">{rule.notes}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Add Rule Inline Form */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-300">Add Field Mapping Pipe</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Source Field"
                value={newSourceField}
                onChange={(e) => setNewSourceField(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
              <input
                type="text"
                placeholder="Canonical Field"
                value={newTargetField}
                onChange={(e) => setNewTargetField(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={newTransformType}
                onChange={(e) => setNewTransformType(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-2 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="direct">Direct Copy</option>
                <option value="type_cast">Type Cast (Float / Int / ISO Date)</option>
                <option value="phone_e164">Phone E.164 (+254/+256)</option>
                <option value="currency_convert">Currency FX Normalizer</option>
                <option value="lookup_map">Dictionary / Master SKU Lookup</option>
                <option value="anonymize">PII Cryptographic Hash (SHA256)</option>
              </select>

              <button
                onClick={handleAddRule}
                disabled={!newSourceField || !newTargetField}
                className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 transition-colors rounded flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Bind Mapping</span>
              </button>
            </div>
          </div>
        </div>

        {/* Governed Canonical Target */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              03. Governed Canonical Lakehouse
            </h3>
            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
              Target Entity: {activePipeline?.targetSchemaName}
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-md font-mono text-xs text-slate-300 space-y-1">
            <div className="text-[11px] text-slate-500 mb-2">// Canonical Entity Definition</div>
            <div>
              <span className="text-cyan-400">entity_id</span>: <span className="text-amber-400">UUID (v4)</span>
            </div>
            <div>
              <span className="text-cyan-400">origin_provenance</span>: <span className="text-amber-400">String</span>
            </div>
            <div>
              <span className="text-cyan-400">ingestion_timestamp</span>: <span className="text-amber-400">ISO-8601</span>
            </div>
            {activePipeline?.transformRules.map((rule) => (
              <div key={rule.id}>
                <span className="text-emerald-400">{rule.targetField}</span>:{' '}
                <span className="text-slate-400">{rule.transformType}</span>
              </div>
            ))}
            <div>
              <span className="text-cyan-400">governance_signature</span>: <span className="text-amber-400">HMAC-SHA256</span>
            </div>
          </div>

          <div className="p-2.5 bg-cyan-950/40 border border-cyan-900/70 rounded text-[11px] text-cyan-200">
            <strong>Guaranteed Governance:</strong> Every row entering the Lakehouse carries an immutable hash linking back to the raw source packet for compliance and auditability.
          </div>
        </div>
      </div>
    </div>
  );
};
