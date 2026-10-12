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

const fs = require("fs");
const path = require("path");

/**
 * The classes written by hand in post markup, i.e. `class="..."` in content/.
 *
 * Tailwind's default extractor treats every word in a file as a class
 * candidate, so scanning the blog compiled English words into the stylesheet:
 * `.invisible` (a post links the podcast "99% Invisible"), `.static`,
 * `.collapse`, `.table`, `.ring`, `.blur`,
 * `[httparchive:lighthouse.2018_08_01_mobile]` and more, none of which any
 * page uses. Because assets/css/tailwind.css is committed, those bogus rules
 * rewrote the tracked asset on every build, and the next `fleet-check` refuses
 * to run on the dirty worktree it left behind.
 *
 * So content/ is not scanned as prose. These classes are read out of the post
 * markup instead, which keeps utility classes written in post HTML (e.g. the
 * `<span class="inline">` spans in CodeRay-highlighted code) without letting
 * the words around them into the stylesheet.
 */
function classesInContentMarkup(dir = path.join(__dirname, "content")) {
  const found = new Set();
  const read = (file) => {
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      return;
    }
    // Whole file, so a class attribute split across lines still counts.
    // Quotes or not, and any case: HTML attribute names are case-insensitive.
    for (const m of text.matchAll(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi)) {
      for (const token of (m[1] || m[2] || m[3] || "").split(/\s+/)) {
        if (token) found.add(token);
      }
    }
  };
  const walk = (d) => {
    let entries;
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (/\.(md|markdown|html?)$/i.test(entry.name)) read(p);
    }
  };
  walk(dir);
  return [...found].sort();
}

module.exports = {
  // Templates and data, scanned normally. Blog content is deliberately not here:
  // see classesInContentMarkup above for how its markup classes get compiled.
  content: [
    "./layouts/**/*.html",
    "./layouts/**/*.txt",
    "./layouts/**/*.xml",
    "./themes/**/layouts/**/*.html",
    "./assets/**/*.js",
    "./static/**/*.html",
    "./data/**/*.{toml,yaml,yml,json}",
  ],
  // Only the classes content actually writes in markup; nothing prose-derived.
  safelist: classesInContentMarkup(),
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
