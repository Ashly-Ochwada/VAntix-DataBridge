/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DataProvider, useDataBridge } from './context/DataContext';
import { Header } from './components/Header';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import { OverviewView } from './components/OverviewView';
import { ConnectorsView } from './components/ConnectorsView';
import { PipelinesView } from './components/PipelinesView';
import { DataQualityView } from './components/DataQualityView';
import { SchemaMapperView } from './components/SchemaMapperView';
import { AnalyticsView } from './components/AnalyticsView';
import { EnterpriseContractView } from './components/EnterpriseContractView';
import { NewConnectorModal } from './components/modals/NewConnectorModal';
import { NewPipelineModal } from './components/modals/NewPipelineModal';
import { RemediateRecordModal } from './components/modals/RemediateRecordModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { QuarantinedRecord, GovernedReportTemplate } from './types/databridge';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isNewConnectorOpen, setIsNewConnectorOpen] = useState(false);
  const [isNewPipelineOpen, setIsNewPipelineOpen] = useState(false);
  const [recordToRemediate, setRecordToRemediate] = useState<QuarantinedRecord | null>(null);
  const [reportTemplateToExport, setReportTemplateToExport] = useState<GovernedReportTemplate | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar following Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewPipeline={() => setIsNewPipelineOpen(true)}
      />

      {/* Workspace Sub-Toolbar with Industry Niche Selector & Context */}
      <WorkspaceToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewConnector={() => setIsNewConnectorOpen(true)}
        onOpenNewPipeline={() => setIsNewPipelineOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <OverviewView
            setActiveTab={setActiveTab}
            onOpenNewConnector={() => setIsNewConnectorOpen(true)}
            onOpenNewPipeline={() => setIsNewPipelineOpen(true)}
          />
        )}

        {activeTab === 'sources' && (
          <ConnectorsView onOpenNewConnector={() => setIsNewConnectorOpen(true)} />
        )}

        {activeTab === 'pipelines' && (
          <PipelinesView
            setActiveTab={setActiveTab}
            onOpenNewPipeline={() => setIsNewPipelineOpen(true)}
          />
        )}

        {activeTab === 'quarantine' && (
          <DataQualityView onOpenRemediateModal={(rec) => setRecordToRemediate(rec)} />
        )}

        {activeTab === 'mapper' && <SchemaMapperView />}

        {activeTab === 'analytics' && (
          <AnalyticsView
            onOpenExportReportModal={(template) => setReportTemplateToExport(template)}
          />
        )}

        {activeTab === 'commercials' && <EnterpriseContractView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>VAntix DataBridge</span>
            <span className="mx-2">·</span>
            <span>Governed Data Integration & Invariant Validation Infrastructure</span>
          </div>
          <div className="font-mono text-[11px] text-slate-600">
            Enterprise Tier · Zero Silent Data Contamination Guarantee
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <NewConnectorModal
        isOpen={isNewConnectorOpen}
        onClose={() => setIsNewConnectorOpen(false)}
      />

      <NewPipelineModal
        isOpen={isNewPipelineOpen}
        onClose={() => setIsNewPipelineOpen(false)}
      />

      <RemediateRecordModal
        record={recordToRemediate}
        onClose={() => setRecordToRemediate(null)}
      />

      <ExportReportModal
        template={reportTemplateToExport}
        onClose={() => setReportTemplateToExport(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <MainLayout />
    </DataProvider>
  );
}
