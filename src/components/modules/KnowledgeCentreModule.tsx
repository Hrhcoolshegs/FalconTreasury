import { useState } from 'react';
import { BookOpen, Search, FileText, Video, Download, ExternalLink, Tag, Clock, TrendingUp, Award, Shield, Users, DollarSign } from 'lucide-react';

interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  type: 'guide' | 'video' | 'document' | 'faq';
  description: string;
  content: string;
  tags: string[];
  readTime: number;
  lastUpdated: string;
  views: number;
  downloads?: number;
}

const knowledgeBase: KnowledgeArticle[] = [
  {
    id: 'KB-001',
    title: 'How to Create a New Counterparty in Falcon',
    category: 'Training',
    type: 'guide',
    description: 'Step-by-step guide to onboarding a new counterparty with complete KYC documentation',
    content: `**Step-by-Step Process:**

**Step 1: Navigate to Counterparties Module**
- Click on "Counterparties" in the main navigation menu
- You'll see the counterparty management screen with existing counterparties

**Step 2: Click "Add New Counterparty"**
- Find the "+ Add Counterparty" button in the top-right corner
- Click to open the counterparty creation form

**Step 3: Enter Basic Information**
- **Counterparty Name**: Full legal entity name (e.g., "Access Bank PLC")
- **Short Name**: Abbreviated name for quick reference (e.g., "Access")
- **Sector**: Select from dropdown (Bank, Corporate, Asset Manager, etc.)
- **Country**: Select primary country of operation
- **Region**: Geographic region (e.g., "West Africa")
- **City**: Primary office location

**Step 4: Complete Credit Assessment**
- **Internal Rating**: Assign rating from AAA to D based on internal analysis
- **External Rating**: Enter rating from recognized agency (e.g., "AA-")
- **Risk Category**: Select Low, Medium, or High based on assessment
- **Exposure Limit (NGN)**: Set maximum exposure in Naira
- **Exposure Limit (USD)**: Set maximum exposure in US Dollars

**Step 5: Add Contact Information**
- **Primary Contact Name**: Full name of main contact person
- **Contact Email**: Business email address
- **Contact Phone**: Direct phone number with country code
- **Relationship Manager**: Assign internal RM from dropdown

**Step 6: Configure Trading Parameters**
- **Product Mix**: Select tradeable products (FX Spot, FX Forward, MM, T-Bills, Bonds)
- **Preferred Settlement**: Choose T+0, T+1, or T+2
- **Desk Assignment**: Assign to appropriate trading desk

**Step 7: Complete Compliance Details**
- **Legal Entity Identifier (LEI)**: 20-character LEI code
- **SWIFT Code**: 8 or 11-character BIC code
- **Bank Sort Code**: Local banking identification code
- **KYC Status**: Mark as "Complete" after verification
- **KYC Expiry Date**: Set renewal date (typically 1 year from now)
- **AML Status**: Confirm "Clear" after AML checks
- **PEP Status**: Check if counterparty is a Politically Exposed Person
- **Sanction Status**: Confirm "Clear" after sanctions screening

**Step 8: Review and Submit**
- Review all entered information for accuracy
- Click "Submit" to create the counterparty
- System will validate all required fields
- Confirmation message will appear upon successful creation

**Important Notes:**
- All fields marked with (*) are mandatory
- KYC documentation must be uploaded before activation
- Credit limits must be approved by Risk Management
- Changes to approved counterparties require authorization

**Common Errors and Solutions:**
- "LEI already exists": Check if counterparty was previously registered
- "Invalid SWIFT Code": Verify format is 8 or 11 alphanumeric characters
- "Exposure limit exceeds global limit": Contact Risk Management for approval`,
    tags: ['Training', 'Counterparties', 'Onboarding', 'How-To'],
    readTime: 12,
    lastUpdated: '2025-11-27',
    views: 856,
  },
  {
    id: 'KB-002',
    title: 'Understanding the Sentiment Intelligence 5×5 Grid',
    category: 'Analytics',
    type: 'guide',
    description: 'Learn how to interpret and use the Likelihood × Fit scoring matrix for counterparty intelligence',
    content: 'The Sentiment Intelligence Grid plots counterparties on two dimensions: Likelihood (probability of trade execution) and Fit (strategic alignment with your business). This creates 25 buckets that help prioritize engagement...',
    tags: ['Sentiment', 'Analytics', 'Counterparty'],
    readTime: 8,
    lastUpdated: '2025-11-20',
    views: 342,
  },
  {
    id: 'KB-002',
    title: 'FX Spot Trading Best Practices',
    category: 'Trading',
    type: 'guide',
    description: 'Essential guidelines for executing FX Spot trades efficiently and managing settlement risk',
    content: 'FX Spot transactions require immediate settlement (T+0 or T+1). Key considerations include: pricing accuracy, confirmation speed, settlement reliability, and counterparty credit limits...',
    tags: ['FX Spot', 'Trading', 'Best Practices'],
    readTime: 12,
    lastUpdated: '2025-11-18',
    views: 428,
  },
  {
    id: 'KB-003',
    title: 'Treasury Risk Management Framework',
    category: 'Risk Management',
    type: 'document',
    description: 'Comprehensive framework covering credit risk, market risk, liquidity risk, and operational risk',
    content: 'Our risk management framework follows a three-lines-of-defense model. First line: Business units own and manage risk. Second line: Risk function provides oversight...',
    tags: ['Risk', 'Framework', 'Compliance'],
    readTime: 25,
    lastUpdated: '2025-11-15',
    views: 256,
    downloads: 89,
  },
  {
    id: 'KB-004',
    title: 'How to Use the Attribution Engine',
    category: 'Analytics',
    type: 'video',
    description: 'Video walkthrough of P&L attribution by trader, desk, product, and counterparty',
    content: 'This video demonstrates how to analyze P&L attribution across multiple dimensions to identify top performers and optimization opportunities...',
    tags: ['Attribution', 'P&L', 'Analytics'],
    readTime: 15,
    lastUpdated: '2025-11-22',
    views: 183,
  },
  {
    id: 'KB-005',
    title: 'Money Market Operations Guide',
    category: 'Operations',
    type: 'guide',
    description: 'Step-by-step guide to Money Market trading, settlement, and reconciliation procedures',
    content: 'Money Market operations involve short-term lending and borrowing. Key products include: call deposits, fixed deposits, commercial paper, and repos...',
    tags: ['Money Market', 'Operations', 'Settlement'],
    readTime: 18,
    lastUpdated: '2025-11-12',
    views: 294,
  },
  {
    id: 'KB-006',
    title: 'KYC and AML Compliance Requirements',
    category: 'Compliance',
    type: 'document',
    description: 'Complete guide to Know Your Customer and Anti-Money Laundering procedures',
    content: 'All counterparties must complete KYC documentation before trading. Requirements include: identity verification, beneficial ownership disclosure, source of funds...',
    tags: ['KYC', 'AML', 'Compliance', 'Regulatory'],
    readTime: 20,
    lastUpdated: '2025-11-10',
    views: 512,
    downloads: 156,
  },
  {
    id: 'KB-007',
    title: 'Liquidity Forecasting and Management',
    category: 'Treasury',
    type: 'guide',
    description: 'Techniques for accurate liquidity forecasting and optimal cash position management',
    content: 'Effective liquidity management requires accurate forecasting of inflows and outflows. Key techniques include: historical analysis, scenario modeling, stress testing...',
    tags: ['Liquidity', 'Forecasting', 'Treasury'],
    readTime: 14,
    lastUpdated: '2025-11-08',
    views: 376,
  },
  {
    id: 'KB-008',
    title: 'Understanding Product Profitability Ratios',
    category: 'Financial Analysis',
    type: 'guide',
    description: 'How to calculate and interpret profitability metrics for different product lines',
    content: 'Profitability ratio = Revenue / Cost. This metric shows how efficiently each product generates profit. Ratios above 2.0x are considered strong...',
    tags: ['Profitability', 'P&L', 'Products'],
    readTime: 10,
    lastUpdated: '2025-11-06',
    views: 421,
  },
  {
    id: 'KB-009',
    title: 'Workflow Automation and SLA Management',
    category: 'Operations',
    type: 'guide',
    description: 'Optimize operational efficiency through workflow automation and service level agreements',
    content: 'Workflow automation reduces manual processing time and errors. Key areas for automation: trade confirmation, settlement matching, exception handling...',
    tags: ['Workflow', 'Automation', 'Efficiency'],
    readTime: 16,
    lastUpdated: '2025-11-04',
    views: 198,
  },
  {
    id: 'KB-010',
    title: 'Credit Rating Methodology',
    category: 'Credit Risk',
    type: 'document',
    description: 'Internal credit rating process and criteria for counterparty assessment',
    content: 'Our internal rating system uses a 10-point scale (AAA to D) combining quantitative and qualitative factors: financial strength, market position, management quality...',
    tags: ['Credit Rating', 'Risk', 'Methodology'],
    readTime: 22,
    lastUpdated: '2025-11-02',
    views: 287,
    downloads: 94,
  },
  {
    id: 'KB-011',
    title: 'T-Bills and Bonds Trading Procedures',
    category: 'Trading',
    type: 'guide',
    description: 'Guidelines for trading government securities including T-Bills and Bonds',
    content: 'Government securities trading requires understanding yield curves, duration, and settlement procedures. T-Bills are zero-coupon instruments...',
    tags: ['T-Bills', 'Bonds', 'Government Securities'],
    readTime: 15,
    lastUpdated: '2025-10-28',
    views: 234,
  },
  {
    id: 'KB-012',
    title: 'Frequently Asked Questions',
    category: 'General',
    type: 'faq',
    description: 'Common questions about Falcon Treasury platform features and operations',
    content: 'Q: How do I update counterparty limits? A: Navigate to Counterparties module, select the counterparty, and click Edit Limits...',
    tags: ['FAQ', 'Help', 'Support'],
    readTime: 5,
    lastUpdated: '2025-11-25',
    views: 1247,
  },
  {
    id: 'KB-013',
    title: 'Market Risk Measurement and VaR',
    category: 'Risk Management',
    type: 'guide',
    description: 'Understanding Value at Risk (VaR) and other market risk metrics',
    content: 'Value at Risk (VaR) estimates the potential loss in portfolio value over a defined period for a given confidence interval...',
    tags: ['Market Risk', 'VaR', 'Risk Metrics'],
    readTime: 19,
    lastUpdated: '2025-10-25',
    views: 312,
  },
  {
    id: 'KB-014',
    title: 'Settlement Failure Resolution',
    category: 'Operations',
    type: 'guide',
    description: 'Procedures for identifying, escalating, and resolving settlement failures',
    content: 'Settlement failures must be addressed immediately. Step 1: Identify root cause (system, counterparty, or documentation issue)...',
    tags: ['Settlement', 'Operations', 'Troubleshooting'],
    readTime: 11,
    lastUpdated: '2025-10-22',
    views: 189,
  },
  {
    id: 'KB-015',
    title: 'Predictive Analytics and ML Models',
    category: 'Analytics',
    type: 'video',
    description: 'How machine learning models predict liquidity needs, default risks, and trade volumes',
    content: 'Our ML models use historical data, market indicators, and behavioral patterns to generate predictions with confidence intervals...',
    tags: ['ML', 'Predictive', 'AI'],
    readTime: 20,
    lastUpdated: '2025-10-20',
    views: 267,
  },
  {
    id: 'KB-016',
    title: 'How to Book a New Trade in Falcon',
    category: 'Training',
    type: 'guide',
    description: 'Complete walkthrough for booking FX, MM, and Fixed Income trades',
    content: `**Step-by-Step Trade Booking Process:**

**Step 1: Navigate to Transactions Module**
- Click "Transactions" in main navigation
- Select "Book New Trade" or click the "+" button

**Step 2: Select Trade Type**
- Choose product: FX Spot, FX Forward, Money Market, T-Bills, or Bonds
- System will display relevant fields for selected product

**Step 3: Enter Trade Details**
- **Trade Date**: Select execution date (defaults to today)
- **Value Date**: Select settlement date (T+0, T+1, T+2)
- **Counterparty**: Search and select from approved list
- **Direction**: Buy or Sell
- **Currency Pair**: Select (e.g., USD/NGN for FX trades)

**Step 4: Enter Amounts**
- **Amount (NGN)**: Enter notional amount in Naira
- **Amount (USD)**: Enter USD equivalent
- **Exchange Rate**: System auto-calculates or enter manually
- **Interest Rate**: For MM/FI products, enter applicable rate

**Step 5: Trading Details**
- **Trader Name**: Select from dropdown or defaults to logged-in user
- **Desk**: Assign to appropriate desk
- **Book**: Select trading book for P&L allocation
- **Portfolio**: Assign to portfolio if applicable

**Step 6: Settlement Information**
- **Settlement Account (NGN)**: Select nostro account
- **Settlement Account (USD)**: Select USD account
- **Settlement Method**: RTGS, ACH, or Wire Transfer

**Step 7: Additional Information**
- **Notes**: Add any special instructions or comments
- **Reference Number**: External reference if applicable
- **Broker**: If trade executed through broker

**Step 8: Review and Submit**
- Review all details on confirmation screen
- Check amounts, dates, and counterparty information
- Click "Submit Trade"
- System generates unique Trade ID
- Confirmation sent to counterparty if automated

**Important Validations:**
- Counterparty must have sufficient available limit
- Value date must be valid business day
- Exchange rate must be within market tolerance (±2%)
- Settlement accounts must be active and verified

**Post-Booking Actions:**
- Trade appears in active trades list
- Confirmation workflow triggers automatically
- Exposure limits update in real-time
- P&L calculation begins
- Settlement monitoring starts

**Common Issues:**
- "Insufficient limit": Contact RM to increase counterparty limit
- "Invalid value date": Check calendar for holidays
- "Rate out of range": Verify current market rates`,
    tags: ['Training', 'Trading', 'Transactions', 'How-To'],
    readTime: 15,
    lastUpdated: '2025-11-27',
    views: 724,
  },
  {
    id: 'KB-017',
    title: 'How to Generate Custom Reports',
    category: 'Training',
    type: 'guide',
    description: 'Using natural language and visual builder to create custom treasury reports',
    content: `**Creating Custom Reports - Two Methods:**

**Method 1: Natural Language Query**

**Step 1**: Navigate to Reports module
**Step 2**: Click "Custom Report Builder" tab
**Step 3**: Enter query in natural language, for example:
  - "Show me all FX Spot trades with FirstBank in the last 30 days"
  - "Generate exposure report for high-risk counterparties this quarter"
  - "Create P&L report by trader for Money Market products"

**Step 4**: Click "Parse & Preview"
**Step 5**: System interprets query and shows parsed configuration
**Step 6**: Review filters, metrics, and date range
**Step 7**: Enter report name and description
**Step 8**: Click "Save Report Template"

**Method 2: Visual Builder**

**Step 1**: Click "Visual Builder" tab
**Step 2**: Select Report Type:
  - Transactions
  - Counterparties
  - Exposure
  - P&L Analysis
  - Compliance
  - Liquidity

**Step 3**: Select Metrics (check boxes):
  - Choose columns to include in report
  - Hold Ctrl/Cmd for multiple selections

**Step 4**: Set Date Range:
  - Use date picker or quick options
  - Options: Today, Last 7 Days, This Month, This Quarter, YTD

**Step 5**: Add Filters (optional):
  - Product Type
  - Counterparty
  - Trader/Desk
  - Amount thresholds
  - Risk category

**Step 6**: Configure Grouping:
  - Group by Product, Counterparty, Trader, or Desk
  - Multiple grouping levels supported

**Step 7**: Name and Save:
  - Enter descriptive report name
  - Add tags for easy searching
  - Mark as favorite if frequently used

**Running Saved Reports:**
- Navigate to Custom Reports section
- Select report from library
- Click "Generate" to run with current data
- Export as CSV, PDF, or Excel

**Scheduling Reports:**
- Open saved report
- Click "Schedule"
- Set frequency (Daily, Weekly, Monthly)
- Add email recipients
- Reports auto-generate and deliver

**Tips:**
- Use specific counterparty names for better parsing
- Include time periods ("last 30 days", "this quarter")
- Save frequently used reports as templates
- Use tags to organize report library`,
    tags: ['Training', 'Reports', 'How-To', 'Custom Reports'],
    readTime: 18,
    lastUpdated: '2025-11-27',
    views: 612,
  },
  {
    id: 'KB-018',
    title: 'Using Calculate with Falcon AI',
    category: 'Training',
    type: 'guide',
    description: 'Perform financial calculations using AI - pricing, yields, duration, and valuations',
    content: `**Financial Calculations Made Easy:**

**Accessing the Calculator:**
- Navigate to Analytics & Intelligence module
- Click "Calculate with Falcon AI" tab
- You'll see the calculation interface

**Available Calculations:**

**1. Clean Price Calculation**
Query: "What is the clean price for trade ID TRD-20251125-001?"
- Pulls real trade data automatically
- Calculates market price minus accrued interest
- Shows price as percentage of par
- Includes interpretation and reasoning

**2. Yield to Maturity**
Query: "Calculate yield for 5-year bond at 95% of par with 8% coupon"
- Computes total return if held to maturity
- Shows step-by-step calculation
- Compares YTM to coupon rate
- Explains discount/premium implications

**3. Duration Calculation**
Query: "Calculate duration for 3-year bond with 8% coupon"
- Computes Macaulay duration
- Calculates Modified duration
- Shows interest rate sensitivity
- Assesses interest rate risk level

**4. Accrued Interest**
Query: "Calculate accrued interest for trade ID TRD-20251125-002"
- Uses trade data from system
- Calculates interest since last coupon
- Shows day count convention
- Explains settlement implications

**5. Mark-to-Market Valuation**
Query: "What is the MTM for all FX trades today?"
- Aggregates current positions
- Values at current market prices
- Shows unrealized P&L
- Provides position analysis

**6. Present Value**
Query: "Calculate present value of ₦1B at 12% over 2 years"
- Discounts future cash flows
- Shows time value of money
- Calculates discount factor
- Explains investment implications

**Using Quick Calculations:**
- Click quick action buttons for common calculations
- System pre-fills query with latest trade data
- One-click calculation and results

**Exporting Calculations:**
- Each result has "Export" button
- Downloads detailed calculation report
- Includes all steps and reasoning
- Suitable for audit trails

**Calculation History:**
- All calculations saved automatically
- Review past calculations anytime
- Re-run with updated data
- Track calculation trends

**Tips for Best Results:**
- Reference specific trade IDs for accurate data
- Include all parameters (rate, years, coupon)
- Use exact product names
- Check calculation assumptions in results`,
    tags: ['Training', 'Calculations', 'AI', 'How-To', 'Falcon AI'],
    readTime: 14,
    lastUpdated: '2025-11-27',
    views: 489,
  },
  {
    id: 'KB-019',
    title: 'Understanding Workflow Automation',
    category: 'Training',
    type: 'guide',
    description: 'How to launch and monitor automated workflows for operational efficiency',
    content: `**Workflow Automation in Falcon:**

**Available Workflows:**

**1. Limit Breach Notification**
- Triggers when counterparty exceeds 90% utilization
- Sends alerts to Risk Management
- Escalates if breach exceeds 95%
- Auto-generates breach report

**2. Trade Confirmation Follow-up**
- Monitors pending confirmations
- Sends reminders after 4 hours
- Escalates unconfirmed trades
- Tracks confirmation rate

**3. Settlement Monitoring**
- Tracks settlement status real-time
- Flags delays beyond SLA
- Notifies operations team
- Triggers reconciliation workflow

**4. KYC Renewal Reminder**
- Identifies expiring KYC (30 days)
- Sends renewal reminders
- Tracks compliance status
- Generates renewal reports

**5. Daily Reconciliation**
- Auto-reconciles nostro accounts
- Identifies breaks and exceptions
- Generates reconciliation report
- Flags unmatched items

**Launching Workflows:**

**Manual Launch:**
- Navigate to Workflows module
- Select workflow from list
- Click "Launch Workflow"
- Monitor execution in real-time
- View completion status

**Automatic Triggers:**
- Workflows launch based on conditions
- Time-based (daily, hourly)
- Event-based (limit breach, delay)
- Threshold-based (amount, count)

**Monitoring Execution:**
- Real-time status updates
- Step-by-step progress tracking
- Execution time displayed
- Success/failure notifications
- Detailed execution logs

**Workflow Configuration:**
- Set trigger conditions
- Configure notification recipients
- Adjust thresholds and timeouts
- Enable/disable as needed
- Schedule recurring runs

**Best Practices:**
- Review workflow logs weekly
- Adjust thresholds based on patterns
- Keep notification lists current
- Monitor execution times
- Disable unused workflows

**Integration with Falcon AI:**
- Ask "Launch limit breach workflow"
- Falcon AI triggers workflow automatically
- Provides status updates in chat
- Notifies on completion
- Shows execution summary`,
    tags: ['Training', 'Workflows', 'Automation', 'How-To'],
    readTime: 12,
    lastUpdated: '2025-11-27',
    views: 445,
  },
  {
    id: 'KB-020',
    title: 'Falcon AI Assistant - Complete User Guide',
    category: 'Training',
    type: 'guide',
    description: 'Master the AI assistant for queries, calculations, reports, and workflow automation',
    content: `**Your Intelligent Treasury Assistant:**

**Accessing Falcon AI:**
- Click the pulsing blue button (bottom-right)
- AI assistant opens in floating window
- Drag to reposition anywhere on screen
- Maximize for full-screen view
- Minimize when not needed

**What Falcon AI Can Do:**

**1. Answer Questions**
Ask about any treasury metric or status:
- "What is the liquidity forecast?"
- "Show me limit breaches"
- "Tell me about FirstBank"
- "What is our compliance status?"

**2. Perform Calculations**
Request financial computations:
- "Calculate yield for 5-year bond at 95%"
- "What is the MTM for today's trades?"
- "Calculate duration for 3-year bond"

**3. Generate Reports**
Create reports with natural language:
- "Generate P&L report by trader this month"
- "Show all high-risk counterparties"
- "Export trades with FirstBank this quarter"

**4. Launch Workflows**
Trigger automated processes:
- "Launch limit breach workflow"
- "Run daily reconciliation"
- "Start KYC renewal process"

**5. Provide Guidance**
Get help with system functions:
- "How do I book a new trade?"
- "How do I create a counterparty?"
- "How do I generate custom reports?"

**Knowledge Base Coverage:**
Falcon AI has comprehensive knowledge of:
- All 50 counterparties with full profiles
- 5 product lines (FX Spot, Forward, MM, T-Bills, Bonds)
- 24 automated workflows
- Real-time risk metrics and exposures
- Liquidity forecasting and analysis
- Settlement analytics and delays
- Compliance status (KYC, AML, Sanctions)
- Market intelligence and trends

**Advanced Features:**

**Context-Aware Responses:**
- Understands current module
- References recent actions
- Provides relevant examples
- Suggests next steps

**Action Buttons:**
- Responses include actionable buttons
- "Launch Workflow" triggers automation
- "View Details" navigates to module
- "Generate Report" creates document

**Conversation History:**
- All queries saved in session
- Scroll to review past responses
- Copy information as needed
- Export conversation log

**Suggested Queries:**
- First-time users see common questions
- Click suggestion to ask immediately
- Learn system capabilities quickly
- Discover hidden features

**Pro Tips:**
- Be specific with counterparty/product names
- Include time periods in queries
- Reference trade IDs for calculations
- Use complete sentences for best results
- Ask follow-up questions naturally

**Response Types:**

**Data & Metrics:**
Falcon AI provides:
- Current values with trends
- Percentages and ratios
- Comparisons to limits/targets
- Historical context

**Analysis & Insights:**
- Identifies patterns and anomalies
- Highlights risks and opportunities
- Recommends actions
- Explains implications

**Step-by-Step Guidance:**
- Numbered procedures
- Screen references
- Field explanations
- Error resolution

**Calculations:**
- Formula breakdowns
- Step-by-step math
- Assumptions stated
- Interpretations provided

**Privacy & Security:**
- All interactions logged for audit
- No sensitive data leaves platform
- Responses based on role permissions
- Complies with data policies`,
    tags: ['Training', 'Falcon AI', 'AI Assistant', 'How-To', 'Complete Guide'],
    readTime: 20,
    lastUpdated: '2025-11-27',
    views: 1043,
  },
];

export default function KnowledgeCentreModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const categories = ['All', ...Array.from(new Set(knowledgeBase.map(a => a.category)))];
  const types = ['All', 'guide', 'video', 'document', 'faq'];

  const filteredArticles = knowledgeBase.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesType = selectedType === 'All' || article.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    const icons = {
      guide: FileText,
      video: Video,
      document: Download,
      faq: BookOpen,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const popularArticles = [...knowledgeBase].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Knowledge Centre</h1>
                <p className="text-sm text-gray-500 mt-1">Documentation, guides, and learning resources</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-6 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600 font-medium">Total Articles</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{knowledgeBase.length}</p>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md p-6 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600 font-medium">Guides</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {knowledgeBase.filter(a => a.type === 'guide').length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600 font-medium">Videos</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {knowledgeBase.filter(a => a.type === 'video').length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-md p-6 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600 font-medium">Documents</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {knowledgeBase.filter(a => a.type === 'document').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {filteredArticles.map((article) => {
              const Icon = getTypeIcon(article.type);
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{article.readTime} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{article.views} views</span>
                        </div>
                        {article.downloads && (
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            <span>{article.downloads} downloads</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
              <div className="space-y-3">
                {popularArticles.map((article) => {
                  const Icon = getTypeIcon(article.type);
                  return (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{article.views} views</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Can't find what you're looking for? Contact our support team for assistance.
              </p>
              <button className="w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

function ArticleModal({ article, onClose }: { article: KnowledgeArticle; onClose: () => void }) {
  const Icon = article.type === 'guide' ? FileText : article.type === 'video' ? Video : article.type === 'document' ? Download : BookOpen;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                    {article.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                    {article.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{article.title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{article.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{article.views} views</span>
            </div>
            {article.downloads && (
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{article.downloads} downloads</span>
              </div>
            )}
            <span className="ml-auto text-gray-500">Updated: {article.lastUpdated}</span>
          </div>

          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">{article.content}</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            {article.type === 'document' && (
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Document
              </button>
            )}
            <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Share Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
