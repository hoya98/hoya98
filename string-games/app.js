/* String Games — single-file SPA renderer.
 * Reads GAMES + ANCHORS from games.js and renders a home grid plus a
 * per-game step viewer with hash-based routing.
 */

(function () {
  const app = document.getElementById("app");
  const crumb = document.getElementById("crumb");
  const homeBtn = document.getElementById("home-link");

  homeBtn.addEventListener("click", () => {
    location.hash = "";
  });

  window.addEventListener("hashchange", route);
  route();

  function route() {
    const hash = location.hash.replace(/^#\/?/, "");
    if (!hash) return renderHome();
    const [gameId, stepStr] = hash.split("/");
    const game = GAMES.find((g) => g.id === gameId);
    if (!game) return renderHome();
    const step = Math.max(0, Math.min(game.steps.length - 1, parseInt(stepStr || "0", 10) || 0));
    renderGame(game, step);
  }

  // ----- Views ---------------------------------------------------------

  function renderHome() {
    crumb.textContent = "Pick a figure";
    app.innerHTML = "";
    const intro = document.createElement("section");
    intro.className = "intro";
    intro.innerHTML = `
      <h1>Learn Cat's Cradle and other string figures</h1>
      <p>
        Seven self-paced lessons. Each one shows the figure, walks you through
        every move, and offers a tip when something usually goes wrong. All you
        need is one closed loop of string.
      </p>`;
    app.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "grid";
    GAMES.forEach((game) => grid.appendChild(makeCard(game)));
    app.appendChild(grid);

    const glossary = document.createElement("section");
    glossary.className = "glossary";
    glossary.innerHTML = `
      <h3>String-figure vocabulary</h3>
      <dl>
        <dt>Near string</dt><dd>The string closer to your body (lying across your palms).</dd>
        <dt>Far string</dt><dd>The string farther from your body (lying across the back of your fingers).</dd>
        <dt>Pick up</dt><dd>Slide a finger under a string from below and lift, so the string ends up looped on that finger.</dd>
        <dt>Drop</dt><dd>Let a loop slip off a finger entirely.</dd>
        <dt>Navaho</dt><dd>When a finger has two loops, lift the lower loop over the upper one and off — leaving only the upper loop.</dd>
      </dl>`;
    app.appendChild(glossary);
  }

  function renderGame(game, stepIndex) {
    crumb.textContent = `${game.title} · step ${stepIndex + 1} of ${game.steps.length}`;
    app.innerHTML = "";

    const head = document.createElement("section");
    head.className = "game-head";
    head.innerHTML = `
      <h1>${escape(game.title)}</h1>
      <span class="tag diff-${game.difficulty}">${diffLabel(game.difficulty)}</span>
    `;
    app.appendChild(head);

    const blurb = document.createElement("p");
    blurb.className = "game-blurb";
    blurb.textContent = game.blurb;
    app.appendChild(blurb);

    const viewer = document.createElement("section");
    viewer.className = "viewer";

    const stage = document.createElement("div");
    stage.className = "stage";
    stage.appendChild(renderDiagram(game.steps[stepIndex].strings));
    viewer.appendChild(stage);

    const body = document.createElement("div");
    body.className = "step-body";
    const step = game.steps[stepIndex];
    body.innerHTML = `
      <span class="step-num">Step ${stepIndex + 1} / ${game.steps.length}</span>
      <h2>${escape(step.title)}</h2>
      <p>${escape(step.body)}</p>
      ${step.tip ? `<div class="tip"><strong>Tip:</strong> ${escape(step.tip)}</div>` : ""}
    `;
    viewer.appendChild(body);

    app.appendChild(viewer);

    const controls = document.createElement("div");
    controls.className = "controls";
    const back = document.createElement("button");
    back.className = "btn secondary";
    back.textContent = "← Previous";
    back.disabled = stepIndex === 0;
    back.addEventListener("click", () => {
      if (stepIndex > 0) location.hash = `/${game.id}/${stepIndex - 1}`;
    });

    const progress = document.createElement("div");
    progress.className = "progress";
    const bar = document.createElement("span");
    bar.style.width = `${((stepIndex + 1) / game.steps.length) * 100}%`;
    progress.appendChild(bar);

    const next = document.createElement("button");
    next.className = "btn";
    if (stepIndex === game.steps.length - 1) {
      next.textContent = "Back to figures";
      next.addEventListener("click", () => {
        location.hash = "";
      });
    } else {
      next.textContent = "Next →";
      next.addEventListener("click", () => {
        location.hash = `/${game.id}/${stepIndex + 1}`;
      });
    }

    controls.appendChild(back);
    controls.appendChild(progress);
    controls.appendChild(next);
    app.appendChild(controls);
  }

  // ----- Card / diagram helpers ----------------------------------------

  function makeCard(game) {
    const btn = document.createElement("button");
    btn.className = "card";
    btn.type = "button";
    btn.addEventListener("click", () => {
      location.hash = `/${game.id}/0`;
    });

    const thumb = document.createElement("div");
    thumb.className = "card-thumb";
    // Use the final step's strings as the "preview" of the finished figure.
    thumb.appendChild(renderDiagram(game.steps[game.steps.length - 1].strings, true));
    btn.appendChild(thumb);

    const title = document.createElement("h2");
    title.className = "card-title";
    title.textContent = game.title;
    btn.appendChild(title);

    const desc = document.createElement("p");
    desc.className = "card-desc";
    desc.textContent = game.blurb;
    btn.appendChild(desc);

    const meta = document.createElement("div");
    meta.className = "card-meta";
    meta.innerHTML = `
      <span class="tag diff-${game.difficulty}">${diffLabel(game.difficulty)}</span>
      <span class="tag">${game.steps.length} steps</span>
      <span class="tag">~${game.minutes} min</span>
    `;
    btn.appendChild(meta);

    return btn;
  }

  function renderDiagram(strings, compact) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 600 400");
    svg.setAttribute("xmlns", svgNS);

    drawHand(svg, "L");
    drawHand(svg, "R");

    (strings || []).forEach((s) => drawString(svg, s, compact));

    return svg;
  }

  function drawHand(svg, side) {
    const svgNS = "http://www.w3.org/2000/svg";
    const sign = side === "L" ? 1 : -1;
    const cx = side === "L" ? 165 : 435;

    // Palm
    const palm = document.createElementNS(svgNS, "rect");
    palm.setAttribute("x", cx - 38);
    palm.setAttribute("y", 200);
    palm.setAttribute("width", 76);
    palm.setAttribute("height", 110);
    palm.setAttribute("rx", 22);
    palm.setAttribute("class", "hand");
    svg.appendChild(palm);

    // Fingers (4) + thumb
    const fingers = [
      { num: 2, x: cx - 23, top: 130 },
      { num: 3, x: cx, top: 110 },
      { num: 4, x: cx + 23, top: 122 },
      { num: 5, x: cx + 45 * (side === "L" ? 1 : -1), top: 152 },
    ];
    fingers.forEach((f) => {
      const finger = document.createElementNS(svgNS, "rect");
      finger.setAttribute("x", f.x - 9);
      finger.setAttribute("y", f.top);
      finger.setAttribute("width", 18);
      finger.setAttribute("height", 200 - f.top + 6);
      finger.setAttribute("rx", 9);
      finger.setAttribute("class", "hand");
      svg.appendChild(finger);
    });

    // Thumb (slanted) — draw as rotated rect
    const thumb = document.createElementNS(svgNS, "rect");
    const thumbX = cx - 55 * sign;
    thumb.setAttribute("x", thumbX - 9);
    thumb.setAttribute("y", 200);
    thumb.setAttribute("width", 18);
    thumb.setAttribute("height", 70);
    thumb.setAttribute("rx", 9);
    thumb.setAttribute("transform", `rotate(${30 * sign} ${thumbX} 235)`);
    thumb.setAttribute("class", "hand");
    svg.appendChild(thumb);
  }

  function drawString(svg, s, compact) {
    const svgNS = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", buildPath(s));
    let cls = "string-line";
    if (s.new && !compact) cls += " string-new";
    if (s.loose) cls += " string-loose";
    path.setAttribute("class", cls);
    svg.appendChild(path);
  }

  function buildPath(s) {
    const pts = resolvePoints(s);
    if (pts.length === 2 && (s.curve || s.curve === 0)) {
      const [a, b] = pts;
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2 + (s.curve || 0);
      return `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`;
    }
    if (pts.length === 2) {
      return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
    }
    // polyline (3+ points): smoothed using Catmull-Rom-ish quad approximation
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i][0]} ${pts[i][1]}`;
    }
    return d;
  }

  function resolvePoints(s) {
    if (s.points) {
      return s.points.map((p) => (Array.isArray(p) ? p : ANCHORS[p]));
    }
    return [ANCHORS[s.from], ANCHORS[s.to]];
  }

  // ----- Utilities -----------------------------------------------------

  function diffLabel(d) {
    return d === 1 ? "Beginner" : d === 2 ? "Intermediate" : "Advanced";
  }

  function escape(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
