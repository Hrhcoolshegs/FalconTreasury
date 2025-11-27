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
