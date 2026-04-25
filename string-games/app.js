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

    const order = [
      "Foundations",
      "Cat's Cradle Sequence",
      "Classic Figures",
      "World Traditions",
      "Tricks & Magic",
    ];
    const groups = new Map();
    GAMES.forEach((g) => {
      const cat = g.category || "Other";
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(g);
    });
    const sorted = [
      ...order.filter((c) => groups.has(c)).map((c) => [c, groups.get(c)]),
      ...[...groups.entries()].filter(([c]) => !order.includes(c)),
    ];

    sorted.forEach(([cat, games]) => {
      const section = document.createElement("section");
      section.className = "category";
      const heading = document.createElement("h2");
      heading.className = "category-title";
      heading.textContent = cat;
      section.appendChild(heading);
      const grid = document.createElement("div");
      grid.className = "grid";
      games.forEach((game) => grid.appendChild(makeCard(game)));
      section.appendChild(grid);
      app.appendChild(section);
    });

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
    const stageStep = game.steps[stepIndex];
    stage.appendChild(
      renderDiagram(stageStep.strings, {
        active: stageStep.active,
        arrow: stageStep.arrow,
      })
    );
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

  function renderDiagram(strings, compactOrOpts, maybeOpts) {
    // Backward compatible: renderDiagram(strings, compact) still works.
    // New form: renderDiagram(strings, { compact, active, arrow, labels })
    const opts =
      typeof compactOrOpts === "object" && compactOrOpts !== null
        ? compactOrOpts
        : { compact: !!compactOrOpts, ...(maybeOpts || {}) };
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 600 400");
    svg.setAttribute("xmlns", NS);

    // Arrowhead marker for move-direction arrows
    if (!opts.compact) {
      const defs = document.createElementNS(NS, "defs");
      const marker = document.createElementNS(NS, "marker");
      marker.setAttribute("id", "arrowhead");
      marker.setAttribute("viewBox", "0 0 10 10");
      marker.setAttribute("refX", "9");
      marker.setAttribute("refY", "5");
      marker.setAttribute("markerWidth", "7");
      marker.setAttribute("markerHeight", "7");
      marker.setAttribute("orient", "auto");
      const head = document.createElementNS(NS, "path");
      head.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
      head.setAttribute("fill", "#c0432c");
      marker.appendChild(head);
      defs.appendChild(marker);
      svg.appendChild(defs);
    }

    drawHand(svg, "L", opts);
    drawHand(svg, "R", opts);

    (strings || []).forEach((s) => drawString(svg, s, opts.compact));

    if (!opts.compact && opts.arrow) {
      const arrows = Array.isArray(opts.arrow) ? opts.arrow : [opts.arrow];
      arrows.forEach((a) => drawArrow(svg, a));
    }

    return svg;
  }

  function drawHand(svg, side, opts) {
    const NS = "http://www.w3.org/2000/svg";
    const sign = side === "L" ? 1 : -1;
    const cx = side === "L" ? 165 : 435;
    const active = (opts && opts.active) || [];
    const compact = opts && opts.compact;
    const isActive = (id) => active.indexOf(id) >= 0;

    // Palm + thumb-pad: a single shaped path with a slight bulge on the
    // outside (thumb side) and a tapered wrist.
    const palm = document.createElementNS(NS, "path");
    const palmD = [
      `M ${cx + 38 * sign} 200`,
      `L ${cx + 40 * sign} 290`,
      `Q ${cx + 36 * sign} 322, ${cx + 18 * sign} 326`,
      `L ${cx - 22 * sign} 326`,
      `Q ${cx - 40 * sign} 326, ${cx - 44 * sign} 295`,
      `L ${cx - 50 * sign} 250`,
      `Q ${cx - 62 * sign} 220, ${cx - 38 * sign} 200`,
      `Z`,
    ].join(" ");
    palm.setAttribute("d", palmD);
    palm.setAttribute("class", "hand palm");
    svg.appendChild(palm);

    if (!compact) {
      // subtle palm crease
      const crease = document.createElementNS(NS, "path");
      crease.setAttribute(
        "d",
        `M ${cx - 25 * sign} 248 Q ${cx} 258, ${cx + 25 * sign} 252`
      );
      crease.setAttribute("class", "hand-detail");
      svg.appendChild(crease);
    }

    // 4 fingers (index, middle, ring, pinky). x = cx + offset*sign so that
    // the right hand mirrors correctly (previous code drew index/ring on
    // the wrong side of the right hand).
    const fingers = [
      { id: side + "2", x: cx - 23 * sign, top: 130, label: "I" },
      { id: side + "3", x: cx,             top: 110, label: "M" },
      { id: side + "4", x: cx + 23 * sign, top: 122, label: "R" },
      { id: side + "5", x: cx + 45 * sign, top: 152, label: "L" },
    ];

    fingers.forEach((f) => {
      const w = 9;
      const tipR = 9;
      const finger = document.createElementNS(NS, "path");
      finger.setAttribute(
        "d",
        [
          `M ${f.x - w} 200`,
          `L ${f.x - w} ${f.top + tipR}`,
          `Q ${f.x - w} ${f.top}, ${f.x} ${f.top}`,
          `Q ${f.x + w} ${f.top}, ${f.x + w} ${f.top + tipR}`,
          `L ${f.x + w} 200`,
          `Z`,
        ].join(" ")
      );
      finger.setAttribute(
        "class",
        "hand finger" + (isActive(f.id) ? " active" : "")
      );
      svg.appendChild(finger);

      if (!compact) {
        // knuckle hint
        const ky = (f.top + 200) / 2 + 6;
        const knuckle = document.createElementNS(NS, "path");
        knuckle.setAttribute(
          "d",
          `M ${f.x - 5} ${ky} Q ${f.x} ${ky + 2}, ${f.x + 5} ${ky}`
        );
        knuckle.setAttribute("class", "hand-detail");
        svg.appendChild(knuckle);

        // finger label above the tip
        const label = document.createElementNS(NS, "text");
        label.setAttribute("x", f.x);
        label.setAttribute("y", f.top - 8);
        label.setAttribute("class", "finger-label");
        label.textContent = f.label;
        svg.appendChild(label);
      }
    });

    // Thumb — angled, tapered, drawn in local coords then transformed
    const thumbId = side + "1";
    const thumb = document.createElementNS(NS, "path");
    const tw = 10;
    const tlen = 65;
    thumb.setAttribute(
      "d",
      [
        `M ${-tw} 0`,
        `L ${-tw} ${tlen - tw}`,
        `Q ${-tw} ${tlen}, 0 ${tlen}`,
        `Q ${tw} ${tlen}, ${tw} ${tlen - tw}`,
        `L ${tw} 0`,
        `Z`,
      ].join(" ")
    );
    thumb.setAttribute(
      "transform",
      `translate(${cx - 50 * sign}, 215) rotate(${30 * sign})`
    );
    thumb.setAttribute(
      "class",
      "hand thumb" + (isActive(thumbId) ? " active" : "")
    );
    svg.appendChild(thumb);

    if (!compact) {
      const tLabel = document.createElementNS(NS, "text");
      tLabel.setAttribute("x", cx - 78 * sign);
      tLabel.setAttribute("y", 295);
      tLabel.setAttribute("class", "finger-label");
      tLabel.textContent = "T";
      svg.appendChild(tLabel);
    }
  }

  function drawArrow(svg, arrow) {
    const NS = "http://www.w3.org/2000/svg";
    const a = ANCHORS[arrow.from] || arrow.from;
    const b = ANCHORS[arrow.to] || arrow.to;
    if (!a || !b) return;
    const mx = (a[0] + b[0]) / 2 + (arrow.dx || 0);
    const my = (a[1] + b[1]) / 2 + (arrow.curve || 0);
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`);
    path.setAttribute("class", "arrow");
    path.setAttribute("marker-end", "url(#arrowhead)");
    svg.appendChild(path);
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
