"use client";
import React from "react";

const ScrollStack = () => {
  const cards = [
    { title: "All on React Bits!", color: "#5338FF" },
    { title: "Components", color: "#5338FF" },
    { title: "Backgrounds", color: "#FF1E9C" },
    { title: "Components", color: "#5338FF" },
    { title: "Animations", color: "#FF1E9C" },
  ];

  const renderIcon = (index) => {
    const baseProps = {
      width: 120,
      height: 120,
      viewBox: "0 0 120 120",
      fill: "none",
      stroke: "white",
      strokeWidth: 10,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    };

    const type = index % 3;
    if (type === 0) {
      // 4 diamonds
      return (
        <svg aria-hidden="true" {...baseProps}>
          <rect x="48" y="10" width="24" height="24" rx="6" />
          <rect x="86" y="48" width="24" height="24" rx="6" />
          <rect x="10" y="48" width="24" height="24" rx="6" />
          <rect x="48" y="86" width="24" height="24" rx="6" />
        </svg>
      );
    }
    if (type === 1) {
      // image placeholder
      return (
        <svg aria-hidden="true" {...baseProps}>
          <rect x="10" y="10" width="100" height="100" rx="16" />
          <circle cx="44" cy="44" r="7" fill="white" stroke="none" />
          <path d="M22 90 L56 58 L98 98" />
        </svg>
      );
    }
    // play icon
    return (
      <svg aria-hidden="true" {...baseProps}>
        <rect x="10" y="10" width="100" height="100" rx="16" />
        <polygon points="52,44 82,60 52,76" fill="white" stroke="none" />
      </svg>
    );
  };

  return (
    <section className="scrollStack" aria-label="Stacked cards on scroll">
      {cards.map((card, index) => (
        <article
          key={index}
          className="card"
          style={{
            ["--offset"]: `${index * 88}px`,
            ["--bg"]: card.color,
          }}
        >
          <div className="cardInner">
            <h3 className="title">{card.title}</h3>
            <div className="accentBox">{renderIcon(index)}</div>
          </div>
        </article>
      ))}
      <div className="spacer" />

      <style jsx>{`
        .scrollStack {
          position: relative;
          padding: 8vh 0 12vh;
          background: transparent;
        }

        .card {
          position: sticky;
          top: clamp(12px, 6vh, 48px);
          margin: 0 auto;
          margin-top: var(--offset);
          max-width: 1080px;
          min-height: 72vh;
          padding: clamp(20px, 5vw, 56px);
          border-radius: 32px;
          background: var(--bg);
          color: #fff;
          box-shadow:
            0 30px 80px rgba(10, 6, 20, 0.45),
            inset 0 0 0 2px rgba(255, 255, 255, 0.06);
          transform-origin: center top;
        }

        .cardInner {
          display: grid;
          grid-template-columns: 1fr minmax(220px, 360px);
          align-items: center;
          gap: clamp(16px, 4vw, 40px);
        }

        .title {
          font-size: clamp(28px, 6vw, 64px);
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: 0.2px;
          margin: 0;
          text-shadow: 0 2px 0 rgba(0, 0, 0, 0.06);
        }

        .accentBox {
          display: grid;
          place-items: center;
          min-height: clamp(160px, 32vh, 320px);
          border-radius: 28px;
          border: 14px solid rgba(255, 255, 255, 0.96);
          background: rgba(255, 255, 255, 0.05);
        }

        .spacer {
          height: 40vh;
        }

        @media (max-width: 860px) {
          .cardInner {
            grid-template-columns: 1fr;
          }
          .accentBox {
            order: 2;
          }
        }
      `}</style>
    </section>
  );
};

export default ScrollStack;
