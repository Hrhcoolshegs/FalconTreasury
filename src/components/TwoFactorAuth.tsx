import { useState, useRef, useEffect } from 'react';
import { Shield, X, RefreshCw } from 'lucide-react';
import FalconLogo from './common/FalconLogo';

interface TwoFactorAuthProps {
  email: string;
  onVerify: () => void;
  onCancel: () => void;
}

export default function TwoFactorAuth({ email, onVerify, onCancel }: TwoFactorAuthProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = (verificationCode: string) => {
    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      if (verificationCode.length === 6 && /^\d{6}$/.test(verificationCode)) {
        onVerify();
      } else {
        const newAttempts = attempts - 1;
        setAttempts(newAttempts);

        if (newAttempts === 0) {
          setError('Maximum attempts reached. Please try again later.');
          setTimeout(() => onCancel(), 2000);
        } else {
          setError(`Invalid code. ${newAttempts} ${newAttempts === 1 ? 'attempt' : 'attempts'} remaining.`);
          setCode(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }
        setIsVerifying(false);
      }
    }, 500);
  };

  const handleResend = () => {
    setResendTimer(30);
    setError('');
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FalconLogo size={48} variant="icon" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            Enter the 6-digit verification code sent to:
          </p>
          <p className="font-semibold text-gray-900">{email}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Demo Code: 123456 (or any 6 digits)</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isVerifying || attempts === 0}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
            </button>
            <span className="text-gray-500">
              Code expires in 5:00
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            For security purposes, this session will be locked after 3 failed attempts.
          </p>
        </div>
      </div>
    </div>
  );
}
