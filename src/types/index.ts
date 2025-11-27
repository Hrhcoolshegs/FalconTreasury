export interface Counterparty {
  counterparty_id: string;
  name: string;
  short_name: string;
  sector: string;
  country: string;
  region: string;
  city: string;
  internal_rating: string;
  external_rating: string;
  exposure_ngn: number;
  exposure_usd: number;
  exposure_limit_ngn: number;
  exposure_limit_usd: number;
  utilization_percentage: number;
  settlement_reliability: number;
  avg_confirmation_time: number;
  total_trades_ytd: number;
  total_volume_ytd_ngn: number;
  total_volume_ytd_usd: number;
  outstanding_trades: number;
  last_trade_date: string;
  onboarding_date: string;
  relationship_tenure_months: number;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  product_mix: string[];
  preferred_settlement: string;
  kyc_status: string;
  kyc_expiry_date: string;
  aml_status: string;
  pep_status: boolean;
  sanction_status: string;
  relationship_manager: string;
  desk_assignment: string;
  legal_entity_identifier: string;
  swift_code: string;
  bank_sort_code: string;
  status: string;
  risk_category: string;
}

export interface Trade {
  trade_id: string;
  trade_date: string;
  trade_time: string;
  value_date: string;
  settlement_date: string;
  product_type: string;
  currency_pair: string;
  currency_sold: string;
  currency_bought: string;
  amount_sold: number;
  amount_bought: number;
  amount_ngn_equivalent: number;
  amount_usd_equivalent: number;
  exchange_rate: number;
  interest_rate: number;
  tenor: string;
  maturity_date: string;
  counterparty_id: string;
  counterparty_name: string;
  desk: string;
  trader: string;
  book: string;
  portfolio: string;
  trade_direction: string;
  trade_type: string;
  status: string;
  confirmation_status: string;
  confirmation_time: string;
  confirmation_method: string;
  settlement_status: string;
  settlement_account_ngn: string;
  settlement_account_usd: string;
  nostro_account: string;
  mtm_value: number;
  mtm_currency: string;
  pnl_realized: number;
  pnl_unrealized: number;
  trade_fee: number;
  broker_commission: number;
  settlement_delay_hours: number;
  delay_reason: string;
  break_status: string;
  booking_timestamp: string;
  last_modified_timestamp: string;
  modified_by: string;
  notes: string;
}

export interface LiquidityData {
  date: string;
  opening_balance_ngn: number;
  opening_balance_usd: number;
  inflows_ngn: number;
  inflows_usd: number;
  outflows_ngn: number;
  outflows_usd: number;
  net_flow_ngn: number;
  net_flow_usd: number;
  closing_balance_ngn: number;
  closing_balance_usd: number;
  required_reserves_ngn: number;
  required_reserves_usd: number;
  buffer_ngn: number;
  buffer_usd: number;
  buffer_percentage_ngn: number;
  buffer_percentage_usd: number;
  liquidity_ratio: number;
  stress_test_scenario: string;
  stress_test_result_ngn: number;
  stress_test_result_usd: number;
  predicted_7d_balance_ngn: number;
  predicted_7d_balance_usd: number;
  predicted_14d_balance_ngn: number;
  predicted_14d_balance_usd: number;
  predicted_30d_balance_ngn: number;
  predicted_30d_balance_usd: number;
  confidence_7d: number;
  confidence_14d: number;
  confidence_30d: number;
  major_inflows: { source: string; amount: number }[];
  major_outflows: { destination: string; amount: number }[];
  liquidity_alert_status: string;
  alert_reason: string;
}

export interface SentimentData {
  counterparty_id: string;
  sentiment_date: string;
  likelihood_score: number;
  fit_score: number;
  sentiment_bucket: string;
  confidence: number;
  likelihood_settle_ontime: number;
  likelihood_confirm_ontime: number;
  likelihood_maintain_volume: number;
  likelihood_no_issues: number;
  fit_fx_spot: number;
  fit_fx_forward: number;
  fit_money_market: number;
  fit_bonds: number;
  fit_tenor_short: number;
  fit_tenor_medium: number;
  fit_tenor_long: number;
  fit_exposure_capacity: number;
  relationship_strength: number;
  sentiment_trend_30d: string;
  sentiment_change_bucket: string;
  previous_bucket: string;
  bucket_stability_days: number;
  recommendation: string;
  last_sentiment_review: string;
  next_review_due: string;
  alert_status: string;
  alert_reason: string;
}

export interface Workflow {
  workflow_id: string;
  workflow_name: string;
  version: string;
  status: string;
  trigger_type: string;
  trigger_condition: object;
  action_type: string;
  action_details: object;
  priority: string;
  execution_frequency: string;
  created_by: string;
  created_date: string;
  last_modified_by: string;
  last_modified_date: string;
  execution_count_ytd: number;
  success_rate: number;
  avg_execution_time_ms: number;
  dependencies: string[];
}

export interface Insight {
  insight_id: string;
  insight_type: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  created_timestamp: string;
  affected_counterparties: string[];
  affected_trades: string[];
  affected_desks: string[];
  financial_impact_ngn: number;
  financial_impact_usd: number;
  operational_impact: string;
  regulatory_impact: string;
  recommended_action: string;
  action_button_label: string;
  associated_workflow_id: string;
  status: string;
  acknowledged_by: string | null;
  acknowledged_timestamp: string | null;
  resolved_by: string | null;
  resolved_timestamp: string | null;
  resolution_notes: string | null;
  roi_estimate_ngn: number;
  risk_reduction_estimate: string;
}

export interface Attribution {
  attribution_id: string;
  attribution_date: string;
  insight_id: string;
  insight_title: string;
  insight_category: string;
  action_taken: string;
  action_timestamp: string;
  counterparty_id: string;
  counterparty_name: string;
  product_type: string;
  trade_id: string;
  revenue_generated_ngn: number;
  revenue_generated_usd: number;
  revenue_type: string;
  attribution_confidence: number;
  attribution_model: string;
  touch_point_weight: number;
  verified_status: string;
  verified_by: string;
  verification_date: string;
  source_system: string;
  desk_attribution: string;
  trader_attribution: string;
  time_to_conversion_hours: number;
  roi_multiple: number;
}

export interface AuditLog {
  log_id: string;
  timestamp: string;
  actor_type: string;
  actor_id: string;
  actor_email: string;
  actor_role: string;
  action_type: string;
  resource_type: string;
  resource_id: string;
  action_description: string;
  before_state: object | null;
  after_state: object | null;
  changes_made: string[];
  ip_address: string;
  location_city: string;
  location_country: string;
  device_type: string;
  browser: string;
  operating_system: string;
  user_agent: string;
  session_id: string;
  request_method: string;
  request_endpoint: string;
  response_status: number;
  response_time_ms: number;
  status: string;
  error_code: string | null;
  error_message: string | null;
  security_event: boolean;
  security_severity: string | null;
  compliance_flag: boolean;
  data_classification: string;
}

export interface ProductPerformance {
  product_type: string;
  date: string;
  trade_count: number;
  trade_volume_ngn: number;
  trade_volume_usd: number;
  pnl_realized_ngn: number;
  pnl_realized_usd: number;
  pnl_unrealized_ngn: number;
  pnl_unrealized_usd: number;
  pnl_total_ngn: number;
  pnl_total_usd: number;
  revenue_ngn: number;
  revenue_usd: number;
  avg_trade_size_ngn: number;
  avg_trade_size_usd: number;
  settlement_success_rate: number;
  settlement_failure_count: number;
  confirmation_time_avg: number;
  active_counterparties: number;
  new_counterparties: number;
  market_share_estimate: number;
  profitability_ratio: number;
}

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  department: string;
  desk_assignment: string;
  status: string;
  created_date: string;
  last_login: string;
  login_count_ytd: number;
}

export interface GlobalFilters {
  dateRange: { start: string; end: string } | null;
  desk: string | null;
  counterparty: string | null;
  currency: string | null;
  product: string | null;
  region: string | null;
  exposureRange: { min: number; max: number } | null;
  riskCategory: string | null;
  sentimentBucket: string | null;
  tradeStatus: string | null;
  tradeSizeRange: { min: number; max: number } | null;
  trader: string | null;
  predictionMode: string | null;
}
