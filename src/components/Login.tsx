import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import FalconLogo from './common/FalconLogo';
import TwoFactorAuth from './TwoFactorAuth';

interface LoginProps {
  onLogin: (email: string, password: string, role: string) => void;
}

const demoUsers = [
  { email: 'admin@falcon.ng', password: 'admin123', role: 'Admin', name: 'Chidi Okeke' },
  { email: 'trader@falcon.ng', password: 'trader123', role: 'Trader', name: 'Aisha Bello' },
  { email: 'manager@falcon.ng', password: 'manager123', role: 'Manager', name: 'Emeka Nwosu' },
  { email: 'viewer@falcon.ng', password: 'viewer123', role: 'Viewer', name: 'Fatima Ibrahim' },
];

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [pendingUser, setPendingUser] = useState<typeof demoUsers[0] | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = demoUsers.find(u => u.email === email && u.password === password);

    if (user) {
      setPendingUser(user);
      setShow2FA(true);
    } else {
      setError('Invalid email or password');
    }
  };

  const handle2FAVerify = () => {
    if (pendingUser) {
      localStorage.setItem('falcon_user', JSON.stringify({
        email: pendingUser.email,
        role: pendingUser.role,
        name: pendingUser.name,
        loginTime: new Date().toISOString(),
      }));
      onLogin(pendingUser.email, pendingUser.password, pendingUser.role);
    }
  };

  const handle2FACancel = () => {
    setShow2FA(false);
    setPendingUser(null);
  };

  const handleDemoLogin = (user: typeof demoUsers[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setPendingUser(user);
    setShow2FA(true);
  };

  return (
    <>
      <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-blue-900/90 backdrop-blur-sm"></div>
        </div>

        <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl">
                <FalconLogo size={64} variant="icon" />
              </div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Falcon Treasury
                </h1>
                <p className="text-blue-200 text-lg mt-1">Enterprise Intelligence Platform</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                Access your comprehensive treasury management platform with real-time analytics,
                AI-powered insights, and automated workflows.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-blue-100">Platform Features:</h3>
              <ul className="space-y-3 text-blue-200">
                {[
                  'Real-time Risk & Exposure Monitoring',
                  'AI-Powered Sentiment Intelligence',
                  'Automated Workflow Management',
                  'Advanced Predictive Analytics',
                  'Comprehensive Reporting Suite',
                  'Natural Language Report Generation',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 space-y-6 border border-white/20">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Enter your credentials to access the platform</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Sign In
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/95 text-gray-500 font-medium">Quick Demo Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleDemoLogin(user)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left transform hover:scale-105"
                >
                  <p className="font-semibold text-gray-900 text-sm">{user.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.name}</p>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Protected by enterprise-grade security. All sessions are encrypted and monitored.
              </p>
            </div>
          </div>
        </div>
      </div>

      {show2FA && pendingUser && (
        <TwoFactorAuth
          email={pendingUser.email}
          onVerify={handle2FAVerify}
          onCancel={handle2FACancel}
        />
      )}
    </>
  );
}
