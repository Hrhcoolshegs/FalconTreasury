interface FalconLogoProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'icon' | 'monochrome';
}

export default function FalconLogo({ size = 48, className = '', variant = 'full' }: FalconLogoProps) {
  const gradientId = `falcon-gradient-${Math.random().toString(36).substr(2, 9)}`;

  if (variant === 'monochrome') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M50 5L85 35C85 35 80 50 70 60C60 70 50 75 50 75C50 75 40 70 30 60C20 50 15 35 15 35L50 5Z"
          fill="currentColor"
        />
        <path
          d="M50 75L45 90L50 95L55 90L50 75Z"
          fill="currentColor"
        />
        <circle cx="40" cy="35" r="3" fill="white" />
        <circle cx="60" cy="35" r="3" fill="white" />
      </svg>
    );
  }

  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M50 5L85 35C85 35 80 50 70 60C60 70 50 75 50 75C50 75 40 70 30 60C20 50 15 35 15 35L50 5Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M50 75L45 90L50 95L55 90L50 75Z"
          fill={`url(#${gradientId})`}
        />
        <circle cx="40" cy="35" r="3" fill="white" />
        <circle cx="60" cy="35" r="3" fill="white" />
        <path
          d="M50 40C48 40 46 42 46 44C46 46 48 48 50 48C52 48 54 46 54 44C54 42 52 40 50 40Z"
          fill="#f59e0b"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id={`${gradientId}-accent`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>

      <g filter="url(#shadow)">
        <path
          d="M50 5L85 35C85 35 80 50 70 60C60 70 50 75 50 75C50 75 40 70 30 60C20 50 15 35 15 35L50 5Z"
          fill={`url(#${gradientId})`}
        />

        <path
          d="M50 75L45 90L50 95L55 90L50 75Z"
          fill={`url(#${gradientId})`}
        />

        <path
          d="M30 40L20 45L25 50L30 40Z"
          fill={`url(#${gradientId})`}
          opacity="0.8"
        />
        <path
          d="M70 40L80 45L75 50L70 40Z"
          fill={`url(#${gradientId})`}
          opacity="0.8"
        />

        <circle cx="40" cy="35" r="3" fill="white" />
        <circle cx="60" cy="35" r="3" fill="white" />

        <path
          d="M50 40C48 40 46 42 46 44C46 46 48 48 50 48C52 48 54 46 54 44C54 42 52 40 50 40Z"
          fill={`url(#${gradientId}-accent)`}
        />

        <path
          d="M45 55C45 55 47.5 58 50 58C52.5 58 55 55 55 55"
          stroke={`url(#${gradientId}-accent)`}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
