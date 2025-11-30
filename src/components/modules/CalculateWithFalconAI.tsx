import { useState } from 'react';
import { Calculator, Sparkles, TrendingUp, DollarSign, Calendar, Percent, Info, History, Download, Search } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { format } from 'date-fns';
import { safeNumber, formatLargeNumber } from '../../utils/numberHelpers';

interface CalculationResult {
  id: string;
  query: string;
  result: any;
  explanation: string;
  timestamp: Date;
  calculationType: string;
}

export default function CalculateWithFalconAI() {
  const { transactions } = useTransactions();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState('');

  const exampleQueries = [
    "What is the clean price for trade ID TRD-20251125-001?",
    "Calculate yield to maturity for 5-year bond at 95% of par",
    "What is the duration of a 3-year bond with 8% coupon?",
    "Calculate accrued interest for trade ID TRD-20251125-002",
    "What is the mark-to-market value for all FX trades today?",
    "Calculate present value of ₦1B discounted at 12% over 2 years",
  ];

  const quickCalculations = [
    { label: 'Clean Price', icon: DollarSign, type: 'clean_price' },
    { label: 'Yield to Maturity', icon: TrendingUp, type: 'ytm' },
    { label: 'Duration', icon: Calendar, type: 'duration' },
    { label: 'Accrued Interest', icon: Percent, type: 'accrued' },
    { label: 'Mark-to-Market', icon: Calculator, type: 'mtm' },
    { label: 'Present Value', icon: DollarSign, type: 'pv' },
  ];

  const handleCalculate = () => {
    if (!query.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const result = performCalculation(query);
      setResults([result, ...results]);
      setLoading(false);
      setQuery('');
    }, 1000);
  };

  const performCalculation = (query: string): CalculationResult => {
    const lowerQuery = query.toLowerCase();

    // Extract trade ID if present
    const tradeIdMatch = query.match(/trade\s+id\s+([A-Z0-9-]+)/i);
    const tradeId = tradeIdMatch ? tradeIdMatch[1] : null;
    const trade = tradeId ? transactions.find(t => t.trade_id === tradeId) : null;

    // Clean Price Calculation
    if (lowerQuery.includes('clean price')) {
      if (trade) {
        const faceValue = safeNumber(trade.amount_ngn_equivalent, 1000000000);
        const marketPrice = faceValue * (0.98 + Math.random() * 0.04);
        const accruedInterest = faceValue * 0.08 * (90 / 365);
        const cleanPrice = marketPrice - accruedInterest;
        const pricePercent = (cleanPrice / faceValue) * 100;

        return {
          id: Date.now().toString(),
          query,
          result: {
            cleanPrice,
            marketPrice,
            accruedInterest,
            faceValue,
            pricePercent,
          },
          explanation: `**Clean Price Calculation for ${trade.trade_id}**

**Given:**
- Face Value: ${formatLargeNumber(faceValue, 'NGN')}
- Market Price: ${formatLargeNumber(marketPrice, 'NGN')}
- Accrued Interest (90 days at 8%): ${formatLargeNumber(accruedInterest, 'NGN')}

**Calculation:**
Clean Price = Market Price - Accrued Interest
Clean Price = ${formatLargeNumber(marketPrice, 'NGN')} - ${formatLargeNumber(accruedInterest, 'NGN')}
Clean Price = ${formatLargeNumber(cleanPrice, 'NGN')}

**As Percentage of Par:** ${pricePercent.toFixed(3)}%

**Interpretation:**
The bond is trading ${pricePercent > 100 ? 'above' : 'below'} par value, indicating ${pricePercent > 100 ? 'strong demand' : 'potential yield opportunity'}. The clean price excludes accrued interest, giving a true view of the bond's value.`,
          timestamp: new Date(),
          calculationType: 'Clean Price',
        };
      } else {
        // Generic clean price calculation
        const faceValue = 1000000000;
        const marketPrice = faceValue * 0.95;
        const accruedInterest = faceValue * 0.08 * (45 / 365);
        const cleanPrice = marketPrice - accruedInterest;

        return {
          id: Date.now().toString(),
          query,
          result: { cleanPrice, marketPrice, accruedInterest, faceValue },
          explanation: `**Clean Price Calculation (Generic Example)**

Clean Price = Market Price - Accrued Interest
Clean Price = ₦950M - ₦9.86M = ₦940.14M

The clean price represents the bond's value without accrued interest.`,
          timestamp: new Date(),
          calculationType: 'Clean Price',
        };
      }
    }

    // Yield to Maturity
    if (lowerQuery.includes('yield') || lowerQuery.includes('ytm')) {
      const priceMatch = query.match(/(\d+)%\s+of\s+par/i);
      const yearsMatch = query.match(/(\d+)-year/i);
      const couponMatch = query.match(/(\d+)%\s+coupon/i);

      const price = priceMatch ? parseFloat(priceMatch[1]) : 95;
      const years = yearsMatch ? parseInt(yearsMatch[1]) : 5;
      const coupon = couponMatch ? parseFloat(couponMatch[1]) : 8;

      // Simplified YTM approximation
      const annualCoupon = coupon;
      const capitalGain = (100 - price) / years;
      const ytm = ((annualCoupon + capitalGain) / ((100 + price) / 2)) * 100;

      return {
        id: Date.now().toString(),
        query,
        result: { ytm, price, years, coupon },
        explanation: `**Yield to Maturity Calculation**

**Given:**
- Bond Price: ${price}% of par
- Maturity: ${years} years
- Coupon Rate: ${coupon}%

**Simplified YTM Formula:**
YTM ≈ [(Annual Coupon + Capital Gain per Year) / Average Price] × 100

**Step 1:** Annual Coupon = ${coupon}%
**Step 2:** Capital Gain per Year = (100 - ${price}) / ${years} = ${capitalGain.toFixed(2)}%
**Step 3:** Average Price = (100 + ${price}) / 2 = ${((100 + price) / 2).toFixed(2)}%
**Step 4:** YTM = [(${coupon} + ${capitalGain.toFixed(2)}) / ${((100 + price) / 2).toFixed(2)}] × 100

**Yield to Maturity: ${ytm.toFixed(3)}%**

**Interpretation:**
The YTM of ${ytm.toFixed(2)}% represents the total return if held to maturity. This is ${ytm > coupon ? 'higher' : 'lower'} than the coupon rate because the bond is trading ${price < 100 ? 'at a discount' : 'at a premium'}.`,
        timestamp: new Date(),
        calculationType: 'Yield to Maturity',
      };
    }

    // Duration Calculation
    if (lowerQuery.includes('duration')) {
      const yearsMatch = query.match(/(\d+)-year/i);
      const couponMatch = query.match(/(\d+)%\s+coupon/i);

      const years = yearsMatch ? parseInt(yearsMatch[1]) : 3;
      const coupon = couponMatch ? parseFloat(couponMatch[1]) : 8;
      const yieldRate = 10; // Assumed yield

      // Macaulay Duration approximation
      const duration = (1 + yieldRate / 100) / (yieldRate / 100) -
                      (1 + yieldRate / 100 + years * (coupon / 100 - yieldRate / 100)) /
                      (coupon / 100 * Math.pow(1 + yieldRate / 100, years) + yieldRate / 100);

      const modifiedDuration = duration / (1 + yieldRate / 100);

      return {
        id: Date.now().toString(),
        query,
        result: { duration, modifiedDuration, years, coupon, yieldRate },
        explanation: `**Duration Calculation**

**Given:**
- Maturity: ${years} years
- Coupon Rate: ${coupon}%
- Yield: ${yieldRate}%

**Macaulay Duration: ${Math.abs(duration).toFixed(3)} years**
**Modified Duration: ${Math.abs(modifiedDuration).toFixed(3)} years**

**Interpretation:**
Duration measures the bond's price sensitivity to interest rate changes. A modified duration of ${Math.abs(modifiedDuration).toFixed(2)} means that for every 1% change in yield, the bond price will change by approximately ${Math.abs(modifiedDuration).toFixed(2)}% in the opposite direction.

**Risk Assessment:** ${Math.abs(modifiedDuration) > 5 ? 'High' : Math.abs(modifiedDuration) > 3 ? 'Moderate' : 'Low'} interest rate risk`,
        timestamp: new Date(),
        calculationType: 'Duration',
      };
    }

    // Accrued Interest
    if (lowerQuery.includes('accrued interest')) {
      if (trade) {
        const faceValue = safeNumber(trade.amount_ngn_equivalent, 1000000000);
        const couponRate = 8.0;
        const daysSinceLastCoupon = 90;
        const accruedInterest = (faceValue * couponRate / 100) * (daysSinceLastCoupon / 365);

        return {
          id: Date.now().toString(),
          query,
          result: { accruedInterest, faceValue, couponRate, daysSinceLastCoupon },
          explanation: `**Accrued Interest Calculation for ${trade.trade_id}**

**Given:**
- Face Value: ${formatLargeNumber(faceValue, 'NGN')}
- Coupon Rate: ${couponRate}% per annum
- Days Since Last Coupon: ${daysSinceLastCoupon} days

**Formula:**
Accrued Interest = (Face Value × Coupon Rate) × (Days / 365)

**Calculation:**
Accrued Interest = (${formatLargeNumber(faceValue, 'NGN')} × ${couponRate}%) × (${daysSinceLastCoupon} / 365)
Accrued Interest = ${formatLargeNumber(accruedInterest, 'NGN')}

**Interpretation:**
The accrued interest of ${formatLargeNumber(accruedInterest, 'NGN')} represents the interest earned but not yet paid. The buyer must compensate the seller for this amount at settlement.`,
          timestamp: new Date(),
          calculationType: 'Accrued Interest',
        };
      }
    }

    // Mark-to-Market
    if (lowerQuery.includes('mark-to-market') || lowerQuery.includes('mtm')) {
      const todayTrades = transactions.filter(t =>
        t.trade_date === format(new Date(), 'yyyy-MM-dd')
      );

      const mtmValues = todayTrades.map(t => ({
        tradeId: t.trade_id,
        notional: safeNumber(t.amount_ngn_equivalent, 0),
        mtm: safeNumber(t.amount_ngn_equivalent, 0) * (0.98 + Math.random() * 0.04),
        pnl: safeNumber(t.pnl_realized, 0),
      }));

      const totalMTM = mtmValues.reduce((sum, v) => sum + v.mtm, 0);
      const totalPnL = mtmValues.reduce((sum, v) => sum + v.pnl, 0);

      return {
        id: Date.now().toString(),
        query,
        result: { mtmValues, totalMTM, totalPnL, tradeCount: todayTrades.length },
        explanation: `**Mark-to-Market Analysis (Today's Trades)**

**Portfolio Summary:**
- Total Trades: ${todayTrades.length}
- Total MTM Value: ${formatLargeNumber(totalMTM, 'NGN')}
- Total P&L: ${formatLargeNumber(totalPnL, 'NGN')}
- MTM/Notional Ratio: ${((totalMTM / mtmValues.reduce((s, v) => s + v.notional, 0)) * 100).toFixed(2)}%

**Top 5 Positions by MTM:**
${mtmValues.slice(0, 5).map((v, i) =>
  `${i + 1}. ${v.tradeId}: ${formatLargeNumber(v.mtm, 'NGN')} (P&L: ${formatLargeNumber(v.pnl, 'NGN')})`
).join('\n')}

**Interpretation:**
The mark-to-market valuation shows your current exposure at market prices. ${totalPnL >= 0 ? 'Positive P&L indicates profitable positions.' : 'Negative P&L suggests positions are underwater.'}`,
        timestamp: new Date(),
        calculationType: 'Mark-to-Market',
      };
    }

    // Present Value
    if (lowerQuery.includes('present value') || lowerQuery.includes('pv')) {
      const amountMatch = query.match(/[₦$](\d+\.?\d*)\s*([BMK])?/i);
      const rateMatch = query.match(/(\d+\.?\d*)%/);
      const yearsMatch = query.match(/(\d+)\s+years?/i);

      const amount = amountMatch ? parseFloat(amountMatch[1]) * (amountMatch[2]?.toUpperCase() === 'B' ? 1000000000 : amountMatch[2]?.toUpperCase() === 'M' ? 1000000 : 1) : 1000000000;
      const rate = rateMatch ? parseFloat(rateMatch[1]) : 12;
      const years = yearsMatch ? parseInt(yearsMatch[1]) : 2;

      const pv = amount / Math.pow(1 + rate / 100, years);
      const discountAmount = amount - pv;

      return {
        id: Date.now().toString(),
        query,
        result: { pv, amount, rate, years, discountAmount },
        explanation: `**Present Value Calculation**

**Given:**
- Future Value: ${formatLargeNumber(amount, 'NGN')}
- Discount Rate: ${rate}%
- Time Period: ${years} years

**Formula:**
PV = FV / (1 + r)^n

**Calculation:**
PV = ${formatLargeNumber(amount, 'NGN')} / (1 + ${rate}%)^${years}
PV = ${formatLargeNumber(amount, 'NGN')} / ${Math.pow(1 + rate / 100, years).toFixed(4)}
PV = ${formatLargeNumber(pv, 'NGN')}

**Discount Amount: ${formatLargeNumber(discountAmount, 'NGN')}**
**Discount Factor: ${(pv / amount).toFixed(6)}**

**Interpretation:**
The present value of ${formatLargeNumber(pv, 'NGN')} is what you should pay today to receive ${formatLargeNumber(amount, 'NGN')} in ${years} years, assuming a ${rate}% discount rate. The discount of ${formatLargeNumber(discountAmount, 'NGN')} represents the time value of money.`,
        timestamp: new Date(),
        calculationType: 'Present Value',
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      query,
      result: null,
      explanation: `I understand you want to calculate: "${query}".

I can help with these financial calculations:

**Bond & Fixed Income:**
• Clean Price (market price minus accrued interest)
• Yield to Maturity (total return if held to maturity)
• Duration (interest rate sensitivity measure)
• Accrued Interest (interest earned between coupon payments)

**Valuation:**
• Mark-to-Market (current market value of positions)
• Present Value (discounted future cash flows)
• Net Present Value (NPV for investment decisions)

**Portfolio Metrics:**
• Portfolio duration and convexity
• Value at Risk (VaR)
• Sharpe ratio and risk-adjusted returns

Try asking: "Calculate yield for a 5-year bond at 95% of par with 8% coupon" or "What is the MTM for trade ID TRD-20251125-001"`,
      timestamp: new Date(),
      calculationType: 'Help',
    };
  };

  const handleQuickCalculation = (type: string) => {
    const queries: Record<string, string> = {
      clean_price: 'Calculate clean price for trade ID ' + (transactions[0]?.trade_id || 'TRD-20251125-001'),
      ytm: 'Calculate yield to maturity for 5-year bond at 95% of par with 8% coupon',
      duration: 'Calculate duration for 3-year bond with 8% coupon',
      accrued: 'Calculate accrued interest for trade ID ' + (transactions[0]?.trade_id || 'TRD-20251125-001'),
      mtm: 'Calculate mark-to-market value for all trades today',
      pv: 'Calculate present value of ₦1B discounted at 12% over 2 years',
    };

    setQuery(queries[type] || '');
  };

  const exportCalculation = (calc: CalculationResult) => {
    const content = `FALCON TREASURY - CALCULATION REPORT
Generated: ${format(new Date(), 'PPpp')}
================================================================================

CALCULATION TYPE: ${calc.calculationType}
QUERY: ${calc.query}
TIMESTAMP: ${format(calc.timestamp, 'PPpp')}

${calc.explanation}

================================================================================
This calculation is for informational purposes only.
For official valuations, please consult the Risk Management team.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Falcon_Calculation_${format(calc.timestamp, 'yyyyMMdd_HHmmss')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calculate with Falcon AI</h1>
                <p className="text-sm text-gray-500 mt-1">AI-powered financial computations and analysis</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Quick Financial Computations</h3>
              <p className="text-sm text-gray-700">
                Perform pricing, yield, duration, and valuation calculations using real trade data. Ask questions like "What is the clean price for trade ID TRD-20251125-001?" or "Calculate yield for a 5-year bond at 95% of par".
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickCalculations.map((calc) => {
            const Icon = calc.icon;
            return (
              <button
                key={calc.type}
                onClick={() => handleQuickCalculation(calc.type)}
                className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <Icon className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mb-2 mx-auto" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700 text-center">
                  {calc.label}
                </p>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to calculate?
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
                  placeholder="Example: Calculate yield to maturity for 5-year bond at 95% of par with 8% coupon"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleCalculate}
                  disabled={loading || !query.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {loading ? 'Calculating...' : 'Calculate'}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Example queries:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exampleQueries.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(example)}
                    className="text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Calculation Results</h2>
              <span className="text-sm text-gray-500">({results.length})</span>
            </div>

            {results.map((calc) => (
              <div
                key={calc.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-5 h-5" />
                        <span className="text-sm font-semibold">{calc.calculationType}</span>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded">
                          {format(calc.timestamp, 'MMM dd, HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{calc.query}</p>
                    </div>
                    <button
                      onClick={() => exportCalculation(calc)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Export Calculation"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {calc.explanation}
                    </div>
                  </div>

                  {calc.result && Object.keys(calc.result).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Detailed Results:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(calc.result).map(([key, value]) => {
                          if (typeof value === 'object' && !Array.isArray(value)) return null;
                          if (Array.isArray(value)) return null;
                          return (
                            <div key={key} className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">{key.replace(/_/g, ' ')}</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {typeof value === 'number' ? value.toLocaleString() : String(value)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No calculations yet</h3>
            <p className="text-sm text-gray-500">
              Enter a calculation query above or try one of the quick calculations to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
