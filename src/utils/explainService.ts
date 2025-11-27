interface ExplainContext {
  component: string;
  metric?: string;
  data?: any;
  trends?: string[];
  currentValues?: Record<string, number | string>;
}

interface ExplainResponse {
  title: string;
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  technicalDetails?: string;
  relatedMetrics?: string[];
}

export class ExplainService {
  static generateExplanation(context: ExplainContext): ExplainResponse {
    const { component, metric, data, trends, currentValues } = context;

    switch (component) {
      case 'treasury-liquidity-trend':
        return {
          title: 'Liquidity Trend Analysis',
          summary: 'This chart shows your closing liquidity balances over the last 30 days in both NGN and USD. The dual-currency view helps you monitor foreign exchange exposure and overall treasury health.',
          keyInsights: [
            `Current NGN liquidity: ₦${currentValues?.ngn || 'N/A'}B - ${this.getTrendDescription(trends?.[0])}`,
            `Current USD liquidity: $${currentValues?.usd || 'N/A'}M - ${this.getTrendDescription(trends?.[1])}`,
            'Liquidity buffer is at 31.5%, exceeding the recommended 25% minimum',
            'Currency diversification ratio is optimal at 70% NGN / 30% USD',
            'No liquidity stress indicators detected in the current period'
          ],
          recommendations: [
            'Consider deploying excess NGN liquidity into short-term money market instruments',
            'Maintain current USD buffer for FX trading obligations',
            'Review intraday liquidity patterns to optimize cash positioning',
            'Set up automated alerts for liquidity falling below 28% buffer threshold'
          ],
          technicalDetails: 'Calculated using end-of-day settlement positions across all nostro accounts, adjusted for pending trades and committed facilities.',
          relatedMetrics: ['Cash Flow Forecast', 'Settlement Calendar', 'Nostro Balances', 'Credit Facilities']
        };

      case 'treasury-fx-exposure':
        return {
          title: 'FX Exposure Distribution Analysis',
          summary: 'This breakdown shows how foreign exchange exposure is distributed across your trading desks. Understanding desk-level concentration helps manage operational risk and optimize resource allocation.',
          keyInsights: [
            'FX Desk A holds 45% of total exposure (₦22.5B) - highest concentration',
            'FX Desk B accounts for 32% (₦16.0B) - well-diversified portfolio',
            'Money Market Desk: 18% (₦9.0B) - primarily NGN instruments',
            'Fixed Income: 5% (₦2.5B) - lowest FX exposure',
            'Top 2 desks represent 77% of total FX risk - potential concentration concern'
          ],
          recommendations: [
            'Review FX Desk A exposure limits - currently at maximum allocation',
            'Consider rebalancing 10-15% from Desk A to Desk B for better risk distribution',
            'Implement desk-level VaR limits to prevent over-concentration',
            'Monitor intraday exposure buildup, especially during peak trading hours (10am-2pm)',
            'Establish cross-desk hedging strategies to optimize capital usage'
          ],
          technicalDetails: 'Exposure calculated as sum of all open FX positions (spot + forward) marked-to-market at current rates, including unsettled trades.',
          relatedMetrics: ['Desk Performance', 'Trader Attribution', 'VaR by Desk', 'Position Limits']
        };

      case 'sentiment-quadrant':
        return {
          title: 'Sentiment Intelligence Quadrant Explained',
          summary: 'This 2x2 matrix maps counterparties based on two key dimensions: Relationship Strength (trust, reliability, history) on the X-axis and Transaction Likelihood (probability of future deals) on the Y-axis. Each quadrant represents a different strategic priority.',
          keyInsights: [
            'Q1 (High/High - Top Right): 12 counterparties - Your "Champions". Strong relationship + high deal flow',
            'Q2 (Low/High - Top Left): 8 counterparties - "Opportunities". Good deal potential but weak relationship',
            'Q3 (Low/Low - Bottom Left): 15 counterparties - "Low Priority". Minimal engagement needed',
            'Q4 (High/Low - Bottom Right): 15 counterparties - "At Risk". Strong past relationship but declining activity',
            '24% of counterparties are Champions - above industry benchmark of 20%'
          ],
          recommendations: [
            'Q1 Strategy: Maintain excellence. Consider expanding product offerings and credit limits',
            'Q2 Strategy: Priority conversion targets. Assign senior relationship managers to build trust',
            'Q3 Strategy: Minimal touch. Review annually for closure or reactivation opportunities',
            'Q4 Strategy: Urgent intervention needed. Schedule executive-level meetings to understand concerns',
            'Focus 60% of relationship management effort on Q2 - highest ROI opportunity'
          ],
          technicalDetails: 'Relationship Strength = weighted score of settlement reliability (40%), tenure (30%), communication quality (20%), and credit standing (10%). Transaction Likelihood = ML model prediction based on historical patterns, market conditions, and behavioral signals.',
          relatedMetrics: ['Counterparty Health Score', 'Win/Loss Analysis', 'Relationship Manager Performance', 'Pipeline Value']
        };

      case 'behavior-pattern':
        return {
          title: 'Behavioral Pattern Analysis',
          summary: 'This visualization tracks changes in counterparty trading behaviors over time. By monitoring volume trends, timing shifts, and product preferences, we can detect opportunities and risks before they materialize.',
          keyInsights: [
            '8 pattern changes detected in the last 30 days across your portfolio',
            '4 seasonal trends identified: Month-end clustering, quarter-end spikes, pre-holiday volume drops',
            '2 anomalies flagged as low risk: GTBank overnight timing shift, UBA product mix change',
            '3 counterparties showing trading time shifts: possible operational changes',
            'Volume variations remain within 2 standard deviations - no alert triggers'
          ],
          recommendations: [
            'Investigate GTBank timing shift - schedule call to understand workflow changes',
            'UBA product mix change (more FX Forward vs Spot) - opportunity to offer new structures',
            'Prepare for month-end volume surge - increase desk staffing on days 28-31',
            'Document seasonal patterns to improve liquidity forecasting accuracy',
            'Set up real-time alerts for volume deviations exceeding 3 standard deviations'
          ],
          technicalDetails: 'Machine learning model analyzes 12 months of transaction data across 15 behavioral dimensions including trade timing, size distribution, product preferences, and communication patterns. Statistical significance tested at 95% confidence level.',
          relatedMetrics: ['Trading Volume Forecast', 'Counterparty Engagement Score', 'Churn Risk Indicator', 'Cross-sell Opportunities']
        };

      case 'product-performance':
        return {
          title: 'Product Performance Metrics Explained',
          summary: 'This dashboard tracks the financial performance of each product line, measuring both absolute profitability (P&L) and efficiency (Win/Loss Ratio). These metrics guide resource allocation and strategic focus.',
          keyInsights: [
            'Money Market leads with ₦320M P&L - 41.8% of total treasury income',
            'Money Market also has the best efficiency: 2.8x ratio (₦2.80 earned per ₦1 at risk)',
            'FX Forward shows strong performance: ₦165M P&L with 2.5x ratio',
            'T-Bills and Bonds underperforming: Below 2.0x ratio threshold',
            'Total portfolio P&L: ₦765M with blended 2.3x ratio - above target of 2.0x'
          ],
          recommendations: [
            'Double down on Money Market: Increase limits and add traders to capture more market share',
            'FX Forward sweet spot identified: Maintain current strategy and risk allocation',
            'T-Bills review needed: Analyze if low ratio is due to market conditions or execution',
            'Bonds: Consider reducing allocation or pivoting to higher-yield instruments',
            'Cross-training initiative: Move T-Bills traders to Money Market for better productivity',
            'Set minimum 2.0x ratio threshold for all products starting next quarter'
          ],
          technicalDetails: 'P&L represents realized gains net of all costs including funding, operations, and credit reserves. Win/Loss Ratio = Average gain on winning trades ÷ Average loss on losing trades. Calculated on closed positions only.',
          relatedMetrics: ['Return on Risk-Weighted Assets', 'Sharpe Ratio by Product', 'Market Share', 'Capacity Utilization']
        };

      case 'exposure-overview':
        return {
          title: 'Risk Exposure Overview Analysis',
          summary: 'This module provides a comprehensive view of your credit and market risk exposures. Understanding these metrics is crucial for maintaining risk appetite compliance and preventing losses.',
          keyInsights: [
            `Total exposure across all counterparties: ₦${currentValues?.totalExposure || 'N/A'}B`,
            `Value at Risk (95% confidence): ₦${currentValues?.var || 'N/A'}B - within approved limit`,
            `Composite risk score: ${currentValues?.riskScore || 'N/A'}/100 - moderate risk profile`,
            '5 counterparties classified as high-risk - requires enhanced monitoring',
            'Top 3 counterparties represent 68% of exposure - concentration elevated'
          ],
          recommendations: [
            'Diversify exposure: Reduce top 3 concentration from 68% to target of 55%',
            'High-risk counterparties: Implement stricter limits and daily mark-to-market',
            'Consider credit default swaps for top exposures exceeding ₦800M',
            'Establish dynamic hedging program for exposures above 80% utilization',
            'Quarterly stress testing required for current exposure profile'
          ],
          technicalDetails: 'Exposure = sum of marked-to-market positions plus potential future exposure calculated using Monte Carlo simulation (10,000 paths). VaR estimated using historical simulation method with 252-day window.',
          relatedMetrics: ['Credit Utilization', 'Expected Shortfall', 'Wrong-Way Risk', 'Collateral Coverage']
        };

      case 'liquidity-forecast':
        return {
          title: 'Liquidity Forecast Model Explanation',
          summary: 'Our machine learning model predicts future liquidity positions using historical patterns, scheduled settlements, and market conditions. This forward-looking view enables proactive treasury management.',
          keyInsights: [
            '7-day forecast: ₦27.8B with 92% confidence - very reliable prediction',
            '14-day forecast: ₦28.5B with 85% confidence - high reliability',
            '30-day forecast: ₦29.2B with 78% confidence - moderate reliability',
            'Current buffer at 31.5% - exceeds healthy threshold of 25%',
            'Model accuracy improved 15% over last quarter through enhanced training data'
          ],
          recommendations: [
            'Lock in excess liquidity in 7-day instruments with high confidence',
            'Maintain flexibility in 30-day planning due to lower forecast confidence',
            'Schedule major settlements during periods of forecasted liquidity strength',
            'Build contingency plans for scenarios where actuals fall below forecast by 10%',
            'Review model assumptions monthly as market conditions evolve'
          ],
          technicalDetails: 'Ensemble model combining ARIMA time series, gradient boosting, and neural network components. Trained on 36 months of historical data with features including day-of-week effects, seasonal patterns, market volatility, and scheduled cash flows. Confidence intervals calculated using bootstrap resampling.',
          relatedMetrics: ['Intraday Liquidity Pattern', 'Settlement Schedule', 'Credit Line Availability', 'Contingent Funding Plan']
        };

      case 'attribution-overview':
        return {
          title: 'P&L Attribution Analysis Explained',
          summary: 'Attribution analysis breaks down profit and loss across multiple dimensions (desk, trader, product, counterparty) to identify top performers and optimization opportunities.',
          keyInsights: [
            'Top Desk: FX Desk A generated ₦285M - 37.3% of total P&L',
            'Top Trader: Aisha Bello produced ₦142M - star performer',
            'Top Product: Money Market contributed ₦320M - strategic focus area',
            'Top Counterparty: FirstBank relationship yielded ₦95M in profits',
            'Performance highly concentrated: Top 10% of traders generate 60% of P&L'
          ],
          recommendations: [
            'Aisha Bello: Fast-track promotion, increase limits, assign mentor role',
            'FX Desk A: Study best practices for replication across other desks',
            'Money Market dominance: Ensure adequate risk management as concentration grows',
            'FirstBank: Deepen relationship with expanded credit lines and new products',
            'Trader development: Create training program to elevate bottom 50% performers',
            'Consider trader retention strategies given concentration risk in key performers'
          ],
          technicalDetails: 'P&L attributed using marginal contribution method. Each dimension receives credit for incremental value add beyond baseline. Interaction effects allocated proportionally. Updated daily with T-1 closing prices.',
          relatedMetrics: ['Return on Allocated Capital', 'Risk-Adjusted Return', 'Trader Sharpe Ratio', 'Compensation Benchmarking']
        };

      default:
        return {
          title: 'Data Insight',
          summary: 'This metric provides important information about your treasury operations. Analyzing this data helps you make informed decisions and identify optimization opportunities.',
          keyInsights: [
            'Real-time data updated continuously throughout the trading day',
            'Historical trends available for comparative analysis',
            'Anomaly detection active to flag unusual patterns',
            'Integrated with enterprise risk management framework'
          ],
          recommendations: [
            'Review this metric regularly as part of daily operations',
            'Set up alerts for significant changes or threshold breaches',
            'Compare against industry benchmarks and peer institutions',
            'Discuss findings with relevant stakeholders in weekly reviews'
          ],
          technicalDetails: 'Calculated using enterprise data warehouse with real-time feeds from all trading systems and external market data providers.',
          relatedMetrics: ['Related KPIs', 'Supporting Metrics', 'Risk Indicators']
        };
    }
  }

  private static getTrendDescription(trend?: string): string {
    if (!trend) return 'stable position';

    switch (trend.toLowerCase()) {
      case 'up':
      case 'increasing':
        return 'showing positive growth trajectory';
      case 'down':
      case 'decreasing':
        return 'experiencing downward pressure';
      case 'stable':
        return 'maintaining steady position';
      case 'volatile':
        return 'exhibiting increased volatility';
      default:
        return 'stable position';
    }
  }

  static getQuickInsight(component: string, metric: string): string {
    const quickInsights: Record<string, string> = {
      'liquidity-trend': 'Your liquidity position is healthy with adequate buffers. NGN and USD balances are well-balanced for operational needs.',
      'fx-exposure': 'FX exposure is concentrated in top 2 desks. Consider rebalancing for better risk distribution.',
      'sentiment': 'Focus relationship management efforts on Q2 (Opportunities) and Q4 (At Risk) counterparties for maximum impact.',
      'behavior': 'Behavioral patterns are mostly stable with a few low-risk anomalies worth investigating.',
      'product': 'Money Market is your star performer. Consider allocating more resources to this high-margin product.',
      'risk': 'Overall risk profile is within acceptable limits, but monitor top 3 counterparty concentration.',
      'attribution': 'Performance is concentrated in top performers. Focus on developing broader talent base.',
    };

    return quickInsights[metric] || 'This metric is performing within expected parameters.';
  }
}
