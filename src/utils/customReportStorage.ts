interface CustomReport {
  id: string;
  user_id: string;
  report_name: string;
  description: string | null;
  report_config: any;
  natural_language_query: string | null;
  is_favorite: boolean;
  is_scheduled: boolean;
  schedule_config: any;
  tags: string[];
  created_at: string;
  last_run_at: string | null;
  run_count: number;
}

const STORAGE_KEY = 'falcon_custom_reports';

export const customReportStorage = {
  // Get all reports
  getAllReports(): CustomReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading reports from localStorage:', error);
      return [];
    }
  },

  // Get single report by ID
  getReportById(id: string): CustomReport | null {
    const reports = this.getAllReports();
    return reports.find(r => r.id === id) || null;
  },

  // Save new report
  saveReport(report: Omit<CustomReport, 'id' | 'created_at' | 'last_run_at' | 'run_count'>): CustomReport {
    const reports = this.getAllReports();
    const newReport: CustomReport = {
      ...report,
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      last_run_at: null,
      run_count: 0,
    };

    reports.push(newReport);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return newReport;
  },

  // Update existing report
  updateReport(id: string, updates: Partial<CustomReport>): CustomReport | null {
    const reports = this.getAllReports();
    const index = reports.findIndex(r => r.id === id);

    if (index === -1) return null;

    reports[index] = { ...reports[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return reports[index];
  },

  // Delete report
  deleteReport(id: string): boolean {
    const reports = this.getAllReports();
    const filtered = reports.filter(r => r.id !== id);

    if (filtered.length === reports.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Update run statistics
  recordRun(id: string): void {
    const reports = this.getAllReports();
    const index = reports.findIndex(r => r.id === id);

    if (index !== -1) {
      reports[index].last_run_at = new Date().toISOString();
      reports[index].run_count = (reports[index].run_count || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    }
  },

  // Toggle favorite
  toggleFavorite(id: string): boolean {
    const reports = this.getAllReports();
    const index = reports.findIndex(r => r.id === id);

    if (index === -1) return false;

    reports[index].is_favorite = !reports[index].is_favorite;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return reports[index].is_favorite;
  },

  // Clear all reports
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Get report count
  getCount(): number {
    return this.getAllReports().length;
  },

  // Search reports
  searchReports(query: string): CustomReport[] {
    const reports = this.getAllReports();
    const lowerQuery = query.toLowerCase();

    return reports.filter(r =>
      r.report_name.toLowerCase().includes(lowerQuery) ||
      (r.description && r.description.toLowerCase().includes(lowerQuery)) ||
      r.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
};
