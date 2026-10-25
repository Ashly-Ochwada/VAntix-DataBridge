export type SectorType = 'agribusiness' | 'ngo_humanitarian' | 'sacco_fintech' | 'enterprise_erp';

export interface OrganizationPreset {
  id: string;
  name: string;
  sector: SectorType;
  sectorLabel: string;
  region: string;
  description: string;
  nicheFocus: string;
  primaryCurrency: string;
  retentionHoursMonthly: number;
  retentionHoursUsed: number;
  slaTier: 'Enterprise Platinum' | 'Mission Critical 99.95%' | 'High Assurance';
  nodeCount: number;
}

export type ConnectorCategory =
  | 'erp_accounting'
  | 'crm_field'
  | 'mobile_money_fintech'
  | 'database_warehouse'
  | 'files_spreadsheets'
  | 'rest_webhook';

export interface DataSource {
  id: string;
  name: string;
  category: ConnectorCategory;
  categoryLabel: string;
  systemType: string;
  iconName: string;
  status: 'connected' | 'syncing' | 'degraded' | 'disconnected';
  lastSyncTime: string;
  recordsSyncedToday: number;
  totalRecords: number;
  syncFrequency: string;
  endpoint: string;
  authMethod: 'OAuth 2.0' | 'API Key & Secret' | 'Mutual TLS' | 'Encrypted SFTP' | 'Direct SQL';
  healthScore: number; // 0 - 100
  sampleFields: string[];
}

export interface TransformationRule {
  id: string;
  sourceField: string;
  targetField: string;
  transformType: 'direct' | 'type_cast' | 'regex_extract' | 'currency_convert' | 'phone_e164' | 'lookup_map' | 'anonymize';
  parameters?: Record<string, any>;
  notes?: string;
}

export interface QualityValidationRule {
  id: string;
  field: string;
  ruleType: 'not_null' | 'regex_format' | 'range_bounds' | 'referential_match' | 'currency_match' | 'ledger_balance';
  description: string;
  parameters: Record<string, any>;
  severity: 'quarantine' | 'warning';
  failureCount: number;
}

export interface Pipeline {
  id: string;
  name: string;
  sourceId: string;
  targetSchemaName: string;
  status: 'active' | 'paused' | 'running' | 'degraded';
  schedule: string;
  lastRunAt: string;
  lastRunDurationSec: number;
  recordsProcessedToday: number;
  qualityPassRate: number; // percentage e.g. 98.4
  quarantinedCount: number;
  transformRules: TransformationRule[];
  qualityRules: QualityValidationRule[];
  recentLogs: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'success';
    message: string;
    stage: 'extract' | 'validate' | 'transform' | 'load';
  }>;
}

export interface QuarantinedRecord {
  id: string;
  pipelineId: string;
  pipelineName: string;
  sourceSystem: string;
  entityType: string;
  rawPayload: Record<string, any>;
  violatedRules: string[];
  severity: 'quarantine' | 'warning';
  quarantinedAt: string;
  status: 'pending' | 'remediated' | 'discarded';
  suggestedFix?: string;
}

export interface GovernedRecord {
  id: string;
  canonicalId: string;
  entityType: string;
  originSource: string;
  ingestedAt: string;
  verifiedAt: string;
  data: Record<string, any>;
  hashSignature: string;
}

export interface GovernedReportTemplate {
  id: string;
  title: string;
  description: string;
  category: 'audit' | 'donor_compliance' | 'operational_reconciliation' | 'financial_float';
  frequency: string;
  targetAudience: string;
  metricsCovered: string[];
  lastGenerated: string;
  format: 'PDF / Executive' | 'CSV / Ledger' | 'JSON Data Stream';
}

export interface EnterpriseCommercials {
  contractPhase: string;
  implementationValueUsd: number;
  monthlyRetainerUsd: number;
  platformRecurringUsd: number;
  retainedHoursAllocated: number;
  retainedHoursUsed: number;
  activeNodes: number;
  uptimeGuarantee: string;
  responseTimeSla: string;
  dedicatedArchitect: {
    name: string;
    role: string;
    avatarUrl: string;
  };
}
