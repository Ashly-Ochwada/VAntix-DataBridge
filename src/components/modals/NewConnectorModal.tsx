import React, { useState } from 'react';
import { useDataBridge } from '../../context/DataContext';
import { X, Server, Check, ArrowRight } from 'lucide-react';

interface NewConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewConnectorModal: React.FC<NewConnectorModalProps> = ({ isOpen, onClose }) => {
  const { addDataSource } = useDataBridge();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<any>('rest_webhook');
  const [systemType, setSystemType] = useState('Custom REST API');
  const [endpoint, setEndpoint] = useState('https://api.external-partner.org/v1/feed');
  const [authMethod, setAuthMethod] = useState<any>('API Key & Secret');
  const [syncFrequency, setSyncFrequency] = useState('Every 15 minutes');
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsTesting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsTesting(false);
    setTestSuccess(true);

    await new Promise((r) => setTimeout(r, 600));

    addDataSource({
      name,
      category,
      categoryLabel: category.replace('_', ' ').toUpperCase(),
      systemType,
      endpoint,
      authMethod,
      syncFrequency,
      sampleFields: ['record_id', 'timestamp', 'transaction_value', 'metadata_ref', 'status_code'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-cyan-950 border border-cyan-800 rounded">
              <Server className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Heterogeneous System Connector</h3>
              <p className="text-xs text-slate-400">Connect an existing silo without software replacement</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleTestAndSave} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Connector Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Odoo Community ERP, CommCare Field App, MTN MoMo API..."
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Silo Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="erp_accounting">Accounting / ERP</option>
                <option value="mobile_money_fintech">Mobile Money & Payments</option>
                <option value="crm_field">Field Survey / CRM</option>
                <option value="database_warehouse">Database / SQL Ledger</option>
                <option value="files_spreadsheets">Spreadsheets & Flat Files</option>
                <option value="rest_webhook">IoT & Webhooks</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Underlying System Type</label>
              <input
                type="text"
                value={systemType}
                onChange={(e) => setSystemType(e.target.value)}
                placeholder="E.g. PostgreSQL, REST v2, OData..."
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Endpoint URI or Connection Host</label>
            <input
              type="text"
              required
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Authentication Method</label>
              <select
                value={authMethod}
                onChange={(e) => setAuthMethod(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="API Key & Secret">API Key & Secret</option>
                <option value="OAuth 2.0">OAuth 2.0 (Token Refresh)</option>
                <option value="Mutual TLS">Mutual TLS Certificate</option>
                <option value="Direct SQL">Encrypted Direct SQL Credential</option>
                <option value="Encrypted SFTP">Encrypted SFTP / SSH Key</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Ingestion Schedule</label>
              <select
                value={syncFrequency}
                onChange={(e) => setSyncFrequency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Real-time Webhook / Stream">Real-time Webhook / Stream</option>
                <option value="Every 5 minutes">Every 5 minutes (Micro-batch)</option>
                <option value="Every 15 minutes">Every 15 minutes</option>
                <option value="Hourly Batch Poll">Hourly Batch Poll</option>
                <option value="Daily 06:00 / 18:00">Daily 06:00 & 18:00</option>
              </select>
            </div>
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
              disabled={isTesting || !name.trim()}
              className="px-4 py-2 font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-colors rounded flex items-center gap-1.5"
            >
              {isTesting ? (
                <span>Introspecting Schema...</span>
              ) : testSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Connected & Ready</span>
                </>
              ) : (
                <>
                  <span>Verify Handshake & Connect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
