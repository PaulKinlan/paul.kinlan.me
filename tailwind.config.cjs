/**
 * Build-time Tailwind config. Replaces the former Tailwind Play CDN runtime
 * (cdn.tailwindcss.com) which was render-blocking and JIT-compiled CSS in the
 * browser. The theme.extend block below mirrors the inline `tailwind.config`
 * that was previously passed to the Play CDN so styling is preserved exactly.
 *
 * Built with: npm run build:css  (tailwindcss CLI -> static/css/tailwind.css)
 */
module.exports = {
  // Comprehensive globs: every place that can emit Tailwind utility classes.
  content: [
    "./layouts/**/*.html",
    "./layouts/**/*.txt",
    "./layouts/**/*.xml",
    "./themes/**/layouts/**/*.html",
    "./content/**/*.md",
    "./content/**/*.markdown",
    "./content/**/*.html",
    "./assets/**/*.js",
    "./static/**/*.html",
    "./data/**/*.{toml,yaml,yml,json}",
  ],
  // Drive dark utilities from the user's system preference (no JS toggle).
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            fontSize: "20px",
            lineHeight: "1.8",
            color: "#111827",
            a: {
              color: "#2563eb",
              "&:hover": {
                color: "#1d4ed8",
              },
            },
            pre: {
              backgroundColor: "#f9fafb",
              color: "#111827",
            },
            code: {
              color: "#111827",
              backgroundColor: "#f3f4f6",
              padding: "0.25rem",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      },
      spacing: {
        "container-max": "1140px",
        gutter: "32px",
        "section-padding": "120px",
        "card-padding": "40px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
