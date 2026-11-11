// Shared harness for suites that drive a shipped Redis EVAL admission script
// (middleware.ts's UA quota, api/activitypub-html/render.ts's cold-render
// budget) without a Redis or Lua runtime on the host.
//
// Extracted verbatim from tests/middleware-ua-quota.test.mjs when render.ts
// gained the same admission pattern (paul-kinlan-me-stn4): the first version of
// that suite replaced `kv.eval` with a HAND-WRITTEN JS model of the script's
// semantics, which meant the Lua was never executed and the model could keep
// passing while the script changed underneath it (paul-kinlan-me-3s4). So the
// fake KV here EXECUTES the script text the module ships: `luaToJs` translates
// the construct subset the admission scripts actually use into a JS function
// and hands it a fake redis table. It is deliberately strict: an unrecognised
// line throws, because a silently skipped line is exactly the drift this
// harness exists to catch - a new Lua construct must fail loudly and be
// modelled.
//
// Stated limits, pinned rather than pretended:
//   * Redis's own atomicity is not reproduced; the fake runs one EVAL to
//     completion at a time, which is the order Redis guarantees for the whole
//     script, so concurrent request tests exercise admission accounting, not
//     SET .. NX race behaviour.
//   * TTLs are simulated on a fake clock the test advances; the scripts never
//     read a clock, so this models Redis's expiry, not the module's.
//   * The translator models LUA truthiness and the value semantics of
//     and/or/not (see LUA_RUNTIME). It does NOT model Lua's coercions:
//     arithmetic on strings, `..` concatenation, `#length` and `{[k]=v}` map
//     constructors are outside the subset and throw rather than being guessed
//     at (paul-kinlan-me-3hx).

// ---------------------------------------------------------------------------
// Lua -> JS, for the construct subset the admission scripts use.
//
// Supported: `--` comments, `local x = expr`, `if expr then`, `else`, `end`,
// `return { ... }`, and bare calls. Expressions support identifiers, string/number
// literals, `redis.call(...)`, `tonumber(...)`, table constructors used as return
// values, `not`, `and`, `or` (Lua operand semantics, see LUA_RUNTIME) and
// `==`/`~=`/`>=`/`<` comparisons.
//
// Anything else throws. That is the point: the harness must never quietly ignore a line
// of the script it was asked to execute.
// ---------------------------------------------------------------------------
// Runtime the translated script calls into. It exists because Lua's truthiness and its
// and/or value semantics are NOT JavaScript's: in Lua only `false` and `nil` are falsy, so
// 0 and '' are TRUTHY, and `a or b` returns an operand rather than a boolean. Translating
// `if used then` straight to `if (used) {` modelled JS, and would have entered the wrong
// branch (silently, and green) the day the script gained a numeric condition
// (paul-kinlan-me-3hx).
export const LUA_RUNTIME = [
  'const __luaTruthy = (value) => value !== false && value !== null && value !== undefined;',
  // Single evaluation of the left operand, as Lua does: the script's `or` default wraps a
  // redis.call, so duplicating it would mean two round-trips.
  'const __luaOr = (left, right) => { const value = left(); return __luaTruthy(value) ? value : right(); };',
  'const __luaAnd = (left, right) => { const value = left(); return __luaTruthy(value) ? right() : value; };',
].join('\n');

// Split an expression on a keyword at paren depth 0, ignoring string literals.
function splitTopLevel(expression, keyword) {
  let depth = 0;
  let quote = null;
  for (let index = 0; index < expression.length; index += 1) {
    const character = expression[index];
    if (quote !== null) {
      if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      continue;
    }
    if (character === '(') depth += 1;
    else if (character === ')') depth -= 1;
    else if (depth === 0 && expression.startsWith(keyword, index)) {
      const left = expression.slice(0, index).trim();
      const right = expression.slice(index + keyword.length).trim();
      if (left !== '' && right !== '') return [left, right];
    }
  }
  return null;
}

// Apply replacements to code only, so a string literal that happens to contain `nil` or
// `==` is left alone.
function mapCodeSegments(expression, transform) {
  const parts = [];
  let code = '';
  let index = 0;
  while (index < expression.length) {
    const character = expression[index];
    if (character !== "'" && character !== '"') {
      code += character;
      index += 1;
      continue;
    }
    parts.push(transform(code));
    code = '';
    let literal = character;
    index += 1;
    while (index < expression.length && expression[index] !== character) {
      literal += expression[index];
      index += 1;
    }
    literal += character;
    index += 1;
    parts.push(literal);
  }
  parts.push(transform(code));
  return parts.join('');
}

// Precedence, loosest first, as Lua binds it: or, and, not, then a primary expression.
const luaOr = (expression) => {
  const split = splitTopLevel(expression, ' or ');
  if (!split) return luaAnd(expression);
  return `__luaOr(() => ${luaOr(split[0])}, () => ${luaOr(split[1])})`;
};

const luaAnd = (expression) => {
  const split = splitTopLevel(expression, ' and ');
  if (!split) return luaNot(expression);
  return `__luaAnd(() => ${luaAnd(split[0])}, () => ${luaAnd(split[1])})`;
};

const luaNot = (expression) => {
  const negated = expression.match(/^not\b\s*([\s\S]+)$/);
  if (negated) return `!__luaTruthy(${luaNot(negated[1])})`;
  return luaTerm(expression);
};

// A primary expression: calls, literals, and the operators that mean the same thing in
// both languages. Table constructors are handled by luaTable, never here.
const luaTerm = (expression) =>
  mapCodeSegments(expression, (code) =>
    code
      .replace(/\btonumber\s*\(/g, 'Number(')
      .replace(/\bnil\b/g, 'undefined')
      // Both comparison operators in ONE pass. Replacing '~=' first and then '==' rewrites
      // the '==' inside the '!==' it just wrote, producing the invalid '!===' and a
      // SyntaxError from new Function with no clue what happened (paul-kinlan-me-k42).
      .replace(/~=|==/g, (operator) => (operator === '~=' ? '!==' : '===')),
  );

const luaExpr = (expression) => luaOr(expression.trim());

// A condition needs Lua truthiness. `not ...` already produces a boolean, so wrapping it
// again is harmless but noisy; everything else must be tested, because Lua and JS disagree
// about 0 and ''.

// Split a comma-separated list at paren depth 0, ignoring string literals, so a table
// constructor survives calls with their own commas: {1, redis.call('INCR', KEYS[1])}.
function splitTopLevelList(expression) {
  const items = [];
  let depth = 0;
  let quote = null;
  let current = '';
  for (const character of expression) {
    if (quote !== null) {
      current += character;
      if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      current += character;
      continue;
    }
    if (character === '(' || character === '[') depth += 1;
    else if (character === ')' || character === ']') depth -= 1;
    if (character === ',' && depth === 0) {
      items.push(current.trim());
      current = '';
      continue;
    }
    current += character;
  }
  items.push(current.trim());
  return items.filter((item) => item !== '');
}

// `{a, b}` is Lua's array constructor; `{[k]=v}` / `{k = v}` is a map constructor this
// harness does not model, so it throws instead of translating something it cannot mean.
const luaTable = (inner) => {
  if (/(^|,)\s*(\[[^\]]*\]|[A-Za-z_]\w*)\s*=(?!=)/.test(inner)) {
    throw new Error(`lua-admission harness: unsupported Lua table constructor: {${inner}}`);
  }
  return `[${splitTopLevelList(inner).map((item) => luaExpr(item)).join(', ')}]`;
};

export function luaToJs(source) {
  const statements = [];
  for (const raw of source.split('\n')) {
    const line = raw.trim();
    if (line === '' || line.startsWith('--')) continue;

    const local = line.match(/^local\s+([A-Za-z_]\w*)\s*=\s*(.+)$/);
    if (local) {
      const table = local[2].trim().match(/^\{([^{}]*)\}$/);
      statements.push(`let ${local[1]} = ${table ? luaTable(table[1]) : luaExpr(local[2])};`);
      continue;
    }

    const condition = line.match(/^if\s+(.+)\s+then$/);
    if (condition) {
      const translated = luaExpr(condition[1]);
      const tested = translated.startsWith('!__luaTruthy(') ? translated : `__luaTruthy(${translated})`;
      statements.push(`if (${tested}) {`);
      continue;
    }

    if (line === 'else') {
      statements.push('} else {');
      continue;
    }

    if (line === 'end') {
      statements.push('}');
      continue;
    }

    const returned = line.match(/^return\s+\{([\s\S]*)\}$/);
    if (returned) {
      statements.push(`return ${luaTable(returned[1])};`);
      continue;
    }

    // A bare statement: a redis.call(...) whose reply the script ignores.
    if (/^[A-Za-z_][\w.]*\s*\(.*\)$/.test(line)) {
      statements.push(`${luaExpr(line)};`);
      continue;
    }

    throw new Error(
      `lua-admission harness: unsupported Lua construct, model it here rather than skipping it: ${line}`,
    );
  }
  return statements.join('\n');
}

const compiled = new Map();
export const compileScript = (source) => {
  if (!compiled.has(source)) {
    compiled.set(source, new Function('redis', 'KEYS', 'ARGV', `${LUA_RUNTIME}\n${luaToJs(source)}`));
  }
  return compiled.get(source);
};

// Fake redis: the commands the admission scripts call, with Redis's TTL semantics
// (INCR preserves a key's TTL; SET with EX sets it; SET NX refuses an existing key;
// EXPIRE sets the TTL of an existing key), on a simulated clock so expiry is
// observable without waiting 60 real seconds. Suites subclass this to add their
// own key-prefix assertion helpers and to observe writes through `noteSet`.
export class FakeRedis {
  values = new Map(); // key -> string value
  expiresAt = new Map(); // key -> absolute simulated second
  nowSeconds = 1_200_000; // arbitrary epoch
  evalCalls = 0;

  advanceSeconds(seconds) {
    this.nowSeconds += seconds;
    this.purge();
  }

  advanceMinutes(minutes) {
    this.advanceSeconds(minutes * 60);
  }

  // A frozen clock has to move BOTH clocks: the fake's TTL clock and the module's own
  // Date.now(), which is what names the minute's budget key. Advancing only this one was
  // the defect in paul-kinlan-me-bgn: the suite never crossed a module minute, so a
  // module whose minute never rotates passed.
  frozen(ms) {
    this.nowSeconds = Math.floor(ms / 1000);
    return this;
  }

  purge() {
    for (const [key, at] of this.expiresAt) {
      if (at <= this.nowSeconds) {
        this.values.delete(key);
        this.expiresAt.delete(key);
      }
    }
  }

  // Hook for subclasses: observe every successful SET (the UA suite counts
  // admissions and budget keys this way).
  noteSet(_key) {}

  ttl(key) {
    this.purge();
    if (!this.values.has(key)) return -2; // Redis: no such key
    const at = this.expiresAt.get(key);
    return at === undefined ? -1 : at - this.nowSeconds; // -1: key has no expiry
  }

  // --- the redis table the script talks to --------------------------------
  eval(script, keys, args) {
    this.evalCalls += 1;
    this.script = script;
    this.lastKeys = keys;
    this.lastArgs = args;
    const run = compileScript(script);
    // Lua tables are 1-based: Redis hands KEYS and ARGV to a script as tables indexed
    // from 1, so a JS array would silently shift every lookup by one (KEYS[1] would be
    // the SECOND key, ARGV[1] the second argument).
    const luaKeys = [null, ...keys];
    const luaArgs = [null, ...args];
    // Redis serialises EVAL: one script runs to completion before the next starts.
    return run({ call: (command, ...commandArgs) => this.call(String(command).toUpperCase(), commandArgs) }, luaKeys, luaArgs);
  }

  call(command, args) {
    this.purge();
    switch (command) {
      case 'GET': {
        const value = this.values.get(args[0]);
        return value === undefined ? null : value;
      }
      case 'EXISTS':
        return this.values.has(args[0]) ? 1 : 0;
      case 'INCR': {
        // Redis INCR keeps the key's existing TTL.
        const next = Number(this.values.get(args[0]) ?? 0) + 1;
        this.values.set(args[0], String(next));
        return next;
      }
      case 'EXPIRE': {
        if (!this.values.has(args[0])) return 0;
        this.expiresAt.set(args[0], this.nowSeconds + Number(args[1]));
        return 1;
      }
      case 'SET': {
        const [key, value, ...options] = args;
        let onlyIfAbsent = false;
        let expiresIn = null;
        for (let index = 0; index < options.length; index += 1) {
          const option = String(options[index]).toUpperCase();
          if (option === 'NX') onlyIfAbsent = true;
          else if (option === 'EX') {
            expiresIn = Number(options[index + 1]);
            index += 1;
          } else {
            throw new Error(`fake redis: unsupported SET option ${options[index]}`);
          }
        }
        if (onlyIfAbsent && this.values.has(key)) return null;
        this.values.set(key, String(value));
        this.noteSet(key);
        if (expiresIn === null) this.expiresAt.delete(key);
        else this.expiresAt.set(key, this.nowSeconds + expiresIn);
        return { ok: 'OK' };
      }
      default:
        throw new Error(`fake redis: unsupported command ${command}`);
    }
  }
}

// The modules name the minute they admit into from Date.now(), so a test that only
// advances the fake's TTL clock never crosses a minute: the budget key stays the same,
// and the cap holds forever. Freeze the real clock for the duration of a test and move
// the fake's TTL clock with it, so "the next minute" means the same thing to both.
export const freezeClock = (kv, startMs) => {
  const realNow = Date.now;
  let ms = startMs;
  Date.now = () => ms;
  kv.frozen(ms);
  return {
    minute: () => Math.floor(ms / 60000),
    // Advance both clocks by the same amount; callers use whole seconds.
    advanceMs(deltaMs) {
      ms += deltaMs;
      kv.advanceSeconds(deltaMs / 1000);
    },
    restore() {
      Date.now = realNow;
    },
  };
};

// A frozen instant one millisecond before a minute rolls over - the worst place to test
// a boundary, which is the point.
export const LAST_MS_OF_A_MINUTE = Date.parse('2026-01-01T00:00:59.999Z');
