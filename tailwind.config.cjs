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
 * Read the class names a tree of files writes in `class="..."` attributes,
 * rather than treating every word in the file as a class candidate.
 *
 * Tailwind's default extractor takes every word in a scanned file as a
 * candidate, so scanning markup as prose compiled English words into the
 * stylesheet: `.invisible` (a post links the podcast "99% Invisible"),
 * `.static`, `.collapse`, `.table`, `.ring`, `.blur`,
 * `[httparchive:lighthouse.2018_08_01_mobile]` and more, none of which any
 * page uses. Because assets/css/tailwind.css is committed, those bogus rules
 * rewrote the tracked asset on every build, and the next `fleet-check` refuses
 * to run on the dirty worktree it left behind.
 *
 * So neither content/ nor layouts/ is scanned as prose; both are read through
 * this function, which keeps the utility classes their markup really writes
 * (e.g. the `<span class="inline">` spans in CodeRay-highlighted code, or a
 * class inside a Hugo action) without letting the words around them in.
 */
function classesInClassAttributes(dir, scannable) {
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
      // A Hugo action in the value is not a class name; the literal text around
      // it is. `class="pb-section-padding {{.Type}}"` writes
      // pb-section-padding, and `class="{{ if .Params.image_header }}relative
      // overflow-hidden{{end}}"` writes relative and overflow-hidden. Splitting
      // the raw value instead yields the single token
      // `}}relative`/`overflow-hidden{{end}}`, which Tailwind silently ignores -
      // dropping classes the site really uses. A class a template builds at
      // build time ({{.Type}}, a variable, data) is the one thing this cannot
      // see; such a class has to be written out in the safelist by hand.
      const value = (m[1] || m[2] || m[3] || "").replace(/\{\{[\s\S]*?\}\}/g, " ");
      for (const token of value.split(/\s+/)) {
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
      else if (scannable(entry.name)) read(p);
    }
  };
  walk(dir);
  return [...found].sort();
}

/** The classes written by hand in post markup, i.e. `class="..."` in content/. */
function classesInContentMarkup(dir = path.join(__dirname, "content")) {
  return classesInClassAttributes(dir, (name) => /\.(md|markdown|html?)$/i.test(name));
}

/**
 * The classes written in layouts. Every file, whatever it renders: a layout's
 * extension says nothing about whether it writes markup (the .ajson and .xml
 * layouts here do), and attribute extraction cannot be fooled by prose, so an
 * extension filter would only risk missing a class. themes/ is walked the same
 * way; this repo has no themes directory, and the walk is a no-op when absent.
 */
function classesInLayoutMarkup(root = __dirname) {
  const anyFile = () => true;
  return [
    ...classesInClassAttributes(path.join(root, "layouts"), anyFile),
    ...classesInClassAttributes(path.join(root, "themes"), anyFile),
  ];
}

module.exports = {
  // Templates and data, scanned normally. No `layouts/**` glob: a layout is a
  // template, so scanning it as prose put every English word in a template
  // comment into the shipped stylesheet (`.static`, `.truncate` from a Hugo
  // `| truncate 160`, `.absolute` from a `style="position: absolute"`), and
  // left the tracked stylesheet dirty for whoever next touched a layout. Its
  // classes are read from its markup by classesInLayoutMarkup() instead.
  content: [
    "./assets/**/*.js",
    "./static/**/*.html",
    "./data/**/*.{toml,yaml,yml,json}",
  ],
  // Only the classes content and layouts actually write in markup; nothing
  // prose-derived.
  safelist: [...new Set([...classesInContentMarkup(), ...classesInLayoutMarkup()])].sort(),
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
