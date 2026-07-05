/* =========================================================================
   Development tools
   ========================================================================= */
import { icons } from "../icons.js";
import { registerTool } from "../views/tool.js";
import { escapeHtml, makeCopyButton, debounce } from "../utils.js";

/* ============== Git cheatsheet ============== */
registerTool("git-memo", {
  mount(el) {
    const sections = [
      ["Setup", [["git config --global user.name \"Name\"","set your name"],["git config --global user.email \"you@x.com\"","set your email"],["git config --global init.defaultBranch main","default branch name"],["git config --global core.editor \"code --wait\"","set editor"]]],
      ["Start a project", [["git init","initialize a repo"],["git clone <url>","clone a remote"],["git clone <url> <dir>","clone into a folder"]]],
      ["Daily workflow", [["git status","show working tree status"],["git add <file>","stage a file"],["git add .","stage all changes"],["git commit -m \"msg\"","commit staged changes"],["git push","push to remote"],["git pull","fetch + merge"]]],
      ["Branching", [["git branch","list branches"],["git branch <name>","create a branch"],["git switch <name>","switch to a branch"],["git switch -c <name>","create + switch"],["git merge <name>","merge a branch in"],["git branch -d <name>","delete a branch"]]],
      ["Inspect history", [["git log --oneline","compact log"],["git log --graph --oneline --all","visual graph"],["git diff","unstaged changes"],["git diff --staged","staged changes"],["git show <hash>","show a commit"]]],
      ["Undo", [["git restore <file>","discard unstaged changes"],["git restore --staged <file>","unstage"],["git reset --soft HEAD~1","undo last commit, keep changes"],["git reset --hard HEAD~1","undo last commit, discard changes"],["git revert <hash>","create an inverse commit"]]],
      ["Remote", [["git remote -v","list remotes"],["git remote add origin <url>","add a remote"],["git push -u origin main","push + set upstream"],["git fetch","download objects"]]],
      ["Stash", [["git stash","stash changes"],["git stash list","list stashes"],["git stash pop","apply + drop last"],["git stash drop","drop last stash"]]],
    ];
    el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--sp-4);">
      ${sections.map(([title, items]) => `
        <div style="padding:var(--sp-4);background:var(--surface-2);border-radius:var(--r-md);border:1px solid var(--border-soft);">
          <div style="font-family:var(--font-display);font-weight:600;font-size:var(--fs-sm);color:var(--accent-text);margin-bottom:var(--sp-3);">${title}</div>
          ${items.map(([cmd, desc]) => `
            <div style="margin-bottom:10px;">
              <code style="display:block;font-size:11.5px;background:var(--surface);padding:6px 8px;border-radius:5px;border:1px solid var(--border);color:var(--text);overflow-x:auto;white-space:nowrap;">${escapeHtml(cmd)}</code>
              <div style="font-size:var(--fs-xs);color:var(--muted);margin-top:3px;">${desc}</div>
            </div>`).join("")}
        </div>`).join("")}
    </div>`;
  }
});

/* ============== Random port generator ============== */
registerTool("random-port-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <label class="field-label" style="margin:0;">Count</label>
          <input class="input" id="rp-count" type="number" value="5" min="1" max="100" style="max-width:100px;">
          <button class="btn btn-primary" id="rp-gen">${icons.refresh} Generate</button>
        </div>
        <div class="output-box scroll" id="rp-out" style="min-height:160px;"></div>
      </div>`;
    const out = el.querySelector("#rp-out");
    function run() {
      const n = Math.max(1, Math.min(100, +el.querySelector("#rp-count").value || 5));
      const ports = new Set();
      while (ports.size < n) ports.add(1024 + Math.floor(Math.random() * (65535 - 1024)));
      out.innerHTML = "";
      [...ports].forEach(p => {
        const row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--border-soft);";
        const span = document.createElement("span");
        span.style.cssText = "flex:1;color:var(--accent-text);";
        span.textContent = p;
        row.append(span, makeCopyButton(() => p));
        out.append(row);
      });
    }
    el.querySelector("#rp-gen").addEventListener("click", run);
    run();
  }
});

/* ============== Crontab generator ============== */
registerTool("crontab-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Cron expression</label>
        <input class="input" id="cr-in" value="*/5 9-17 * * 1-5" style="font-family:var(--font-mono);">
        <div class="output-box" id="cr-out">—</div>
        <div class="muted-line">Field order: minute, hour, day-of-month, month, day-of-week.</div>
        <details style="margin-top:var(--sp-3);">
          <summary style="cursor:pointer;color:var(--accent-text);font-size:var(--fs-sm);">Common examples</summary>
          <div style="margin-top:var(--sp-3);display:grid;gap:6px;">
            ${[
              ["@yearly","Once a year (Jan 1, 00:00)"],
              ["@monthly","First day of every month"],
              ["@weekly","Every Sunday at 00:00"],
              ["@daily","Every day at 00:00"],
              ["@hourly","Top of every hour"],
              ["0 */2 * * *","Every 2 hours"],
              ["*/15 * * * *","Every 15 minutes"],
            ].map(([c,d]) => `<button class="btn btn-sm btn-ghost" style="justify-content:flex-start;font-family:var(--font-mono);" data-c="${c}"><strong style="color:var(--accent-text);">${c}</strong> &nbsp;<span class="muted-line">${d}</span></button>`).join("")}
          </div>
        </details>
      </div>`;
    const inp = el.querySelector("#cr-in");
    const out = el.querySelector("#cr-out");
    const aliases = { "@yearly":"0 0 1 1 *","@annually":"0 0 1 1 *","@monthly":"0 0 1 * *","@weekly":"0 0 * * 0","@daily":"0 0 * * *","@midnight":"0 0 * * *","@hourly":"0 * * * *" };
    function describe(expr) {
      if (aliases[expr]) expr = aliases[expr];
      const parts = expr.trim().split(/\s+/);
      if (parts.length !== 5) return { ok:false, msg:`Expected 5 fields, got ${parts.length}.` };
      const [m, h, dom, mon, dow] = parts;
      const lines = [];
      // minute
      lines.push(["Minute", fieldDesc(m, 0, 59, "past the hour")]);
      lines.push(["Hour", fieldDesc(h, 0, 23, "")]);
      lines.push(["Day of month", fieldDesc(dom, 1, 31, "")]);
      lines.push(["Month", fieldDesc(mon, 1, 12, "")]);
      const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      let dowDesc;
      if (dow === "*") dowDesc = "every day of the week";
      else if (/^\d+$/.test(dow)) dowDesc = `on ${days[+dow % 7]}`;
      else if (dow.startsWith("*/")) dowDesc = `every ${dow.slice(2)} days`;
      else dowDesc = dow;
      lines.push(["Day of week", dowDesc]);
      return { ok:true, lines };
    }
    function fieldDesc(v, min, max, suffix) {
      if (v === "*") return `every value (${min}-${max})`;
      if (v.startsWith("*/")) return `every ${v.slice(2)} ${suffix||"unit"}`;
      if (v.includes(",")) return `at ${v}`;
      if (v.includes("-")) return `between ${v}`;
      return v;
    }
    function run() {
      const res = describe(inp.value);
      if (!res.ok) { out.innerHTML = `<span style="color:var(--rose);">${res.msg}</span>`; return; }
      out.innerHTML = `<div style="display:grid;grid-template-columns:140px 1fr;gap:6px 16px;">${
        res.lines.map(([k,v]) => `<span style="color:var(--muted);font-size:var(--fs-xs);text-transform:uppercase;">${k}</span><span>${escapeHtml(v)}</span>`).join("")
      }</div>`;
    }
    inp.addEventListener("input", debounce(run, 80));
    el.querySelectorAll("[data-c]").forEach(b => b.addEventListener("click", () => { inp.value = b.dataset.c; run(); }));
    run();
  }
});

/* ============== Chmod calculator ============== */
registerTool("chmod-calculator", {
  mount(el) {
    const perms = [
      ["Owner", "owner"],
      ["Group", "group"],
      ["Other", "other"],
    ];
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          ${perms.map(([label, key]) => `
            <div>
              <div class="field-label">${label}</div>
              <div class="row">
                ${["read","write","execute"].map((p,i) => `
                  <label class="row" style="gap:6px;padding:8px 12px;background:var(--surface-2);border-radius:var(--r-md);cursor:pointer;font-size:var(--fs-sm);">
                    <input type="checkbox" data-perm="${key}-${"rwx"[i]}"> ${"rwx"[i]} · ${p}
                  </label>`).join("")}
              </div>
            </div>`).join("")}
        </div>
        <div class="stack">
          <label class="field-label">Symbolic</label>
          <div class="output-box" id="ch-sym" style="font-size:var(--fs-xl);text-align:center;font-weight:700;color:var(--accent-text);">———</div>
          <label class="field-label">Numeric (octal)</label>
          <div class="output-box" id="ch-num" style="font-size:var(--fs-xl);text-align:center;font-weight:700;color:var(--accent-text);">000</div>
          <label class="field-label">Command</label>
          <div class="output-box" id="ch-cmd" style="font-family:var(--font-mono);">chmod 000 file</div>
        </div>
      </div>`;
    const checks = el.querySelectorAll("[data-perm]");
    function run() {
      const groups = ["owner","group","other"];
      let sym = "", num = "";
      groups.forEach(g => {
        let s = "";
        let n = 0;
        ["r","w","x"].forEach((p, i) => {
          const c = el.querySelector(`[data-perm="${g}-${p}"]`);
          if (c.checked) { s += p; n += 4 >> i; } else s += "-";
        });
        sym += s; num += n;
      });
      el.querySelector("#ch-sym").textContent = sym;
      el.querySelector("#ch-num").textContent = num;
      el.querySelector("#ch-cmd").textContent = `chmod ${num} file`;
    }
    checks.forEach(c => c.addEventListener("change", run));
    run();
  }
});

/* ============== Regex tester ============== */
registerTool("regex-tester", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <span style="font-family:var(--font-mono);color:var(--muted);">/</span>
          <input class="input" id="rx-pattern" value="\\b(\\w+)@(\\w+\\.\\w+)\\b" style="font-family:var(--font-mono);flex:1;">
          <span style="font-family:var(--font-mono);color:var(--muted);">/</span>
          <input class="input" id="rx-flags" value="g" style="max-width:80px;font-family:var(--font-mono);">
        </div>
        <label class="field-label">Test string</label>
        <textarea class="textarea" id="rx-text">Reach out to alice@example.com or bob@test.org for details.</textarea>
        <div class="row">
          <span id="rx-status" class="muted-line"></span>
          <div id="rx-matches-count"></div>
        </div>
        <div>
          <label class="field-label">Highlighted</label>
          <div class="output-box" id="rx-highlight" style="white-space:pre-wrap;word-break:break-word;"></div>
        </div>
        <div id="rx-groups"></div>
      </div>`;
    const pattern = el.querySelector("#rx-pattern");
    const flags = el.querySelector("#rx-flags");
    const text = el.querySelector("#rx-text");
    const status = el.querySelector("#rx-status");
    const hl = el.querySelector("#rx-highlight");
    const groups = el.querySelector("#rx-groups");
    const cnt = el.querySelector("#rx-matches-count");
    function esc(s){return s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
    function run() {
      try {
        const re = new RegExp(pattern.value, flags.value || "g");
        const str = text.value;
        const matches = [];
        if (flags.value.includes("g")) {
          let m; while ((m = re.exec(str)) !== null) { matches.push(m); if (m.index === re.lastIndex) re.lastIndex++; }
        } else {
          const m = re.exec(str);
          if (m) matches.push(m);
        }
        status.innerHTML = `<span class="tag tag-add">${icons.check} valid</span>`;
        cnt.textContent = `${matches.length} match${matches.length===1?"":"es"}`;
        // highlight
        let out = "", last = 0;
        for (const m of matches) {
          out += esc(str.slice(last, m.index));
          out += `<mark>${esc(m[0])}</mark>`;
          last = m.index + m[0].length;
        }
        out += esc(str.slice(last));
        hl.innerHTML = out || `<span class="muted-line">No matches.</span>`;
        // groups
        if (matches.length && matches[0].length > 1) {
          groups.innerHTML = `<label class="field-label" style="margin-top:var(--sp-3);">Capture groups</label>
            <div class="output-box scroll">${matches.map((m, i) => `<div style="padding:4px 0;border-bottom:1px solid var(--border-soft);"><strong>#${i+1}</strong> ${m.slice(1).map((g,j)=>`<span class="tag">$${j+1} = ${esc(g||"")}</span>`).join(" ")}</div>`).join("")}</div>`;
        } else groups.innerHTML = "";
      } catch (e) {
        status.innerHTML = `<span class="tag tag-del">${e.message}</span>`;
        hl.innerHTML = `<span class="muted-line">—</span>`;
        cnt.textContent = "";
        groups.innerHTML = "";
      }
    }
    [pattern, flags, text].forEach(e => e.addEventListener("input", debounce(run, 120)));
    run();
  }
});

/* ============== JSON minify ============== */
registerTool("json-minify", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="grid-2">
          <div class="stack"><label class="field-label">Input</label><textarea class="textarea" id="jm-in">{
  "name": "Alice",
  "tags": ["a","b"]
}</textarea></div>
          <div class="stack">
            <div class="row" style="justify-content:space-between;"><label class="field-label" style="margin:0;">Minified</label><div id="jm-copy"></div></div>
            <textarea class="textarea" id="jm-out" readonly></textarea>
          </div>
        </div>
        <div id="jm-status" class="muted-line"></div>
      </div>`;
    const inp = el.querySelector("#jm-in");
    const out = el.querySelector("#jm-out");
    const status = el.querySelector("#jm-status");
    function run() {
      try {
        const v = JSON.parse(inp.value);
        out.value = JSON.stringify(v);
        const before = inp.value.length, after = out.value.length;
        status.innerHTML = `<span class="tag tag-add">${icons.check} valid</span> ${before} → ${after} bytes <span class="muted-line">(−${Math.max(0, before-after)})</span>`;
      } catch (e) { out.value=""; status.innerHTML = `<span class="tag tag-del">${e.message}</span>`; }
    }
    inp.addEventListener("input", debounce(run, 80));
    el.querySelector("#jm-copy").append(makeCopyButton(() => out.value));
    run();
  }
});

/* ============== SQL prettify ============== */
registerTool("sql-prettify", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="grid-2">
          <div class="stack"><label class="field-label">SQL</label><textarea class="textarea" id="sq-in">select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=1 group by u.id, u.name order by orders desc limit 10;</textarea></div>
          <div class="stack">
            <div class="row" style="justify-content:space-between;"><label class="field-label" style="margin:0;">Formatted</label><div id="sq-copy"></div></div>
            <textarea class="textarea" id="sq-out" readonly></textarea>
          </div>
        </div>
      </div>`;
    const inp = el.querySelector("#sq-in");
    const out = el.querySelector("#sq-out");
    function prettify(sql) {
      const keywords = ["SELECT","FROM","WHERE","AND","OR","LEFT JOIN","RIGHT JOIN","INNER JOIN","OUTER JOIN","JOIN","ON","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","UNION","INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE","PRIMARY KEY","FOREIGN KEY","REFERENCES"];
      let s = sql.replace(/\s+/g, " ").trim();
      keywords.forEach(k => { const re = new RegExp("\\b"+k.replace(/ /g,"\\s+")+"\\b","gi"); s = s.replace(re, "\n"+k+" "); });
      s = s.replace(/\s*,\s*/g, ",\n    ");
      // indent SELECT fields
      s = s.replace(/^SELECT /i, "SELECT\n    ");
      s = s.replace(/\nFROM/i, "\nFROM");
      // tidy
      s = s.split("\n").map((line, i) => {
        line = line.trim();
        if (/^(FROM|WHERE|AND|OR|GROUP|ORDER|HAVING|LIMIT|LEFT|RIGHT|INNER|OUTER|JOIN|UNION|INSERT|VALUES|UPDATE|SET|DELETE|CREATE)/i.test(line)) return line;
        return "    " + line;
      }).join("\n");
      return s.endsWith(";") ? s : s + ";";
    }
    inp.addEventListener("input", debounce(() => { out.value = prettify(inp.value); }, 80));
    el.querySelector("#sq-copy").append(makeCopyButton(() => out.value));
    out.value = prettify(inp.value);
  }
});

/* ============== Docker run → compose ============== */
registerTool("docker-run-to-compose", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">docker run command</label>
        <textarea class="textarea" id="dr-in">docker run -d --name web -p 8080:80 -v $(pwd)/html:/usr/share/nginx/html -e NGINX_HOST=example.com --restart unless-stopped nginx:alpine</textarea>
        <div class="row" style="justify-content:space-between;"><label class="field-label" style="margin:0;">docker-compose.yml</label><div id="dr-copy"></div></div>
        <textarea class="textarea" id="dr-out" readonly></textarea>
        <div id="dr-warn" class="muted-line"></div>
      </div>`;
    const inp = el.querySelector("#dr-in");
    const out = el.querySelector("#dr-out");
    const warn = el.querySelector("#dr-warn");
    function run() {
      const cmd = inp.value.trim();
      warn.textContent = "";
      if (!cmd) { out.value = ""; return; }
      const tokens = cmd.split(/\s+/).filter(Boolean);
      if (tokens[0] === "docker" && tokens[1] === "run") tokens.splice(0,2);
      else if (tokens[0] === "run") tokens.shift();
      else { out.value = "# Expected a 'docker run' command"; return; }
      let name = "service", image = "image", ports=[], volumes=[], env=[], restart=null, workdir=null, network=null, hostname=null;
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t === "-d" || t === "--detach") continue;
        else if ((t === "--name") && tokens[i+1]) { name = tokens[++i]; }
        else if ((t === "-p" || t === "--publish") && tokens[i+1]) { ports.push(tokens[++i]); }
        else if ((t === "-v" || t === "--volume") && tokens[i+1]) { volumes.push(tokens[++i].replace(/\$\{?\(?pwd\)?\}?/g, ".")); }
        else if ((t === "-e" || t === "--env") && tokens[i+1]) { env.push(tokens[++i]); }
        else if (t === "--restart" && tokens[i+1]) { restart = tokens[++i]; }
        else if ((t === "-w" || t === "--workdir") && tokens[i+1]) { workdir = tokens[++i]; }
        else if ((t === "--network") && tokens[i+1]) { network = tokens[++i]; }
        else if ((t === "-h" || t === "--hostname") && tokens[i+1]) { hostname = tokens[++i]; }
        else if (t.startsWith("-")) { if (tokens[i+1] && !tokens[i+1].startsWith("-")) i++; warn.textContent = "Note: ignored option "+t; }
        else if (!image) image = t;
      }
      const lines = [`services:`, `  ${name}:`, `    image: ${image}`];
      if (ports.length) lines.push(`    ports:` , ...ports.map(p => `      - "${p}"`));
      if (volumes.length) lines.push(`    volumes:`, ...volumes.map(v => `      - "${v}"`));
      if (env.length) lines.push(`    environment:`, ...env.map(e => `      ${/^[A-Z0-9_]+=/i.test(e) ? e : `"${e}"`}`));
      if (restart) lines.push(`    restart: ${restart}`);
      if (workdir) lines.push(`    working_dir: ${workdir}`);
      if (network) lines.push(`    networks:`, `      - ${network}`);
      if (hostname) lines.push(`    hostname: ${hostname}`);
      out.value = lines.join("\n");
    }
    inp.addEventListener("input", debounce(run, 100));
    el.querySelector("#dr-copy").append(makeCopyButton(() => out.value));
    run();
  }
});
