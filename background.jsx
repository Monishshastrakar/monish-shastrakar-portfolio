import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from 'shaders/react'

function Background() {
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Light theme (Axion Studio prompt)
  const light = {
    swirlA: "#ffffff",
    swirlB: "#f0f0f0",
    chromaBase: "#ffffff",
    chromaAccent: "#ff5f03",
    highlight: 0.12
  };

  // Dark theme (Portfolio matching)
  const dark = {
    swirlA: "#050608",
    swirlB: "#0B0D11",
    chromaBase: "#0B0D11",
    chromaAccent: "#06B6D4", // Electric Cyan to match your accent
    highlight: 0.04 // Softer glass highlight for dark mode
  };

  const theme = isDark ? dark : light;

  return (
    <div style={{ width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
      <Shader>
        <Swirl colorA={theme.swirlA} colorB={theme.swirlB} detail={1.7} />
        <ChromaFlow 
          baseColor={theme.chromaBase} 
          downColor={theme.chromaAccent} 
          leftColor={theme.chromaAccent} 
          rightColor={theme.chromaAccent} 
          upColor={theme.chromaAccent} 
          momentum={13} 
          radius={3.5} 
        />
        <FlutedGlass 
          aberration={0.61} 
          angle={31} 
          frequency={8} 
          highlight={theme.highlight} 
          highlightSoftness={0} 
          lightAngle={-90} 
          refraction={4} 
          shape="rounded" 
          softness={1} 
          speed={0.15} 
        />
        <FilmGrain strength={0.05} />
      </Shader>
    </div>
  )
}

const container = document.getElementById('shader-root')
if (container) {
  const root = createRoot(container)
  root.render(<Background />)
}
