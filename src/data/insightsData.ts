export interface Insight {
  id: string;
  type: 'alert' | 'opportunity' | 'recommendation' | 'insight' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  timestamp: string;
  metrics?: {
    label: string;
    value: string;
    change?: string;
  }[];
  actions?: {
    label: string;
    type: 'primary' | 'secondary';
  }[];
}

export const insightsData: Insight[] = [
  {
    id: 'INS-001',
    type: 'alert',
    priority: 'high',
    category: 'Risk Management',
    title: 'Counterparty Exposure Approaching Limit',
    description: 'First Bank of Nigeria exposure is at 85% of limit (₦850M of ₦1B). Consider reducing exposure or increasing limit.',
    impact: 'Potential trade rejections and lost revenue opportunities',
    timestamp: '2025-11-26 07:30',
    metrics: [
      { label: 'Current Exposure', value: '₦850M', change: '+12%' },
      { label: 'Limit', value: '₦1B' },
      { label: 'Utilization', value: '85%' },
    ],
    actions: [
      { label: 'Review Limit', type: 'primary' },
      { label: 'View Details', type: 'secondary' },
    ],
  },
  {
    id: 'INS-002',
    type: 'opportunity',
    priority: 'high',
    category: 'Revenue Growth',
    title: 'FX Forward Volume Surge Detected',
    description: 'FX Forward trades increased 45% this week. Market conditions favorable for higher spreads.',
    impact: 'Potential ₦85M additional revenue if pricing optimized',
    timestamp: '2025-11-26 06:15',
    metrics: [
      { label: 'Volume Growth', value: '+45%' },
      { label: 'Revenue Opportunity', value: '₦85M' },
      { label: 'Market Share', value: '18.3%', change: '+2.1%' },
    ],
    actions: [
      { label: 'Adjust Pricing', type: 'primary' },
      { label: 'View Analysis', type: 'secondary' },
    ],
  },
  {
    id: 'INS-003',
    type: 'recommendation',
    priority: 'medium',
    category: 'Product Strategy',
    title: 'Money Market Outperforming Other Products',
    description: 'MM products showing 2.8x profitability ratio vs 2.1x average. Consider allocating more resources.',
    impact: 'Could increase overall P&L by 15-20% with strategic reallocation',
    timestamp: '2025-11-26 05:00',
    metrics: [
      { label: 'MM Profitability', value: '2.8x' },
      { label: 'Average', value: '2.1x' },
      { label: 'MM P&L', value: '₦320M' },
    ],
    actions: [
      { label: 'View Strategy', type: 'primary' },
    ],
  },
  {
    id: 'INS-004',
    type: 'insight',
    priority: 'medium',
    category: 'Behavior Analytics',
    title: 'Zenith Bank Trading Pattern Shift',
    description: 'Zenith Bank shifted from morning to afternoon trading. Settlement times improved by 30%.',
    impact: 'Operational efficiency gains; adjust desk staffing accordingly',
    timestamp: '2025-11-25 18:00',
    metrics: [
      { label: 'Settlement Time', value: '2.1h', change: '-30%' },
      { label: 'Trade Volume', value: '₦12B' },
    ],
  },
  {
    id: 'INS-005',
    type: 'achievement',
    priority: 'low',
    category: 'Operations',
    title: 'Settlement Success Rate Hit 96.8%',
    description: 'Monthly settlement success rate exceeded target of 95%. Best performance in 6 months.',
    impact: 'Reduced operational costs and improved counterparty satisfaction',
    timestamp: '2025-11-25 17:30',
    metrics: [
      { label: 'Success Rate', value: '96.8%', change: '+1.8%' },
      { label: 'Target', value: '95%' },
    ],
  },
  {
    id: 'INS-006',
    type: 'alert',
    priority: 'high',
    category: 'Compliance',
    title: 'KYC Expiring for 3 Counterparties',
    description: 'KYC documents expiring within 30 days for Stanbic, GTBank, and Union Bank. Renewal required.',
    impact: 'Trading restrictions if not renewed on time',
    timestamp: '2025-11-25 16:00',
    metrics: [
      { label: 'Expiring Soon', value: '3' },
      { label: 'Days Remaining', value: '28' },
    ],
    actions: [
      { label: 'Start Renewal', type: 'primary' },
      { label: 'View List', type: 'secondary' },
    ],
  },
  {
    id: 'INS-007',
    type: 'opportunity',
    priority: 'medium',
    category: 'Liquidity Management',
    title: 'USD Excess Liquidity Detected',
    description: 'USD position $2.5M above optimal level for 5 consecutive days. Consider redeployment.',
    impact: 'Opportunity cost of ₦12M in potential interest income',
    timestamp: '2025-11-25 14:30',
    metrics: [
      { label: 'Excess Position', value: '$2.5M' },
      { label: 'Opportunity Cost', value: '₦12M' },
    ],
    actions: [
      { label: 'View Options', type: 'primary' },
    ],
  },
  {
    id: 'INS-008',
    type: 'insight',
    priority: 'medium',
    category: 'Sentiment Intelligence',
    title: 'High Fit, Low Likelihood Opportunities',
    description: '12 counterparties in Quadrant 2 (high fit, low likelihood). Targeted engagement could convert.',
    impact: 'Estimated ₦180M additional trade volume if 50% convert',
    timestamp: '2025-11-25 12:00',
    metrics: [
      { label: 'Quadrant 2 Count', value: '12' },
      { label: 'Potential Volume', value: '₦180M' },
    ],
    actions: [
      { label: 'View Targets', type: 'primary' },
    ],
  },
  {
    id: 'INS-009',
    type: 'recommendation',
    priority: 'high',
    category: 'Risk Management',
    title: 'Diversification Opportunity in FX Spot',
    description: 'Top 3 counterparties account for 68% of FX Spot volume. High concentration risk.',
    impact: 'Reducing concentration could lower VaR by 15%',
    timestamp: '2025-11-25 10:00',
    metrics: [
      { label: 'Concentration', value: '68%' },
      { label: 'Target', value: '<50%' },
      { label: 'VaR Impact', value: '-15%' },
    ],
    actions: [
      { label: 'View Plan', type: 'primary' },
    ],
  },
  {
    id: 'INS-010',
    type: 'alert',
    priority: 'medium',
    category: 'Operations',
    title: 'Trade Confirmation Time Increasing',
    description: 'Average confirmation time for FX trades increased from 2.1h to 2.8h over past week.',
    impact: 'Settlement delays and potential counterparty complaints',
    timestamp: '2025-11-25 09:00',
    metrics: [
      { label: 'Current Time', value: '2.8h', change: '+33%' },
      { label: 'Target', value: '2.0h' },
    ],
    actions: [
      { label: 'Investigate', type: 'primary' },
    ],
  },
  {
    id: 'INS-011',
    type: 'achievement',
    priority: 'low',
    category: 'Financial Performance',
    title: 'November P&L Exceeds Target by 18%',
    description: 'Month-to-date P&L of ₦645M exceeds monthly target of ₦545M. All products contributing positively.',
    impact: 'Strong performance positions Q4 ahead of forecast',
    timestamp: '2025-11-25 08:00',
    metrics: [
      { label: 'MTD P&L', value: '₦645M', change: '+18%' },
      { label: 'Target', value: '₦545M' },
    ],
  },
  {
    id: 'INS-012',
    type: 'opportunity',
    priority: 'medium',
    category: 'Product Strategy',
    title: 'T-Bills Trading Volume Below Capacity',
    description: 'T-Bills desk operating at 45% capacity. Market conditions favorable for increased activity.',
    impact: 'Potential ₦35M additional revenue with full capacity utilization',
    timestamp: '2025-11-24 17:00',
    metrics: [
      { label: 'Current Capacity', value: '45%' },
      { label: 'Revenue Potential', value: '₦35M' },
    ],
    actions: [
      { label: 'Explore Market', type: 'primary' },
    ],
  },
  {
    id: 'INS-013',
    type: 'insight',
    priority: 'low',
    category: 'Market Intelligence',
    title: 'NGN/USD Volatility Increasing',
    description: 'NGN/USD implied volatility up 23% this week. Consider adjusting hedging strategies.',
    impact: 'Increased market risk; potential for wider spreads',
    timestamp: '2025-11-24 15:00',
    metrics: [
      { label: 'Volatility', value: '15.2%', change: '+23%' },
      { label: 'Historical Avg', value: '12.4%' },
    ],
  },
  {
    id: 'INS-014',
    type: 'recommendation',
    priority: 'medium',
    category: 'Workflow Optimization',
    title: 'Automate Trade Confirmation Process',
    description: 'Manual confirmation steps causing 35% of delays. Automation could improve efficiency by 40%.',
    impact: 'Reduce confirmation time from 2.8h to 1.7h average',
    timestamp: '2025-11-24 12:00',
    metrics: [
      { label: 'Manual Steps', value: '35%' },
      { label: 'Efficiency Gain', value: '+40%' },
      { label: 'Time Savings', value: '1.1h' },
    ],
    actions: [
      { label: 'Review Workflow', type: 'primary' },
    ],
  },
  {
    id: 'INS-015',
    type: 'alert',
    priority: 'high',
    category: 'Credit Risk',
    title: 'External Rating Downgrade for ABC Bank',
    description: 'ABC Bank downgraded from A to BBB+ by Fitch. Review internal rating and exposure.',
    impact: 'May require exposure reduction or pricing adjustment',
    timestamp: '2025-11-24 10:30',
    metrics: [
      { label: 'New Rating', value: 'BBB+' },
      { label: 'Exposure', value: '₦580M' },
    ],
    actions: [
      { label: 'Review Exposure', type: 'primary' },
      { label: 'Update Rating', type: 'secondary' },
    ],
  },
  {
    id: 'INS-016',
    type: 'opportunity',
    priority: 'high',
    category: 'Cross-Sell',
    title: 'FX Spot Clients Not Using MM Products',
    description: '18 active FX Spot counterparties have not traded Money Market products. Cross-sell opportunity.',
    impact: 'Estimated ₦120M additional revenue from cross-sell',
    timestamp: '2025-11-24 09:00',
    metrics: [
      { label: 'Target Clients', value: '18' },
      { label: 'Revenue Potential', value: '₦120M' },
    ],
    actions: [
      { label: 'Create Campaign', type: 'primary' },
    ],
  },
  {
    id: 'INS-017',
    type: 'insight',
    priority: 'medium',
    category: 'Predictive Analytics',
    title: 'Liquidity Shortage Predicted Next Week',
    description: 'ML model predicts NGN liquidity shortage on Nov 29-30. Consider preemptive funding.',
    impact: 'Avoid expensive emergency funding or missed trade opportunities',
    timestamp: '2025-11-24 07:00',
    metrics: [
      { label: 'Predicted Shortage', value: '₦450M' },
      { label: 'Confidence', value: '87%' },
    ],
    actions: [
      { label: 'Arrange Funding', type: 'primary' },
    ],
  },
  {
    id: 'INS-018',
    type: 'achievement',
    priority: 'low',
    category: 'Client Satisfaction',
    title: 'Zero Settlement Failures This Week',
    description: 'Achieved 100% settlement success rate for all 487 trades executed this week.',
    impact: 'Operational excellence; strong counterparty relationships',
    timestamp: '2025-11-23 18:00',
    metrics: [
      { label: 'Trades Settled', value: '487' },
      { label: 'Success Rate', value: '100%' },
    ],
  },
  {
    id: 'INS-019',
    type: 'recommendation',
    priority: 'medium',
    category: 'Technology',
    title: 'API Integration for Top 5 Counterparties',
    description: 'Top 5 counterparties account for 55% of volume. API integration could reduce processing time by 70%.',
    impact: 'Operational efficiency and competitive advantage',
    timestamp: '2025-11-23 14:00',
    metrics: [
      { label: 'Volume Impact', value: '55%' },
      { label: 'Time Savings', value: '70%' },
    ],
    actions: [
      { label: 'Initiate Project', type: 'primary' },
    ],
  },
  {
    id: 'INS-020',
    type: 'alert',
    priority: 'medium',
    category: 'Market Risk',
    title: 'Unusual Price Movement in T-Bills',
    description: 'T-Bills yield curve shifted 45bps in 24 hours. Review pricing and positions.',
    impact: 'Mark-to-market impact of approximately ₦22M',
    timestamp: '2025-11-23 11:00',
    metrics: [
      { label: 'Yield Change', value: '+45bps' },
      { label: 'MTM Impact', value: '₦22M' },
    ],
    actions: [
      { label: 'Review Positions', type: 'primary' },
    ],
  },
];
