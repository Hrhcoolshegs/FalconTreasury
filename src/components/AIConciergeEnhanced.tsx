import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles, Play, Minimize2, Maximize2 } from 'lucide-react';
import { workflows } from '../data/workflowData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; workflowId?: string; action?: string }>;
}

const knowledgeBase: Record<string, string> = {
  'liquidity forecast': 'Based on the latest ML models:\n\n• 7-day forecast: ₦27.8B (confidence: 92%)\n• 14-day forecast: ₦28.5B (confidence: 85%)\n• 30-day forecast: ₦29.2B (confidence: 78%)\n• Current buffer: 31.5% (healthy)\n\nThe liquidity position looks stable with adequate buffers across all timeframes.',

  'limit': 'I found 3 counterparties with exposure utilization above 90%:\n\n• Zenith Bank: 95.0% (₦950M / ₦1B)\n• Access Bank: 92.3% (₦738M / ₦800M)\n• FirstBank: 91.8% (₦825M / ₦900M)\n\nRecommendation: Review limits or reduce exposure to avoid breaches.',

  'settlement delays': 'Settlement Analysis (Last 30 Days):\n\n• Average confirmation time: 2.3 hours\n• On-time settlement rate: 94.2%\n• Delayed settlements: 8 trades (₦2.4B)\n• Failed settlements: 2 trades (₦450M)\n\nTop causes: Documentation issues (50%), System delays (30%), Counterparty issues (20%)',

  'risk exposure': 'Current Risk Overview:\n\n• Total Exposure: ₦60.4B\n• VaR (95%): ₦6.9B\n• Composite Risk Score: 68.5/100\n• High-risk counterparties: 5\n• Credit concentration: Top 3 = 68%\n\nRisk profile is within acceptable limits but concentration is elevated.',

  'sentiment analysis': 'Sentiment Intelligence Summary:\n\n• Total counterparties: 50\n• Quadrant 1 (High/High): 12 (24%)\n• Quadrant 2 (Low/High): 8 (16%)\n• Quadrant 3 (Low/Low): 15 (30%)\n• Quadrant 4 (High/Low): 15 (30%)\n\nFocus on Q2 (low likelihood, high fit) for conversion opportunities.',

  'product performance': 'Product Performance (MTD):\n\n• Money Market: ₦320M P&L (2.8x ratio)\n• FX Spot: ₦140M P&L (2.3x ratio)\n• FX Forward: ₦165M P&L (2.5x ratio)\n• T-Bills: ₦75M P&L (1.8x ratio)\n• Bonds: ₦65M P&L (1.9x ratio)\n\nMoney Market is the top performer.',

  'counterparty': 'Counterparty Overview:\n\n• Total active: 50 counterparties\n• Banks: 35 (70%)\n• Corporates: 10 (20%)\n• Asset Managers: 5 (10%)\n• Average exposure: ₦1.2B\n• KYC expiring <30 days: 3\n\nAll counterparties are in good standing.',

  'workflows': 'Active Workflows:\n\n• Total: 24 workflows\n• Automated: 15 (62.5%)\n• Manual: 9 (37.5%)\n• Avg completion: 87.5%\n• Avg execution time: 4.2 seconds\n\nWorkflow efficiency is strong across the platform.',

  'attribution': 'P&L Attribution (MTD):\n\n• Top Desk: FX Desk A (₦285M)\n• Top Trader: Aisha Bello (₦142M)\n• Top Product: Money Market (₦320M)\n• Top Counterparty: FirstBank (₦95M)\n\nStrong performance across all dimensions.',

  'prediction': 'ML Predictions:\n\n• Liquidity shortage risk: 12% (low)\n• Default probability (30d): 0.8% (very low)\n• Trade volume forecast: +15% next month\n• Settlement delays: -5% improvement expected\n\nPositive outlook across key metrics.',

  'fx spot': 'FX Spot Performance:\n\n• Trades YTD: 1,245\n• Volume: ₦45.2B\n• P&L: ₦140M\n• Market share: 15.8%\n• Settlement success: 96.2%\n• Avg confirmation: 2.1 hours\n\nSolid performance with room for volume growth.',

  'fx forward': 'FX Forward Performance:\n\n• Trades YTD: 876\n• Volume: ₦38.7B\n• P&L: ₦165M\n• Market share: 18.3%\n• Settlement success: 95.8%\n• Avg confirmation: 2.5 hours\n\nHighest market share among products.',

  'money market': 'Money Market Performance:\n\n• Trades YTD: 2,134\n• Volume: ₦120.5B\n• P&L: ₦320M\n• Market share: 22.4%\n• Settlement success: 97.1%\n• Profitability ratio: 2.8x\n\nTop performing product line.',

  't-bills': 'T-Bills Performance:\n\n• Trades YTD: 645\n• Volume: ₦28.3B\n• P&L: ₦75M\n• Market share: 12.1%\n• Settlement success: 98.5%\n• Capacity utilization: 45%\n\nRoom for growth; operating below capacity.',

  'bonds': 'Bonds Performance:\n\n• Trades YTD: 423\n• Volume: ₦22.8B\n• P&L: ₦65M\n• Market share: 10.9%\n• Settlement success: 97.8%\n• Duration profile: 5.2 years\n\nStable performance with low risk.',

  'compliance': 'Compliance Status:\n\n• KYC complete: 50/50 (100%)\n• AML checks current: 100%\n• Sanctions screening: All clear\n• PEP exposure: 0 counterparties\n• Regulatory filings: Up to date\n• Audit findings: 0 open items\n\nFull compliance across all areas.',

  'reports': '16 Report Templates Available:\n\n• Daily: 5 reports\n• Weekly: 6 reports\n• Monthly: 5 reports\n\nCategories: Treasury, Risk, Operations, Compliance, Analytics, Management\n\nAll reports can be generated on-demand or scheduled.',

  'insights': 'Recent Insights:\n\n• Alerts: 4 active\n• Opportunities: 5 identified\n• Recommendations: 6 pending\n• Achievements: 3 this week\n\nTotal: 20 insights across all categories.',

  'knowledge': 'Knowledge Centre:\n\n• Total articles: 15\n• Guides: 9\n• Videos: 2\n• Documents: 3\n• FAQs: 1\n\nAll documentation is current and accessible.',

  'behavior': 'Behavior Analytics:\n\n• Pattern changes detected: 8\n• Seasonal trends: 4\n• Anomalies: 2 (low risk)\n• Trading time shifts: 3 counterparties\n• Volume variations: Within normal range\n\nNo concerning behavioral patterns.',

  'treasury': 'Treasury Overview:\n\n• Total P&L: ₦765M MTD\n• Revenue: ₦2.1B\n• Avg margin: 36.4%\n• Total trades: 4,870\n• Settlement success: 96.8%\n\nStrong overall treasury performance.',

  'overview': 'Dashboard Summary:\n\n• All modules: Operational\n• Data freshness: Real-time\n• System health: 99.2%\n• Active users: 42\n• Last update: 2 minutes ago\n\nPlatform running smoothly.',

  'firstbank': 'FirstBank Profile:\n\n• Exposure: ₦850M (85% utilization)\n• Rating: A (internal), AA- (external)\n• Trades YTD: 145\n• Volume: ₦15B\n• Settlement: 92.5% reliability\n• Products: FX Spot, FX Forward, MM\n\nTop-tier counterparty.',

  'access bank': 'Access Bank Profile:\n\n• Exposure: ₦720M (72% utilization)\n• Rating: A (internal), A+ (external)\n• Trades YTD: 132\n• Volume: ₦13.5B\n• Settlement: 94.2% reliability\n• Products: FX Spot, MM, T-Bills\n\nExcellent relationship.',

  'zenith': 'Zenith Bank Profile:\n\n• Exposure: ₦950M (95% utilization)\n• Rating: B+ (internal), BBB+ (external)\n• Trades YTD: 156\n• Volume: ₦16.2B\n• Settlement: 88.5% reliability\n• Products: FX Spot, FX Forward, Bonds\n\nApproaching limit; monitor closely.',

  'gtbank': 'GTBank Profile:\n\n• Exposure: ₦680M (68% utilization)\n• Rating: A+ (internal), AA (external)\n• Trades YTD: 128\n• Volume: ₦14.8B\n• Settlement: 95.7% reliability\n• Products: All products\n\nDiversified, reliable partner.',

  'uba': 'UBA Profile:\n\n• Exposure: ₦750M (75% utilization)\n• Rating: A (internal), A (external)\n• Trades YTD: 118\n• Volume: ₦12.3B\n• Settlement: 93.8% reliability\n• Products: FX Spot, MM, T-Bills\n\nConsistent performer.',

  'stanbic': 'Stanbic Profile:\n\n• Exposure: ₦620M (62% utilization)\n• Rating: A+ (internal), AA- (external)\n• Trades YTD: 98\n• Volume: ₦9.8B\n• Settlement: 96.4% reliability\n• Products: FX Forward, Bonds\n\nStrong settlement record.',

  'market share': 'Market Share by Product:\n\n• Money Market: 22.4% (#1)\n• FX Forward: 18.3% (#2)\n• FX Spot: 15.8% (#3)\n• T-Bills: 12.1% (#4)\n• Bonds: 10.9% (#5)\n\nStrong positions across portfolio.',

  'kyc': 'KYC Status:\n\n• Complete: 50/50\n• Expiring <30 days: 3\n• Expiring 30-60 days: 5\n• Expiring 60-90 days: 7\n• Current: 35\n\nSchedule renewals for expiring KYC.',

  'aml': 'AML Status:\n\n• All counterparties: Clear\n• Sanctions screening: Current\n• PEP checks: Complete\n• Transaction monitoring: Active\n• Suspicious activity: 0 reports\n\nFull AML compliance maintained.',

  'stress test': 'Stress Test Results:\n\n• Scenario 1 (Market shock): Pass\n• Scenario 2 (Liquidity crisis): Pass\n• Scenario 3 (Credit event): Pass\n• Scenario 4 (Combined): Warning\n• Capital adequacy: 125% (target: 120%)\n\nResilience confirmed under most scenarios.',

  'trade id': 'Trade Lookup:\n\nTo find a specific trade, provide the trade ID format: TRD-YYYYMMDD-XXX\n\nExample: "Show me trade ID TRD-20251125-001"\n\nI can provide:\n• Complete trade details\n• Current status and settlement\n• P&L and MTM valuation\n• Counterparty information\n• Confirmation status\n• Related transactions',

  'calculate': 'Financial Calculations Available:\n\n**Navigate to Analytics & Intelligence > Calculate with Falcon AI**\n\nI can help calculate:\n• Clean Price (market price - accrued interest)\n• Yield to Maturity (total return if held)\n• Duration (interest rate sensitivity)\n• Accrued Interest (interest earned between coupons)\n• Mark-to-Market (current position value)\n• Present Value (discounted cash flows)\n\nExample: "Calculate yield for 5-year bond at 95% of par"',

  'how do i': 'Training & Guidance:\n\n**Visit Knowledge Centre for step-by-step guides:**\n\n• How to create a counterparty\n• How to book a new trade\n• How to generate custom reports\n• How to launch workflows\n• How to use Calculate with Falcon AI\n• How to monitor settlements\n• How to manage exposures\n\nAll guides include screen references, field explanations, and error resolution tips.',

  'help': 'Falcon AI Help:\n\n**I can assist with:**\n\n1. **Data & Metrics**: Ask about any treasury metric\n   - Example: "What is our total exposure?"\n\n2. **Calculations**: Request financial computations\n   - Example: "Calculate duration for 3-year bond"\n\n3. **Reports**: Generate custom reports\n   - Example: "Show trades with FirstBank this month"\n\n4. **Workflows**: Launch automation\n   - Example: "Run limit breach workflow"\n\n5. **Training**: Get step-by-step guidance\n   - Example: "How do I book a trade?"\n\n6. **Analysis**: Get insights and recommendations\n   - Example: "Analyze settlement performance"\n\nFor detailed help, visit the Knowledge Centre.',

  'report': 'Custom Report Generation:\n\n**Quick Report Examples:**\n• "Generate trades report for today"\n• "Show all high-risk counterparties"\n• "Create P&L report by trader this month"\n• "Export exposure report by sector"\n• "List pending settlements"\n\n**Navigate to Reports Module:**\n- Use Natural Language Builder\n- Or Visual Report Builder\n- Save templates for reuse\n- Schedule automatic delivery\n- Export as CSV, PDF, or Excel\n\nI can also guide you through creating complex reports!',

  'clean price': 'Clean Price Calculation:\n\n**What it is:**\nBond price excluding accrued interest\n\n**Formula:**\nClean Price = Dirty Price - Accrued Interest\n\n**To Calculate:**\nNavigate to: Analytics & Intelligence > Calculate with Falcon AI\n\nQuery: "What is the clean price for trade ID TRD-20251125-001?"\n\nSystem will:\n• Pull trade data automatically\n• Calculate accrued interest\n• Compute clean price\n• Show as % of par\n• Provide detailed explanation\n\n**Use Cases:**\n- Bond pricing quotes\n- Portfolio valuation\n- Trade booking reference\n- Performance measurement',

  'yield': 'Yield to Maturity (YTM):\n\n**Definition:**\nTotal return anticipated if bond held until maturity\n\n**To Calculate:**\nGo to: Analytics & Intelligence > Calculate with Falcon AI\n\nExample Query:\n"Calculate yield for 5-year bond at 95% of par with 8% coupon"\n\n**What You Get:**\n• YTM percentage\n• Step-by-step calculation\n• Comparison to coupon rate\n• Premium/discount analysis\n• Investment implications\n\n**Key Insights:**\n- YTM > Coupon = Bond at discount\n- YTM < Coupon = Bond at premium\n- YTM = Coupon = Bond at par',

  'duration': 'Duration Calculation:\n\n**What it measures:**\nBond price sensitivity to interest rate changes\n\n**Types:**\n• Macaulay Duration: Weighted average time to cash flows\n• Modified Duration: Price change for 1% rate change\n\n**To Calculate:**\nNavigate: Analytics & Intelligence > Calculate with Falcon AI\n\nExample: "Calculate duration for 3-year bond with 8% coupon"\n\n**Result includes:**\n• Duration in years\n• Interest rate risk level\n• Price volatility estimate\n• Portfolio management insights\n\n**Risk Categories:**\n- Duration < 3 years: Low risk\n- Duration 3-5 years: Moderate risk\n- Duration > 5 years: High risk',

  'mtm': 'Mark-to-Market Valuation:\n\n**Current MTM Status:**\n• Total portfolio MTM updated real-time\n• Unrealized P&L tracked daily\n• Position-level valuations\n• Currency-specific exposures\n\n**To Calculate:**\nGo to: Analytics & Intelligence > Calculate with Falcon AI\n\nQuery: "Calculate MTM for all trades today"\n\nOr ask: "What is the MTM for trade ID TRD-20251125-001?"\n\n**MTM Components:**\n- Current market prices\n- Exchange rate movements\n- Interest rate changes\n- Credit spread adjustments\n\n**View Full MTM:**\nDashboard > Treasury Overview > MTM section',

  'settlement': 'Settlement Monitoring:\n\n**Current Status:**\n• Average confirmation time: 2.3 hours\n• On-time settlement rate: 94.2%\n• Pending settlements tracked real-time\n• Failed trades flagged immediately\n\n**Common Delays:**\n1. Documentation issues (50%)\n2. System delays (30%)\n3. Counterparty issues (20%)\n\n**To Monitor:**\n- Dashboard > Settlement panel\n- Transactions > Filter by "Pending"\n- Workflow > Settlement Monitoring\n\n**Get Alerts:**\nWorkflows auto-trigger for:\n• Delays beyond 4 hours\n• Failed settlements\n• Missing confirmations\n• Unmatched payments',

  'book trade': 'Booking a New Trade:\n\n**Quick Steps:**\n1. Navigate to Transactions module\n2. Click "+ Book New Trade"\n3. Select product type\n4. Enter counterparty and amounts\n5. Set dates and rates\n6. Review and submit\n\n**For Detailed Guide:**\nKnowledge Centre > "How to Book a New Trade"\n\n**Includes:**\n• Screen-by-screen walkthrough\n• Field explanations\n• Validation rules\n• Common errors and solutions\n• Post-booking actions\n\n**Quick Validation:**\n- Counterparty limit available?\n- Valid business day?\n- Rate within tolerance?\n- Settlement accounts active?',

  'create counterparty': 'Creating a New Counterparty:\n\n**Quick Process:**\n1. Go to Counterparties module\n2. Click "+ Add Counterparty"\n3. Complete 8-step form:\n   - Basic Information\n   - Credit Assessment\n   - Contact Details\n   - Trading Parameters\n   - Compliance Details\n   - Review & Submit\n\n**For Complete Guide:**\nKnowledge Centre > "How to Create a New Counterparty"\n\n**Detailed guide includes:**\n• Required vs optional fields\n• Field-by-field explanations\n• Compliance requirements\n• Validation rules\n• Error resolution\n• Approval workflow\n\n**Prerequisites:**\n- KYC documentation\n- Credit approval\n- Risk assessment\n- Sanctions screening',

  'limit breach': 'Limit Breach Management:\n\n**Current Breaches:**\n• Zenith Bank: 95.0% utilization\n• Access Bank: 92.3% utilization\n• FirstBank: 91.8% utilization\n\n**Breach Levels:**\n• 90-94%: Warning (monitor closely)\n• 95-99%: Critical (immediate action)\n• 100%+: Breach (trading stopped)\n\n**Automatic Actions:**\n- Alerts sent to Risk Management\n- Trading desk notified\n- Breach report generated\n- Limit review triggered\n\n**To Launch Workflow:**\nSay: "Launch limit breach workflow"\n\nOr navigate: Workflows > Limit Breach Notification\n\n**Resolution Options:**\n- Increase counterparty limit\n- Reduce exposure\n- Close out positions\n- Request collateral',

  'exposure': 'Exposure Management:\n\n**Current Exposure:**\n• Total: ₦60.4B across 50 counterparties\n• Avg utilization: 67.5%\n• High utilization (>90%): 3 counterparties\n• Concentration (Top 3): 68%\n\n**By Sector:**\n• Banks: ₦42.3B (70%)\n• Corporates: ₦12.1B (20%)\n• Asset Managers: ₦4.8B (8%)\n• Others: ₦1.2B (2%)\n\n**Risk Metrics:**\n• VaR (95%): ₦6.9B\n• Composite risk score: 68.5/100\n• Credit concentration within limits\n\n**To Monitor:**\n- Dashboard > Exposure Overview\n- Counterparties > Sort by utilization\n- Reports > Monthly Exposure Report\n\n**Real-time tracking ensures compliance with all limits.**',

  'p&l': 'Profit & Loss Analysis:\n\n**Current P&L (MTD):**\n• Total: ₦765M\n• Daily average: ₦28.3M\n• Winning trades: 73%\n• Avg margin: 36.4 bps\n\n**By Product:**\n• Money Market: ₦320M (highest)\n• FX Forward: ₦165M\n• FX Spot: ₦140M\n• T-Bills: ₦75M\n• Bonds: ₦65M\n\n**By Desk:**\n• FX Desk A: ₦285M\n• MM Desk: ₦320M\n• FX Desk B: ₦190M\n\n**Top Traders:**\n1. Aisha Bello: ₦142M\n2. Emeka Okonkwo: ₦118M\n3. Fatima Yusuf: ₦95M\n\n**View Detailed P&L:**\n- Dashboard > Product Performance\n- Reports > Weekly P&L Report\n- Analytics > Attribution Engine',

  'training': 'Training & Support:\n\n**Knowledge Centre:**\n20+ comprehensive guides covering:\n• System navigation\n• Trade booking procedures\n• Counterparty management\n• Report generation\n• Workflow automation\n• Financial calculations\n• Compliance processes\n• Risk management\n\n**Guide Types:**\n• Step-by-step tutorials\n• Video simulations\n• Screen references\n• Field explanations\n• Troubleshooting tips\n• Best practices\n\n**Access Training:**\nNavigate to Knowledge Centre module\n\nOr ask me:\n• "How do I book a trade?"\n• "How do I create a counterparty?"\n• "How do I generate reports?"\n• "How do I use workflows?"\n\nI\'ll guide you through any process!',

  'workflow': 'Automated Workflows:\n\n**24 Active Workflows:**\n• 15 Automated (62.5%)\n• 9 Manual trigger\n• Avg execution: 4.2 seconds\n• Success rate: 98.7%\n\n**Popular Workflows:**\n1. Limit Breach Notification\n2. Trade Confirmation Follow-up\n3. Settlement Monitoring\n4. KYC Renewal Reminder\n5. Daily Reconciliation\n\n**To Launch:**\nSay: "Launch [workflow name]"\nExample: "Run daily reconciliation"\n\nOr navigate: Workflows module\n\n**Benefits:**\n• 24/7 monitoring\n• Instant notifications\n• Automatic escalation\n• Audit trail\n• Time savings\n\n**For Details:**\nKnowledge Centre > "Understanding Workflow Automation"',

  'api': 'API & Integrations:\n\n**Falcon Treasury API:**\n• RESTful API architecture\n• JWT authentication\n• Real-time data access\n• Webhook support\n• Rate limiting: 1000 req/min\n\n**Available Endpoints:**\n• /trades - Trade operations\n• /counterparties - CP management\n• /exposure - Exposure data\n• /reports - Report generation\n• /workflows - Workflow triggers\n\n**Common Integrations:**\n• Swift for confirmations\n• RTGS for settlements\n• Market data feeds\n• Accounting systems\n• Risk platforms\n\n**Documentation:**\nNavigate to Settings > API Documentation\n\nOr contact: api-support@falcon.ng',

  'dashboard': 'Dashboard Overview:\n\n**Real-time Metrics:**\n• Treasury overview with key metrics\n• Product performance analysis\n• Risk exposure monitoring\n• Settlement tracking\n• Liquidity positions\n• P&L summary\n\n**Customization:**\n• Drag-and-drop widgets\n• Custom date ranges\n• Filter by product/desk\n• Export to Excel/PDF\n• Set alerts and thresholds\n\n**Quick Actions:**\n• Book new trade\n• View exposures\n• Check settlements\n• Run workflows\n• Generate reports\n\n**Dashboard Updates:**\n- Real-time (trades, exposures)\n- Every 5 min (settlements)\n- Hourly (analytics)\n- Daily (reports)\n\nAll modules accessible from dashboard navigation.',
};

export default function AIConciergeEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Falcon AI, your intelligent treasury assistant. I have comprehensive knowledge of:\n\n• All 50 counterparties with complete profiles\n• 5 product lines (FX Spot, FX Forward, MM, T-Bills, Bonds)\n• 24 automated workflows\n• Real-time risk metrics and exposures\n• Liquidity forecasting with ML predictions\n• Settlement analytics and performance\n• Compliance status (KYC, AML, Sanctions)\n• Market intelligence and trends\n• Financial calculations (yields, duration, pricing)\n• Custom report generation\n• Training and how-to guidance\n\nAsk me anything about your treasury operations, request calculations, generate reports, or get help with system functions.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  const suggestedActions = [
    { label: 'Check liquidity forecast', query: 'What is the liquidity forecast?' },
    { label: 'Review limit breaches', query: 'Show me limit breaches' },
    { label: 'Analyze settlement delays', query: 'Analyze settlement delays' },
    { label: 'Product performance', query: 'Show product performance' },
    { label: 'Check compliance status', query: 'What is our compliance status?' },
    { label: 'FirstBank details', query: 'Tell me about FirstBank' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    const rect = chatRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isMaximized) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const response = generateResponse(inputValue);
      setMessages(prev => [...prev, response]);
    }, 800);
  };

  const generateResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();

    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lowerQuery.includes(key)) {
        const actions: Array<{ label: string; workflowId?: string }> = [];

        if (key === 'limit breach') {
          actions.push({ label: 'Launch Limit Breach Workflow', workflowId: 'WF-001' });
        } else if (key === 'liquidity forecast') {
          actions.push({ label: 'Run Stress Test', workflowId: 'WF-003' });
        } else if (key === 'settlement delays') {
          actions.push({ label: 'Launch Follow-up Workflow', workflowId: 'WF-002' });
        }

        return {
          id: Date.now().toString(),
          role: 'assistant',
          content: value,
          timestamp: new Date(),
          actions: actions.length > 0 ? actions : undefined,
        };
      }
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I understand you're asking about "${query}". While I don't have a specific pre-configured response, I can help you with:\n\n• Treasury operations analysis\n• Risk and exposure monitoring\n• Liquidity forecasting\n• Counterparty intelligence\n• Product performance\n• Compliance checks\n• Workflow automation\n\nTry asking about specific counterparties, products, or metrics for detailed information.`,
      timestamp: new Date(),
    };
  };

  const handleWorkflowLaunch = (workflowId: string) => {
    const workflow = workflows.find(w => w.workflow_id === workflowId);
    if (!workflow) return;

    const confirmMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✅ Workflow "${workflow.name}" launched successfully.\n\nExecution ID: EXE-${Date.now()}\nStatus: Running\nEstimated completion: 2-5 seconds\n\nI'll notify you when it completes.`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, confirmMessage]);

    setTimeout(() => {
      const completionMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ Workflow "${workflow.name}" completed successfully.\n\nExecution time: 3.2 seconds\nActions taken: ${workflow.steps.length}\nStatus: Completed\n\nAll tasks have been processed.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, completionMessage]);
    }, 3200);
  };

  if (!isOpen) {
    return (
      <>
        <style>
          {`
            @keyframes heartbeat {
              0%, 100% {
                transform: scale(1);
              }
              25% {
                transform: scale(1.15);
              }
              50% {
                transform: scale(1);
              }
            }
            @keyframes pulse-glow {
              0%, 100% {
                box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3);
              }
              50% {
                box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5);
              }
            }
            .heartbeat-button {
              animation: heartbeat 2s ease-in-out infinite, pulse-glow 2s ease-in-out infinite;
            }
          `}
        </style>
        <button
          onClick={() => setIsOpen(true)}
          className="heartbeat-button fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all z-50"
        >
          <Sparkles className="w-7 h-7" />
        </button>
      </>
    );
  }

  const chatStyle = isMaximized
    ? { width: '100vw', height: '100vh', top: 0, left: 0 }
    : {
        width: '480px',
        height: '700px',
        bottom: '24px',
        right: '24px',
        ...(position.x !== 0 || position.y !== 0
          ? { left: position.x, top: position.y, bottom: 'auto', right: 'auto' }
          : {}),
      };

  return (
    <div
      ref={chatRef}
      className="fixed bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200"
      style={chatStyle}
    >
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Falcon AI</h3>
            <p className="text-xs text-white/80">Your Intelligent Treasury Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:bg-white/10 rounded"
          >
            {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => action.workflowId && handleWorkflowLaunch(action.workflowId)}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs mt-2 opacity-60">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500 mb-2 font-medium">Try asking:</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(action.query);
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-left px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg text-xs text-gray-700 transition-all border border-blue-200"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
