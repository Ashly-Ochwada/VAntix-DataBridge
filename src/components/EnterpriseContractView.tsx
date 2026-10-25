import React, { useState } from 'react';
import { useDataBridge } from '../context/DataContext';
import {
  ShieldCheck,
  Clock,
  DollarSign,
  FileCheck,
  CheckCircle2,
  Calendar,
  Send,
  UserCheck,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export const EnterpriseContractView: React.FC = () => {
  const { currentOrg, commercials } = useDataBridge();
  const [retainerRequestText, setRetainerRequestText] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const retainerLogs = [
    {
      date: 'Oct 23, 2026',
      engineer: commercials.dedicatedArchitect.name,
      hours: 3.5,
      task: 'Calibrated tare weight bounds and exception handler on Avery Field Scale driver #4',
      status: 'Approved',
    },
    {
      date: 'Oct 19, 2026',
      engineer: commercials.dedicatedArchitect.name,
      hours: 5.0,
      task: 'Built automated M-Pesa B2C callback reconciliation bridge to Sage Pastel general ledger',
      status: 'Approved',
    },
    {
      date: 'Oct 12, 2026',
      engineer: 'Field Systems Team',
      hours: 6.0,
      task: 'Designed donor code cross-reference table and E.164 MSISDN sanitization pipe',
      status: 'Approved',
    },
  ];

  const handleRetainerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retainerRequestText.trim()) return;
    setRequestSubmitted(true);
    setTimeout(() => {
      setRetainerRequestText('');
      setRequestSubmitted(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white">
            Commercial Architecture: Implementation, Retainers & SLA
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise engagement model combining upfront system implementation, ongoing engineering retainers for pipeline evolution, and recurring node fees.
          </p>
        </div>
      </div>

      {/* Commercial 3-Pillar Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Implementation Contract */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                One-Off Contract
              </span>
              <FileCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-xs text-slate-400 font-medium">Enterprise Implementation Contract</h3>
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              ${commercials.implementationValueUsd.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {commercials.contractPhase}. Covers initial silo introspection, custom API driver development, schema mapping, and security hardening.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Architecture Milestones Validated</span>
          </div>
        </div>

        {/* Pillar 2: Integration Retainer */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Monthly Retainer
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-xs text-slate-400 font-medium">Monthly Engineering Retainer</h3>
            <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              ${commercials.monthlyRetainerUsd.toLocaleString()}
              <span className="text-xs font-normal text-slate-500"> /mo</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Dedicated data infrastructure engineering retainers. Provides continuous rule adjustments, new accounting ERP code mappings, and emergency triage.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between font-mono">
            <span>Hours Used:</span>
            <span className="font-bold text-amber-400 tabular-nums">
              {commercials.retainedHoursUsed} / {commercials.retainedHoursAllocated} hrs
            </span>
          </div>
        </div>

        {/* Pillar 3: Recurring Platform Node Fees */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                Recurring License
              </span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xs text-slate-400 font-medium">Platform Infrastructure Subscription</h3>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              ${commercials.platformRecurringUsd.toLocaleString()}
              <span className="text-xs font-normal text-slate-500"> /mo</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Governed Lakehouse storage, multi-zone ingestion cluster orchestration, cryptographic audit ledger signatures, and dead-letter quarantine queue.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between font-mono">
            <span>Active Cluster Nodes:</span>
            <span className="font-bold text-cyan-400">{commercials.activeNodes} dedicated nodes</span>
          </div>
        </div>
      </div>

      {/* Two Column: Retainer Ledger & Dedicated Architect Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Retainer Burn-down Ledger */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Retainer Engineering Timesheet & Ledger</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent accounting of retained hours spent on custom schemas and driver updates
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold tabular-nums">
              {(commercials.retainedHoursAllocated - commercials.retainedHoursUsed).toFixed(1)} hrs available
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Lead Engineer</th>
                  <th className="py-2.5 px-3">Task & Scope</th>
                  <th className="py-2.5 px-3 text-right">Hours</th>
                  <th className="py-2.5 px-3 text-right">Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {retainerLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="py-3 px-3 text-slate-200 font-medium whitespace-nowrap">
                      {log.engineer}
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-sm">{log.task}</td>
                    <td className="py-3 px-3 font-mono text-amber-400 font-bold text-right tabular-nums">
                      {log.hours.toFixed(1)}h
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SLA Terms Strip */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
              <div className="text-slate-500 font-mono text-[11px]">Uptime SLA Guarantee:</div>
              <div className="text-slate-200 font-semibold mt-0.5">{commercials.uptimeGuarantee}</div>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded">
              <div className="text-slate-500 font-mono text-[11px]">Incident Response SLA:</div>
              <div className="text-slate-200 font-semibold mt-0.5">{commercials.responseTimeSla}</div>
            </div>
          </div>
        </div>

        {/* Dedicated Architect & Request Service */}
        <div className="space-y-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Assigned Enterprise Architect
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={commercials.dedicatedArchitect.avatarUrl}
                alt={commercials.dedicatedArchitect.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-lg object-cover border border-slate-700 shadow-sm"
              />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {commercials.dedicatedArchitect.name}
                </h4>
                <div className="text-xs text-cyan-400">
                  {commercials.dedicatedArchitect.role}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Assigned directly under current Retainer contract
                </div>
              </div>
            </div>

            <form onSubmit={handleRetainerSubmit} className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block">
                Submit Retainer Request
              </label>
              <textarea
                value={retainerRequestText}
                onChange={(e) => setRetainerRequestText(e.target.value)}
                placeholder="E.g., Map new Kobo survey schema, modify harvest weight validation limit, or audit Q3 disbursement..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={!retainerRequestText.trim()}
                className="w-full py-2 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 transition-colors rounded flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Engineering Queue</span>
              </button>

              {requestSubmitted && (
                <div className="p-2 bg-emerald-950/60 border border-emerald-900 rounded text-xs text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Request logged to Retainer Queue. Engineer notified.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
