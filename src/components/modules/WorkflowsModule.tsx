import { useState } from 'react';
import { workflows, workflowExecutions } from '../../data/workflowData';
import { Plus, Play, Settings, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function WorkflowsModule() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'executions'>('list');

  const activeWorkflows = workflows.filter(w => w.status === 'Active');
  const draftWorkflows = workflows.filter(w => w.status === 'Draft');

  const recentExecutions = workflowExecutions.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
            <p className="text-sm text-gray-500 mt-1">Automate treasury operations with intelligent workflows</p>
          </div>
          <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8f] flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Active Workflows</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{activeWorkflows.length}</p>
            <p className="text-xs text-gray-400 mt-1">Running workflows</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Total Executions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {workflows.reduce((sum, w) => sum + w.execution_count, 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-500">Success Rate</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {(workflows.reduce((sum, w) => sum + w.success_rate, 0) / workflows.length).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Average</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-500">Draft Workflows</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{draftWorkflows.length}</p>
            <p className="text-xs text-gray-400 mt-1">In development</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <div className="flex gap-4">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  view === 'list' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Workflow List
              </button>
              <button
                onClick={() => setView('executions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  view === 'executions' ? 'bg-[#1e3a5f] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Execution History
              </button>
            </div>
          </div>

          {view === 'list' && (
            <div className="p-6 space-y-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.workflow_id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#1e3a5f] hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedWorkflow(workflow.workflow_id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          workflow.status === 'Active' ? 'bg-green-100 text-green-800' :
                          workflow.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {workflow.status}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {workflow.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>Trigger: {workflow.trigger_type}</span>
                        <span>•</span>
                        <span>{workflow.steps.length} steps</span>
                        <span>•</span>
                        <span>{workflow.execution_count} executions</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">{workflow.success_rate}% success</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={(e) => { e.stopPropagation(); }}>
                        <Play className="w-5 h-5 text-[#1e3a5f]" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={(e) => { e.stopPropagation(); }}>
                        <Settings className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <img src={`https://ui-avatars.com/api/?name=${workflow.created_by}&size=24`} className="w-6 h-6 rounded-full" alt="" />
                    <span className="text-xs text-gray-500">Created by {workflow.created_by}</span>
                    <span className="text-xs text-gray-400">• Modified {workflow.last_modified}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'executions' && (
            <div className="p-6">
              <div className="space-y-3">
                {recentExecutions.map((execution) => (
                  <div key={execution.execution_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{execution.workflow_name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            execution.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            execution.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                            execution.status === 'Failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {execution.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">ID: {execution.execution_id}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Triggered by: {execution.triggered_by}</span>
                          <span>•</span>
                          <span>Started: {new Date(execution.start_time).toLocaleString()}</span>
                          {execution.end_time && (
                            <>
                              <span>•</span>
                              <span>Duration: {((new Date(execution.end_time).getTime() - new Date(execution.start_time).getTime()) / 1000).toFixed(1)}s</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {execution.status === 'Completed' && <CheckCircle className="w-6 h-6 text-green-600" />}
                        {execution.status === 'Running' && <Clock className="w-6 h-6 text-blue-600 animate-spin" />}
                        {execution.status === 'Failed' && <XCircle className="w-6 h-6 text-red-600" />}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{execution.steps_completed} / {execution.total_steps} steps</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#1e3a5f] h-2 rounded-full"
                          style={{ width: `${(execution.steps_completed / execution.total_steps) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
