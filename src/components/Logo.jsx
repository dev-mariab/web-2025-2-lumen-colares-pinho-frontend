export default function Logo({ size = 110 }) {
  return (
    <div className="logo-wrap">

      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="planet"
      >
        <defs>

          {/* Gradiente principal da esfera (brilho → ciano → roxo) */}
          <radialGradient id="core" cx="35%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#20B2AA" />
            <stop offset="100%" stopColor="#4800CD" />
          </radialGradient>

          {/* Gradiente de sombra para dar volume 3D real */}
          <radialGradient id="shadow" cx="75%" cy="75%" r="90%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.38)" />
          </radialGradient>

        </defs>

        {/* Esfera */}
        <circle cx="50" cy="50" r="45" fill="url(#core)" />
        {/* Sombra atmosférica */}
        <circle cx="50" cy="50" r="45" fill="url(#shadow)" />

      </svg>

      <span className="logo-text animated-logo">LUMEN</span>

    </div>
  );
}
