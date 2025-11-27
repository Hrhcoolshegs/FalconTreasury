import { useState } from 'react';
import { MessageSquare, Send, X, Sparkles, Play, TrendingUp, AlertTriangle } from 'lucide-react';
import { workflows } from '../data/workflowData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; workflowId: string }>;
}

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Falcon Treasury AI Concierge. I can help you with:\n\n• Launching workflows\n• Analyzing counterparty risk\n• Generating insights\n• Forecasting liquidity\n• Monitoring exposures\n\nHow can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const suggestedActions = [
    { label: 'Check liquidity forecast', query: 'What is the liquidity forecast for next week?' },
    { label: 'Review limit breaches', query: 'Show me any limit breaches' },
    { label: 'Run settlement analysis', query: 'Analyze recent settlement delays' },
  ];

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
    }, 1000);
  };

  const generateResponse = (query: string): Message => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('limit') || lowerQuery.includes('breach')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I found 3 counterparties with exposure utilization above 90%:\n\n• Zenith Bank: 95.0%\n• Access Bank: 92.3%\n• FirstBank: 91.8%\n\nWould you like me to launch the "Limit Breach Alert & Escalation" workflow?',
        timestamp: new Date(),
        actions: [
          { label: 'Launch Workflow', workflowId: 'WF-001' },
        ],
      };
    }

    if (lowerQuery.includes('liquidity') || lowerQuery.includes('forecast')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Based on the latest forecast:\n\n• 7-day forecast: ₦27.8B (confidence: 92%)\n• 14-day forecast: ₦28.5B (confidence: 85%)\n• Current buffer: 31.5% (healthy)\n\nThe liquidity position looks stable. Would you like me to run a stress test?',
        timestamp: new Date(),
        actions: [
          { label: 'Run Stress Test', workflowId: 'WF-003' },
        ],
      };
    }

    if (lowerQuery.includes('settlement') || lowerQuery.includes('delay')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Settlement Analysis (Last 30 Days):\n\n• Average confirmation time: 2.3 hours\n• On-time settlement rate: 94.2%\n• Delayed settlements: 8 trades\n• Failed settlements: 2 trades\n\nWould you like me to initiate follow-up workflows for delayed settlements?',
        timestamp: new Date(),
        actions: [
          { label: 'Launch Follow-up Workflow', workflowId: 'WF-002' },
        ],
      };
    }

    if (lowerQuery.includes('risk') || lowerQuery.includes('exposure')) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Current Risk Overview:\n\n• Total Exposure: ₦60.4B\n• VaR (95%): ₦6.9B\n• Composite Risk Score: 68.5/100\n• High-risk counterparties: 5\n\nThe risk profile is within acceptable limits. Would you like a detailed risk report?',
        timestamp: new Date(),
      };
    }

    return {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'I understand you\'re asking about "' + query + '". Let me analyze that for you.\n\nBased on current data, I can help you:\n\n• Launch relevant workflows\n• Generate detailed reports\n• Provide predictive insights\n• Monitor key metrics\n\nWhat specific action would you like me to take?',
      timestamp: new Date(),
    };
  };

  const handleWorkflowLaunch = (workflowId: string) => {
    const workflow = workflows.find(w => w.workflow_id === workflowId);
    if (!workflow) return;

    const confirmMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `✅ Workflow "${workflow.name}" has been launched successfully.\n\nExecution ID: EXE-${Date.now()}\nStatus: Running\nEstimated completion: 2-5 seconds\n\nI'll notify you when it completes.`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, confirmMessage]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#1e3a5f] text-white rounded-full shadow-lg hover:bg-[#2d5a8f] flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <Sparkles className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200">
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8f] text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">AI Concierge</h3>
            <p className="text-xs text-white/80">Always here to help</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
          <X className="w-5 h-5" />
        </button>
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
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.actions && message.actions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleWorkflowLaunch(action.workflowId)}
                      className="w-full px-3 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2d5a8f] flex items-center justify-center gap-2"
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
          <p className="text-xs text-gray-500 mb-2">Suggested actions:</p>
          <div className="space-y-2">
            {suggestedActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputValue(action.query);
                  setTimeout(() => handleSend(), 100);
                }}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8f] flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
