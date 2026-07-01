"use client";
import Link from "next/link";

import { useState, useEffect, useRef } from "react";

// ─── Animated Logic Expression ────────────────────────────────────────────────
function AnimatedLogicExpression() {
  const lines = [
    [
      { type: "kw", text: "IF" },
      { type: "op", text: " (" },
      { type: "val", text: "business" },
      { type: "op", text: "." },
      { type: "val", text: "ambition" },
      { type: "op", text: " === " },
      { type: "str", text: "true" },
      { type: "op", text: ") {" },
    ],
    [
      { type: "indent", text: "  " },
      { type: "kw", text: "THEN" },
      { type: "op", text: " " },
      { type: "val", text: "booleanForce" },
      { type: "op", text: "." },
      { type: "val", text: "execute" },
      { type: "op", text: "(" },
      { type: "str", text: '"GROWTH"' },
      { type: "op", text: ");" },
    ],
    [
      { type: "indent", text: "  " },
      { type: "kw", text: "RETURN" },
      { type: "op", text: " " },
      { type: "val", text: "precision" },
      { type: "op", text: "." },
      { type: "val", text: "code" },
      { type: "op", text: " + " },
      { type: "val", text: "emotive" },
      { type: "op", text: "." },
      { type: "val", text: "design" },
      { type: "op", text: ";" },
    ],
    [
      { type: "op", text: "} " },
      { type: "kw", text: "ELSE" },
      { type: "op", text: " { " },
      { type: "val", text: "staySmall" },
      { type: "op", text: "(); }" },
      { type: "cursor", text: "" },
    ],
  ];

  const tokenColors = {
    kw: "#F97316",
    val: "#93c5fd",
    str: "#6ee7b7",
    op: "rgba(255,255,255,0.75)",
    indent: "transparent",
    cursor: "#F97316",
  };

  // Flatten each line into a single string + a per-character color map,
  // so we can reveal it character-by-character (typewriter effect)
  // while still coloring each character correctly.
  const lineData = lines.map((line) => {
    let text = "";
    const colors = [];
    line.forEach((tok) => {
      if (tok.type === "cursor") return;
      const color = tokenColors[tok.type];
      for (let i = 0; i < tok.text.length; i++) {
        text += tok.text[i];
        colors.push(color);
      }
    });
    return { text, colors };
  });

  const lineLengths = lineData.map((l) => l.text.length);
  const totalChars = lineLengths.reduce((sum, n) => sum + n, 0);

  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    let timer;

    if (visibleChars < totalChars) {
      // typing speed per character
      timer = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, 28);
    } else {
      // pause at the end, then restart the typewriter loop
      timer = setTimeout(() => {
        setVisibleChars(0);
      }, 1600);
    }

    return () => clearTimeout(timer);
  }, [visibleChars, totalChars]);

  let charsBeforeCurrentLine = 0;

  return (
    <div className="bf-code-text font-mono text-[13px] leading-[1.9]">
      {lineData.map((line, li) => {
        const lineStart = charsBeforeCurrentLine;
        const lineEnd = lineStart + lineLengths[li];
        const visibleInThisLine = Math.max(
          0,
          Math.min(visibleChars - lineStart, lineLengths[li])
        );
        const showCursor = visibleChars >= lineStart && visibleChars <= lineEnd;

        charsBeforeCurrentLine += lineLengths[li];

        return (
          <div key={li} className="whitespace-nowrap">
            {line.text.slice(0, visibleInThisLine).split("").map((ch, ci) => (
              <span key={ci} style={{ color: line.colors[ci] }}>
                {ch}
              </span>
            ))}
            {showCursor && (
              <span
                className="inline-block w-[2px] h-[14px] bg-[#F97316] align-middle bf-blink"
                style={{ marginLeft: "1px" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Particle Canvas ──────────────────────────────────────────────────────────
function ParticleCanvas({ paused }) {
  const canvasRef = useRef(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.08),
      alpha: Math.random() * 0.45 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();

        if (!pausedRef.current) {
          p.x += p.vx;
          p.y += p.vy;
        }

        if (p.y < -4) {
          p.y = canvas.height + 4;
          p.x = Math.random() * canvas.width;
        }

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
}

// ─── Main Banner ──────────────────────────────────────────────────────────────
function BooleanForceBanner() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

        @keyframes bfBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes bfFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .bf-blink {
          animation: bfBlink 1s step-end infinite;
        }

        .bf-fadein {
          animation: bfFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both;
        }

        .bf-fadein-d1 { animation-delay: 0.1s; }
        .bf-fadein-d2 { animation-delay: 0.25s; }
        .bf-fadein-d3 { animation-delay: 0.4s; }
        .bf-fadein-d4 { animation-delay: 0.55s; }

        .bf-cta-btn:hover .bf-arrow-box {
          background: #1E3A8A !important;
        }

        .bf-cta-btn:hover {
          opacity: 0.9;
        }

        .bf-banner {
          width: 100%;
          max-width: 100%;
          margin: 0 !important;
          padding: 0 !important;
        }

        .bf-hero-row {
          min-height: 100svh;
          padding-top: 0 !important;
        }

        .bf-left-col,
        .bf-right-col {
          min-width: 0;
        }

        .bf-headline {
          overflow-wrap: anywhere;
        }

        .bf-copy {
          width: 100%;
        }

        .bf-logic-box {
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 1024px) {
          .bf-hero-row {
            padding-left: 36px !important;
            padding-right: 36px !important;
            gap: 36px !important;
          }

          .bf-right-col {
            padding-left: 32px !important;
          }

          .bf-logic-strip {
            padding-left: 36px !important;
            padding-right: 36px !important;
          }
        }

        @media (max-width: 768px) {
          .bf-hero-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            min-height: auto !important;
            padding: 0 28px 64px !important;
            gap: 30px !important;
          }

          .bf-left-col,
          .bf-right-col {
            width: 100% !important;
            flex: none !important;
          }

          .bf-right-col {
            padding-left: 0 !important;
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.12) !important;
            padding-top: 26px !important;
            align-self: stretch !important;
          }

          .bf-headline {
            font-size: clamp(30px, 9vw, 44px) !important;
            line-height: 1.08 !important;
            letter-spacing: -0.35px !important;
          }

          .bf-copy {
            max-width: 100% !important;
          }

          .bf-pause-btn {
            left: 28px !important;
            bottom: 22px !important;
          }

          .bf-logic-strip {
            padding: 18px 28px 22px !important;
          }

          .bf-logic-box {
            padding: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .bf-hero-row {
            padding: 0 18px 58px !important;
            gap: 24px !important;
          }

          .bf-headline {
            font-size: clamp(25px, 8.2vw, 34px) !important;
            line-height: 1.12 !important;
          }

          .bf-right-col {
            padding-top: 22px !important;
          }

          .bf-pause-btn {
            left: 18px !important;
            bottom: 18px !important;
          }

          .bf-logic-strip {
            padding: 14px 18px 18px !important;
          }

          .bf-logic-box {
            padding: 14px !important;
          }

          .bf-code-text {
            font-size: 11px !important;
            line-height: 1.8 !important;
          }
        }

        @media (max-width: 360px) {
          .bf-hero-row {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }

          .bf-headline {
            font-size: 24px !important;
          }

          .bf-code-text {
            font-size: 10px !important;
          }
        }
      `}</style>

      <div className="bf-banner bg-[#080808] font-['Inter',sans-serif] rounded-none overflow-hidden w-full box-border m-0 p-0">
        {/* ── Hero Row ── */}
        <div className="bf-hero-row relative flex items-center min-h-screen px-12 pt-0 pb-14 gap-12 box-border overflow-hidden">
          {/* Navy glow */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 90% at 30% 50%, rgba(30,58,138,0.1) 0%, transparent 70%)",
            }}
          />

          <ParticleCanvas paused={paused} />

          {/* LEFT — headline */}
          <div className="bf-left-col flex-[1.45] relative z-[2]">
            {isLoaded && (
              <h1
                className="bf-headline bf-fadein bf-fadein-d1 m-0 font-medium leading-none tracking-[-0.5px] text-white uppercase"
                style={{ fontSize: "clamp(34px, 5.8vw, 52px)" }}
              >
                IF (Business = Ambition)
                <br />
                THEN (Boolean
                <span className="text-[#F97316] not-italic inline">
                  &gt;
                </span>
                Force
                <br />
                == Growth)
              </h1>
            )}
          </div>

          {/* RIGHT — copy + CTA */}
          <div className="bf-right-col flex-1 pl-10 border-l border-white/[0.12] relative z-[2] self-center">
            {isLoaded && (
              <div className="bf-fadein bf-fadein-d2 w-9 h-[3px] bg-[#F97316] mb-[14px] rounded-sm" />
            )}

            {isLoaded && (
              <p className="bf-fadein bf-fadein-d2 m-0 mb-3 text-[17px] font-bold text-white leading-[1.3]">
                Shaping tomorrow, today
              </p>
            )}

            {isLoaded && (
              <p className="bf-copy bf-fadein bf-fadein-d3 m-0 mb-7 text-[14px] text-white/65 leading-[1.75] max-w-[360px]">
                Engineering high-performance identities and software for
                businesses that refuse to stay small. We turn your variables
                into constants through precision code and emotive design.
              </p>
            )}

            {isLoaded && (
  <Link
    href="/portfolio"
    className="bf-fadein bf-fadein-d4 bf-cta-btn inline-flex items-center gap-[10px] bg-transparent border-none p-0 cursor-pointer text-[14px] font-semibold text-white font-['Inter',sans-serif] no-underline"
  >
    Execute Project
    <span className="bf-arrow-box w-7 h-7 bg-[#F97316] flex items-center justify-center rounded text-[13px] font-black text-white transition-colors duration-200">
      &#62;
    </span>
  </Link>
)}
          </div>

          {/* Pause / Play */}
          <button
            className="bf-pause-btn absolute bottom-4 left-12 z-[3] bg-transparent border-none cursor-pointer flex items-center gap-[3px] opacity-40 p-0 transition-opacity duration-200 hover:opacity-75"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play particles" : "Pause particles"}
          >
            {paused ? (
              <span
                className="inline-block w-0 h-0"
                style={{
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: "12px solid #fff",
                }}
              />
            ) : (
              <>
                <span className="block w-[3px] h-[14px] bg-white rounded-[1px]" />
                <span className="block w-[3px] h-[14px] bg-white rounded-[1px]" />
              </>
            )}
          </button>
        </div>

        {/* ── Logic Expression Strip ── */}
        <div className="bf-logic-strip border-t border-[#F97316]/[0.18] bg-white/[0.03] px-12 pt-5 pb-6">
          <div className="bf-logic-box bg-white/[0.04] border border-white/[0.08] rounded-[10px] p-[18px_24px] overflow-x-auto">
            <AnimatedLogicExpression />
          </div>
        </div>
      </div>
    </>
  );
}

export default BooleanForceBanner;