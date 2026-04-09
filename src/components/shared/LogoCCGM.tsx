interface LogoCCGMProps {
  className?: string
  /** 'color' usa paleta original, 'white' para fondos oscuros */
  variant?: 'color' | 'white'
  /** false = solo el emblema circular (para navbar) */
  showText?: boolean
}

export function LogoCCGM({ className, variant = 'color', showText = true }: LogoCCGMProps) {
  const isWhite = variant === 'white'

  const textColor    = isWhite ? '#FFFFFF' : '#1C1814'
  const circleColor  = isWhite ? '#FFFFFF' : '#C9A227'
  const blackRect    = isWhite ? 'rgba(255,255,255,0.15)' : '#1C1814'
  const yellowRect   = isWhite ? 'rgba(255,255,255,0.30)' : '#F0C030'
  const redRect      = isWhite ? 'rgba(255,255,255,0.20)' : '#CC2200'
  const gabrielaCol  = isWhite ? '#FFFFFF' : '#F0C030'
  const mistralCol   = isWhite ? '#FFFFFF' : '#1C1814'

  // showText=false → recorta el viewBox al emblema circular solamente
  const viewBox = showText ? '0 0 420 420' : '75 118 270 278'

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Colegio Cristiano Gabriela Mistral"
    >
      {/* ── COLEGIO CRISTIANO ── */}
      {showText && (
        <text
          x="210" y="50"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontWeight="800"
          fontSize="28"
          fill={textColor}
          letterSpacing="4"
        >
          COLEGIO CRISTIANO
        </text>
      )}

      {/* ── Círculo dorado ── */}
      <circle
        cx="210" cy="255" r="132"
        fill="none"
        stroke={circleColor}
        strokeWidth="4"
      />

      {/* ── Cuadrado negro ── */}
      <rect x="110" y="158" width="138" height="132" fill={blackRect} />

      {/* ── Cuadrado amarillo ── */}
      <rect x="182" y="228" width="124" height="108" fill={yellowRect} />

      {/* ── Cuadrado rojo ── */}
      <rect x="103" y="265" width="96" height="84" fill={redRect} />

      {/* ── Gabriela ── */}
      <text
        x="118" y="223"
        fontFamily="'Dancing Script', cursive"
        fontWeight="700"
        fontSize="52"
        fill={gabrielaCol}
      >
        Gabriela
      </text>

      {/* ── Mistral ── */}
      <text
        x="186" y="310"
        fontFamily="'Dancing Script', cursive"
        fontWeight="700"
        fontSize="50"
        fill={mistralCol}
      >
        Mistral
      </text>
    </svg>
  )
}
