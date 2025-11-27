import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ReportConfig {
  reportType: string;
  filters: any[];
  metrics: string[];
  groupBy?: string[];
  sortBy?: any;
  limit?: number;
  dateRange: { start: Date | null; end: Date | null };
  aggregations?: string[];
  format?: 'pdf' | 'excel' | 'csv' | 'json';
}

interface CustomReport {
  id: string;
  user_id: string;
  report_name: string;
  description: string | null;
  report_config: ReportConfig;
  natural_language_query: string | null;
  created_at: string;
  updated_at: string;
  last_generated_at: string | null;
  generation_count: number;
  is_favorite: boolean;
  is_scheduled: boolean;
  schedule_config: any | null;
  tags: string[];
}

interface ReportHistoryEntry {
  id: string;
  report_id: string;
  generated_at: string;
  generated_by: string | null;
  date_range_start: string | null;
  date_range_end: string | null;
  record_count: number | null;
  file_size_bytes: number | null;
  download_url: string | null;
  status: 'success' | 'failed' | 'pending';
  error_message: string | null;
}

export function useCustomReports() {
  const [reports, setReports] = useState<CustomReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching custom reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const createReport = async (report: Omit<CustomReport, 'id' | 'created_at' | 'updated_at' | 'last_generated_at' | 'generation_count'>) => {
    try {
      const { data, error } = await supabase
        .from('custom_reports')
        .insert([{
          user_id: report.user_id,
          report_name: report.report_name,
          description: report.description,
          report_config: report.report_config,
          natural_language_query: report.natural_language_query,
          is_favorite: report.is_favorite,
          is_scheduled: report.is_scheduled,
          schedule_config: report.schedule_config,
          tags: report.tags,
        }])
        .select()
        .single();

      if (error) throw error;

      setReports(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating report:', err);
      throw err;
    }
  };

  const updateReport = async (id: string, updates: Partial<CustomReport>) => {
    try {
      const { data, error } = await supabase
        .from('custom_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setReports(prev => prev.map(r => r.id === id ? data : r));
      return data;
    } catch (err: any) {
      console.error('Error updating report:', err);
      throw err;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReports(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error('Error deleting report:', err);
      throw err;
    }
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    return updateReport(id, { is_favorite: isFavorite });
  };

  const recordGeneration = async (reportId: string, historyEntry: Omit<ReportHistoryEntry, 'id' | 'generated_at'>) => {
    try {
      // Insert history entry
      const { error: historyError } = await supabase
        .from('report_history')
        .insert([{
          report_id: reportId,
          generated_by: historyEntry.generated_by,
          date_range_start: historyEntry.date_range_start,
          date_range_end: historyEntry.date_range_end,
          record_count: historyEntry.record_count,
          file_size_bytes: historyEntry.file_size_bytes,
          download_url: historyEntry.download_url,
          status: historyEntry.status,
          error_message: historyEntry.error_message,
        }]);

      if (historyError) throw historyError;

      // Update report generation stats
      const report = reports.find(r => r.id === reportId);
      if (report && historyEntry.status === 'success') {
        await updateReport(reportId, {
          generation_count: report.generation_count + 1,
          last_generated_at: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error('Error recording generation:', err);
      throw err;
    }
  };

  const getReportHistory = async (reportId: string): Promise<ReportHistoryEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('report_history')
        .select('*')
        .eq('report_id', reportId)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error fetching report history:', err);
      return [];
    }
  };

  const duplicateReport = async (id: string) => {
    const original = reports.find(r => r.id === id);
    if (!original) return;

    return createReport({
      user_id: original.user_id,
      report_name: `${original.report_name} (Copy)`,
      description: original.description,
      report_config: original.report_config,
      natural_language_query: original.natural_language_query,
      is_favorite: false,
      is_scheduled: false,
      schedule_config: null,
      tags: original.tags,
    });
  };

  return {
    reports,
    loading,
    error,
    createReport,
    updateReport,
    deleteReport,
    toggleFavorite,
    recordGeneration,
    getReportHistory,
    duplicateReport,
    refreshReports: fetchReports,
  };
}
