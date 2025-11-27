export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'notification';
  label: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

export interface Workflow {
  workflow_id: string;
  name: string;
  description: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived';
  trigger_type: string;
  trigger_conditions: Record<string, any>;
  steps: WorkflowStep[];
  created_by: string;
  created_date: string;
  last_modified: string;
  execution_count: number;
  success_rate: number;
  avg_execution_time: number;
}

export interface WorkflowExecution {
  execution_id: string;
  workflow_id: string;
  workflow_name: string;
  triggered_by: string;
  trigger_data: Record<string, any>;
  start_time: string;
  end_time: string | null;
  status: 'Running' | 'Completed' | 'Failed' | 'Cancelled';
  steps_completed: number;
  total_steps: number;
  error_message: string | null;
  output_data: Record<string, any>;
}

export interface PredictionModel {
  model_id: string;
  name: string;
  type: 'Classification' | 'Regression' | 'TimeSeries';
  target: string;
  accuracy: number;
  last_trained: string;
  predictions_made: number;
  features: string[];
}

export interface Prediction {
  prediction_id: string;
  model_id: string;
  model_name: string;
  entity_id: string;
  entity_name: string;
  prediction_type: string;
  predicted_value: any;
  confidence: number;
  prediction_date: string;
  actual_value: any | null;
  status: 'Pending' | 'Confirmed' | 'Rejected';
}

export interface AttributionRule {
  rule_id: string;
  name: string;
  category: string;
  priority: number;
  conditions: Record<string, any>;
  allocation_method: 'Proportional' | 'Fixed' | 'Waterfall' | 'Custom';
  targets: string[];
  active: boolean;
}

export const workflows: Workflow[] = [
  {
    workflow_id: 'WF-001',
    name: 'Limit Breach Alert & Escalation',
    description: 'Automatically alert and escalate when counterparty exposure exceeds 90% of limit',
    category: 'Risk Management',
    status: 'Active',
    trigger_type: 'Threshold Breach',
    trigger_conditions: { metric: 'exposure_utilization', threshold: 90, operator: 'greater_than' },
    steps: [
      { id: 's1', type: 'trigger', label: 'Exposure > 90%', config: {}, position: { x: 100, y: 100 } },
      { id: 's2', type: 'condition', label: 'Check Risk Category', config: { field: 'risk_category' }, position: { x: 300, y: 100 } },
      { id: 's3', type: 'notification', label: 'Email Risk Team', config: { recipients: ['risk@falcon.com'] }, position: { x: 500, y: 100 } },
      { id: 's4', type: 'action', label: 'Block New Trades', config: { action: 'block_trades' }, position: { x: 700, y: 100 } },
    ],
    created_by: 'Aisha Bello',
    created_date: '2025-10-15',
    last_modified: '2025-11-20',
    execution_count: 45,
    success_rate: 97.8,
    avg_execution_time: 2.3,
  },
  {
    workflow_id: 'WF-002',
    name: 'Settlement Delay Follow-up',
    description: 'Automatically follow up on delayed settlements with counterparty and operations',
    category: 'Operations',
    status: 'Active',
    trigger_type: 'Time-based',
    trigger_conditions: { delay_hours: 24 },
    steps: [
      { id: 's1', type: 'trigger', label: 'Settlement Delayed 24h', config: {}, position: { x: 100, y: 100 } },
      { id: 's2', type: 'action', label: 'Contact Counterparty', config: { method: 'email' }, position: { x: 300, y: 100 } },
      { id: 's3', type: 'notification', label: 'Alert Operations', config: { team: 'operations' }, position: { x: 500, y: 100 } },
      { id: 's4', type: 'action', label: 'Log Incident', config: { severity: 'medium' }, position: { x: 700, y: 100 } },
    ],
    created_by: 'Olumide Ajayi',
    created_date: '2025-09-20',
    last_modified: '2025-11-18',
    execution_count: 128,
    success_rate: 92.5,
    avg_execution_time: 5.7,
  },
  {
    workflow_id: 'WF-003',
    name: 'Liquidity Buffer Alert',
    description: 'Alert treasury team when liquidity buffer drops below threshold',
    category: 'Liquidity Management',
    status: 'Active',
    trigger_type: 'Threshold Breach',
    trigger_conditions: { metric: 'buffer_percentage', threshold: 25, operator: 'less_than' },
    steps: [
      { id: 's1', type: 'trigger', label: 'Buffer < 25%', config: {}, position: { x: 100, y: 100 } },
      { id: 's2', type: 'action', label: 'Generate Forecast', config: { days: 7 }, position: { x: 300, y: 100 } },
      { id: 's3', type: 'notification', label: 'Alert Treasury Head', config: { urgency: 'high' }, position: { x: 500, y: 100 } },
      { id: 's4', type: 'action', label: 'Schedule Review Meeting', config: { attendees: ['treasury_team'] }, position: { x: 700, y: 100 } },
    ],
    created_by: 'Fatima Hassan',
    created_date: '2025-08-10',
    last_modified: '2025-11-15',
    execution_count: 12,
    success_rate: 100,
    avg_execution_time: 3.1,
  },
  {
    workflow_id: 'WF-004',
    name: 'Sentiment Downgrade Response',
    description: 'Respond to counterparty sentiment downgrades with recommended actions',
    category: 'Relationship Management',
    status: 'Active',
    trigger_type: 'Event-based',
    trigger_conditions: { event: 'sentiment_downgrade', severity: 'significant' },
    steps: [
      { id: 's1', type: 'trigger', label: 'Sentiment Downgraded', config: {}, position: { x: 100, y: 100 } },
      { id: 's2', type: 'condition', label: 'Check Exposure', config: { field: 'exposure_ngn' }, position: { x: 300, y: 100 } },
      { id: 's3', type: 'notification', label: 'Notify RM', config: { include_analysis: true }, position: { x: 500, y: 100 } },
      { id: 's4', type: 'action', label: 'Review Limits', config: { auto_suggest: true }, position: { x: 700, y: 100 } },
    ],
    created_by: 'Aisha Bello',
    created_date: '2025-10-01',
    last_modified: '2025-11-10',
    execution_count: 23,
    success_rate: 95.7,
    avg_execution_time: 4.2,
  },
  {
    workflow_id: 'WF-005',
    name: 'Product Performance Review',
    description: 'Monthly product performance review with auto-generated insights',
    category: 'Analytics',
    status: 'Active',
    trigger_type: 'Scheduled',
    trigger_conditions: { schedule: 'monthly', day: 1 },
    steps: [
      { id: 's1', type: 'trigger', label: 'Monthly Trigger', config: {}, position: { x: 100, y: 100 } },
      { id: 's2', type: 'action', label: 'Generate Report', config: { metrics: ['pnl', 'volume', 'market_share'] }, position: { x: 300, y: 100 } },
      { id: 's3', type: 'action', label: 'Compare vs Previous', config: { periods: 3 }, position: { x: 500, y: 100 } },
      { id: 's4', type: 'notification', label: 'Send to Management', config: { format: 'pdf' }, position: { x: 700, y: 100 } },
    ],
    created_by: 'Fatima Hassan',
    created_date: '2025-07-15',
    last_modified: '2025-11-01',
    execution_count: 4,
    success_rate: 100,
    avg_execution_time: 12.5,
  },
];

export const workflowExecutions: WorkflowExecution[] = [
  {
    execution_id: 'EXE-20251125-001',
    workflow_id: 'WF-001',
    workflow_name: 'Limit Breach Alert & Escalation',
    triggered_by: 'System',
    trigger_data: { counterparty: 'Zenith Bank', utilization: 95.0 },
    start_time: '2025-11-25T14:30:00Z',
    end_time: '2025-11-25T14:30:05Z',
    status: 'Completed',
    steps_completed: 4,
    total_steps: 4,
    error_message: null,
    output_data: { emails_sent: 2, trades_blocked: true },
  },
  {
    execution_id: 'EXE-20251125-002',
    workflow_id: 'WF-002',
    workflow_name: 'Settlement Delay Follow-up',
    triggered_by: 'System',
    trigger_data: { trade_id: 'TRD-20251123-045', delay_hours: 26 },
    start_time: '2025-11-25T10:15:00Z',
    end_time: '2025-11-25T10:15:08Z',
    status: 'Completed',
    steps_completed: 4,
    total_steps: 4,
    error_message: null,
    output_data: { contact_attempted: true, incident_logged: 'INC-20251125-001' },
  },
  {
    execution_id: 'EXE-20251124-001',
    workflow_id: 'WF-003',
    workflow_name: 'Liquidity Buffer Alert',
    triggered_by: 'System',
    trigger_data: { buffer_percentage: 22.5, currency: 'NGN' },
    start_time: '2025-11-24T09:00:00Z',
    end_time: '2025-11-24T09:00:06Z',
    status: 'Completed',
    steps_completed: 4,
    total_steps: 4,
    error_message: null,
    output_data: { forecast_generated: true, meeting_scheduled: '2025-11-26T15:00:00Z' },
  },
  {
    execution_id: 'EXE-20251123-001',
    workflow_id: 'WF-004',
    workflow_name: 'Sentiment Downgrade Response',
    triggered_by: 'AI Engine',
    trigger_data: { counterparty: 'Access Bank', old_bucket: 'L4-F4', new_bucket: 'L3-F4' },
    start_time: '2025-11-23T16:45:00Z',
    end_time: null,
    status: 'Running',
    steps_completed: 2,
    total_steps: 4,
    error_message: null,
    output_data: {},
  },
];

export const predictionModels: PredictionModel[] = [
  {
    model_id: 'MODEL-001',
    name: 'Settlement Delay Predictor',
    type: 'Classification',
    target: 'settlement_delay',
    accuracy: 87.5,
    last_trained: '2025-11-20',
    predictions_made: 1247,
    features: ['counterparty_reliability', 'trade_volume', 'time_of_day', 'desk', 'product_type'],
  },
  {
    model_id: 'MODEL-002',
    name: 'Liquidity Forecaster',
    type: 'TimeSeries',
    target: 'daily_balance',
    accuracy: 92.3,
    last_trained: '2025-11-22',
    predictions_made: 847,
    features: ['historical_balance', 'scheduled_flows', 'day_of_week', 'seasonal_patterns', 'stress_indicators'],
  },
  {
    model_id: 'MODEL-003',
    name: 'Counterparty Risk Scorer',
    type: 'Regression',
    target: 'risk_score',
    accuracy: 89.1,
    last_trained: '2025-11-18',
    predictions_made: 2156,
    features: ['exposure', 'reliability', 'sentiment', 'sector_health', 'payment_history'],
  },
  {
    model_id: 'MODEL-004',
    name: 'Trade Volume Predictor',
    type: 'Regression',
    target: 'monthly_volume',
    accuracy: 84.7,
    last_trained: '2025-11-15',
    predictions_made: 523,
    features: ['historical_volume', 'market_conditions', 'counterparty_activity', 'product_trends'],
  },
];

export const predictions: Prediction[] = [
  {
    prediction_id: 'PRED-20251125-001',
    model_id: 'MODEL-001',
    model_name: 'Settlement Delay Predictor',
    entity_id: 'TRD-20251125-089',
    entity_name: 'Trade with Zenith Bank',
    prediction_type: 'Settlement Delay',
    predicted_value: 'High Risk',
    confidence: 78.5,
    prediction_date: '2025-11-25T08:00:00Z',
    actual_value: null,
    status: 'Pending',
  },
  {
    prediction_id: 'PRED-20251125-002',
    model_id: 'MODEL-002',
    model_name: 'Liquidity Forecaster',
    entity_id: 'LIQ-20251126',
    entity_name: 'Tomorrow Liquidity',
    prediction_type: 'Daily Balance',
    predicted_value: 27500000000,
    confidence: 92.1,
    prediction_date: '2025-11-25T00:00:00Z',
    actual_value: null,
    status: 'Pending',
  },
  {
    prediction_id: 'PRED-20251125-003',
    model_id: 'MODEL-003',
    model_name: 'Counterparty Risk Scorer',
    entity_id: 'CP-NG-003',
    entity_name: 'Zenith Bank',
    prediction_type: 'Risk Score',
    predicted_value: 72.3,
    confidence: 85.4,
    prediction_date: '2025-11-25T06:00:00Z',
    actual_value: null,
    status: 'Pending',
  },
];

export const attributionRules: AttributionRule[] = [
  {
    rule_id: 'ATTR-001',
    name: 'Desk Revenue Attribution',
    category: 'Revenue',
    priority: 1,
    conditions: { metric: 'revenue', scope: 'trade' },
    allocation_method: 'Proportional',
    targets: ['FX Desk A', 'FX Desk B', 'MM Desk', 'Fixed Income'],
    active: true,
  },
  {
    rule_id: 'ATTR-002',
    name: 'RM Commission Allocation',
    category: 'Commission',
    priority: 2,
    conditions: { metric: 'pnl', threshold: 0 },
    allocation_method: 'Fixed',
    targets: ['Relationship Managers'],
    active: true,
  },
  {
    rule_id: 'ATTR-003',
    name: 'Product P&L Distribution',
    category: 'P&L',
    priority: 1,
    conditions: { metric: 'pnl', scope: 'product' },
    allocation_method: 'Waterfall',
    targets: ['FX Spot', 'FX Forward', 'Money Market', 'Bonds', 'Treasury Bills'],
    active: true,
  },
  {
    rule_id: 'ATTR-004',
    name: 'Counterparty Contribution Score',
    category: 'Performance',
    priority: 3,
    conditions: { metrics: ['volume', 'pnl', 'reliability'] },
    allocation_method: 'Custom',
    targets: ['All Counterparties'],
    active: true,
  },
];
