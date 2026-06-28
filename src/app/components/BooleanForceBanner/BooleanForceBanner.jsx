"use client";

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

  return (
    <div
      style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "13px",
        lineHeight: "1.9",
      }}
    >
      {lines.map((line, li) => (
        <div key={li} style={{ whiteSpace: "nowrap" }}>
          {line.map((tok, ti) =>
            tok.type === "cursor" ? (
              <span
                key={ti}
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "14px",
                  background: "#F97316",
                  verticalAlign: "middle",
                  animation: "bfBlink 1s step-end infinite",
                }}
              />
            ) : (
              <span key={ti} style={{ color: tokenColors[tok.type] }}>
                {tok.text}
              </span>
            )
          )}
        </div>
      ))}
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
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
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

        .bf-pause-btn {
          position: absolute;
          bottom: 16px;
          left: 48px;
          z-index: 3;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 3px;
          opacity: 0.4;
          padding: 0;
          transition: opacity 0.2s;
        }
        .bf-pause-btn:hover {
          opacity: 0.75;
        }

        @media (max-width: 680px) {
          .bf-hero-row {
            flex-direction: column !important;
            padding: 76px 24px 36px !important;
            gap: 24px !important;
          }
          .bf-right-col {
            padding-left: 0 !important;
            border-left: none !important;
            border-top: 1px solid rgba(255,255,255,0.12) !important;
            padding-top: 28px !important;
          }
          .bf-logic-strip {
            padding: 16px 24px 20px !important;
          }
        }
      `}</style>

      <div
        style={{
          background: "#080808",
          fontFamily: "'Inter', sans-serif",
          borderRadius: "0px",
          overflow: "hidden",
          width: "100%",
          boxSizing: "border-box",
          margin: 0,
          padding: 0,
        }}
      >
        {/* ── Hero Row ── */}
        <div
          className="bf-hero-row"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            minHeight: "100vh",
            /*
              padding-top 76px = exact navbar height → content starts flush below navbar
              No more pt-20 in ClientLayout means this is the ONLY offset applied.
            */
            padding: "0px 48px 56px",
            gap: "48px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Navy glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 55% 90% at 30% 50%, rgba(30,58,138,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          <ParticleCanvas paused={paused} />

          {/* LEFT — headline */}
          <div style={{ flex: "1.45", position: "relative", zIndex: 2 }}>
            {isLoaded && (
              <h1
                className="bf-fadein bf-fadein-d1"
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 5.8vw, 52px)",
                  fontWeight: 500,
                  lineHeight: 1.0,
                  letterSpacing: "-0.5px",
                  color: "#ffffff",
                  textTransform: "uppercase",
                }}
              >
                IF (Business = Ambition)
                <br />
                THEN (Boolean
                <span style={{ color: "#F97316", fontStyle: "normal", display: "inline" }}>
                  &gt;
                </span>
                Force
                <br />
                == Growth)
              </h1>
            )}
          </div>

          {/* RIGHT — copy + CTA */}
          <div
            className="bf-right-col"
            style={{
              flex: "1",
              paddingLeft: "40px",
              borderLeft: "1px solid rgba(255,255,255,0.12)",
              position: "relative",
              zIndex: 2,
              alignSelf: "center",
            }}
          >
            {isLoaded && (
              <div
                className="bf-fadein bf-fadein-d2"
                style={{
                  width: "36px",
                  height: "3px",
                  background: "#F97316",
                  marginBottom: "14px",
                  borderRadius: "2px",
                }}
              />
            )}

            {isLoaded && (
              <p
                className="bf-fadein bf-fadein-d2"
                style={{ margin: "0 0 12px", fontSize: "17px", fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}
              >
                Shaping tomorrow, today
              </p>
            )}

            {isLoaded && (
              <p
                className="bf-fadein bf-fadein-d3"
                style={{
                  margin: "0 0 28px",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.75,
                  maxWidth: "360px",
                }}
              >
                Engineering high-performance identities and software for
                businesses that refuse to stay small. We turn your variables
                into constants through precision code and emotive design.
              </p>
            )}

            {isLoaded && (
              <button
                className="bf-fadein bf-fadein-d4 bf-cta-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#ffffff",
                  fontFamily: "inherit",
                }}
              >
                Execute Project
                <span
                  className="bf-arrow-box"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "#F97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    transition: "background 0.2s",
                    fontSize: "13px",
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  &#62;
                </span>
              </button>
            )}
          </div>

          {/* Pause / Play */}
          <button
            className="bf-pause-btn"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play particles" : "Pause particles"}
          >
            {paused ? (
              <span
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "7px solid transparent",
                  borderBottom: "7px solid transparent",
                  borderLeft: "12px solid #fff",
                  display: "inline-block",
                }}
              />
            ) : (
              <>
                <span style={{ width: "3px", height: "14px", background: "#fff", borderRadius: "1px", display: "block" }} />
                <span style={{ width: "3px", height: "14px", background: "#fff", borderRadius: "1px", display: "block" }} />
              </>
            )}
          </button>
        </div>

        {/* ── Logic Expression Strip ── */}
        <div
          className="bf-logic-strip"
          style={{
            borderTop: "1px solid rgba(249,115,22,0.18)",
            background: "rgba(255,255,255,0.03)",
            padding: "20px 48px 24px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "18px 24px",
              overflowX: "auto",
            }}
          >
            <AnimatedLogicExpression />
          </div>
        </div>
      </div>
    </>
  );
}

export default BooleanForceBanner;