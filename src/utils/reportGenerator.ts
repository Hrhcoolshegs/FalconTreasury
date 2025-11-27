import { format } from 'date-fns';

export function generateReport(reportId: string, reportName: string, data: any) {
  const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
  const filename = `${reportName.replace(/\s+/g, '_')}_${timestamp}`;

  switch (reportId) {
    case 'daily-treasury':
      return generateDailyTreasuryReport(data);
    case 'weekly-pnl':
      return generateWeeklyPnLReport(data);
    case 'monthly-exposure':
      return generateMonthlyExposureReport(data);
    case 'counterparty-analysis':
      return generateCounterpartyAnalysisReport(data);
    case 'liquidity-report':
      return generateLiquidityReport(data);
    default:
      return generateGenericReport(reportName, data);
  }
}

function generateDailyTreasuryReport(data: any) {
  return `
FALCON TREASURY - DAILY TREASURY SUMMARY
Generated: ${format(new Date(), 'PPpp')}
================================================================================

EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
Total P&L (MTD):                 ₦${(data.totalPnL / 1000000).toFixed(2)}M
Trading Volume (Today):          ₦${(data.todayVolume / 1000000000).toFixed(2)}B
Active Trades:                   ${data.activeTrades}
Settlement Success Rate:         ${data.settlementRate.toFixed(1)}%

POSITION OVERVIEW
--------------------------------------------------------------------------------
NGN Liquidity:                   ₦${(data.ngnLiquidity / 1000000000).toFixed(2)}B
USD Liquidity:                   $${(data.usdLiquidity / 1000000).toFixed(2)}M
Total Exposure:                  ₦${(data.totalExposure / 1000000000).toFixed(2)}B
VaR (95%):                       ₦${(data.var / 1000000000).toFixed(2)}B

PRODUCT BREAKDOWN
--------------------------------------------------------------------------------
FX Spot P&L:                     ₦${(data.fxSpotPnL / 1000000).toFixed(2)}M
FX Forward P&L:                  ₦${(data.fxForwardPnL / 1000000).toFixed(2)}M
Money Market P&L:                ₦${(data.mmPnL / 1000000).toFixed(2)}M
T-Bills P&L:                     ₦${(data.tbillsPnL / 1000000).toFixed(2)}M
Bonds P&L:                       ₦${(data.bondsPnL / 1000000).toFixed(2)}M

RISK ALERTS
--------------------------------------------------------------------------------
${data.alerts.map((alert: string) => `• ${alert}`).join('\n')}

COMMENTARY
--------------------------------------------------------------------------------
${data.commentary}

================================================================================
This report is confidential and intended for internal use only.
For questions, contact treasury@falcon.ng
`;
}

function generateWeeklyPnLReport(data: any) {
  return `
FALCON TREASURY - WEEKLY P&L REPORT
Generated: ${format(new Date(), 'PPpp')}
Week Ending: ${format(new Date(), 'PPP')}
================================================================================

TOTAL P&L SUMMARY
--------------------------------------------------------------------------------
Week Total:                      ₦${(data.weeklyPnL / 1000000).toFixed(2)}M
MTD Total:                       ₦${(data.mtdPnL / 1000000).toFixed(2)}M
YTD Total:                       ₦${(data.ytdPnL / 1000000).toFixed(2)}M
Weekly Change:                   ${data.weeklyChange >= 0 ? '+' : ''}${data.weeklyChange.toFixed(1)}%

P&L BY PRODUCT
--------------------------------------------------------------------------------
FX Spot:                         ₦${(data.products.fxSpot / 1000000).toFixed(2)}M
FX Forward:                      ₦${(data.products.fxForward / 1000000).toFixed(2)}M
Money Market:                    ₦${(data.products.moneyMarket / 1000000).toFixed(2)}M
T-Bills:                         ₦${(data.products.tbills / 1000000).toFixed(2)}M
Bonds:                           ₦${(data.products.bonds / 1000000).toFixed(2)}M

P&L BY DESK
--------------------------------------------------------------------------------
FX Desk A:                       ₦${(data.desks.fxDeskA / 1000000).toFixed(2)}M
FX Desk B:                       ₦${(data.desks.fxDeskB / 1000000).toFixed(2)}M
MM Desk:                         ₦${(data.desks.mmDesk / 1000000).toFixed(2)}M
Fixed Income Desk:               ₦${(data.desks.fiDesk / 1000000).toFixed(2)}M

TOP 5 COUNTERPARTIES BY P&L
--------------------------------------------------------------------------------
${data.topCounterparties.map((cp: any, idx: number) =>
  `${idx + 1}. ${cp.name.padEnd(30)} ₦${(cp.pnl / 1000000).toFixed(2)}M`
).join('\n')}

================================================================================
This report is confidential and intended for internal use only.
`;
}

function generateMonthlyExposureReport(data: any) {
  return `
FALCON TREASURY - MONTHLY EXPOSURE REPORT
Generated: ${format(new Date(), 'PPpp')}
Report Period: ${format(new Date(), 'MMMM yyyy')}
================================================================================

EXPOSURE SUMMARY
--------------------------------------------------------------------------------
Total Exposure:                  ₦${(data.totalExposure / 1000000000).toFixed(2)}B
Total Limits:                    ₦${(data.totalLimits / 1000000000).toFixed(2)}B
Average Utilization:             ${data.avgUtilization.toFixed(1)}%
High Utilization (>90%):         ${data.highUtilCount} counterparties

COUNTERPARTY EXPOSURE BREAKDOWN
--------------------------------------------------------------------------------
${data.counterparties.map((cp: any) =>
  `${cp.name.padEnd(30)} ₦${(cp.exposure / 1000000).toFixed(0)}M / ₦${(cp.limit / 1000000).toFixed(0)}M (${cp.utilization.toFixed(1)}%)`
).join('\n')}

CONCENTRATION ANALYSIS
--------------------------------------------------------------------------------
Top 3 Exposure:                  ${data.top3Concentration.toFixed(1)}%
Top 5 Exposure:                  ${data.top5Concentration.toFixed(1)}%
Top 10 Exposure:                 ${data.top10Concentration.toFixed(1)}%

SECTOR DISTRIBUTION
--------------------------------------------------------------------------------
Banks:                           ₦${(data.sectors.banks / 1000000000).toFixed(2)}B (${data.sectors.banksPercent.toFixed(1)}%)
Corporates:                      ₦${(data.sectors.corporates / 1000000000).toFixed(2)}B (${data.sectors.corporatesPercent.toFixed(1)}%)
Asset Managers:                  ₦${(data.sectors.assetManagers / 1000000000).toFixed(2)}B (${data.sectors.assetManagersPercent.toFixed(1)}%)
Others:                          ₦${(data.sectors.others / 1000000000).toFixed(2)}B (${data.sectors.othersPercent.toFixed(1)}%)

RECOMMENDATIONS
--------------------------------------------------------------------------------
${data.recommendations.map((rec: string) => `• ${rec}`).join('\n')}

================================================================================
This report is confidential and intended for internal use only.
`;
}

function generateCounterpartyAnalysisReport(data: any) {
  return `
FALCON TREASURY - COUNTERPARTY ANALYSIS
Generated: ${format(new Date(), 'PPpp')}
================================================================================

TOTAL COUNTERPARTIES: ${data.totalCounterparties}
Active: ${data.active} | Inactive: ${data.inactive}

DETAILED COUNTERPARTY LIST
--------------------------------------------------------------------------------
${data.counterparties.map((cp: any) => `
${cp.name} (${cp.id})
  Sector:          ${cp.sector}
  Rating:          ${cp.internalRating} / ${cp.externalRating}
  Exposure:        ₦${(cp.exposure / 1000000).toFixed(1)}M
  Limit:           ₦${(cp.limit / 1000000).toFixed(1)}M
  Utilization:     ${cp.utilization.toFixed(1)}%
  Risk Category:   ${cp.riskCategory}
  Trades YTD:      ${cp.tradesYtd}
  Settlement:      ${cp.settlementReliability.toFixed(1)}%
`).join('\n')}

================================================================================
This report is confidential and intended for internal use only.
`;
}

function generateLiquidityReport(data: any) {
  return `
FALCON TREASURY - LIQUIDITY POSITION REPORT
Generated: ${format(new Date(), 'PPpp')}
================================================================================

CURRENT LIQUIDITY POSITION
--------------------------------------------------------------------------------
NGN Position:                    ₦${(data.ngnPosition / 1000000000).toFixed(2)}B
USD Position:                    $${(data.usdPosition / 1000000).toFixed(2)}M
GBP Position:                    £${(data.gbpPosition / 1000000).toFixed(2)}M
EUR Position:                    €${(data.eurPosition / 1000000).toFixed(2)}M

FORECASTED LIQUIDITY (7 DAYS)
--------------------------------------------------------------------------------
${data.forecast.map((day: any) =>
  `${day.date}: ₦${(day.position / 1000000000).toFixed(2)}B (${day.confidence}% confidence)`
).join('\n')}

LIQUIDITY BUFFER ANALYSIS
--------------------------------------------------------------------------------
Current Buffer:                  ${data.currentBuffer.toFixed(1)}%
Minimum Required:                ${data.minRequired.toFixed(1)}%
Status:                          ${data.bufferStatus}

UPCOMING MATURITIES (30 DAYS)
--------------------------------------------------------------------------------
${data.maturities.map((mat: any) =>
  `${mat.date}: ₦${(mat.amount / 1000000).toFixed(1)}M - ${mat.product}`
).join('\n')}

================================================================================
This report is confidential and intended for internal use only.
`;
}

function generateGenericReport(reportName: string, data: any) {
  return `
FALCON TREASURY - ${reportName.toUpperCase()}
Generated: ${format(new Date(), 'PPpp')}
================================================================================

REPORT SUMMARY
--------------------------------------------------------------------------------
This report contains comprehensive analysis and metrics for ${reportName}.

DATA OVERVIEW
--------------------------------------------------------------------------------
${JSON.stringify(data, null, 2)}

================================================================================
This report is confidential and intended for internal use only.
For questions, contact treasury@falcon.ng
`;
}

export function downloadTextReport(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCSVReport(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header =>
      JSON.stringify(row[header] || '')
    ).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
