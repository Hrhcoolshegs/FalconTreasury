import { parseISO, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subMonths, subQuarters } from 'date-fns';

interface ParsedFilter {
  field: string;
  operator: 'equals' | 'in' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
}

interface ParsedReport {
  reportType: 'transactions' | 'counterparties' | 'exposure' | 'pnl' | 'compliance' | 'liquidity' | 'generic';
  reportName: string;
  filters: ParsedFilter[];
  metrics: string[];
  groupBy?: string[];
  sortBy?: { field: string; direction: 'asc' | 'desc' };
  limit?: number;
  dateRange: { start: Date | null; end: Date | null };
  aggregations?: string[];
}

export class ReportNLPParser {
  // Entity dictionaries
  private static counterpartyNames = [
    'firstbank', 'first bank', 'access bank', 'access', 'zenith', 'zenith bank',
    'gtbank', 'gt bank', 'guaranty trust', 'uba', 'united bank', 'stanbic',
    'union bank', 'fidelity', 'fidelity bank', 'wema', 'wema bank', 'sterling',
    'sterling bank', 'fcmb', 'ecobank', 'standard chartered', 'citibank'
  ];

  private static productTypes = {
    'fx': ['FX Spot', 'FX Forward'],
    'fx spot': ['FX Spot'],
    'fx forward': ['FX Forward'],
    'foreign exchange': ['FX Spot', 'FX Forward'],
    'money market': ['MM'],
    'mm': ['MM'],
    't-bills': ['T-Bills'],
    'tbills': ['T-Bills'],
    'treasury bills': ['T-Bills'],
    'bonds': ['Bonds'],
  };

  private static metricKeywords = {
    'exposure': ['exposure_ngn', 'exposure_usd', 'exposure_limit_ngn', 'utilization_percentage'],
    'pnl': ['pnl_ngn', 'pnl_total_ngn'],
    'p&l': ['pnl_ngn', 'pnl_total_ngn'],
    'profit': ['pnl_ngn', 'pnl_total_ngn'],
    'volume': ['amount_ngn', 'amount_usd', 'total_volume_ytd_ngn'],
    'count': ['total_trades_ytd', 'outstanding_trades'],
    'trades': ['total_trades_ytd', 'outstanding_trades'],
    'settlement': ['settlement_status', 'settlement_reliability', 'avg_confirmation_time'],
    'rating': ['internal_rating', 'external_rating'],
    'risk': ['risk_category', 'exposure_ngn'],
  };

  static parse(query: string): ParsedReport {
    const lowerQuery = query.toLowerCase();

    // Determine report type
    const reportType = this.detectReportType(lowerQuery);

    // Extract entities
    const counterparties = this.extractCounterparties(lowerQuery);
    const products = this.extractProducts(lowerQuery);
    const traders = this.extractTraders(lowerQuery);
    const desks = this.extractDesks(lowerQuery);

    // Parse date range
    const dateRange = this.parseDateRange(lowerQuery);

    // Extract numeric filters
    const numericFilters = this.extractNumericFilters(lowerQuery);

    // Extract status filters
    const statusFilters = this.extractStatusFilters(lowerQuery);

    // Determine metrics to include
    const metrics = this.determineMetrics(lowerQuery, reportType);

    // Detect grouping
    const groupBy = this.detectGrouping(lowerQuery);

    // Detect sorting and limits
    const sortBy = this.detectSorting(lowerQuery);
    const limit = this.extractLimit(lowerQuery);

    // Detect aggregations
    const aggregations = this.detectAggregations(lowerQuery);

    // Build filters array
    const filters: ParsedFilter[] = [];

    if (counterparties.length > 0) {
      filters.push({
        field: 'counterparty_name',
        operator: counterparties.length === 1 ? 'equals' : 'in',
        value: counterparties.length === 1 ? counterparties[0] : counterparties
      });
    }

    if (products.length > 0) {
      filters.push({
        field: 'product',
        operator: 'in',
        value: products
      });
    }

    if (traders.length > 0) {
      filters.push({
        field: 'trader',
        operator: 'in',
        value: traders
      });
    }

    if (desks.length > 0) {
      filters.push({
        field: 'desk',
        operator: 'in',
        value: desks
      });
    }

    filters.push(...numericFilters);
    filters.push(...statusFilters);

    // Generate report name
    const reportName = this.generateReportName(query, reportType, filters, dateRange);

    return {
      reportType,
      reportName,
      filters,
      metrics,
      groupBy,
      sortBy,
      limit,
      dateRange,
      aggregations,
    };
  }

  private static detectReportType(query: string): ParsedReport['reportType'] {
    if (query.includes('transaction') || query.includes('trade')) return 'transactions';
    if (query.includes('counterpart') || query.includes('client')) return 'counterparties';
    if (query.includes('exposure') || query.includes('credit')) return 'exposure';
    if (query.includes('pnl') || query.includes('p&l') || query.includes('profit')) return 'pnl';
    if (query.includes('compliance') || query.includes('kyc') || query.includes('aml')) return 'compliance';
    if (query.includes('liquidity') || query.includes('cash')) return 'liquidity';
    return 'generic';
  }

  private static extractCounterparties(query: string): string[] {
    const found: string[] = [];
    for (const name of this.counterpartyNames) {
      if (query.includes(name)) {
        found.push(this.capitalize(name));
      }
    }
    return found;
  }

  private static extractProducts(query: string): string[] {
    const products = new Set<string>();
    for (const [keyword, productList] of Object.entries(this.productTypes)) {
      if (query.includes(keyword)) {
        productList.forEach(p => products.add(p));
      }
    }
    return Array.from(products);
  }

  private static extractTraders(query: string): string[] {
    const traders = ['Aisha Bello', 'Emeka Okonkwo', 'Fatima Yusuf', 'Chidi Nwankwo', 'Zainab Abubakar'];
    return traders.filter(t => query.includes(t.toLowerCase()));
  }

  private static extractDesks(query: string): string[] {
    const desks = ['FX Desk A', 'FX Desk B', 'MM Desk', 'Fixed Income'];
    return desks.filter(d => query.includes(d.toLowerCase()));
  }

  private static parseDateRange(query: string): { start: Date | null; end: Date | null } {
    const now = new Date();

    // Check for specific patterns
    if (query.includes('today')) {
      return { start: now, end: now };
    }

    if (query.includes('yesterday')) {
      const yesterday = subDays(now, 1);
      return { start: yesterday, end: yesterday };
    }

    // Last N days
    const lastDaysMatch = query.match(/last (\d+) days?/);
    if (lastDaysMatch) {
      const days = parseInt(lastDaysMatch[1]);
      return { start: subDays(now, days), end: now };
    }

    // This month
    if (query.includes('this month')) {
      return { start: startOfMonth(now), end: endOfMonth(now) };
    }

    // Last month
    if (query.includes('last month')) {
      const lastMonth = subMonths(now, 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    }

    // This quarter
    if (query.includes('this quarter')) {
      return { start: startOfQuarter(now), end: endOfQuarter(now) };
    }

    // Last quarter / Q4 2024, etc
    const quarterMatch = query.match(/q([1-4])\s*(\d{4})/);
    if (quarterMatch) {
      const quarter = parseInt(quarterMatch[1]);
      const year = parseInt(quarterMatch[2]);
      const date = new Date(year, (quarter - 1) * 3, 1);
      return { start: startOfQuarter(date), end: endOfQuarter(date) };
    }

    // This year / YTD
    if (query.includes('this year') || query.includes('ytd')) {
      return { start: startOfYear(now), end: now };
    }

    // Specific year
    const yearMatch = query.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
    }

    return { start: null, end: null };
  }

  private static extractNumericFilters(query: string): ParsedFilter[] {
    const filters: ParsedFilter[] = [];

    // Volume/Amount filters
    const volumeMatch = query.match(/volume\s*(greater|more|above|over|exceeds?|>)\s*(?:than\s*)?[₦$]?(\d+\.?\d*)\s*([bmk])?/i);
    if (volumeMatch) {
      const value = this.parseNumericValue(volumeMatch[2], volumeMatch[3]);
      filters.push({
        field: 'amount_ngn',
        operator: 'greaterThan',
        value
      });
    }

    // Exposure filters
    const exposureMatch = query.match(/exposure\s*(greater|more|above|over|exceeds?|>)\s*(?:than\s*)?[₦$]?(\d+\.?\d*)\s*([bmk])?/i);
    if (exposureMatch) {
      const value = this.parseNumericValue(exposureMatch[2], exposureMatch[3]);
      filters.push({
        field: 'exposure_ngn',
        operator: 'greaterThan',
        value
      });
    }

    // Utilization filters
    const utilizationMatch = query.match(/utilization\s*(greater|more|above|over|>)\s*(\d+)%?/i);
    if (utilizationMatch) {
      filters.push({
        field: 'utilization_percentage',
        operator: 'greaterThan',
        value: parseInt(utilizationMatch[2])
      });
    }

    return filters;
  }

  private static extractStatusFilters(query: string): ParsedFilter[] {
    const filters: ParsedFilter[] = [];

    // Risk category
    if (query.includes('high risk') || query.includes('high-risk')) {
      filters.push({ field: 'risk_category', operator: 'equals', value: 'High' });
    }
    if (query.includes('medium risk')) {
      filters.push({ field: 'risk_category', operator: 'equals', value: 'Medium' });
    }
    if (query.includes('low risk')) {
      filters.push({ field: 'risk_category', operator: 'equals', value: 'Low' });
    }

    // Settlement status
    if (query.includes('settled')) {
      filters.push({ field: 'settlement_status', operator: 'equals', value: 'Settled' });
    }
    if (query.includes('pending')) {
      filters.push({ field: 'settlement_status', operator: 'equals', value: 'Pending' });
    }
    if (query.includes('failed')) {
      filters.push({ field: 'settlement_status', operator: 'equals', value: 'Failed' });
    }

    // Active/Inactive
    if (query.includes('active') && !query.includes('inactive')) {
      filters.push({ field: 'status', operator: 'equals', value: 'Active' });
    }

    return filters;
  }

  private static determineMetrics(query: string, reportType: string): string[] {
    const metrics = new Set<string>();

    // Add metrics based on keywords
    for (const [keyword, fields] of Object.entries(this.metricKeywords)) {
      if (query.includes(keyword)) {
        fields.forEach(f => metrics.add(f));
      }
    }

    // Default metrics based on report type
    if (metrics.size === 0) {
      switch (reportType) {
        case 'transactions':
          return ['trade_id', 'trade_date', 'counterparty_name', 'product', 'amount_ngn', 'pnl_ngn', 'settlement_status'];
        case 'counterparties':
          return ['name', 'sector', 'exposure_ngn', 'internal_rating', 'settlement_reliability', 'total_trades_ytd'];
        case 'exposure':
          return ['counterparty_name', 'exposure_ngn', 'exposure_limit_ngn', 'utilization_percentage', 'risk_category'];
        case 'pnl':
          return ['product', 'trader', 'desk', 'pnl_ngn', 'trades_count', 'win_loss_ratio'];
        default:
          return [];
      }
    }

    return Array.from(metrics);
  }

  private static detectGrouping(query: string): string[] | undefined {
    const groupings: string[] = [];

    if (query.includes('by counterparty')) groupings.push('counterparty_name');
    if (query.includes('by product')) groupings.push('product');
    if (query.includes('by trader')) groupings.push('trader');
    if (query.includes('by desk')) groupings.push('desk');
    if (query.includes('by sector')) groupings.push('sector');
    if (query.includes('by date')) groupings.push('trade_date');

    return groupings.length > 0 ? groupings : undefined;
  }

  private static detectSorting(query: string): { field: string; direction: 'asc' | 'desc' } | undefined {
    if (query.includes('sorted by') || query.includes('order by')) {
      if (query.includes('volume')) {
        return { field: 'amount_ngn', direction: query.includes('ascending') ? 'asc' : 'desc' };
      }
      if (query.includes('exposure')) {
        return { field: 'exposure_ngn', direction: query.includes('ascending') ? 'asc' : 'desc' };
      }
      if (query.includes('date')) {
        return { field: 'trade_date', direction: query.includes('ascending') ? 'asc' : 'desc' };
      }
    }
    return undefined;
  }

  private static extractLimit(query: string): number | undefined {
    const topMatch = query.match(/top (\d+)/);
    if (topMatch) return parseInt(topMatch[1]);

    const firstMatch = query.match(/first (\d+)/);
    if (firstMatch) return parseInt(firstMatch[1]);

    return undefined;
  }

  private static detectAggregations(query: string): string[] {
    const aggregations: string[] = [];

    if (query.includes('total') || query.includes('sum')) aggregations.push('sum');
    if (query.includes('average') || query.includes('avg')) aggregations.push('avg');
    if (query.includes('count')) aggregations.push('count');
    if (query.includes('maximum') || query.includes('max')) aggregations.push('max');
    if (query.includes('minimum') || query.includes('min')) aggregations.push('min');

    return aggregations;
  }

  private static parseNumericValue(value: string, unit?: string): number {
    const num = parseFloat(value);
    if (!unit) return num;

    switch (unit.toLowerCase()) {
      case 'b': return num * 1000000000;
      case 'm': return num * 1000000;
      case 'k': return num * 1000;
      default: return num;
    }
  }

  private static capitalize(str: string): string {
    return str.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private static generateReportName(query: string, reportType: string, filters: ParsedFilter[], dateRange: any): string {
    const parts: string[] = [];

    // Add report type
    parts.push(this.capitalize(reportType));

    // Add main entities
    const counterpartyFilter = filters.find(f => f.field === 'counterparty_name');
    if (counterpartyFilter) {
      const cp = Array.isArray(counterpartyFilter.value) ? counterpartyFilter.value[0] : counterpartyFilter.value;
      parts.push(`- ${cp}`);
    }

    const productFilter = filters.find(f => f.field === 'product');
    if (productFilter) {
      const products = Array.isArray(productFilter.value) ? productFilter.value : [productFilter.value];
      parts.push(`- ${products.join(', ')}`);
    }

    // Add date context
    if (dateRange.start || dateRange.end) {
      if (query.includes('this month')) parts.push('- This Month');
      else if (query.includes('last month')) parts.push('- Last Month');
      else if (query.includes('this quarter')) parts.push('- This Quarter');
      else if (query.includes('this year')) parts.push('- YTD');
      else parts.push('- Custom Period');
    }

    return parts.join(' ') || 'Custom Report';
  }
}
