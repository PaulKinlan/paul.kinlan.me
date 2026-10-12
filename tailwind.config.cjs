/**
 * Build-time Tailwind config. Replaces the former Tailwind Play CDN runtime
 * (cdn.tailwindcss.com) which was render-blocking and JIT-compiled CSS in the
 * browser. The theme.extend block below mirrors the inline `tailwind.config`
 * that was previously passed to the Play CDN so styling is preserved exactly.
 *
 * Built with: npm run build:css  (tailwindcss CLI -> assets/css/tailwind.css)
 *
 * The generated assets/css/tailwind.css is committed on purpose: Vercel builds
 * this site with `hugo -D --gc`, which does NOT run `npm run build:css`, so the
 * committed file is the stylesheet production actually serves.
 */
module.exports = {
  // Template and data globs only.
  //
  // content/** is deliberately NOT scanned. Tailwind's extractor treats every
  // word in a file as a class candidate, so scanning the blog compiled English
  // words into the stylesheet: `.invisible` (a post links the podcast "99%
  // Invisible"), `.outline` (a `<nav class="outline toc">` shown inside a code
  // sample), `.static`, `.collapse`, `.table`, `.ring`, `.blur`,
  // `[httparchive:lighthouse.2018_08_01_mobile]` and 24 more. Those bogus rules
  // rewrote the committed asset on every build, which needed a manual restore
  // before the next `fleet-check` would run (it refuses a dirty worktree).
  //
  // The scan contributed zero classes the site needs: of the 31 rules it caused,
  // the only one any rendered page references is `.inline` on a `<span>` in
  // CodeRay output, where `display: inline` is the browser default (before/after
  // screenshots of 7 pages: 0 differing pixels). If a post ever needs a utility
  // class in raw HTML, add it to `safelist` below rather than re-adding
  // content/**.
  content: [
    "./layouts/**/*.html",
    "./layouts/**/*.txt",
    "./layouts/**/*.xml",
    "./themes/**/layouts/**/*.html",
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
            blockquote: {
              fontStyle: "normal",
              fontWeight: "400",
              color: "#374151",
              backgroundColor: "#f9fafb",
              borderInlineStartColor: "#2563eb",
              borderInlineStartWidth: "3px",
              borderRadius: "0.375rem",
              marginTop: "1.5em",
              marginBottom: "1.5em",
              paddingTop: "0.85rem",
              paddingBottom: "0.85rem",
              paddingInlineStart: "1.25rem",
              paddingInlineEnd: "1.25rem",
            },
            "blockquote p": {
              marginTop: "0",
              marginBottom: "0",
            },
            "blockquote p:first-of-type::before": {
              content: '""',
            },
            "blockquote p:last-of-type::after": {
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
