/** Altın hedef / radar çizgeleri — referans görseldeki finans logosu estetiğine yakın. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width={32}
      height={32}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient
          id="veltara-gold"
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9a7b1a" />
          <stop offset="0.45" stopColor="#f0d78c" />
          <stop offset="1" stopColor="#b8922e" />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        r="12.5"
        stroke="url(#veltara-gold)"
        strokeWidth="2"
        strokeDasharray="19 11"
        strokeLinecap="round"
        transform="rotate(-52 16 16)"
      />
      <circle
        cx="16"
        cy="16"
        r="8.5"
        stroke="url(#veltara-gold)"
        strokeWidth="1.75"
        strokeDasharray="14 10"
        strokeLinecap="round"
        transform="rotate(38 16 16)"
      />
      <circle
        cx="16"
        cy="16"
        r="5"
        stroke="url(#veltara-gold)"
        strokeWidth="1.5"
        strokeDasharray="10 9"
        strokeLinecap="round"
        transform="rotate(-18 16 16)"
      />
      <circle cx="16" cy="16" r="2.25" fill="url(#veltara-gold)" />
      <path
        d="M16 16L8.5 8.5"
        stroke="url(#veltara-gold)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}
