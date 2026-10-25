import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  OrganizationPreset,
  DataSource,
  Pipeline,
  QuarantinedRecord,
  GovernedRecord,
  GovernedReportTemplate,
  EnterpriseCommercials,
  TransformationRule,
  QualityValidationRule,
} from '../types/databridge';
import { ORGANIZATION_PRESETS, INITIAL_DATA_BY_ORG } from '../data/initialData';

interface DataContextType {
  orgPresets: OrganizationPreset[];
  selectedOrgId: string;
  currentOrg: OrganizationPreset;
  setOrgId: (orgId: string) => void;
  sources: DataSource[];
  pipelines: Pipeline[];
  quarantinedRecords: QuarantinedRecord[];
  governedRecords: GovernedRecord[];
  reportTemplates: GovernedReportTemplate[];
  commercials: EnterpriseCommercials;
  runningPipelineId: string | null;
  triggerPipelineRun: (pipelineId: string) => Promise<void>;
  addDataSource: (source: Partial<DataSource> & { name: string; category: any; systemType: string; endpoint: string }) => void;
  deleteDataSource: (sourceId: string) => void;
  addPipeline: (pipeline: Partial<Pipeline> & { name: string; sourceId: string; targetSchemaName: string }) => void;
  remediateRecord: (recordId: string, updatedPayload: Record<string, any>, action: 'remediate' | 'discard') => void;
  updateFieldMappings: (pipelineId: string, rules: TransformationRule[]) => void;
  updateQualityRules: (pipelineId: string, rules: QualityValidationRule[]) => void;
  syncSourceNow: (sourceId: string) => Promise<void>;
  isSyncingSourceId: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org_agribusiness');
  const [runningPipelineId, setRunningPipelineId] = useState<string | null>(null);
  const [isSyncingSourceId, setIsSyncingSourceId] = useState<string | null>(null);

  // Per-organization data store
  const [sources, setSources] = useState<DataSource[]>(INITIAL_DATA_BY_ORG.org_agribusiness.sources);
  const [pipelines, setPipelines] = useState<Pipeline[]>(INITIAL_DATA_BY_ORG.org_agribusiness.pipelines);
  const [quarantinedRecords, setQuarantinedRecords] = useState<QuarantinedRecord[]>(
    INITIAL_DATA_BY_ORG.org_agribusiness.quarantinedRecords
  );
  const [governedRecords, setGovernedRecords] = useState<GovernedRecord[]>(
    INITIAL_DATA_BY_ORG.org_agribusiness.governedRecords
  );
  const [reportTemplates, setReportTemplates] = useState<GovernedReportTemplate[]>(
    INITIAL_DATA_BY_ORG.org_agribusiness.reportTemplates
  );
  const [commercials, setCommercials] = useState<EnterpriseCommercials>(
    INITIAL_DATA_BY_ORG.org_agribusiness.commercials
  );

  // Switch organization preset
  const handleSetOrgId = (newOrgId: string) => {
    setSelectedOrgId(newOrgId);
    const orgData = INITIAL_DATA_BY_ORG[newOrgId];
    if (orgData) {
      setSources(orgData.sources);
      setPipelines(orgData.pipelines);
      setQuarantinedRecords(orgData.quarantinedRecords);
      setGovernedRecords(orgData.governedRecords);
      setReportTemplates(orgData.reportTemplates);
      setCommercials(orgData.commercials);
    }
  };

  const currentOrg = ORGANIZATION_PRESETS.find((o) => o.id === selectedOrgId) || ORGANIZATION_PRESETS[0];

  // Pipeline Execution Simulator with Realistic Multi-stage Steps
  const triggerPipelineRun = async (pipelineId: string) => {
    if (runningPipelineId) return;
    setRunningPipelineId(pipelineId);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    // Stage 1: Extract
    setPipelines((prev) =>
      prev.map((pipe) => {
        if (pipe.id !== pipelineId) return pipe;
        return {
          ...pipe,
          status: 'running',
          recentLogs: [
            {
              timestamp: timeStr,
              level: 'info',
              stage: 'extract',
              message: `Initiating handshake and extracting changes from source system...`,
            },
            ...pipe.recentLogs.slice(0, 8),
          ],
        };
      })
    );

    await new Promise((r) => setTimeout(r, 900));

    // Stage 2: Invariant Check & Validation
    const stage2Time = new Date().toTimeString().split(' ')[0];
    setPipelines((prev) =>
      prev.map((pipe) => {
        if (pipe.id !== pipelineId) return pipe;
        return {
          ...pipe,
          recentLogs: [
            {
              timestamp: stage2Time,
              level: 'info',
              stage: 'validate',
              message: `Evaluating schema invariants & bounds across incoming batch (42 records checked)...`,
            },
            ...pipe.recentLogs,
          ],
        };
      })
    );

    await new Promise((r) => setTimeout(r, 900));

    // Stage 3: Transformation & Load
    const stage3Time = new Date().toTimeString().split(' ')[0];
    const generatedId = `GOV-${Math.floor(1000 + Math.random() * 9000)}`;

    setPipelines((prev) =>
      prev.map((pipe) => {
        if (pipe.id !== pipelineId) return pipe;
        return {
          ...pipe,
          status: 'active',
          lastRunAt: 'Just now',
          lastRunDurationSec: 2.7,
          recordsProcessedToday: pipe.recordsProcessedToday + 42,
          qualityPassRate: Number(Math.min(99.9, pipe.qualityPassRate + 0.1).toFixed(1)),
          recentLogs: [
            {
              timestamp: stage3Time,
              level: 'success',
              stage: 'load',
              message: `Transformation complete: 42 verified canonical records committed to Governed Lakehouse.`,
            },
            ...pipe.recentLogs,
          ],
        };
      })
    );

    // Add a freshly reconciled governed record into the explorer
    setGovernedRecords((prev) => [
      {
        id: `gov_fresh_${Date.now()}`,
        canonicalId: generatedId,
        entityType: currentOrg.sector === 'agribusiness' ? 'GovernedHarvestConsignment' : 'GovernedLedgerEvent',
        originSource: 'Real-time Pipeline Ingestion Stream',
        ingestedAt: 'Just now',
        verifiedAt: 'Just now',
        data:
          currentOrg.sector === 'agribusiness'
            ? {
                producer_code: 'FARM-CENTRAL-0992',
                grower_name: 'Timothy Mwamburi',
                cooperative_zone: 'Aberdare Highland Outgrowers',
                commodity: 'Arabica SL28 Grade AA',
                net_weight_kg: 74.2,
                unit_rate_kes: 115.0,
                gross_payable_kes: 8533.0,
                moisture_grade: '12.0% (Verified)',
                settlement_status: 'Scheduled M-Pesa B2C Batch',
                audit_hash: 'sha256:d82f...a109',
              }
            : {
                reference: 'TXN-SYS-RECON-771',
                channel: 'Verified Enterprise Stream',
                reconciliation_status: '100% Invariant Compliant',
                audit_signature: 'HMAC-SHA256 verified',
              },
        hashSignature: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      },
      ...prev,
    ]);

    setRunningPipelineId(null);
  };

  // Immediate Source Sync
  const syncSourceNow = async (sourceId: string) => {
    setIsSyncingSourceId(sourceId);
    await new Promise((r) => setTimeout(r, 1200));

    setSources((prev) =>
      prev.map((src) => {
        if (src.id !== sourceId) return src;
        return {
          ...src,
          status: 'connected',
          lastSyncTime: 'Just now',
          recordsSyncedToday: src.recordsSyncedToday + 120,
          healthScore: Math.min(100, src.healthScore + 2),
        };
      })
    );

    setIsSyncingSourceId(null);
  };

  // Add Data Source Connector
  const addDataSource = (sourceData: Partial<DataSource> & { name: string; category: any; systemType: string; endpoint: string }) => {
    const newId = `src_custom_${Date.now()}`;
    const newSource: DataSource = {
      id: newId,
      name: sourceData.name,
      category: sourceData.category || 'rest_webhook',
      categoryLabel: sourceData.categoryLabel || 'Custom Connector',
      systemType: sourceData.systemType,
      iconName: 'Server',
      status: 'connected',
      lastSyncTime: 'Just now',
      recordsSyncedToday: 0,
      totalRecords: 1,
      syncFrequency: sourceData.syncFrequency || 'Every 15 minutes',
      endpoint: sourceData.endpoint,
      authMethod: sourceData.authMethod || 'API Key & Secret',
      healthScore: 100,
      sampleFields: sourceData.sampleFields || ['id', 'timestamp', 'payload', 'status'],
    };

    setSources((prev) => [newSource, ...prev]);
  };

  const deleteDataSource = (sourceId: string) => {
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
    setPipelines((prev) => prev.filter((p) => p.sourceId !== sourceId));
  };

  // Add Pipeline
  const addPipeline = (pipelineData: Partial<Pipeline> & { name: string; sourceId: string; targetSchemaName: string }) => {
    const newId = `pipe_${Date.now()}`;
    const newPipe: Pipeline = {
      id: newId,
      name: pipelineData.name,
      sourceId: pipelineData.sourceId,
      targetSchemaName: pipelineData.targetSchemaName,
      status: 'active',
      schedule: pipelineData.schedule || 'Hourly Batch',
      lastRunAt: 'Never',
      lastRunDurationSec: 0,
      recordsProcessedToday: 0,
      qualityPassRate: 100,
      quarantinedCount: 0,
      transformRules: [
        { id: `tr_${Date.now()}_1`, sourceField: 'id', targetField: 'canonical_id', transformType: 'direct' },
        { id: `tr_${Date.now()}_2`, sourceField: 'created_at', targetField: 'timestamp_iso', transformType: 'type_cast' },
      ],
      qualityRules: [
        {
          id: `qr_${Date.now()}_1`,
          field: 'id',
          ruleType: 'not_null',
          description: 'Primary identifier constraint',
          parameters: {},
          severity: 'quarantine',
          failureCount: 0,
        },
      ],
      recentLogs: [
        {
          timestamp: new Date().toTimeString().split(' ')[0],
          level: 'info',
          stage: 'extract',
          message: 'Pipeline initialized and ready for automated scheduling.',
        },
      ],
    };

    setPipelines((prev) => [newPipe, ...prev]);
  };

  // Remediate or Discard Quarantined Records
  const remediateRecord = (recordId: string, updatedPayload: Record<string, any>, action: 'remediate' | 'discard') => {
    const target = quarantinedRecords.find((r) => r.id === recordId);
    if (!target) return;

    if (action === 'discard') {
      setQuarantinedRecords((prev) =>
        prev.map((r) => (r.id === recordId ? { ...r, status: 'discarded' } : r))
      );
      return;
    }

    // Mark remediated
    setQuarantinedRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'remediated', rawPayload: updatedPayload } : r))
    );

    // Create a new verified governed record from the remediated item
    const cleanId = `GOV-REMED-${Math.floor(1000 + Math.random() * 9000)}`;
    setGovernedRecords((prev) => [
      {
        id: `gov_rem_${Date.now()}`,
        canonicalId: cleanId,
        entityType: target.entityType || 'RemediatedRecord',
        originSource: `${target.sourceSystem} (Remediated via Quality Console)`,
        ingestedAt: 'Just now',
        verifiedAt: 'Just now',
        data: {
          ...updatedPayload,
          remediation_audit: 'Manual correction verified against data invariant rules',
          remediated_by: 'Lead Data Architect',
        },
        hashSignature: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      },
      ...prev,
    ]);

    // Update pipeline quarantined count
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id !== target.pipelineId) return p;
        return {
          ...p,
          quarantinedCount: Math.max(0, p.quarantinedCount - 1),
          qualityPassRate: Number(Math.min(99.9, p.qualityPassRate + 0.2).toFixed(1)),
        };
      })
    );
  };

  const updateFieldMappings = (pipelineId: string, rules: TransformationRule[]) => {
    setPipelines((prev) =>
      prev.map((p) => (p.id === pipelineId ? { ...p, transformRules: rules } : p))
    );
  };

  const updateQualityRules = (pipelineId: string, rules: QualityValidationRule[]) => {
    setPipelines((prev) =>
      prev.map((p) => (p.id === pipelineId ? { ...p, qualityRules: rules } : p))
    );
  };

  return (
    <DataContext.Provider
      value={{
        orgPresets: ORGANIZATION_PRESETS,
        selectedOrgId,
        currentOrg,
        setOrgId: handleSetOrgId,
        sources,
        pipelines,
        quarantinedRecords,
        governedRecords,
        reportTemplates,
        commercials,
        runningPipelineId,
        triggerPipelineRun,
        addDataSource,
        deleteDataSource,
        addPipeline,
        remediateRecord,
        updateFieldMappings,
        updateQualityRules,
        syncSourceNow,
        isSyncingSourceId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataBridge = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataBridge must be used within a DataProvider');
  }
  return context;
};
