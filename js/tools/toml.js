/* =========================================================================
   Minimal JSON ⇄ TOML converter (no deps)
   Supports: string, int, float, bool, array, nested table.
   ========================================================================= */
export const TomlWriter = {
  jsonToToml(obj, prefix = "") {
    const lines = [];
    const scalars = [];
    const tables = [];
    for (const [k, v] of Object.entries(obj)) {
      if (v !== null && typeof v === "object" && !Array.isArray(v)) tables.push([k, v]);
      else scalars.push([k, v]);
    }
    for (const [k, v] of scalars) lines.push(`${quoteKey(k)} = ${formatVal(v)}`);
    for (const [k, v] of tables) {
      const fullKey = prefix ? `${prefix}.${quoteKey(k)}` : quoteKey(k);
      lines.push("", `[${fullKey}]`);
      lines.push(this.jsonToToml(v, fullKey));
    }
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  },
};

function quoteKey(k) { return /^[A-Za-z0-9_-]+$/.test(k) ? k : `"${k.replace(/"/g,'\\"')}"`; }
function formatVal(v) {
  if (v === null || v === undefined) return '""';
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") {
    if (/^ISODate\(/.test(v)) return v;
    return `"${v.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`;
  }
  if (Array.isArray(v)) return "[" + v.map(formatVal).join(", ") + "]";
  return JSON.stringify(v);
}

export const TomlReader = {
  tomlToJson(str) {
    const result = {};
    let current = result;
    const lines = str.split(/\r?\n/);
    for (let raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      // table header
      const header = line.match(/^\[([^\]]+)\]$/);
      if (header) {
        const keys = header[1].split(".").map(k => k.trim().replace(/^"|"$/g,""));
        current = result;
        for (const k of keys) {
          if (current[k] === undefined) current[k] = {};
          current = current[k];
        }
        continue;
      }
      // key = value
      const eq = line.match(/^([A-Za-z0-9_\-"]+)\s*=\s*(.+)$/);
      if (eq) {
        const key = eq[1].replace(/^"|"$/g,"");
        current[key] = parseVal(eq[2]);
      }
    }
    return result;
  },
};

function parseVal(v) {
  v = v.trim();
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
  if (v.startsWith("[") && v.endsWith("]")) {
    const inner = v.slice(1,-1).trim();
    if (!inner) return [];
    return inner.split(",").map(s => parseVal(s.trim()));
  }
  // string
  if (v.startsWith('"') && v.endsWith('"')) return v.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\");
  return v;
}
