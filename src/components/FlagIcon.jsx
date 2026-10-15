export default function FlagIcon({ country, className = "w-4 h-4 rounded-full overflow-hidden shadow-xs shrink-0" }) {
  const code = (country || '').toUpperCase();

  switch (code) {
    case 'US':
    case 'USA':
      return (
        <svg viewBox="0 0 512 512" className={className} aria-label="USA flag">
          <circle cx="256" cy="256" r="256" fill="#B22234" />
          <path d="M0 78.8h512v39.4H0zm0 78.8h512v39.4H0zm0 78.8h512v39.4H0zm0 78.8h512v39.4H0zm0 78.8h512v39.4H0z" fill="#FFFFFF" />
          <path d="M0 0h256v275.7H0z" fill="#3C3B6E" />
          <circle cx="70" cy="65" r="14" fill="#FFFFFF" />
          <circle cx="128" cy="65" r="14" fill="#FFFFFF" />
          <circle cx="186" cy="65" r="14" fill="#FFFFFF" />
          <circle cx="99" cy="115" r="14" fill="#FFFFFF" />
          <circle cx="157" cy="115" r="14" fill="#FFFFFF" />
          <circle cx="70" cy="165" r="14" fill="#FFFFFF" />
          <circle cx="128" cy="165" r="14" fill="#FFFFFF" />
          <circle cx="186" cy="165" r="14" fill="#FFFFFF" />
          <circle cx="99" cy="215" r="14" fill="#FFFFFF" />
          <circle cx="157" cy="215" r="14" fill="#FFFFFF" />
        </svg>
      );
    case 'NL':
      return (
        <svg viewBox="0 0 512 512" className={className} aria-label="Netherlands flag">
          <circle cx="256" cy="256" r="256" fill="#AE1C28" />
          <path d="M0 170.7h512v170.6H0z" fill="#FFFFFF" />
          <path d="M0 341.3h512v170.7H0z" fill="#21468B" />
        </svg>
      );
    case 'GB':
    case 'UK':
      return (
        <svg viewBox="0 0 512 512" className={className} aria-label="UK flag">
          <circle cx="256" cy="256" r="256" fill="#012169" />
          <path d="M0 0l512 512m0-512L0 512" stroke="#FFFFFF" strokeWidth="60" />
          <path d="M0 0l512 512m0-512L0 512" stroke="#C8102E" strokeWidth="28" />
          <path d="M256 0v512M0 256h512" stroke="#FFFFFF" strokeWidth="100" />
          <path d="M256 0v512M0 256h512" stroke="#C8102E" strokeWidth="60" />
        </svg>
      );
    case 'SE':
      return (
        <svg viewBox="0 0 512 512" className={className} aria-label="Sweden flag">
          <circle cx="256" cy="256" r="256" fill="#006AA7" />
          <path d="M0 216h512v80H0zm160-216h80v512h-80z" fill="#FECC00" />
        </svg>
      );
    case 'DE':
      return (
        <svg viewBox="0 0 512 512" className={className} aria-label="Germany flag">
          <circle cx="256" cy="256" r="256" fill="#262626" />
          <path d="M0 170.7h512v170.6H0z" fill="#DD0000" />
          <path d="M0 341.3h512v170.7H0z" fill="#FFCE00" />
        </svg>
      );
    case 'SG':
      return (
        <svg viewBox="0 0 512 512" className={className} aria-label="Singapore flag">
          <circle cx="256" cy="256" r="256" fill="#ED2939" />
          <path d="M0 256h512v256H0z" fill="#FFFFFF" />
        </svg>
      );
    default:
      return (
        <div className={`${className} bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300`}>
          {code.slice(0, 2)}
        </div>
      );
  }
}
