/* ---------------------------------------------------------------------
   Agent office: an animated isometric office where the six AI agents
   (Analyst, Architect, Designer, Developer, Reviewer, QA Engineer) and
   the office cat go about their day. Just for fun: it is not connected
   to the agents' real work.

   Plain canvas, no libraries. Used by components/AgentOffice.jsx:
     const office = mount(containerEl, { legend: listEl, paused });
     office.pause(); office.play(); office.destroy();

   Things you may want to change live near the top of this file:
   TEAM (names, colours, work bubbles), SIGGI, CAT_NAME, the floor plan
   (roomAt, H_WALLS, V_WALLS) and the furniture below it.

   Floor plan (from Siggi's sketch), in grid cells, x to the right-back,
   y to the left-front:
     kitchen x0-7 y0-7 | meeting room 1 x7-14 y0-7 | game room x14-24 y0-6
     meeting room 2 x18-24 y6-12 | entrance x18-24 y12-20
     main working area: the rest (x0-18 y7-20)
--------------------------------------------------------------------- */
const global = window;

  const W = 24, H = 20, WALL = 3;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const approach = (v, to, step) => (v < to ? Math.min(to, v + step) : Math.max(to, v - step));
  const easeInOut = (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2);
  const DIRS = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
  const FONT = '"DM Sans", system-ui, sans-serif';

  /* ---------------- colours ---------------- */
  const shadeCache = new Map();
  function shade(hex, f) {
    const key = hex + f;
    let v = shadeCache.get(key);
    if (v) return v;
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (f < 1) { r *= f; g *= f; b *= f; }
    else { r += (255 - r) * (f - 1); g += (255 - g) * (f - 1); b += (255 - b) * (f - 1); }
    v = `rgb(${r | 0},${g | 0},${b | 0})`;
    shadeCache.set(key, v);
    return v;
  }

  /* ---------------- the team ---------------- */
  const TEAM = [
    { id: "analyst", name: "Analyst", shirt: "#e3a03a", hair: "#3b2a1e", skin: "#f1c7a1", hairStyle: "bun",
      work: "refining requirements", bubbles: ["REQ-27?", "Who uses this?", "Edge case!", "📝"] },
    { id: "architect", name: "Architect", shirt: "#4f7cc4", hair: "#22222a", skin: "#d9a37c", hairStyle: "short",
      work: "sketching the architecture", bubbles: ["EEA ✓", "0 kr. ✓", "📐", "Trace it"] },
    { id: "designer", name: "Designer", shirt: "#d4628a", hair: "#b8562f", skin: "#f3d0b5", hairStyle: "long",
      work: "polishing screens", bubbles: ["🎨", "More contrast", "8px grid", "Calm, paper-like"] },
    { id: "developer", name: "Developer", shirt: "#2fa7b3", hair: "#6b4a2b", skin: "#e8b892", hairStyle: "short",
      work: "writing code", bubbles: ["git push", "{ }", "Tests pass ✓", "One more PR"] },
    { id: "reviewer", name: "Reviewer", shirt: "#8a6fd1", hair: "#d8c79c", skin: "#c68c63", hairStyle: "short",
      work: "reviewing a pull request", bubbles: ["LGTM", "nit:", "🔍", "Allowlist!"] },
    { id: "qa", name: "QA Engineer", short: "QA", shirt: "#5aa865", hair: "#2a1c14", skin: "#f0c39c", hairStyle: "long",
      work: "testing on a phone", bubbles: ["🐞 Found one", "Test 41 ✓", "Keyboard OK?", "📱"] },
  ];
  const SIGGI = { id: "siggi", name: "Siggi", shirt: "#9cc3e6", hair: "#8d7656", skin: "#f1cfb3", hairStyle: "short",
    work: "planning the next step", bubbles: ["Next milestone", "Let's decide", "📋", "Good call"] };
  const CAT_NAME = "Alan Isaac", CAT_SHORT = "Alan";
  const who = (d) => (d.id === "siggi" ? "Siggi" : `the ${d.name}`);

  /* ---------------- floor plan ---------------- */
  function roomAt(x, y) {
    if (y < 7 && x < 7) return "kitchen";
    if (y < 7 && x < 14) return "mr1";
    if (y < 6 && x >= 14) return "game";
    if (x >= 18 && y >= 6 && y < 12) return "mr2";
    if (x >= 18 && y >= 12) return "entrance";
    return "main";
  }

  // Interior walls on cell edges. Doors are cells left open.
  // Style: "glass", "solid" (cut away at chest height, so the rooms behind
  // stay visible from this angle) or "tall" (full height, used for the
  // wall that carries the meeting room screen).
  const H_WALLS = [ // [y, x0, x1, door cells, style]
    [7, 0, 7, [4], "solid"],       // kitchen | main
    [7, 7, 14, [11], "glass"],     // meeting room 1 | main
    [6, 14, 24, [15, 16], "solid"], // game room | main and meeting room 2
    [12, 18, 24, [], "solid"],     // meeting room 2 | entrance
  ];
  const V_WALLS = [ // [x, y0, y1, door cells, style]
    [7, 0, 7, [], "tall"],          // kitchen | meeting room 1 (screen)
    [14, 0, 7, [], "tall"],         // meeting room 1 | game room (TV)
    [18, 6, 12, [8], "glass"],      // main | meeting room 2
    [18, 12, 20, [15, 16], "solid"], // main | entrance
  ];

  /* ---------------- spots (where people stand or sit) ---------------- */
  const SPOTS = {};
  function spot(id, x, y, face, pose, extra) {
    SPOTS[id] = Object.assign({ id, x, y, face: face || "S", pose: pose || "stand", taken: null }, extra || {});
    return SPOTS[id];
  }

  /* ---------------- furniture ---------------- */
  // Each piece: { x, y, w, d, h, z, c (base colour) or top/left/right, block, after }
  const FURN = [];
  const BLOCKS = [];
  function box(o) { FURN.push(Object.assign({ kind: "box", z: 0 }, o)); if (o.block) BLOCKS.push([o.x, o.y, o.w, o.d]); return o; }
  function roundTable(cx, cy, r, h, c) { FURN.push({ kind: "round", cx, cy, r, h, c }); BLOCKS.push([cx - r, cy - r, 2 * r, 2 * r]); }
  function plant(cx, cy, big) { FURN.push({ kind: "plant", cx, cy, big: !!big }); BLOCKS.push([cx - 0.3, cy - 0.3, 0.6, 0.6]); }
  function chair(x, y, face, c) {
    c = c || "#3d4350";
    box({ x: x - 0.21, y: y - 0.21, w: 0.42, d: 0.42, h: 0.42, c, kb: -0.06 });
    const t = 0.07;
    if (face === "S") box({ x: x - 0.21, y: y - 0.26, w: 0.42, d: t, h: 0.95, c });
    if (face === "N") box({ x: x - 0.21, y: y + 0.19, w: 0.42, d: t, h: 0.95, c });
    if (face === "E") box({ x: x - 0.26, y: y - 0.21, w: t, d: 0.42, h: 0.95, c });
    if (face === "W") box({ x: x + 0.19, y: y - 0.21, w: t, d: 0.42, h: 0.95, c });
  }
  function seat(id, x, y, face, chairColour, extra) {
    chair(x, y, face, chairColour);
    return spot(id, x, y, face, "sit", extra);
  }

  // Kitchen
  box({ x: 0.12, y: 0.12, w: 4.7, d: 0.75, h: 0.9, top: "#efeae2", c: "#8fa39c", block: true });
  box({ x: 0.55, y: 0.25, w: 0.5, d: 0.4, h: 0.5, z: 0.9, c: "#3a3d44", after: coffeeMachine, whole: true });
  // in the corner, clear of the back wall windows
  box({ x: 5.85, y: 0.12, w: 1.0, d: 0.8, h: 2.1, c: "#e3e7ea", block: true, after: fridgeDetail, whole: true });
  box({ x: 1.6, y: 2.5, w: 3.2, d: 0.9, h: 0.9, top: "#e9e2d6", c: "#6f8a84", block: true });
  spot("coffee", 0.85, 1.45, "N");
  spot("fridge", 6.35, 1.55, "N");
  spot("stool1", 2.4, 3.85, "N", "sit"); box({ x: 2.22, y: 3.68, w: 0.36, d: 0.36, h: 0.55, c: "#c6a77e", kb: -0.06 });
  spot("stool2", 3.9, 3.85, "N", "sit"); box({ x: 3.72, y: 3.68, w: 0.36, d: 0.36, h: 0.55, c: "#c6a77e", kb: -0.06 });
  roundTable(2.6, 5.6, 0.72, 0.75, "#c9b08c");
  seat("kt1", 1.5, 5.6, "E", "#b98e5a");
  seat("kt2", 3.7, 5.6, "W", "#b98e5a");
  seat("kt3", 2.6, 6.55, "N", "#b98e5a");
  plant(6.3, 6.3);

  // Meeting room 1
  box({ x: 8.4, y: 2.8, w: 4.2, d: 1.4, h: 0.75, top: "#8d6a4b", c: "#6f523a", block: true });
  const MR1_SEATS = [
    seat("m1a", 9.0, 2.2, "S"), seat("m1b", 10.4, 2.2, "S"), seat("m1c", 11.8, 2.2, "S"),
    seat("m1d", 9.0, 4.8, "N"), seat("m1e", 10.4, 4.8, "N"), seat("m1f", 11.8, 4.8, "N"),
  ];
  spot("m1present", 7.75, 4.45, "E");
  plant(13.4, 6.3);

  // Game room
  // turned so the long side runs front to back: one player by the windows, one by the front
  const PP = { x: 21.0, y: 1.2, w: 1.6, d: 3.2 };
  box({ x: PP.x, y: PP.y, w: PP.w, d: PP.d, h: 0.75, top: "#2f7a66", c: "#2a3b35", block: true, after: pingPongLines, whole: true });
  // The net is drawn whole, right after the table top. Cut into chunks like
  // other boxes, its back half sorted behind the table and disappeared.
  FURN.push({ kind: "net", x: PP.x - 0.08, y: PP.y + PP.d / 2, w: PP.w + 0.16 });
  spot("pp1", PP.x + PP.w / 2, PP.y - 0.65, "S");
  spot("pp2", PP.x + PP.w / 2, PP.y + PP.d + 0.65, "N");
  // gaming sofa facing the TV on the meeting room wall
  box({ x: 16.15, y: 1.7, w: 0.85, d: 2.1, h: 0.42, c: "#5f6f8f", block: true });
  box({ x: 17.0, y: 1.7, w: 0.22, d: 2.1, h: 0.95, c: "#56647f", block: true });
  spot("sofa1", 16.6, 2.25, "W", "sit");
  spot("sofa2", 16.6, 3.25, "W", "sit");
  // Two arcade machines side by side on the back wall, between the windows,
  // facing into the room. A plant takes the old arcade corner.
  const ARCADES = [
    { id: "arcade", x: 17.85, c: "#40306a", trim: "#f2b84b" },
    { id: "arcade2", x: 18.8, c: "#7a2f45", trim: "#7fd6df" },
  ];
  for (const m of ARCADES) {
    box({ x: m.x, y: 0.25, w: 0.8, d: 0.7, h: 1.8, c: m.c, block: true, after: arcadeScreen, whole: true, machine: m });
    // control deck sticking out under the screen
    box({ x: m.x + 0.05, y: 0.95, w: 0.7, d: 0.18, h: 0.12, z: 0.85, c: shade(m.c, 0.8), top: "#2a2d33", after: arcadeControls, whole: true });
    spot(m.id, m.x + 0.4, 1.5, "N");
  }
  plant(14.55, 0.55);

  // Meeting room 2
  // A whiteboard on feet, standing clear of the wall: pushed against the
  // low wall it looked like it stood in the game room behind it.
  box({ x: 18.8, y: 6.5, w: 2.4, d: 0.08, h: 1.2, z: 0.5, top: "#ffffff", left: "#f4f6f7", right: "#d9dde0", after: whiteboardScribbles, whole: true });
  for (const lx of [19.0, 20.95]) {
    box({ x: lx, y: 6.51, w: 0.06, d: 0.06, h: 0.5, c: "#9aa1a8" });
    box({ x: lx - 0.02, y: 6.3, w: 0.1, d: 0.48, h: 0.04, c: "#7d848b" });
  }
  BLOCKS.push([18.8, 6.3, 2.4, 0.48]);
  spot("board2", 20.0, 7.3, "N");
  roundTable(21.4, 9.4, 0.78, 0.75, "#f0ece4");
  seat("m2a", 20.3, 9.4, "E"); seat("m2b", 22.5, 9.4, "W"); seat("m2c", 21.4, 10.5, "N"); seat("m2d", 21.4, 8.3, "S");
  plant(23.4, 11.4);
  // Sideboard against the wall. Drawn in chunks (not whole), so each part
  // sorts in front of the wall piece behind it; the things on top are drawn
  // with the right-hand end, or the wall covered them.
  box({ x: 21.7, y: 6.12, w: 2.1, d: 0.5, h: 0.85, top: "#efe9df", c: "#9b7a55", block: true, after: sideboardTop, afterKey: 23.8 + 6.62 + 0.05 });
  box({ x: 18.15, y: 10.2, w: 0.85, d: 0.9, h: 0.42, c: "#5a8f86", block: true });
  box({ x: 18.15, y: 10.2, w: 0.2, d: 0.9, h: 0.9, c: "#4f8077", block: true });
  FURN.push({ kind: "lamp", cx: 18.55, cy: 11.55 }); BLOCKS.push([18.35, 11.35, 0.4, 0.4]);
  spot("m2arm", 18.6, 10.65, "E", "sit");

  // Entrance
  // waiting sofa against the front wall, ending before the door opening
  box({ x: 22.9, y: 12.35, w: 0.65, d: 2.4, h: 0.42, c: "#7c8a6a", block: true });
  box({ x: 23.55, y: 12.35, w: 0.25, d: 2.4, h: 0.95, c: "#717e60", block: true });
  plant(19.0, 19.2, true);
  plant(23.3, 19.2);
  // reception desk under the logo
  box({ x: 19.5, y: 13.0, w: 2.2, d: 0.7, h: 0.95, top: "#e6d3b3", c: "#3fb8c4", block: true, after: logoSign, whole: true });
  box({ x: 20.3, y: 13.05, w: 0.6, d: 0.06, h: 0.42, z: 0.95, c: "#2a2e35" });
  spot("reception", 20.6, 12.55, "S");
  // waiting corner
  box({ x: 21.9, y: 12.8, w: 0.7, d: 1.4, h: 0.36, top: "#b08f69", c: "#8f714f", block: true, after: magazines, whole: true });
  box({ x: 20.0, y: 17.6, w: 0.85, d: 0.85, h: 0.42, c: "#d9a441", block: true });
  box({ x: 20.0, y: 18.25, w: 0.85, d: 0.2, h: 0.9, c: "#c4912f", block: true });
  box({ x: 21.6, y: 17.6, w: 0.85, d: 0.85, h: 0.42, c: "#d9a441", block: true });
  box({ x: 21.6, y: 18.25, w: 0.85, d: 0.2, h: 0.9, c: "#c4912f", block: true });
  roundTable(21.2, 17.0, 0.4, 0.5, "#f0ece4");
  box({ x: 23.35, y: 17.35, w: 0.35, d: 0.35, h: 0.6, c: "#4f7cc4", block: true, after: umbrellas, whole: true });
  box({ x: 18.75, y: 12.5, w: 0.12, d: 0.12, h: 1.6, c: "#6b5a48", block: true, after: coatRack });

  // Main working area: two desk pods
  const DESK = { top: "#e6d3b3", c: "#b89a72" };
  function pod(x0, ids) {
    box(Object.assign({ x: x0, y: 10, w: 4.4, d: 1.4, h: 0.75, block: true }, DESK));
    const xs = [x0 + 1.1, x0 + 3.3];
    const out = [];
    xs.forEach((x, i) => {
      // north row faces south (we see faces), south row faces north (we see screens)
      const n = seat(ids[i], x, 9.35, "S", null, { desk: { x, y: 10.7 } });
      const mN = box({ x: x - 0.4, y: 10.12, w: 0.8, d: 0.07, h: 0.5, z: 0.75, c: "#2a2e35" });
      n.monitor = mN; out.push(n);
      const s = seat(ids[i + 2], x, 12.05, "N", null, { desk: { x, y: 10.7 } });
      const mS = box({ x: x - 0.4, y: 11.21, w: 0.8, d: 0.07, h: 0.5, z: 0.75, c: "#2a2e35" });
      mS.screenOf = s; s.monitor = mS; out.push(s);
      box({ x: x - 0.3, y: 10.42, w: 0.6, d: 0.16, h: 0.03, z: 0.75, c: "#d9dde1" });
      box({ x: x - 0.3, y: 10.92, w: 0.6, d: 0.16, h: 0.03, z: 0.75, c: "#d9dde1" });
    });
    return out;
  }
  const PODA = pod(1.8, ["dA1", "dA2", "dA3", "dA4"]);
  const PODB = pod(8.0, ["dB1", "dB2", "dB3", "dB4"]);
  void PODA; void PODB;
  const HOME = { analyst: "dA1", architect: "dA2", designer: "dA3", developer: "dB1", reviewer: "dB2", qa: "dB3", siggi: "dA4" };

  // Kanban board on the left wall, bookshelf, printer, water cooler
  spot("kanban", 0.95, 14.6, "W");
  box({ x: 0.12, y: 17.0, w: 0.5, d: 2.3, h: 1.9, c: "#9b7a55", block: true, after: bookshelfBooks, whole: true });
  // printer against the kitchen wall, not on the corner where the kitchen
  // wall meets the meeting room glass
  box({ x: 5.55, y: 7.2, w: 0.85, d: 0.6, h: 0.8, top: "#eef0f2", c: "#cfd4d9", block: true });
  spot("printer", 5.95, 8.35, "N");
  box({ x: 16.9, y: 7.3, w: 0.5, d: 0.5, h: 1.15, top: "#7cc4e0", c: "#e3e8ec", block: true });
  spot("cooler1", 16.45, 8.25, "N");
  spot("cooler2", 17.6, 8.6, "W");
  spot("window", 1.1, 8.0, "W");
  spot("stretch", 7.4, 13.8, "S");

  // Lounge by the bookshelf
  box({ x: 1.4, y: 18.3, w: 3.4, d: 0.8, h: 0.42, c: "#c27b5a", block: true });
  box({ x: 1.4, y: 19.1, w: 3.4, d: 0.22, h: 0.95, c: "#b06c4d", block: true });
  box({ x: 2.2, y: 16.4, w: 1.8, d: 0.85, h: 0.38, top: "#b08f69", c: "#8f714f", block: true });
  box({ x: 5.1, y: 16.1, w: 0.85, d: 0.9, h: 0.42, c: "#c27b5a", block: true });
  box({ x: 5.8, y: 16.1, w: 0.18, d: 0.9, h: 0.9, c: "#b06c4d", block: true });
  spot("lounge1", 2.2, 18.55, "N", "sit");
  spot("lounge2", 4.0, 18.55, "N", "sit");

  // Mini golf: tee in the west, a windmill to putt through, the hole in the east
  const GOLF = { x0: 7.6, x1: 12.9, y0: 15.2, y1: 19.5, tee: { x: 8.4, y: 17.35 }, hole: { x: 12.05, y: 17.35 } };
  const rail = { top: "#f2efe8", left: "#d9d4ca", right: "#c9c3b7" };
  [[GOLF.x0, GOLF.y0, GOLF.x1 - GOLF.x0, 0.1], [GOLF.x0, GOLF.y1 - 0.1, GOLF.x1 - GOLF.x0, 0.1],
   [GOLF.x0, GOLF.y0, 0.1, GOLF.y1 - GOLF.y0], [GOLF.x1 - 0.1, GOLF.y0, 0.1, GOLF.y1 - GOLF.y0]]
    .forEach(([x, y, w, d]) => box(Object.assign({ x, y, w, d, h: 0.14 }, rail)));
  // A tapered tower with a tunnel the ball rolls through, a roof, and sails
  // turning on the face towards the hole
  const MILL = { x0: 9.95, x1: 10.65, y0: 16.95, y1: 17.75, taper: 0.1, h: 0.95, tunnel: [17.17, 17.53, 0.26] };
  FURN.push({ kind: "windmill" });
  FURN.push({ kind: "flag", cx: GOLF.hole.x, cy: GOLF.hole.y });
  spot("tee", GOLF.tee.x - 0.45, GOLF.tee.y + 0.05, "E");
  plant(0.6, 7.65); plant(6.95, 19.3, true); plant(17.4, 13.4);

  // Alan's corner by the mini golf: a bed, a cat tree, bowls and a toy mouse.
  // The cat tree stays inside one floor cell so its stacked parts sort by height.
  const CAT_CORNER = { bed: { x: 14.2, y: 19.0 }, tree: { x: 15.35, y: 18.3, w: 0.6, d: 0.6 }, bowls: { x: 16.55, y: 19.4 }, mouse: { x: 13.55, y: 18.35 } };
  FURN.push({ kind: "catbed", cx: CAT_CORNER.bed.x, cy: CAT_CORNER.bed.y });
  BLOCKS.push([CAT_CORNER.bed.x - 0.45, CAT_CORNER.bed.y - 0.35, 0.9, 0.7]);
  {
    const t = CAT_CORNER.tree, carpet = { c: "#d8c3a0" }, sisal = { c: "#c9ad7c" };
    box(Object.assign({ x: t.x, y: t.y, w: t.w, d: t.d, h: 0.08, block: true }, carpet));
    box(Object.assign({ x: t.x + 0.22, y: t.y + 0.22, w: 0.16, d: 0.16, h: 0.57, z: 0.08 }, sisal));
    box(Object.assign({ x: t.x + 0.05, y: t.y + 0.05, w: 0.5, d: 0.5, h: 0.06, z: 0.65, after: catTreeToy }, carpet));
    box(Object.assign({ x: t.x + 0.22, y: t.y + 0.22, w: 0.16, d: 0.16, h: 0.54, z: 0.71 }, sisal));
    box({ x: t.x, y: t.y, w: t.w, d: t.d, h: 0.07, z: 1.25, c: "#d8c3a0", top: "#e9d6c1" });
  }
  FURN.push({ kind: "bowls", cx: CAT_CORNER.bowls.x, cy: CAT_CORNER.bowls.y });
  FURN.push({ kind: "mouse", cx: CAT_CORNER.mouse.x, cy: CAT_CORNER.mouse.y });

  /* ---------------- walkability ---------------- */
  const blocked = [], hEdge = [], vEdge = [];
  for (let y = 0; y <= H; y++) { blocked.push(new Array(W + 1).fill(false)); hEdge.push(new Array(W + 1).fill(false)); vEdge.push(new Array(W + 1).fill(false)); }
  for (const [bx, by, bw, bd] of BLOCKS) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const cx = x + 0.5, cy = y + 0.5;
      if (cx > bx - 0.05 && cx < bx + bw + 0.05 && cy > by - 0.05 && cy < by + bd + 0.05) blocked[y][x] = true;
    }
  }
  for (const [y, x0, x1, doors] of H_WALLS) for (let x = x0; x < x1; x++) if (!doors.includes(x)) hEdge[y][x] = true;
  for (const [x, y0, y1, doors] of V_WALLS) for (let y = y0; y < y1; y++) if (!doors.includes(y)) vEdge[y][x] = true;

  const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  function canStep(ax, ay, bx, by) {
    if (!inside(bx, by) || blocked[by][bx]) return false;
    if (bx === ax + 1 && vEdge[ay][bx]) return false;
    if (bx === ax - 1 && vEdge[ay][ax]) return false;
    if (by === ay + 1 && hEdge[by][ax]) return false;
    if (by === ay - 1 && hEdge[ay][ax]) return false;
    return true;
  }
  function canMove(ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    if (dx === 0 || dy === 0) return canStep(ax, ay, bx, by);
    return canStep(ax, ay, bx, ay) && canStep(bx, ay, bx, by) && canStep(ax, ay, ax, by) && canStep(ax, by, bx, by);
  }
  function nearestFree(x, y) {
    if (inside(x, y) && !blocked[y][x]) return [x, y];
    for (let r = 1; r < 6; r++) {
      let best = null, bd = 1e9;
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        const nx = x + dx, ny = y + dy;
        if (inside(nx, ny) && !blocked[ny][nx]) { const d = dx * dx + dy * dy; if (d < bd) { bd = d; best = [nx, ny]; } }
      }
      if (best) return best;
    }
    return [x, y];
  }
  // Goal cell: the free cell next to the target that is on the target's open side
  function goalCell(t) {
    const gx = Math.floor(t.x), gy = Math.floor(t.y);
    if (inside(gx, gy) && !blocked[gy][gx]) return [gx, gy];
    return nearestFree(gx, gy);
  }
  function findPath(fx, fy, t) {
    const [sx, sy] = nearestFree(Math.floor(fx), Math.floor(fy));
    const [gx, gy] = goalCell(t);
    const key = (x, y) => y * W + x;
    const open = [[sx, sy]], came = new Map(), g = new Map([[key(sx, sy), 0]]);
    const f = new Map([[key(sx, sy), Math.hypot(gx - sx, gy - sy)]]);
    const closed = new Set();
    let found = false, guard = 0;
    while (open.length && guard++ < 4000) {
      let bi = 0;
      for (let i = 1; i < open.length; i++) if (f.get(key(...open[i])) < f.get(key(...open[bi]))) bi = i;
      const [cx, cy] = open.splice(bi, 1)[0];
      const ck = key(cx, cy);
      if (cx === gx && cy === gy) { found = true; break; }
      closed.add(ck);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cx + dx, ny = cy + dy, nk = key(nx, ny);
        if (closed.has(nk) || !canMove(cx, cy, nx, ny)) continue;
        const ng = g.get(ck) + (dx && dy ? 1.414 : 1);
        if (ng < (g.has(nk) ? g.get(nk) : 1e9)) {
          came.set(nk, ck); g.set(nk, ng); f.set(nk, ng + Math.hypot(gx - nx, gy - ny));
          if (!open.some((o) => o[0] === nx && o[1] === ny)) open.push([nx, ny]);
        }
      }
    }
    const pts = [];
    if (found) {
      let k = key(gx, gy);
      while (k !== key(sx, sy)) { pts.unshift({ x: (k % W) + 0.5, y: Math.floor(k / W) + 0.5 }); k = came.get(k); }
    }
    // Cut the grid's zig-zags into straight lines where nothing is in the
    // way. Only from a free start cell: someone on a sofa or a chair takes
    // the first step off it as planned.
    const start = Math.floor(fx) === sx && Math.floor(fy) === sy && !blocked[sy][sx] ? { x: fx, y: fy } : null;
    const out = smoothPath(start, pts);
    out.push({ x: t.x, y: t.y });
    return out;
  }
  // Is the straight walk from a to b clear? Checks a strip about a body wide.
  function clearLine(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
    if (len < 1e-6) return true;
    const nx = (-dy / len) * 0.22, ny = (dx / len) * 0.22;
    const n = Math.ceil(len / 0.2);
    for (const o of [0, 1, -1]) {
      let px = Math.floor(a.x + nx * o), py = Math.floor(a.y + ny * o);
      for (let i = 1; i <= n; i++) {
        const u = i / n;
        const cx = Math.floor(a.x + dx * u + nx * o), cy = Math.floor(a.y + dy * u + ny * o);
        if (cx !== px || cy !== py) {
          if (!canMove(px, py, cx, cy)) return false;
          px = cx; py = cy;
        }
      }
    }
    return true;
  }
  function smoothPath(start, pts) {
    if (pts.length < 2) return pts.slice();
    const out = [];
    let anchor = start, i = 0;
    if (!anchor) { anchor = pts[0]; out.push(pts[0]); i = 1; }
    while (i < pts.length) {
      let j = pts.length - 1;
      while (j > i && !clearLine(anchor, pts[j])) j--;
      out.push(pts[j]);
      anchor = pts[j]; i = j + 1;
    }
    return out;
  }

  /* =====================================================================
     Rendering
  ===================================================================== */
  let ctx, hw, hh, zh, ox, oy, k, cssW, cssH;
  function layout(width) {
    cssW = width;
    const margin = 14;
    hw = (cssW - margin * 2) / (W + H);
    hh = hw / 2;
    zh = hw * 0.95;
    k = hw / 21;
    ox = margin + H * hw;
    oy = margin + WALL * zh + 30 * k;
    cssH = Math.round(oy + (W + H) * hh + 0.6 * zh + margin);
  }
  const P = (x, y, z) => [ox + (x - y) * hw, oy + (x + y) * hh - (z || 0) * zh];

  function poly(pts, fill, stroke, lw) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
  }
  function quadX(x, y0, y1, z0, z1) { return [P(x, y0, z1), P(x, y1, z1), P(x, y1, z0), P(x, y0, z0)]; }
  function quadY(y, x0, x1, z0, z1) { return [P(x0, y, z1), P(x1, y, z1), P(x1, y, z0), P(x0, y, z0)]; }

  function boxColours(b) {
    if (b.top && b.left) return [b.top, b.left, b.right];
    const base = b.c;
    return [b.top || shade(base, 1.08), shade(base, 0.86), shade(base, 0.72)];
  }
  function drawChunk(b, x0, x1, y0, y1) {
    const [top, left, right] = b._col || (b._col = boxColours(b));
    const zt = b.z + b.h, zb = b.z;
    poly([P(x0, y0, zt), P(x1, y0, zt), P(x1, y1, zt), P(x0, y1, zt)], top, top, 0.6);
    if (y1 >= b.y + b.d - 1e-6) poly(quadY(y1, x0, x1, zb, zt), left, left, 0.5);
    if (x1 >= b.x + b.w - 1e-6) poly(quadX(x1, y0, y1, zb, zt), right, right, 0.5);
  }
  function splits(a, b) {
    const r = [a];
    let v = Math.floor(a) + 1;
    while (v < b - 1e-6) { r.push(v); v++; }
    r.push(b);
    return r;
  }

  // Static drawables (furniture + interior walls) built once
  const STATIC = [];
  function addBoxDrawables(b) {
    if (b.whole) {
      STATIC.push({ key: b.x + b.w / 2 + b.y + b.d / 2 + (b.kb || 0) + b.z * 0.01, draw: () => { drawChunk(b, b.x, b.x + b.w, b.y, b.y + b.d); if (b.after) b.after(b); } });
      return;
    }
    const xs = splits(b.x, b.x + b.w), ys = splits(b.y, b.y + b.d);
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
      const x0 = xs[i], x1 = xs[i + 1], y0 = ys[j], y1 = ys[j + 1];
      STATIC.push({ key: (x0 + x1) / 2 + (y0 + y1) / 2 + (b.kb || 0) + b.z * 0.01, draw: () => drawChunk(b, x0, x1, y0, y1) });
    }
    if (b.after) STATIC.push({ key: b.afterKey || b.x + b.w / 2 + b.y + b.d / 2 + 0.02 + (b.kb || 0) + b.z * 0.01, draw: () => b.after(b) });
    if (b.screenOf) STATIC.push({ key: b.x + b.w / 2 + b.y + b.d + 0.03, draw: () => monitorScreen(b) });
  }
  for (const f of FURN) {
    if (f.kind === "box") addBoxDrawables(f);
    else if (f.kind === "round") STATIC.push({ key: f.cx + f.cy, draw: () => drawRoundTable(f) });
    else if (f.kind === "plant") STATIC.push({ key: f.cx + f.cy, draw: () => drawPlant(f) });
    else if (f.kind === "lamp") STATIC.push({ key: f.cx + f.cy, draw: () => drawLamp(f) });
    else if (f.kind === "windmill") STATIC.push({ key: (MILL.x0 + MILL.x1) / 2 + (MILL.y0 + MILL.y1) / 2, draw: drawWindmill });
    else if (f.kind === "catbed") STATIC.push({ key: f.cx + f.cy - 0.3, draw: () => drawCatBed(f.cx, f.cy) });
    else if (f.kind === "bowls") STATIC.push({ key: f.cx + f.cy, draw: () => drawBowls(f) });
    else if (f.kind === "mouse") STATIC.push({ key: f.cx + f.cy, draw: () => drawToyMouse(f) });
    else if (f.kind === "flag") STATIC.push({ key: f.cx + f.cy + 0.1, draw: () => drawFlag(f) });
    // just after the table it stands on (same centre, key + 0.05)
    else if (f.kind === "net") STATIC.push({ key: f.x + f.w / 2 + f.y + 0.05, draw: () => drawNet(f) });
  }
  const GLASS = { top: "rgba(225,240,246,0.55)", left: "rgba(200,228,238,0.22)", right: "rgba(180,214,228,0.20)" };
  const BASE = { top: "#f1ece3", left: "#ddd5c7", right: "#cbc2b2" };
  const SOLID = { top: "#9a9184", left: "#e8e2d8", right: "#d6cfc3" };
  const SOLID_H = 1.15, TALL_H = 2.25;
  function wallSeg(x, y, w, d, style) {
    if (style === "glass") {
      addBoxDrawables(Object.assign({ x, y, w, d, h: 0.5, z: 0, kind: "box" }, BASE));
      addBoxDrawables(Object.assign({ x, y, w, d, h: 1.75, z: 0.5, kind: "box", after: glassFrame }, GLASS));
    } else {
      addBoxDrawables(Object.assign({ x, y, w, d, h: style === "tall" ? TALL_H : SOLID_H, z: 0, kind: "box", whole: true, after: wallDecor }, SOLID));
    }
  }
  for (const [y, x0, x1, doors, style] of H_WALLS) for (let x = x0; x < x1; x++) if (!doors.includes(x)) wallSeg(x, y - 0.05, 1, 0.1, style);
  for (const [x, y0, y1, doors, style] of V_WALLS) for (let y = y0; y < y1; y++) if (!doors.includes(y)) wallSeg(x - 0.05, y, 0.1, 1, style);

  // Meeting room 1 screen, on the kitchen wall. It spans two whole wall
  // segments and is drawn right after them, before anyone in the room.
  const MR1_SCREEN = { x: 7.05, y0: 2.0, y1: 4.0, z0: 0.95, z1: 2.0 };
  STATIC.push({ key: MR1_SCREEN.x + MR1_SCREEN.y1 - 0.45, draw: () => drawMr1Screen(MR1_SCREEN) });
  STATIC.push({ key: 14.05 + 3.9 - 0.45, draw: () => drawTv() });
  function wallDecor(b) {
    // baseboard line on solid walls
    if (b.w > b.d) poly(quadY(b.y + b.d + 0.001, b.x, b.x + b.w, 0, 0.1), "#cdc5b8");
    else poly(quadX(b.x + b.w + 0.001, b.y, b.y + b.d, 0, 0.1), "#c5bdb0");
  }
  function drawMr1Screen(sc) {
    const x = sc.x + 0.002;
    poly(quadX(x, sc.y0, sc.y1, sc.z0, sc.z1), "#20242b");
    poly(quadX(x + 0.001, sc.y0 + 0.08, sc.y1 - 0.08, sc.z0 + 0.07, sc.z1 - 0.07), world.standup ? "#2f5568" : "#2a3440");
    if (world.standup) {
      poly(quadX(x + 0.002, sc.y0 + 0.25, sc.y1 - 0.25, sc.z1 - 0.3, sc.z1 - 0.16), "#7fd6df");
      for (let i = 0; i < 3; i++) poly(quadX(x + 0.002, sc.y0 + 0.25, sc.y0 + 0.25 + 0.7 + i * 0.3, sc.z1 - 0.52 - i * 0.2, sc.z1 - 0.43 - i * 0.2), "#cfe3ea");
    }
  }

  const DOOR = { y0: 15.2, y1: 16.8, x: 24 };
  const FRONT = { top: "#e9e3d9", left: "#d6cfc3", right: "#c4bcae" };
  addBoxDrawables(Object.assign({ x: 0, y: 19.92, w: 24, d: 0.08, h: 0.3, z: 0, kind: "box" }, FRONT));
  addBoxDrawables(Object.assign({ x: 23.92, y: 0, w: 0.08, d: DOOR.y0, h: 0.3, z: 0, kind: "box" }, FRONT));
  addBoxDrawables(Object.assign({ x: 23.92, y: DOOR.y1, w: 0.08, d: H - DOOR.y1, h: 0.3, z: 0, kind: "box" }, FRONT));
  addBoxDrawables({ x: 24, y: 15.0, w: 1.5, d: 2.0, h: 0.5, z: -0.5, kind: "box", top: "#bdb6aa", left: "#9c958a", right: "#8a8378" });

  function glassFrame(b) {
    const zt = b.z + b.h;
    ctx.strokeStyle = "rgba(110,135,145,0.55)";
    ctx.lineWidth = Math.max(1, 1.1 * k);
    ctx.beginPath();
    if (b.w > b.d) { const a = P(b.x, b.y + b.d, zt), c = P(b.x + b.w, b.y + b.d, zt); ctx.moveTo(...a); ctx.lineTo(...c); const m = P(b.x, b.y + b.d, b.z); ctx.moveTo(...a); ctx.lineTo(...m); }
    else { const a = P(b.x + b.w, b.y, zt), c = P(b.x + b.w, b.y + b.d, zt); ctx.moveTo(...a); ctx.lineTo(...c); const m = P(b.x + b.w, b.y, b.z); ctx.moveTo(...a); ctx.lineTo(...m); }
    ctx.stroke();
  }

  function drawRoundTable(f) {
    const top = P(f.cx, f.cy, f.h), base = P(f.cx, f.cy, 0);
    const rx = f.r * hw * Math.SQRT2, ry = f.r * hh * Math.SQRT2;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath(); ctx.ellipse(base[0], base[1], rx * 0.8, ry * 0.8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = shade(f.c, 0.6);
    ctx.fillRect(top[0] - 2.5 * k, top[1], 5 * k, base[1] - top[1]);
    ctx.fillStyle = shade(f.c, 0.8);
    ctx.beginPath(); ctx.ellipse(top[0], top[1] + 2.5 * k, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = f.c;
    ctx.beginPath(); ctx.ellipse(top[0], top[1], rx, ry, 0, 0, Math.PI * 2); ctx.fill();
  }
  function drawPlant(f) {
    const s = f.big ? 1.35 : 1;
    const pb = P(f.cx, f.cy, 0);
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath(); ctx.ellipse(pb[0], pb[1], 9 * k * s, 4.5 * k * s, 0, 0, Math.PI * 2); ctx.fill();
    const pt = P(f.cx, f.cy, 0.42 * s);
    ctx.fillStyle = "#d8cbb8";
    ctx.beginPath();
    ctx.moveTo(pt[0] - 6 * k * s, pt[1]); ctx.lineTo(pt[0] + 6 * k * s, pt[1]);
    ctx.lineTo(pb[0] + 4.5 * k * s, pb[1]); ctx.lineTo(pb[0] - 4.5 * k * s, pb[1]); ctx.closePath(); ctx.fill();
    const leaves = [[0, -9, 8], [-6, -5, 6], [6, -5, 6], [-3, -14, 6], [4, -13, 5.5]];
    leaves.forEach(([dx, dy, r], i) => {
      ctx.fillStyle = i % 2 ? "#5f9c69" : "#4b8758";
      ctx.beginPath(); ctx.arc(pt[0] + dx * k * s, pt[1] + dy * k * s, r * k * s, 0, Math.PI * 2); ctx.fill();
    });
  }
  function coffeeMachine(b) {
    const p = P(b.x + 0.25, b.y + b.d, b.z + 0.25);
    ctx.fillStyle = "#e86b4a"; ctx.beginPath(); ctx.arc(p[0], p[1], 1.4 * k, 0, Math.PI * 2); ctx.fill();
    const cup = P(b.x + 0.3, b.y + b.d + 0.05, b.z + 0.02);
    ctx.fillStyle = "#fff"; ctx.fillRect(cup[0] - 1.6 * k, cup[1] - 3 * k, 3.2 * k, 3 * k);
  }
  function fridgeDetail(b) {
    ctx.strokeStyle = "#b9c0c6"; ctx.lineWidth = Math.max(1, k);
    const a = P(b.x, b.y + b.d, 1.3), c = P(b.x + b.w, b.y + b.d, 1.3);
    ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...c); ctx.stroke();
    const h1 = P(b.x + 0.85, b.y + b.d, 1.0), h2 = P(b.x + 0.85, b.y + b.d, 0.6);
    ctx.beginPath(); ctx.moveTo(...h1); ctx.lineTo(...h2); ctx.stroke();
  }
  function pingPongLines(b) {
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = Math.max(1, k);
    poly([P(b.x + 0.05, b.y + 0.05, b.h), P(b.x + b.w - 0.05, b.y + 0.05, b.h), P(b.x + b.w - 0.05, b.y + b.d - 0.05, b.h), P(b.x + 0.05, b.y + b.d - 0.05, b.h)], null, "rgba(255,255,255,0.85)", Math.max(1, k));
    // centre line along the length of the table
    ctx.beginPath();
    if (b.w >= b.d) { ctx.moveTo(...P(b.x, b.y + b.d / 2, b.h)); ctx.lineTo(...P(b.x + b.w, b.y + b.d / 2, b.h)); }
    else { ctx.moveTo(...P(b.x + b.w / 2, b.y, b.h)); ctx.lineTo(...P(b.x + b.w / 2, b.y + b.d, b.h)); }
    ctx.stroke();
  }
  // A machine lights up while someone plays it, otherwise it runs its attract screen
  function arcadePlayer(m) { const s = SPOTS[m.id], a = s && s.taken; return a && a.atSpot && a.anim === "game" ? a : null; }
  function arcadeScreen(b) {
    const m = b.machine, y = b.y + b.d + 0.001, t = world.t;
    const on = arcadePlayer(m);
    poly(quadY(y, b.x + 0.1, b.x + b.w - 0.1, 1.0, 1.58), "#15131c");
    poly(quadY(y, b.x + 0.14, b.x + b.w - 0.14, 1.04, 1.54), on ? `hsl(${(t * 90 + b.x * 40) % 360},70%,58%)` : shade(m.c, 0.55));
    if (on) {
      // a little ship dodging blocks
      const sx = b.x + 0.3 + ((Math.sin(t * 2.3 + b.x) + 1) / 2) * 0.2;
      poly(quadY(y + 0.001, sx, sx + 0.1, 1.1, 1.18), "#ffffff");
      const bz = 1.5 - ((t * 0.6 + b.x) % 1) * 0.4;
      poly(quadY(y + 0.001, b.x + 0.2, b.x + 0.28, bz - 0.06, bz), "#f2e05b");
      poly(quadY(y + 0.001, b.x + 0.5, b.x + 0.58, bz - 0.18, bz - 0.12), "#f2e05b");
    } else if (Math.sin(t * 2 + b.x) > 0) {
      poly(quadY(y + 0.001, b.x + 0.25, b.x + b.w - 0.25, 1.24, 1.32), shade(m.trim, 0.9)); // "INSERT COIN"
    }
    poly(quadY(y, b.x + 0.08, b.x + b.w - 0.08, 1.64, 1.77), m.trim);
  }
  function arcadeControls(b) {
    const zt = b.z + b.h;
    const stick = P(b.x + 0.2, b.y + b.d * 0.5, zt);
    ctx.strokeStyle = "#1b1d22"; ctx.lineWidth = 1.2 * k; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(...stick); ctx.lineTo(stick[0], stick[1] - 3.2 * k); ctx.stroke();
    ctx.fillStyle = "#d9493a"; ctx.beginPath(); ctx.arc(stick[0], stick[1] - 3.4 * k, 1.3 * k, 0, Math.PI * 2); ctx.fill();
    ["#f2e05b", "#7fd6df"].forEach((c, i) => {
      const q = P(b.x + 0.42 + i * 0.14, b.y + b.d * 0.5, zt);
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(q[0], q[1], 1.3 * k, 0.7 * k, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  function drawNet(n) {
    const z0 = 0.75, z1 = 0.92, y = n.y;
    // posts at both ends, a see-through mesh and a white top band
    for (const x of [n.x, n.x + n.w]) {
      ctx.strokeStyle = "#3a3d44"; ctx.lineWidth = 1.4 * k;
      ctx.beginPath(); ctx.moveTo(...P(x, y, z0 - 0.04)); ctx.lineTo(...P(x, y, z1 + 0.02)); ctx.stroke();
    }
    poly(quadY(y, n.x, n.x + n.w, z0, z1), "rgba(236,240,238,0.45)");
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = Math.max(0.6, 0.5 * k);
    for (let x = n.x + 0.1; x < n.x + n.w; x += 0.1) { ctx.beginPath(); ctx.moveTo(...P(x, y, z0)); ctx.lineTo(...P(x, y, z1)); ctx.stroke(); }
    poly(quadY(y, n.x, n.x + n.w, z1 - 0.035, z1), "#f7f7f7");
  }
  function whiteboardScribbles(b) {
    const y = b.y + b.d + 0.002;
    ctx.lineWidth = Math.max(1, 1.2 * k);
    const lines = [["#d4628a", 0.3, 1.0, 1.6], ["#4f7cc4", 0.3, 1.4, 1.3], ["#2fa7b3", 1.5, 2.1, 1.5], ["#e3a03a", 1.3, 1.9, 1.1]];
    lines.forEach(([c, a, e, z]) => { ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(...P(b.x + a, y, z)); ctx.lineTo(...P(b.x + e, y, z)); ctx.stroke(); });
    poly(quadY(y, b.x + 1.45, b.x + 2.05, 0.75, 1.0), null, "#4f7cc4", Math.max(1, k));
  }
  function logoSign(b) {
    const p = P(b.x + b.w / 2, b.y + b.d, b.z + b.h * 0.55);
    ctx.save();
    ctx.translate(p[0], p[1]);
    ctx.transform(1, 0.5, 0, 1, 0, 0); // follow the wall's slope
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    // keep the text on the desk's front panel
    let fs = 8.5 * k;
    ctx.font = `700 ${fs}px ${FONT}`;
    const fit = (b.w * hw * 0.84) / ctx.measureText("SGH · AI TEAM").width;
    if (fit < 1) { fs *= fit; ctx.font = `700 ${fs}px ${FONT}`; }    ctx.fillText("SGH · AI TEAM", 0, 0);
    ctx.restore();
  }
  function sideboardTop(b) {
    const t = P(b.x + 0.5, b.y + 0.25, b.z + b.h);
    ctx.fillStyle = "#3a3d44"; ctx.fillRect(t[0] - 3 * k, t[1] - 9 * k, 6 * k, 9 * k);
    ctx.fillStyle = "#e86b4a"; ctx.fillRect(t[0] - 3 * k, t[1] - 9 * k, 6 * k, 1.6 * k);
    const c = P(b.x + 1.1, b.y + 0.25, b.z + b.h);
    ["#ffffff", "#ffffff", "#ffffff"].forEach((col, i) => { ctx.fillStyle = col; ctx.fillRect(c[0] - 6 * k + i * 4.5 * k, c[1] - 3.4 * k, 3 * k, 3.4 * k); });
    const pl = P(b.x + 1.8, b.y + 0.25, b.z + b.h);
    ctx.fillStyle = "#4b8758"; ctx.beginPath(); ctx.arc(pl[0], pl[1] - 6 * k, 4.5 * k, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#d8cbb8"; ctx.fillRect(pl[0] - 3 * k, pl[1] - 3.5 * k, 6 * k, 3.5 * k);
  }
  function magazines(b) {
    const a = P(b.x + 0.35, b.y + 0.45, b.z + b.h), c = P(b.x + 0.35, b.y + 1.0, b.z + b.h);
    ctx.fillStyle = "#d4628a"; ctx.fillRect(a[0] - 4 * k, a[1] - 2 * k, 7 * k, 3 * k);
    ctx.fillStyle = "#4f7cc4"; ctx.fillRect(c[0] - 3 * k, c[1] - 2 * k, 7 * k, 3 * k);
  }
  function umbrellas(b) {
    const t = P(b.x + 0.17, b.y + 0.17, b.z + b.h);
    ctx.strokeStyle = "#2a2d33"; ctx.lineWidth = 1.4 * k;
    [[-2, "#d9493a"], [2, "#2a2d33"]].forEach(([dx, col]) => { ctx.strokeStyle = col; ctx.beginPath(); ctx.moveTo(t[0] + dx * k, t[1]); ctx.lineTo(t[0] + dx * 1.5 * k, t[1] - 8 * k); ctx.stroke(); });
  }
  function drawLamp(f) {
    const b = P(f.cx, f.cy, 0), t = P(f.cx, f.cy, 1.75);
    ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.beginPath(); ctx.ellipse(b[0], b[1], 5 * k, 2.5 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#3a3d44"; ctx.lineWidth = 1.5 * k; ctx.beginPath(); ctx.moveTo(...b); ctx.lineTo(...t); ctx.stroke();
    ctx.fillStyle = "#f6e7c4"; ctx.beginPath();
    ctx.moveTo(t[0] - 4 * k, t[1] + 2 * k); ctx.lineTo(t[0] + 4 * k, t[1] + 2 * k); ctx.lineTo(t[0] + 2.6 * k, t[1] - 4 * k); ctx.lineTo(t[0] - 2.6 * k, t[1] - 4 * k); ctx.closePath(); ctx.fill();
  }
  function drawWindmill() {
    const m = MILL, T = m.taper, zt = m.h;
    const s = (z) => (T * z) / zt; // how far the walls lean in at height z
    // the face towards the hole (+x) and the face towards the viewer (+y)
    const faceX = (ya, yb, za, zb) => [P(m.x1 - s(zb), Math.max(ya, m.y0 + s(zb)), zb), P(m.x1 - s(zb), Math.min(yb, m.y1 - s(zb)), zb),
      P(m.x1 - s(za), Math.min(yb, m.y1 - s(za)), za), P(m.x1 - s(za), Math.max(ya, m.y0 + s(za)), za)];
    const faceY = (xa, xb, za, zb) => [P(Math.max(xa, m.x0 + s(zb)), m.y1 - s(zb), zb), P(Math.min(xb, m.x1 - s(zb)), m.y1 - s(zb), zb),
      P(Math.min(xb, m.x1 - s(za)), m.y1 - s(za), za), P(Math.max(xa, m.x0 + s(za)), m.y1 - s(za), za)];
    const p0 = P((m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2, 0);
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.beginPath(); ctx.ellipse(p0[0] + 3 * k, p0[1] + 1.5 * k, 18 * k, 8.5 * k, 0, 0, Math.PI * 2); ctx.fill();
    // whitewashed walls on a brick base
    poly(faceY(m.x0, m.x1, 0, zt), "#efe8dc");
    poly(faceX(m.y0, m.y1, 0, zt), "#d8cebe");
    poly(faceY(m.x0, m.x1, 0, 0.13), "#b9573f");
    poly(faceX(m.y0, m.y1, 0, 0.13), "#9c4835");
    // tunnel the ball rolls through, with a rounded top
    const [ta, tb, th] = m.tunnel, mid = (ta + tb) / 2, r = (tb - ta) / 2;
    const arch = [];
    for (let i = 0; i <= 8; i++) { const a = Math.PI - (i * Math.PI) / 8; const y = mid + Math.cos(a) * r, z = th - r + Math.sin(a) * r; arch.push(P(m.x1 - s(z) + 0.002, y, z)); }
    poly([P(m.x1 + 0.002, ta, 0), ...arch, P(m.x1 + 0.002, tb, 0)], "#2a2420");
    // a small window and a door frame line
    const wx = (m.x0 + m.x1) / 2;
    poly(faceY(wx - 0.09, wx + 0.09, 0.48, 0.66).map(([x, y]) => [x, y]), "#5d7f95");
    poly(faceY(wx - 0.09, wx + 0.09, 0.565, 0.575), "#efe8dc");
    // roof: a pyramid that overhangs the walls a little
    const o = 0.06, rx0 = m.x0 + T - o, rx1 = m.x1 - T + o, ry0 = m.y0 + T - o, ry1 = m.y1 - T + o;
    const apex = P((m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2, zt + 0.45);
    poly([P(rx0, ry1, zt), P(rx1, ry1, zt), apex], "#8f4a3a");
    poly([P(rx1, ry0, zt), P(rx1, ry1, zt), apex], "#6f392d");
    // four lattice sails turning on the +x face
    const hz = 0.7, hx = m.x1 - s(hz) + 0.07, hy = (m.y0 + m.y1) / 2;
    const at = (a, rr, w) => P(hx, hy + Math.cos(a) * rr - Math.sin(a) * w, hz + Math.sin(a) * rr + Math.cos(a) * w);
    const a0 = world.t * 1.3;
    ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      const a = a0 + (i * Math.PI) / 2;
      poly([at(a, 0.14, 0.02), at(a, 0.62, 0.02), at(a, 0.62, 0.15), at(a, 0.14, 0.15)], "rgba(246,241,231,0.92)", "#8a7a66", Math.max(0.6, 0.6 * k));
      ctx.strokeStyle = "#8a7a66"; ctx.lineWidth = Math.max(0.5, 0.45 * k);
      for (const rr of [0.3, 0.46]) { ctx.beginPath(); ctx.moveTo(...at(a, rr, 0.02)); ctx.lineTo(...at(a, rr, 0.15)); ctx.stroke(); }
      ctx.strokeStyle = "#5b4030"; ctx.lineWidth = 1.3 * k;
      ctx.beginPath(); ctx.moveTo(...at(a, 0, 0)); ctx.lineTo(...at(a, 0.64, 0)); ctx.stroke();
    }
    const hub = P(hx, hy, hz);
    ctx.fillStyle = "#3a3d44"; ctx.beginPath(); ctx.arc(hub[0], hub[1], 1.7 * k, 0, Math.PI * 2); ctx.fill();
  }
  function drawCatBed(x, y) {
    const b = P(x, y);
    ctx.fillStyle = "rgba(0,0,0,0.14)"; ctx.beginPath(); ctx.ellipse(b[0], b[1] + 1.5 * k, 14 * k, 7 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#a8654a"; ctx.beginPath(); ctx.ellipse(b[0], b[1] + 1 * k, 13 * k, 6.5 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#c27b5a"; ctx.beginPath(); ctx.ellipse(b[0], b[1] - 1 * k, 13 * k, 6.5 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e9d6c1"; ctx.beginPath(); ctx.ellipse(b[0], b[1] - 0.5 * k, 9.5 * k, 4.5 * k, 0, 0, Math.PI * 2); ctx.fill();
  }
  function drawBowls(f) {
    const mat = 0.3;
    poly([P(f.cx - 0.45, f.cy - mat), P(f.cx + 0.45, f.cy - mat), P(f.cx + 0.45, f.cy + mat - 0.1), P(f.cx - 0.45, f.cy + mat - 0.1)], "#e8a6a0");
    [[-0.2, "#4f7cc4", "#8a5a3a"], [0.2, "#f2efe8", "#9fd3e6"]].forEach(([dx, rim, inside]) => {
      const p = P(f.cx + dx, f.cy - 0.05);
      ctx.fillStyle = shade(rim, 0.8); ctx.beginPath(); ctx.ellipse(p[0], p[1], 4.4 * k, 2.3 * k, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rim; ctx.beginPath(); ctx.ellipse(p[0], p[1] - 1.2 * k, 4.4 * k, 2.2 * k, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = inside; ctx.beginPath(); ctx.ellipse(p[0], p[1] - 1.2 * k, 3.2 * k, 1.5 * k, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  function drawToyMouse(f) {
    const p = P(f.cx, f.cy);
    ctx.strokeStyle = "#e88aa0"; ctx.lineWidth = 0.8 * k; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(p[0] - 2.5 * k, p[1] - 1 * k); ctx.quadraticCurveTo(p[0] - 6 * k, p[1] - 3 * k, p[0] - 5 * k, p[1] + 1 * k); ctx.stroke();
    ctx.fillStyle = "#9aa1a8"; ctx.beginPath(); ctx.ellipse(p[0], p[1] - 1.3 * k, 3 * k, 1.8 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e88aa0"; ctx.beginPath(); ctx.arc(p[0] + 1.6 * k, p[1] - 2.8 * k, 0.9 * k, 0, Math.PI * 2); ctx.fill();
  }
  function catTreeToy(b) {
    // a pompom on a string, swinging under the middle platform
    const a = P(b.x + b.w - 0.04, b.y + b.d - 0.04, b.z);
    const sw = Math.sin(world.t * 2.1) * 2.5 * k;
    ctx.strokeStyle = "#7a6a58"; ctx.lineWidth = 0.7 * k;
    ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(a[0] + sw, a[1] + 9 * k); ctx.stroke();
    ctx.fillStyle = "#d4628a"; ctx.beginPath(); ctx.arc(a[0] + sw, a[1] + 10.2 * k, 1.6 * k, 0, Math.PI * 2); ctx.fill();
  }
  function drawFlag(f) {
    const b = P(f.cx, f.cy, 0), t = P(f.cx, f.cy, 1.35);
    ctx.strokeStyle = "#f2efe8"; ctx.lineWidth = 1.2 * k;
    ctx.beginPath(); ctx.moveTo(...b); ctx.lineTo(...t); ctx.stroke();
    const w = Math.sin(world.t * 3) * 1.2 * k;
    ctx.fillStyle = "#d9493a"; ctx.beginPath();
    ctx.moveTo(t[0], t[1]); ctx.lineTo(t[0] + 8 * k, t[1] + 2.5 * k + w); ctx.lineTo(t[0], t[1] + 5.5 * k); ctx.closePath(); ctx.fill();
  }
  // Game room TV on the meeting room wall, drawn right after that wall
  const TV = { x: 14.05, y0: 1.6, y1: 3.9, z0: 0.95, z1: 2.05 };
  function drawTv() {
    const x = TV.x + 0.002;
    poly(quadX(x, TV.y0, TV.y1, TV.z0, TV.z1), "#1b1d22");
    if (world.gaming > 0) {
      const t = world.t;
      poly(quadX(x + 0.001, TV.y0 + 0.08, TV.y1 - 0.08, TV.z0 + 0.07, TV.z1 - 0.07), `hsl(${(t * 40) % 360},55%,45%)`);
      const by = TV.y0 + 0.3 + ((Math.sin(t * 1.7) + 1) / 2) * (TV.y1 - TV.y0 - 0.9);
      const bz = TV.z0 + 0.2 + Math.abs(Math.sin(t * 3)) * 0.5;
      poly(quadX(x + 0.002, by, by + 0.3, bz, bz + 0.3), "#f2e05b");
    } else {
      poly(quadX(x + 0.001, TV.y0 + 0.08, TV.y1 - 0.08, TV.z0 + 0.07, TV.z1 - 0.07), "#262b33");
    }
  }
  function drawGolfBall(x, y) {
    const p = P(x, y, 0);
    ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.ellipse(p[0], p[1], 1.6 * k, 0.8 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(p[0], p[1] - 1.3 * k, 1.4 * k, 0, Math.PI * 2); ctx.fill();
  }
  function coatRack(b) {
    const t = P(b.x + 0.06, b.y + 0.06, 1.6);
    ctx.fillStyle = "#c27b5a"; ctx.beginPath(); ctx.ellipse(t[0] + 3 * k, t[1] + 6 * k, 3 * k, 5 * k, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#4f7cc4"; ctx.beginPath(); ctx.ellipse(t[0] - 3 * k, t[1] + 7 * k, 3 * k, 5.5 * k, -0.3, 0, Math.PI * 2); ctx.fill();
  }
  function bookshelfBooks(b) {
    const cols = ["#4f7cc4", "#d4628a", "#e3a03a", "#5aa865", "#8a6fd1", "#2fa7b3", "#c27b5a"];
    const x = b.x + b.w + 0.001;
    for (let shelf = 0; shelf < 3; shelf++) {
      const z0 = 0.15 + shelf * 0.6;
      poly(quadX(x, b.y + 0.05, b.y + b.d - 0.05, z0 - 0.06, z0 - 0.02), shade("#9b7a55", 0.6));
      let y = b.y + 0.12, i = shelf * 2;
      while (y < b.y + b.d - 0.2) {
        const wdt = 0.12 + ((i * 37) % 5) * 0.03, ht = 0.34 + ((i * 13) % 4) * 0.04;
        poly(quadX(x, y, y + wdt, z0, z0 + ht), cols[i % cols.length]);
        y += wdt + 0.03; i++;
      }
    }
  }
  function monitorScreen(b) {
    const s = b.screenOf;
    const on = s.taken && s.taken.atSpot && s.taken.anim === "type";
    const y = b.y + b.d + 0.002;
    poly(quadY(y, b.x + 0.05, b.x + b.w - 0.05, b.z + 0.08, b.z + b.h - 0.05), on ? "#1d3340" : "#262b33");
    if (on) {
      ctx.lineWidth = Math.max(1, k);
      for (let i = 0; i < 4; i++) {
        const z = b.z + b.h - 0.12 - i * 0.08;
        const len = 0.2 + (((i * 7 + Math.floor(world.t * 2)) % 5) / 5) * 0.45;
        ctx.strokeStyle = ["#7fd6df", "#e3a03a", "#9fb4ff", "#7fd6df"][i];
        ctx.beginPath(); ctx.moveTo(...P(b.x + 0.12, y, z)); ctx.lineTo(...P(b.x + 0.12 + len, y, z)); ctx.stroke();
      }
    }
  }

  /* ---------------- static background: floor and outer walls ---------------- */
  const FLOOR = {
    main: ["#c9a67b", "#c19e72"], kitchen: ["#e6e0d4", "#d3cbbd"], mr1: ["#7f95a5", "#7a90a0"],
    game: ["#6f8f7f", "#6a8a7a"], mr2: ["#9a9ebd", "#959ab8"], entrance: ["#d2c9b9", "#c7bdab"],
  };
  function drawBackground() {
    // floor slab edges (front)
    const edge = "#2b2620";
    poly([P(0, H, 0), P(W, H, 0), P(W, H, -0.5), P(0, H, -0.5)], edge);
    poly([P(W, 0, 0), P(W, H, 0), P(W, H, -0.5), P(W, 0, -0.5)], shade("#2b2620", 0.8));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const room = roomAt(x, y);
      const [a, b] = FLOOR[room];
      let c = a;
      if (room === "kitchen" || room === "entrance") c = (x + y) % 2 ? a : b;
      else if (room === "main") c = (y % 2 === 0) !== (Math.floor((x + (y % 2) * 0.5) / 3) % 2 === 0) ? a : b;
      poly([P(x, y), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1)], c, c, 0.6);
    }
    // wood plank seams
    ctx.strokeStyle = "rgba(90,60,30,0.10)"; ctx.lineWidth = Math.max(1, 0.6 * k);
    for (let y = 7; y <= H; y += 0.5) { ctx.beginPath(); ctx.moveTo(...P(0, y)); ctx.lineTo(...P(18, y)); ctx.stroke(); }
    // rugs
    poly([P(1.0, 15.2), P(6.3, 15.2), P(6.3, 19.5), P(1.0, 19.5)], "#e7d9c3");
    poly([P(1.3, 15.5), P(6.0, 15.5), P(6.0, 19.2), P(1.3, 19.2)], null, "#c9b48f", Math.max(1, 1.2 * k));
    poly([P(20.1, 0.4), P(23.5, 0.4), P(23.5, 5.6), P(20.1, 5.6)], "rgba(255,255,255,0.08)");
    // mini golf green, tee mat and hole
    poly([P(GOLF.x0, GOLF.y0), P(GOLF.x1, GOLF.y0), P(GOLF.x1, GOLF.y1), P(GOLF.x0, GOLF.y1)], "#5f9f62");
    for (let i = 0; i < 6; i++) { const x = GOLF.x0 + i * ((GOLF.x1 - GOLF.x0) / 6); if (i % 2) poly([P(x, GOLF.y0), P(x + (GOLF.x1 - GOLF.x0) / 6, GOLF.y0), P(x + (GOLF.x1 - GOLF.x0) / 6, GOLF.y1), P(x, GOLF.y1)], "#67a86a"); }
    poly([P(GOLF.tee.x - 0.35, GOLF.tee.y - 0.35), P(GOLF.tee.x + 0.35, GOLF.tee.y - 0.35), P(GOLF.tee.x + 0.35, GOLF.tee.y + 0.35), P(GOLF.tee.x - 0.35, GOLF.tee.y + 0.35)], "#3f7a47");
    const hp = P(GOLF.hole.x, GOLF.hole.y);
    ctx.fillStyle = "#1f2a20"; ctx.beginPath(); ctx.ellipse(hp[0], hp[1], 3.4 * k, 1.7 * k, 0, 0, Math.PI * 2); ctx.fill();
    poly([P(20.1, 8.0), P(22.8, 8.0), P(22.8, 10.9), P(20.1, 10.9)], "#b7b8d6");
    poly([P(19.5, 16.3), P(22.9, 16.3), P(22.9, 19.0), P(19.5, 19.0)], "#b9ab95");
    poly([P(19.7, 16.5), P(22.7, 16.5), P(22.7, 18.8), P(19.7, 18.8)], null, "#9d8f78", Math.max(1, k));
    // sunlight from the left windows
    for (const [y0, y1] of [[1.4, 5.6], [7.6, 11.6]]) {
      ctx.fillStyle = "rgba(255,236,190,0.22)";
      poly([P(0, y0), P(2.6, y0 + 1.2), P(2.6, y1 + 1.2), P(0, y1)], "rgba(255,236,190,0.20)");
    }
    // doormat and cat bed
    poly([P(23.0, 15.1), P(24, 15.1), P(24, 16.9), P(23.0, 16.9)], "#5b4a3a");
    drawCatBed(23.2, 5.3);

    // outer walls (back left x=0, back right y=0)
    const wall = "#ece7df", wallR = "#e2dcd2";
    poly(quadX(0, 0, H, 0, WALL), wall);
    poly(quadY(0, 0, W, 0, WALL), wallR);
    poly(quadX(0, 0, H, 0, 0.14), "#cfc6b8");
    poly(quadY(0, 0, W, 0, 0.14), "#c8bfb1");
    // wall caps
    poly([P(0, 0, WALL), P(W, 0, WALL), P(W, -0.25, WALL), P(-0.25, -0.25, WALL), P(-0.25, H, WALL), P(0, H, WALL)], "#a69d90");
    // windows
    const win = (pts) => { poly(pts, "#bcd8e4", "#8a9aa3", Math.max(1, k)); };
    for (const [y0, y1] of [[1.4, 5.6], [7.6, 11.6]]) {
      win(quadX(0.001, y0, y1, 1.0, 2.6));
      for (let y = y0; y <= y1 + 1e-6; y += (y1 - y0) / 3) { ctx.beginPath(); ctx.moveTo(...P(0.001, y, 1.0)); ctx.lineTo(...P(0.001, y, 2.6)); ctx.stroke(); }
    }
    // back wall: the same window in every bay, two per room. The kitchen's
    // second window is shifted so the fridge doesn't stand in front of it, and
    // the game room's leave the wall between them for the arcade machines.
    for (const c of [1.75, 4.3, 8.75, 12.25, 15.8, 21.6]) {
      const x0 = c - 1.0, x1 = c + 1.0;
      win(quadY(0.001, x0, x1, 1.2, 2.6));
      ctx.beginPath(); ctx.moveTo(...P(c, 0.001, 1.2)); ctx.lineTo(...P(c, 0.001, 2.6)); ctx.stroke();
    }
    // kanban board on the left wall
    poly(quadX(0.002, 12.6, 16.6, 0.9, 2.35), "#f7f5f0", "#c9c2b5", Math.max(1, k));
    const cols = [[12.6, 13.93], [13.93, 15.27], [15.27, 16.6]];
    ctx.strokeStyle = "#d8d1c4";
    cols.slice(1).forEach(([a]) => { ctx.beginPath(); ctx.moveTo(...P(0.003, a, 0.95)); ctx.lineTo(...P(0.003, a, 2.3)); ctx.stroke(); });
    const notes = ["#f6d365", "#a7d8de", "#f4a7b9", "#b9e4a6"];
    [[0, 3], [1, 2], [2, 4]].forEach(([ci, n]) => {
      for (let i = 0; i < n; i++) {
        const y0 = cols[ci][0] + 0.15 + (i % 2) * 0.55, z0 = 2.0 - Math.floor(i / 2) * 0.38;
        poly(quadX(0.004, y0, y0 + 0.42, z0 - 0.28, z0), notes[(ci + i) % 4]);
      }
    });
  }
  function drawDoor() {
    const o = world.doorOpen * 0.72;
    const frame = { c: "#3a3d44" };
    const glass = { top: "rgba(225,240,246,0.6)", left: "rgba(190,225,238,0.32)", right: "rgba(170,210,226,0.3)" };
    const bx = (o2) => Object.assign({ z: 0 }, o2);
    [bx(Object.assign({ x: DOOR.x - 0.08, y: DOOR.y0 + (0.78 - o) * 0 - o, w: 0.06, d: 0.78, h: 2.25 }, glass)),
     bx(Object.assign({ x: DOOR.x - 0.08, y: DOOR.y0 + 0.82 + o, w: 0.06, d: 0.78, h: 2.25 }, glass)),
     bx(Object.assign({ x: DOOR.x - 0.1, y: DOOR.y0 - 0.1, w: 0.1, d: 0.1, h: 2.4 }, frame)),
     bx(Object.assign({ x: DOOR.x - 0.1, y: DOOR.y1, w: 0.1, d: 0.1, h: 2.4 }, frame)),
     bx(Object.assign({ x: DOOR.x - 0.1, y: DOOR.y0 - 0.1, w: 0.1, d: DOOR.y1 - DOOR.y0 + 0.2, h: 0.18, z: 2.4 }, frame))]
      .forEach((b) => drawChunk(b, b.x, b.x + b.w, b.y, b.y + b.d));
    // a small sign above the door
    const s = P(DOOR.x - 0.04, (DOOR.y0 + DOOR.y1) / 2, 2.49);
    ctx.save(); ctx.translate(s[0], s[1]); ctx.transform(1, -0.5, 0, 1, 0, 0);
    ctx.fillStyle = "#3fb8c4"; ctx.font = `700 ${Math.max(6, 6.5 * k)}px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.fillText("WELCOME", 0, -1 * k); ctx.restore();
  }
  function drawDynamicWall() {
  }

  /* ---------------- people ---------------- */
  function faceVec(f) { return Array.isArray(f) ? f : DIRS[f] || DIRS.S; }

  function drawPerson(a) {
    const p = P(a.x, a.y, a.z);
    const [fx, fy] = faceVec(a.face);
    const front = fx + fy > 0;          // facing the viewer
    const sdir = Math.sign(fx - fy) || 1; // screen left/right
    const sb = a.sitBlend == null ? (a.pose === "sit" ? 1 : 0) : a.sitBlend;
    const sit = sb > 0.5, crouch = a.anim === "pet";
    const walk = a.moving;
    const ph = a.phase;
    const bob = walk ? Math.abs(Math.sin(ph)) * 1.2 * k * (a.gait || 1) : 0;
    // a slow breath while standing or sitting still
    const breath = walk ? 0 : (Math.sin((world.t + a.seed) * 2.1) + 1) * 0.3 * k;

    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath(); ctx.ellipse(p[0], p[1], 6.5 * k, 3 * k, 0, 0, Math.PI * 2); ctx.fill();

    let hip = p[1] - (crouch ? 4 : 8 - 2 * sb) * k - bob;
    // legs
    ctx.fillStyle = "#3a3f4b";
    if (sit) {
      ctx.fillRect(p[0] - 3.6 * k + sdir * 1.5 * k, hip - 1 * k, 3 * k, 4.5 * k);
      ctx.fillRect(p[0] + 0.6 * k + sdir * 1.5 * k, hip - 1 * k, 3 * k, 4.5 * k);
    } else if (!crouch) {
      const s = walk ? Math.sin(ph) * 2 * k : 0;
      ctx.fillRect(p[0] - 3.4 * k + s, hip, 2.8 * k, p[1] - hip - 0.5 * k);
      ctx.fillRect(p[0] + 0.6 * k - s, hip, 2.8 * k, p[1] - hip - 0.5 * k);
      ctx.fillStyle = "#26292f";
      ctx.fillRect(p[0] - 3.8 * k + s, p[1] - 1.6 * k, 3.4 * k, 1.6 * k);
      ctx.fillRect(p[0] + 0.4 * k - s, p[1] - 1.6 * k, 3.4 * k, 1.6 * k);
    } else {
      ctx.fillRect(p[0] - 4 * k, hip, 8 * k, 3 * k);
    }
    // body
    const bodyH = 10.5 * k, bodyW = 10 * k;
    const by = hip - bodyH - breath;
    ctx.fillStyle = a.def.shirt;
    roundRect(p[0] - bodyW / 2, by, bodyW, bodyH + breath + 1 * k, 3 * k);
    ctx.fill();
    // arms
    ctx.strokeStyle = shade(a.def.shirt, 0.82);
    ctx.lineWidth = 2.4 * k; ctx.lineCap = "round";
    const sh = by + 2.5 * k, t = world.t + a.seed;
    const arm = (side, ex, ey) => { ctx.beginPath(); ctx.moveTo(p[0] + side * 4.6 * k, sh); ctx.lineTo(p[0] + side * 4.6 * k + ex, sh + ey); ctx.stroke(); };
    switch (a.anim) {
      case "type": arm(-1, 1.5 * k, 6 * k + Math.sin(t * 14) * k); arm(1, -1.5 * k, 6 * k + Math.cos(t * 13) * k); break;
      case "stretch": { const u = Math.sin(t * 3) > 0 ? -9 : -7; arm(-1, -2 * k, u * k); arm(1, 2 * k, u * k); break; }
      case "board": arm(-1, 0, 7 * k); arm(1, 3 * k * sdir, -6 * k + Math.sin(t * 6) * 1.5 * k); break;
      case "pet": arm(-1, 0, 6 * k); arm(1, 5 * k * sdir, 5 * k + Math.sin(t * 8) * 1.2 * k); break;
      case "play": arm(-1, 0, 7 * k); arm(1, 4 * k * sdir, 2 * k + Math.sin(t * 7) * 3 * k); break;
      case "game": arm(-1, 2.5 * k, 5 * k); arm(1, -2.5 * k, 5 * k); break;
      case "drink": arm(-1, 0, 7 * k); arm(1, 2 * k * sdir, -2.5 * k); break;
      case "putt": {
        const sw = Math.sin(t * 2.2) * 2.5 * k;
        arm(-1, 2.5 * k * sdir + sw, 7 * k); arm(1, 1 * k * sdir + sw, 7 * k);
        ctx.strokeStyle = "#9aa1a8"; ctx.lineWidth = 1.2 * k;
        ctx.beginPath(); ctx.moveTo(p[0] + 2 * k * sdir + sw, sh + 7 * k); ctx.lineTo(p[0] + 6 * k * sdir + sw * 1.6, p[1] - 0.5 * k); ctx.stroke();
        ctx.strokeStyle = shade(a.def.shirt, 0.82); ctx.lineWidth = 2.4 * k;
        break;
      }
      case "talk": arm(-1, 0, 7 * k); arm(1, 2 * k * sdir, 5 * k + Math.sin(t * 4) * 2 * k); break;
      default: { const s = walk ? Math.sin(ph) * 2.5 * k : 0; arm(-1, -s * 0.4, 7 * k); arm(1, s * 0.4, 7 * k); }
    }
    // props
    const hand = [p[0] + 4.6 * k + 2 * k * sdir, sh - 2.5 * k];
    if (a.anim === "drink") { ctx.fillStyle = "#fff"; ctx.fillRect(hand[0] - 1.5 * k, hand[1] - 3 * k, 3 * k, 3.4 * k); }
    if (a.anim === "play") { ctx.fillStyle = "#d9493a"; ctx.beginPath(); ctx.arc(p[0] + (4.6 + 4) * k * sdir, sh + 2 * k + Math.sin(t * 7) * 3 * k, 2.2 * k, 0, Math.PI * 2); ctx.fill(); }
    if (a.anim === "game") { ctx.fillStyle = "#2a2d33"; ctx.fillRect(p[0] - 3 * k, sh + 4 * k, 6 * k, 2.4 * k); }
    // head
    const hy = by - 4.2 * k + (a.anim === "talk" ? Math.sin(t * 5) * 0.5 * k : 0);
    ctx.fillStyle = a.def.skin;
    ctx.beginPath(); ctx.arc(p[0], hy, 4.6 * k, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = a.def.hair;
    ctx.beginPath();
    if (front) {
      ctx.arc(p[0], hy - 0.6 * k, 4.9 * k, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
      if (a.def.hairStyle === "long") { ctx.fillRect(p[0] - 5 * k, hy - 1 * k, 2 * k, 6.5 * k); ctx.fillRect(p[0] + 3 * k, hy - 1 * k, 2 * k, 6.5 * k); }
      ctx.fillStyle = "#2a2a2a";
      // blink every few seconds, each person on their own beat
      const blink = (world.t + a.seed * 2.3) % (3.6 + (a.seed % 1.5)) < 0.13;
      for (const ex of [-1.6, 1.6]) {
        const cx = p[0] + sdir * 1 * k + ex * k;
        if (blink) ctx.fillRect(cx - 0.75 * k, hy + 0.45 * k, 1.5 * k, 0.4 * k);
        else { ctx.beginPath(); ctx.arc(cx, hy + 0.6 * k, 0.65 * k, 0, Math.PI * 2); ctx.fill(); }
      }
    } else {
      ctx.arc(p[0], hy - 0.3 * k, 4.9 * k, 0, Math.PI * 2); ctx.fill();
      if (a.def.hairStyle === "long") ctx.fillRect(p[0] - 4.6 * k, hy, 9.2 * k, 6 * k);
    }
    if (a.def.hairStyle === "bun") { ctx.fillStyle = a.def.hair; ctx.beginPath(); ctx.arc(p[0], hy - 5.4 * k, 2.2 * k, 0, Math.PI * 2); ctx.fill(); }
    a._headY = hy - 6 * k;
    a._sx = p[0];
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawLabel(a) {
    if (cssW < 560) return;
    const text = a.def.short || a.def.name;
    const fs = Math.max(9, 9.5 * k);
    ctx.font = `600 ${fs}px ${FONT}`;
    const tw = ctx.measureText(text).width;
    const x = a._sx, y = a._headY - 5 * k;
    ctx.fillStyle = "rgba(19,20,23,0.78)";
    roundRect(x - tw / 2 - 4 * k, y - fs * 0.75 - 2 * k, tw + 8 * k, fs + 4 * k, 3 * k); ctx.fill();
    ctx.fillStyle = a.def.shirt;
    ctx.fillRect(x - tw / 2 - 4 * k, y + fs * 0.25 + 1.2 * k, tw + 8 * k, 1.4 * k);
    ctx.fillStyle = "#f2f4f6"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillText(text, x, y + fs * 0.12);
    a._labelTop = y - fs * 0.75 - 2 * k;
  }
  function drawCatLabel() {
    if (cssW < 560 || cat._top == null) return;
    const fs = Math.max(8.5, 8.5 * k);
    ctx.font = `600 ${fs}px ${FONT}`;
    const tw = ctx.measureText(CAT_NAME).width;
    const x = cat._sx, y = cat._top - 1 * k;
    ctx.fillStyle = "rgba(19,20,23,0.65)";
    roundRect(x - tw / 2 - 3.5 * k, y - fs * 0.75 - 2 * k, tw + 7 * k, fs + 4 * k, 3 * k); ctx.fill();
    ctx.fillStyle = "#e9eef5"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillText(CAT_NAME, x, y + fs * 0.12);
  }
  // Bubbles pop up from the speaker's head and fade out at the end
  function drawBubbleFor(a) {
    const b = a.bubble, age = world.t - (b.from == null ? -1 : b.from), left = b.until - world.t;
    const u = Math.min(1, age / 0.22);
    const s = 0.55 + 0.45 * (1 + 2.2 * (u - 1) ** 3 + 1.2 * (u - 1) ** 2); // ease out with a small overshoot
    const x = a._sx, y = (a._labelTop || a._headY) - 1;
    ctx.save();
    ctx.globalAlpha = Math.min(1, u * 2, left / 0.3);
    ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y);
    drawBubble(x, y, b.text);
    ctx.restore();
  }
  function drawBubble(x, yBottom, text) {
    const fs = Math.max(9.5, 10.5 * k);
    ctx.font = `600 ${fs}px ${FONT}`;
    const tw = ctx.measureText(text).width;
    const bw = tw + 10 * k, bh = fs + 7 * k;
    const bx = x - bw / 2, by = yBottom - bh - 4 * k;
    ctx.fillStyle = "#ffffff";
    roundRect(bx, by, bw, bh, 5 * k); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 3 * k, by + bh - 0.5); ctx.lineTo(x, by + bh + 4 * k); ctx.lineTo(x + 3 * k, by + bh - 0.5); ctx.fill();
    ctx.fillStyle = "#1f2125"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, x, by + bh / 2 + 0.5);
  }

  /* ---------------- the cat ---------------- */
  function drawCat(c) {
    const p = P(c.x, c.y, c.z);
    c._sx = p[0];
    const sdir = c.sdir;
    const t = world.t;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath(); ctx.ellipse(p[0], p[1] + (c.z > 0 ? (c.z * zh) : 0), 6 * k, 2.4 * k, 0, 0, Math.PI * 2); ctx.fill();
    const grey = "#8c9098", dark = "#6d7179", white = "#f4f2ee";
    if (c.mode === "sleep") {
      ctx.fillStyle = grey; ctx.beginPath(); ctx.ellipse(p[0], p[1] - 2.6 * k, 5.6 * k, 3.2 * k, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = white; ctx.beginPath(); ctx.ellipse(p[0] + 2.2 * k * sdir, p[1] - 2.2 * k, 2.6 * k, 2 * k, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = dark; ctx.lineWidth = 1.8 * k; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(p[0], p[1] - 2.2 * k, 5.4 * k, 0.2, 1.6); ctx.stroke();
      ctx.fillStyle = grey; ctx.beginPath(); ctx.arc(p[0] + 3.6 * k * sdir, p[1] - 4.4 * k, 2.6 * k, 0, Math.PI * 2); ctx.fill();
      ear(p[0] + 2.4 * k * sdir, p[1] - 6.2 * k, sdir); ear(p[0] + 4.6 * k * sdir, p[1] - 6.4 * k, sdir);
      c._top = p[1] - 9 * k;
      return;
    }
    const sitting = c.mode !== "walk";
    const step = c.moving ? Math.sin(c.phase) * 1.4 * k : 0;
    // tail
    ctx.strokeStyle = grey; ctx.lineWidth = 1.8 * k; ctx.lineCap = "round";
    const tx = p[0] - 5 * k * sdir, ty = p[1] - (sitting ? 2 : 4) * k;
    ctx.beginPath(); ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx - 4 * k * sdir, ty - 4 * k, tx - 2 * k * sdir + Math.sin(t * 3 + c.seed) * 2.5 * k, ty - 8 * k);
    ctx.stroke();
    // legs
    ctx.fillStyle = white;
    if (!sitting) {
      ctx.fillRect(p[0] - 3.5 * k + step, p[1] - 3 * k, 1.5 * k, 3 * k);
      ctx.fillRect(p[0] + 2.5 * k - step, p[1] - 3 * k, 1.5 * k, 3 * k);
    }
    // body
    ctx.fillStyle = grey;
    if (sitting) { ctx.beginPath(); ctx.ellipse(p[0] - 0.5 * k * sdir, p[1] - 3.8 * k, 4 * k, 4 * k, 0, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.beginPath(); ctx.ellipse(p[0], p[1] - 4.5 * k, 6 * k, 2.8 * k, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = white;
    ctx.beginPath(); ctx.ellipse(p[0] + 2.4 * k * sdir, p[1] - (sitting ? 3 : 3.6) * k, 2.2 * k, 1.8 * k, 0, 0, Math.PI * 2); ctx.fill();
    // head
    const hx = p[0] + (sitting ? 2.6 : 5.4) * k * sdir, hy = p[1] - (sitting ? 8.6 : 7.2) * k + (c.mode === "petted" ? Math.sin(t * 6) * 0.6 * k : 0);
    ctx.fillStyle = grey; ctx.beginPath(); ctx.arc(hx, hy, 2.9 * k, 0, Math.PI * 2); ctx.fill();
    ear(hx - 1.6 * k, hy - 2 * k, sdir); ear(hx + 1.6 * k, hy - 2 * k, sdir);
    ctx.fillStyle = white; ctx.beginPath(); ctx.arc(hx + 0.8 * k * sdir, hy + 1 * k, 1.5 * k, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#2a2a2a";
    if (c.mode === "petted") { ctx.fillRect(hx - 1.6 * k, hy - 0.4 * k, 1.2 * k, 0.5 * k); ctx.fillRect(hx + 0.6 * k, hy - 0.4 * k, 1.2 * k, 0.5 * k); }
    else { ctx.beginPath(); ctx.arc(hx - 1 * k + 0.6 * k * sdir, hy - 0.2 * k, 0.55 * k, 0, Math.PI * 2); ctx.arc(hx + 1 * k + 0.6 * k * sdir, hy - 0.2 * k, 0.55 * k, 0, Math.PI * 2); ctx.fill(); }
    c._top = hy - 6 * k;
  }
  function ear(x, y, sdir) {
    ctx.fillStyle = "#8c9098";
    ctx.beginPath(); ctx.moveTo(x - 1.3 * k, y + 0.6 * k); ctx.lineTo(x + 0.2 * k * sdir, y - 2.4 * k); ctx.lineTo(x + 1.3 * k, y + 0.6 * k); ctx.fill();
  }
  function drawYarn(y) {
    const p = P(y.x, y.y, 0);
    ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.beginPath(); ctx.ellipse(p[0], p[1], 2.6 * k, 1.2 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#d9493a"; ctx.beginPath(); ctx.arc(p[0], p[1] - 2 * k, 2.2 * k, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#f08a7c"; ctx.lineWidth = 0.8 * k;
    ctx.beginPath(); ctx.arc(p[0], p[1] - 2 * k, 1.3 * k, y.rot, y.rot + 2); ctx.stroke();
  }
  function drawBall(b) {
    const s = P(b.x, b.y, 0.76), p = P(b.x, b.y, b.z);
    ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.beginPath(); ctx.ellipse(s[0], s[1], 1.6 * k, 0.8 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(p[0], p[1], 1.5 * k, 0, Math.PI * 2); ctx.fill();
  }

  /* =====================================================================
     Simulation
  ===================================================================== */
  const world = { t: 0, standup: false, particles: [], doorOpen: 0 };

  class Agent {
    constructor(def, seed) {
      this.def = def; this.seed = seed;
      this.home = SPOTS[HOME[def.id]];
      this.home.taken = this; this.home.owner = this;
      this.x = this.home.x; this.y = this.home.y; this.z = 0;
      this.pose = "sit"; this.face = this.home.face; this.anim = "type";
      this.atSpot = true; this.spot = this.home;
      this.queue = []; this.step = null; this.task = null;
      this.moving = false; this.path = null; this.phase = 0; this.speed = rand(2.1, 2.5);
      this.bubble = null; this.label = def.work;
      this.walkT = 0; this.gait = 1; this.sitBlend = 1;
    }
    say(text, dur) { this.bubble = { text, from: world.t, until: world.t + (dur || 2.6) }; }
    setTask(task) {
      this.task = task; this.label = task.label; this.queue = task.steps.slice(); this.step = null;
      this.next();
    }
    releaseSpot() { if (this.spot && this.spot.taken === this && this.spot.owner !== this) this.spot.taken = null; this.spot = null; this.atSpot = false; }
    next() {
      const s = this.step = this.queue.shift() || null;
      if (!s) { this.task = null; return; }
      if (s.go) {
        const target = typeof s.go === "function" ? s.go(this) : s.go;
        if (!target) { this.next(); return; }
        this.releaseSpot();
        if (target.id) { target.taken = this; }
        this.target = target;
        this.path = findPath(this.x, this.y, target);
        this.moving = true; this.walkT = 0; this.pose = "stand"; this.anim = "walk"; this.z = 0;
      } else if (s.walk) {
        this.releaseSpot();
        this.target = Object.assign({ pose: "stand" }, s.walk);
        this.path = [{ x: s.walk.x, y: s.walk.y }];
        this.moving = true; this.walkT = 0; this.pose = "stand"; this.anim = "walk"; this.z = 0;
      } else if (s.wait != null) {
        this.timer = typeof s.wait === "function" ? s.wait() : s.wait;
        this.anim = s.anim || "idle";
        if (s.face) this.face = s.face;
        this.nextBubble = world.t + rand(0.6, 2.5);
      } else if (s.sync) {
        s.sync.arrived.add(this);
        this.anim = s.anim || "idle";
      } else if (s.fn) {
        s.fn(this); this.next();
      }
    }
    update(dt) {
      // ease into and out of sitting instead of dropping onto the chair
      this.sitBlend = approach(this.sitBlend || 0, this.pose === "sit" ? 1 : 0, dt * 7);
      if (this.moving) {
        const tgt = this.path[0];
        const dx = tgt.x - this.x, dy = tgt.y - this.y, d = Math.hypot(dx, dy);
        // speed up over the first steps, slow down for the last
        this.walkT += dt;
        let left = d;
        for (let i = 1; i < this.path.length; i++) left += Math.hypot(this.path[i].x - this.path[i - 1].x, this.path[i].y - this.path[i - 1].y);
        this.gait = Math.min(1, 0.35 + this.walkT / 0.4, 0.3 + left / 0.7);
        const stepLen = this.speed * this.gait * dt;
        if (d <= stepLen) { this.x = tgt.x; this.y = tgt.y; this.path.shift(); }
        else { this.x += (dx / d) * stepLen; this.y += (dy / d) * stepLen; }
        if (d > 0.05) this.face = [Math.abs(dx / d) > 0.38 ? Math.sign(dx) : 0, Math.abs(dy / d) > 0.38 ? Math.sign(dy) : 0];
        this.phase += dt * 11 * this.gait;
        if (!this.path.length) {
          this.moving = false;
          const t = this.target;
          this.pose = t.pose || "stand"; this.face = t.face || this.face;
          this.atSpot = true; this.spot = t.id ? t : null;
          this.next();
        }
        return;
      }
      const s = this.step;
      if (!s) { if (!this.task) scheduler.assignSolo(this); return; }
      if (s.wait != null) {
        this.timer -= dt;
        if (s.bubbles && world.t > this.nextBubble) { this.say(pick(s.bubbles)); this.nextBubble = world.t + rand(4, 8); }
        if (s.tick) s.tick(this, dt);
        if (this.timer <= 0) this.next();
      } else if (s.sync) {
        const g = s.sync;
        if (g.cancelled || g.arrived.size >= g.members.length) { if (!g.active && !g.cancelled) g.start(); this.next(); }
      }
    }
  }

  /* ---------------- cat ---------------- */
  const cat = {
    x: 1.0, y: 9.1, z: 0, mode: "sleep", moving: false, path: null, phase: 0, sdir: 1, seed: 1.7,
    until: 14, label: "napping in the sun", reservedBy: null, plan: null, jump: null,
  };
  const yarn = { x: 6, y: 14, rot: 0, tx: 6, ty: 14, active: false };
  const CAT_NAPS = [
    { x: 1.0, y: 9.1, z: 0, label: "napping in the sun" },
    { x: 23.2, y: 5.3, z: 0, label: "asleep in the cat bed", approach: { x: 22.6, y: 5.5 } },
    { x: 3.4, y: 18.6, z: 0.42, label: "napping on the sofa", approach: { x: 3.4, y: 17.6 } },
    { x: CAT_CORNER.bed.x, y: CAT_CORNER.bed.y - 0.05, z: 0, label: "curled up in the bed by the mini golf", approach: { x: CAT_CORNER.bed.x, y: 18.4 } },
    { x: CAT_CORNER.tree.x + 0.3, y: CAT_CORNER.tree.y + 0.3, z: 1.32, label: "napping on top of the cat tree", approach: { x: CAT_CORNER.tree.x + 0.3, y: 17.6 } },
  ];
  function catGo(t, speed, then) {
    cat.path = findPath(cat.x, cat.y, t.approach || t);
    cat.moving = true; cat.mode = "walk"; cat.speed = speed || 1.5; cat.after = then;
    cat.z = 0;
  }
  function catJump(to, then) { cat.jump = { fx: cat.x, fy: cat.y, fz: cat.z, tx: to.x, ty: to.y, tz: to.z || 0, t: 0, then }; cat.mode = "sit"; }
  function catPlan() {
    if (cat.reservedBy) return;
    const working = agents.filter((a) => a.atSpot && a.spot === a.home && a.anim === "type");
    const r = Math.random();
    if (r < 0.3) {
      const nap = pick(CAT_NAPS);
      cat.label = "walking over for a nap";
      catGo(nap, 1.3, () => {
        const settle = () => { cat.mode = "sleep"; cat.label = nap.label; cat.until = world.t + rand(16, 26); };
        if (nap.approach) catJump(nap, settle); else settle();
      });
    } else if (r < 0.5) {
      cat.label = "playing with a ball of yarn";
      yarn.active = true; yarn.x = rand(2.5, 7); yarn.y = rand(13.0, 14.1); yarn.tx = yarn.x; yarn.ty = yarn.y;
      catGo({ x: yarn.x - 0.6, y: yarn.y }, 2.2, () => { cat.mode = "play"; cat.until = world.t + rand(9, 13); });
    } else if (r < 0.7 && working.length) {
      const a = pick(working);
      const deskTop = { x: a.home.desk.x + 0.55, y: a.home.desk.y, z: 0.75 };
      const appr = { x: a.home.x + 0.75, y: a.home.y };
      cat.label = `sitting on ${who(a.def)}'s desk`;
      catGo(appr, 1.5, () => catJump(deskTop, () => {
        cat.mode = "sit"; cat.until = world.t + rand(8, 11); cat.onDesk = { a, appr };
        a.say(pick(["Alan, not the keyboard!", "Hi, Alan 😺", "Off the desk, Alan", "Help, a cat"]), 3);
      }));
    } else if (r < 0.88) {
      // Alan's corner: a bite to eat, or a go at the scratching post
      if (Math.random() < 0.55) {
        cat.label = "walking over to the food bowl";
        catGo({ x: CAT_CORNER.bowls.x - 0.2, y: CAT_CORNER.bowls.y - 0.5 }, 1.8, () => { cat.mode = "sit"; cat.sdir = 1; cat.label = "having a bite to eat"; cat.until = world.t + rand(5, 8); });
      } else {
        cat.label = "heading for the cat tree";
        catGo({ x: CAT_CORNER.tree.x + 0.3, y: CAT_CORNER.tree.y - 0.3 }, 1.6, () => { cat.mode = "sit"; cat.sdir = 1; cat.label = "sharpening claws on the cat tree"; cat.until = world.t + rand(4, 6); });
      }
    } else {
      cat.label = "exploring the office";
      const spots = [{ x: 6, y: 14.5 }, { x: 15, y: 9 }, { x: 20.5, y: 16 }, { x: 3, y: 18.5 }, { x: 10.5, y: 15 }, { x: 16, y: 13 }];
      catGo(pick(spots), 1.4, () => { cat.mode = "sit"; cat.until = world.t + rand(3, 6); });
    }
  }
  function updateCat(dt) {
    if (cat.jump) {
      const j = cat.jump; j.t += dt / 0.45;
      const u = Math.min(1, j.t), e = easeInOut(u);
      cat.x = j.fx + (j.tx - j.fx) * e; cat.y = j.fy + (j.ty - j.fy) * e;
      cat.z = j.fz + (j.tz - j.fz) * u + Math.sin(u * Math.PI) * 0.5;
      if (u >= 1) { cat.jump = null; cat.z = j.tz; if (j.then) j.then(); }
      return;
    }
    if (cat.moving) {
      const tgt = cat.path[0];
      const dx = tgt.x - cat.x, dy = tgt.y - cat.y, d = Math.hypot(dx, dy), s = cat.speed * dt;
      if (Math.abs(dx - dy) > 0.02) cat.sdir = Math.sign(dx - dy);
      if (d <= s) { cat.x = tgt.x; cat.y = tgt.y; cat.path.shift(); } else { cat.x += (dx / d) * s; cat.y += (dy / d) * s; }
      cat.phase += dt * 14;
      if (!cat.path.length) { cat.moving = false; cat.mode = "sit"; const f = cat.after; cat.after = null; if (f) f(); }
      return;
    }
    if (cat.mode === "play") {
      // the yarn rolls away, the cat pounces after it
      if (Math.hypot(yarn.tx - yarn.x, yarn.ty - yarn.y) < 0.05 && Math.random() < dt * 1.2) {
        yarn.tx = Math.min(7.3, Math.max(2.0, yarn.x + rand(-2, 2))); yarn.ty = Math.min(14.1, Math.max(12.9, yarn.y + rand(-0.6, 0.6)));
      }
      const yd = Math.hypot(yarn.tx - yarn.x, yarn.ty - yarn.y);
      if (yd > 0.02) { const s = Math.min(yd, 2.5 * dt); yarn.x += ((yarn.tx - yarn.x) / yd) * s; yarn.y += ((yarn.ty - yarn.y) / yd) * s; yarn.rot += dt * 8; }
      const cx = yarn.x - 0.55 * cat.sdir * 0.7, cy = yarn.y + 0.1;
      const cd = Math.hypot(cx - cat.x, cy - cat.y);
      if (cd > 0.05) { const s = Math.min(cd, 2.8 * dt); const dx = cx - cat.x, dy = cy - cat.y; cat.x += (dx / cd) * s; cat.y += (dy / cd) * s; if (Math.abs(dx - dy) > 0.02) cat.sdir = Math.sign(dx - dy); cat.phase += dt * 16; }
      cat.pouncing = cd > 0.2;
      if (world.t > cat.until) { yarn.active = false; catPlan(); }
      return;
    }
    if (cat.mode === "petted") {
      if (Math.random() < dt * 2.5) world.particles.push({ x: cat.x, y: cat.y, z: cat.z + 0.9, life: 1.6, age: 0, ch: "♥", col: "#ff7aa8" });
      return;
    }
    if (cat.mode === "sleep" && Math.random() < dt * 0.7) world.particles.push({ x: cat.x + 0.2, y: cat.y - 0.2, z: cat.z + 0.6, life: 2.2, age: 0, ch: "z", col: "#e9eef5" });
    if (cat.reservedBy) return;
    if (world.t > cat.until) {
      if (cat.onDesk) {
        const od = cat.onDesk; cat.onDesk = null;
        catJump({ x: od.appr.x, y: od.appr.y, z: 0 }, () => catPlan());
      } else if (cat.z > 0 && cat.mode === "sleep") {
        const n = CAT_NAPS.find((q) => Math.abs(q.x - cat.x) < 0.1 && Math.abs(q.y - cat.y) < 0.1);
        cat.mode = "sit";
        catJump(Object.assign({ z: 0 }, n && n.approach ? n.approach : { x: cat.x, y: cat.y - 0.8 }), () => catPlan());
      } else catPlan();
    }
  }
  // Can someone come and pet the cat right now?
  function catPettable() { return !cat.reservedBy && !cat.jump && !cat.onDesk && cat.z === 0 && !cat.moving; }

  /* ---------------- tasks ---------------- */
  const goHome = (label) => ({ go: (a) => a.home });
  function workTask(a) {
    return { label: a.def.work, interruptible: true, steps: [
      goHome(),
      { wait: () => rand(14, 26), anim: "type", bubbles: a.def.bubbles },
    ] };
  }
  function freeSpot(ids) { const free = ids.map((i) => SPOTS[i]).filter((s) => !s.taken); return free.length ? pick(free) : null; }
  const SOLO = {
    coffee: (a) => {
      if (SPOTS.coffee.taken) return null;
      const sitAfter = Math.random() < 0.55 ? freeSpot(["kt1", "kt2", "kt3", "stool1", "stool2"]) : null;
      const steps = [{ go: SPOTS.coffee }, { wait: 3, anim: "idle" }, { fn: (x) => x.say("☕", 2) }, { wait: 1.5, anim: "drink" }];
      if (sitAfter) steps.push({ go: sitAfter }, { wait: () => rand(6, 10), anim: "drink", bubbles: ["Mmm, coffee", "☕", "Good beans"] });
      return { label: "getting coffee", interruptible: true, steps };
    },
    snack: (a) => {
      const s = freeSpot(["kt1", "kt2", "kt3"]);
      if (!s || SPOTS.fridge.taken) return null;
      return { label: "having a snack in the kitchen", interruptible: true, steps: [
        { go: SPOTS.fridge }, { wait: 2.2, anim: "idle" }, { fn: (x) => x.say(pick(["🥪", "🍎", "Skyr!"]), 2) },
        { go: s }, { wait: () => rand(7, 11), anim: "drink" },
      ] };
    },
    pet: (a) => {
      if (!catPettable()) return null;
      const side = cat.sdir;
      const cand = [{ x: cat.x + 0.75, y: cat.y }, { x: cat.x - 0.75, y: cat.y }, { x: cat.x, y: cat.y + 0.75 }, { x: cat.x, y: cat.y - 0.75 }];
      const ok = cand.find((p) => inside(Math.floor(p.x), Math.floor(p.y)) && !blocked[Math.floor(p.y)][Math.floor(p.x)]);
      if (!ok) return null;
      void side;
      yarn.active = false;
      cat.reservedBy = a; cat.mode = cat.mode === "sleep" ? "sleep" : "sit"; cat.label = `waiting for ${who(a.def)}`;
      const face = [Math.sign(Math.round(cat.x - ok.x)), Math.sign(Math.round(cat.y - ok.y))];
      return { label: "petting the cat", interruptible: false, steps: [
        { go: Object.assign({ face, pose: "stand" }, ok) },
        { fn: (x) => { cat.mode = "petted"; cat.label = `being petted by ${who(x.def)}`; x.say(pick(["Hi, Alan!", "Who's a good cat?", "Pspspsps", "So soft"]), 3); } },
        { wait: () => rand(5, 7), anim: "pet" },
        { fn: () => { cat.reservedBy = null; cat.mode = "sit"; cat.until = world.t + 2; cat.label = "purring"; } },
      ] };
    },
    pair: (a) => {
      const others = agents.filter((o) => o !== a && !o.hidden && o.atSpot && o.spot === o.home && o.anim === "type");
      if (!others.length) return null;
      const o = pick(others);
      const st = { x: o.home.x + 0.95, y: o.home.y + (o.home.face === "S" ? -0.25 : 0.25), face: o.home.face === "S" ? [-1, 1] : [-1, -1] };
      return { label: `helping ${who(o.def)}`, interruptible: true, steps: [
        { go: st },
        { wait: () => rand(8, 12), anim: "talk", bubbles: ["Try this?", "Ah, I see", "Ship it?", "Good catch"],
          tick: (x) => { if (Math.random() < 0.004) o.say(pick(["Hmm…", "Nice idea", "Fixed!", "Thanks!"]), 2.2); } },
      ] };
    },
    kanban: (a) => SPOTS.kanban.taken ? null : { label: "moving a card on the board", interruptible: true, steps: [
      { go: SPOTS.kanban }, { wait: () => rand(4, 6), anim: "board", bubbles: ["Done ✓", "→ Doing"] }] },
    printer: (a) => SPOTS.printer.taken ? null : { label: "picking up a printout", interruptible: true, steps: [
      { go: SPOTS.printer }, { wait: 3.5, anim: "idle" }, { fn: (x) => x.say(pick(["Paper jam!", "🖨️", "Got it"]), 2) }, { wait: 1, anim: "idle" }] },
    window: (a) => SPOTS.window.taken ? null : { label: "looking out of the window", interruptible: true, steps: [
      { go: SPOTS.window }, { wait: () => rand(5, 8), anim: "drink", bubbles: ["Nice weather", "Snow soon?"] }] },
    stretch: (a) => ({ label: "stretching", interruptible: true, steps: [
      { go: { x: a.home.x + (a.home.face === "S" ? 0 : 0), y: a.home.y + (a.home.face === "S" ? -0.9 : 0.95), face: "S" } },
      { wait: 4, anim: "stretch" }] }),
    cooler: (a) => SPOTS.cooler1.taken ? null : { label: "at the water cooler", interruptible: true, steps: [
      { go: SPOTS.cooler1 }, { wait: () => rand(4, 6), anim: "drink", bubbles: ["💧", "Hydrate!"] }] },
    arcade: (a) => {
      const s = freeSpot(["arcade", "arcade2"]);
      return s && { label: "playing the arcade machine", interruptible: false, steps: [
        { go: s }, { wait: () => rand(6, 9), anim: "game", bubbles: ["High score!", "One more go", "Boss level!"] }] };
    },
  };
  SOLO.approve = (a) => {
    const team = agents.filter((o) => o !== a && !o.hidden && o.atSpot && o.spot === o.home && o.anim === "type");
    if (!team.length) return null;
    const o = pick(team);
    const st = { x: o.home.x + 0.95, y: o.home.y + (o.home.face === "S" ? -0.25 : 0.25), face: o.home.face === "S" ? [-1, 1] : [-1, -1] };
    return { label: `approving the ${o.def.name}'s work`, interruptible: true, steps: [
      { go: st },
      { wait: 1.2, anim: "talk" },
      { fn: (x) => x.say(pick(["Approved ✓", "Looks good, go ahead", "One change, then OK", "Nice work"]), 3) },
      { wait: 2.6, anim: "talk" },
      { fn: () => o.say(pick(["Thanks!", "On it", "Next step!", "👍"]), 2.4) },
      { wait: 2.2, anim: "idle" },
    ] };
  };
  const OUTSIDE = { x: 25.3, y: 16.0 }, INSIDE = { x: 23.3, y: 16.0 };
  function enterSteps() {
    return [
      { fn: (x) => { x.x = OUTSIDE.x; x.y = OUTSIDE.y; x.hidden = false; } },
      { walk: { x: INSIDE.x, y: INSIDE.y, face: "W" } },
      { fn: (x) => x.say(pick(["Morning, team!", "Hi all!", "I'm back"]), 2.6) },
    ];
  }
  SOLO.away = (a) => ({ label: pick(["out for lunch", "at a meeting in town", "picking up a coffee in town"]), interruptible: false, steps: [
    { go: INSIDE }, { walk: { x: OUTSIDE.x, y: OUTSIDE.y, face: "E" } },
    { fn: (x) => { x.hidden = true; } }, { wait: () => rand(18, 30), anim: "idle" },
    ...enterSteps(),
    { fn: (x) => { x.label = SIGGI.work; } },
  ] });
  SIGGI.weights = [["work", 2.5], ["approve", 3.5], ["coffee", 1.2], ["pet", 1], ["kanban", 0.8], ["window", 0.4], ["cooler", 0.4], ["away", 0.35], ["golf", 0.4]];
  SOLO.golf = (a) => {
    if (SPOTS.tee.taken || world.golf) return null;
    return { label: "playing mini golf", interruptible: false, steps: [
      { go: SPOTS.tee },
      { fn: (x) => { world.golf = { owner: x, putt: null }; } },
      { wait: () => rand(9, 13), anim: "putt", tick: (x) => {
        const g = world.golf, t = world.t;
        if (!g.putt || t > g.putt.end) g.putt = { start: t + 0.6, dur: 2.0, make: Math.random() < 0.4, stop: rand(0.55, 0.85), end: t + 3.6, said: false };
        if (!g.putt.said && t > g.putt.start + g.putt.dur) {
          g.putt.said = true;
          x.say(g.putt.make ? pick(["Hole in one!", "Yes! ⛳", "Through the windmill!"]) : pick(["So close", "Argh", "One more try"]), 2.2);
        }
      } },
      { fn: () => { world.golf = null; } },
    ] };
  };
  const SOLO_WEIGHTS = [["work", 6], ["coffee", 1.6], ["snack", 0.7], ["pet", 1.2], ["pair", 0.9], ["kanban", 0.6], ["printer", 0.35], ["window", 0.45], ["stretch", 0.4], ["cooler", 0.45], ["arcade", 0.35], ["golf", 0.7]];

  /* ---------------- group events ---------------- */
  class Group {
    constructor(type, members) { this.type = type; this.members = members; this.arrived = new Set(); this.active = false; this.cancelled = false; this.done = 0; }
    start() { this.active = true; this.startT = world.t; groupStart(this); }
    leave() { if (++this.done >= this.members.length) { this.active = false; groupEnd(this); } }
  }
  const groups = [];
  function groupStart(g) {
    if (g.type === "standup") world.standup = true;
    if (g.type === "gaming") world.gaming++;
  }
  function groupEnd(g) {
    if (g.type === "standup") world.standup = false;
    if (g.type === "gaming") world.gaming--;
    const i = groups.indexOf(g); if (i >= 0) groups.splice(i, 1);
  }
  function freeAgents() { return agents.filter((a) => !a.hidden && (!a.task || a.task.interruptible)); }
  function groupSteps(g, spotFor, dur, anim, bubbles, label) {
    return (a, i) => ({ label, interruptible: false, steps: [
      { go: spotFor(a, i) },
      { sync: g, anim: "idle" },
      { wait: dur, anim: typeof anim === "function" ? anim(a, i) : anim,
        tick: (x) => {
          if (x !== g.members[(g.speaker || 0) % g.members.length] || world.t < (g.nextSay || 0)) return;
          x.say(pick(bubbles), 2.6); g.speaker = (g.speaker || 0) + 1 + (Math.random() < 0.3 ? 1 : 0); g.nextSay = world.t + rand(3, 4.2);
        } },
      { fn: () => g.leave() },
    ] });
  }
  const EVENTS = {
    standup() {
      const free = freeAgents(); if (free.length < 4) return false;
      const members = free.sort(() => Math.random() - 0.5).slice(0, Math.min(free.length, 4 + Math.floor(Math.random() * 3)));
      members.sort((p, q) => (q.def.id === "siggi") - (p.def.id === "siggi"));
      const g = new Group("standup", members); groups.push(g);
      const seats = MR1_SEATS.slice().sort(() => Math.random() - 0.5);
      const make = groupSteps(g, (a, i) => (i === 0 ? SPOTS.m1present : seats[i - 1]), rand(16, 22), (a, i) => (i === 0 ? "talk" : "idle"),
        ["Yesterday I…", "No blockers", "M1 on track", "Today: tests", "Any questions?"], "in the stand-up meeting");
      members.forEach((a, i) => a.setTask(make(a, i)));
      return true;
    },
    pingpong() {
      const free = freeAgents(); if (free.length < 2 || SPOTS.pp1.taken || SPOTS.pp2.taken) return false;
      const members = free.sort(() => Math.random() - 0.5).slice(0, 2);
      const g = new Group("pingpong", members); groups.push(g);
      const make = groupSteps(g, (a, i) => (i ? SPOTS.pp2 : SPOTS.pp1), rand(16, 22), "play", ["Nice shot!", "11–9!", "Rematch?", "Ha!"], "playing ping-pong");
      members.forEach((a, i) => a.setTask(make(a, i)));
      return true;
    },
    review() {
      const free = freeAgents(); if (free.length < 2) return false;
      const n = Math.random() < 0.5 ? 2 : 3;
      const members = free.sort(() => Math.random() - 0.5).slice(0, n);
      const g = new Group("review", members); groups.push(g);
      const seats = [SPOTS.m2a, SPOTS.m2b, SPOTS.m2c, SPOTS.m2d].sort(() => Math.random() - 0.5);
      const make = groupSteps(g, (a, i) => (i === 0 ? SPOTS.board2 : seats[i - 1]), rand(14, 18), (a, i) => (i === 0 ? "board" : "talk"),
        ["What about dark mode?", "Option B", "Agreed", "Ask Siggi?", "Let's sketch it"], "in a design review");
      members.forEach((a, i) => a.setTask(make(a, i)));
      return true;
    },
    gaming() {
      const free = freeAgents(); if (free.length < 2 || SPOTS.sofa1.taken || SPOTS.sofa2.taken) return false;
      const members = free.sort(() => Math.random() - 0.5).slice(0, 2);
      const g = new Group("gaming", members); groups.push(g);
      const make = groupSteps(g, (a, i) => (i ? SPOTS.sofa2 : SPOTS.sofa1), rand(15, 20), "game", ["Left! Left!", "GG", "Respawning…", "So close"], "playing video games");
      members.forEach((a, i) => a.setTask(make(a, i)));
      return true;
    },
    arcade() {
      const free = freeAgents(); if (free.length < 2 || SPOTS.arcade.taken || SPOTS.arcade2.taken) return false;
      const members = free.sort(() => Math.random() - 0.5).slice(0, 2);
      const g = new Group("arcade", members); groups.push(g);
      const make = groupSteps(g, (a, i) => (i ? SPOTS.arcade2 : SPOTS.arcade), rand(12, 16), "game", ["Two-player!", "Watch this", "No way!", "New high score"], "in an arcade duel");
      members.forEach((a, i) => a.setTask(make(a, i)));
      return true;
    },
    chat() {
      const free = freeAgents(); if (free.length < 2 || SPOTS.lounge1.taken || SPOTS.lounge2.taken) return false;
      const members = free.sort(() => Math.random() - 0.5).slice(0, 2);
      const g = new Group("chat", members); groups.push(g);
      const make = groupSteps(g, (a, i) => (i ? SPOTS.lounge2 : SPOTS.lounge1), rand(10, 14), "talk", ["Weekend plans?", "Ha ha", "Saw the aurora?", "Same!"], "chatting on the sofa");
      members.forEach((a, i) => a.setTask(make(a, i)));
      return true;
    },
  };

  const scheduler = {
    timers: { standup: 5, pingpong: 24, review: 42, gaming: 58, chat: 32, arcade: 70 },
    every: { standup: [80, 100], pingpong: [50, 65], review: [60, 75], gaming: [65, 85], chat: [45, 60], arcade: [70, 90] },
    update() {
      for (const name in this.timers) {
        if (world.t >= this.timers[name]) {
          const ok = EVENTS[name]();
          this.timers[name] = world.t + (ok ? rand(...this.every[name]) : 6);
        }
      }
    },
    assignSolo(a) {
      const weights = a.def.weights || SOLO_WEIGHTS;
      const total = weights.reduce((s, w) => s + w[1], 0);
      for (let tries = 0; tries < 5; tries++) {
        let r = Math.random() * total, name = "work";
        for (const [n, w] of weights) { r -= w; if (r <= 0) { name = n; break; } }
        if (a._last === name && name !== "work") continue;
        const task = name === "work" ? workTask(a) : SOLO[name](a);
        if (task) { a._last = name; a.setTask(task); return; }
      }
      a._last = "work"; a.setTask(workTask(a));
    },
  };
  world.gaming = 0;

  let agents = [];
  function reset() {
    groups.length = 0; world.gaming = 0; world.standup = false; world.golf = null;
    Object.values(SPOTS).forEach((s) => { s.taken = null; s.owner = null; });
    agents = TEAM.map((d, i) => new Agent(d, i * 1.37));
    agents.forEach((a) => { a.timerStart = rand(2, 14); a.setTask({ label: a.def.work, interruptible: true, steps: [{ wait: a.timerStart, anim: "type", bubbles: a.def.bubbles }] }); });
    const siggi = new Agent(SIGGI, 9.1);
    siggi.hidden = true; siggi.pose = "stand"; siggi.x = OUTSIDE.x; siggi.y = OUTSIDE.y; siggi.atSpot = false; siggi.spot = null;
    siggi.setTask({ label: "on the way in", interruptible: false, steps: [{ wait: 2.5, anim: "idle" }, ...enterSteps(), { fn: (x) => { x.label = SIGGI.work; } }] });
    agents.push(siggi);
  }

  function update(dt) {
    world.t += dt;
    const near = agents.some((a) => !a.hidden && Math.abs(a.x - DOOR.x) < 1.4 && a.y > DOOR.y0 - 0.6 && a.y < DOOR.y1 + 0.6);
    world.doorOpen += ((near ? 1 : 0) - world.doorOpen) * Math.min(1, dt * 6);
    scheduler.update();
    agents.forEach((a) => a.update(dt));
    updateCat(dt);
    world.particles = world.particles.filter((p) => (p.age += dt) < p.life);
  }

  function withScale(f, fn) { const kk = k; k = kk * f; fn(); k = kk; }
  const PERSON_SCALE = 1.32, CAT_SCALE = 1.5, TEXT_SCALE = 1.12;

  /* ---------------- frame ---------------- */
  let bg = null, dpr = 1;
  function render(canvas) {
    const c = canvas.getContext("2d");
    if (!bg || bg.w !== cssW || bg.dpr !== dpr) {
      const off = document.createElement("canvas");
      off.width = Math.round(cssW * dpr); off.height = Math.round(cssH * dpr);
      ctx = off.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBackground();
      bg = { canvas: off, w: cssW, dpr };
    }
    ctx = c;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(bg.canvas, 0, 0);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawDynamicWall();

    const list = STATIC.slice();
    agents.forEach((a) => { if (!a.hidden) list.push({ key: a.x + a.y + 0.001, draw: () => withScale(PERSON_SCALE, () => drawPerson(a)) }); });
    list.push({ key: DOOR.x + (DOOR.y0 + DOOR.y1) / 2 + 0.2, draw: drawDoor });
    list.push({ key: cat.x + cat.y + (cat.z > 0 ? 0.6 : 0.002), draw: () => withScale(CAT_SCALE, () => drawCat(cat)) });
    if (world.golf) {
      const g = world.golf, t = world.t;
      let bx = GOLF.tee.x, by = GOLF.tee.y, show = true;
      if (g.putt && t > g.putt.start) {
        const u = Math.min(1, (t - g.putt.start) / g.putt.dur), e = 1 - (1 - u) * (1 - u);
        const reach = g.putt.make ? 1 : g.putt.stop;
        bx = GOLF.tee.x + (GOLF.hole.x - GOLF.tee.x) * e * reach;
        by = GOLF.tee.y + Math.sin(e * Math.PI) * 0.12;
        if (g.putt.make && u >= 1) show = false;
        if (bx > MILL.x0 - 0.05 && bx < MILL.x1) show = false; // inside the windmill's tunnel
      }
      if (show) list.push({ key: bx + by + 0.05, draw: () => withScale(1.2, () => drawGolfBall(bx, by)) });
    }
    if (yarn.active) list.push({ key: yarn.x + yarn.y, draw: () => withScale(1.4, () => drawYarn(yarn)) });
    const pp = groups.find((g) => g.type === "pingpong" && g.active);
    if (pp) {
      const u = (world.t - pp.startT) / 0.8, leg = Math.floor(u), f = u - leg;
      const fwd = leg % 2 === 0;
      const y0 = PP.y + 0.05, y1 = PP.y + PP.d - 0.05, yy = fwd ? y0 + (y1 - y0) * f : y1 - (y1 - y0) * f;
      const xx = PP.x + PP.w / 2 + Math.sin(leg * 2.3) * 0.45 * (fwd ? f : 1 - f);
      list.push({ key: xx + yy + 0.4, draw: () => withScale(1.25, () => drawBall({ x: xx, y: yy, z: 0.78 + Math.sin(f * Math.PI) * 0.55 })) });
    }
    list.sort((p, q) => p.key - q.key);
    for (const d of list) d.draw();

    // overlays: labels, bubbles, particles
    withScale(TEXT_SCALE, () => {
      agents.forEach((a) => { if (!a.hidden) drawLabel(a); });
      drawCatLabel();
      agents.forEach((a) => { if (!a.hidden && a.bubble && world.t < a.bubble.until) drawBubbleFor(a); });
    });
    const kk = k; k = kk * PERSON_SCALE;
    for (const p of world.particles) {
      const s = P(p.x, p.y, p.z + p.age * 0.6);
      ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
      ctx.fillStyle = p.col; ctx.font = `700 ${Math.max(9, 10 * k)}px ${FONT}`; ctx.textAlign = "center";
      ctx.fillText(p.ch, s[0] + Math.sin(p.age * 3) * 3 * k, s[1]);
      ctx.globalAlpha = 1;
    }
    k = kk;
  }

  /* ---------------- legend ---------------- */
  function buildLegend(el) {
    if (!el) return null;
    el.innerHTML = "";
    const rows = TEAM.concat([SIGGI]).map((d) => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="office-dot" style="background:${d.shirt}"></span><span class="office-who">${d.name}</span><span class="office-what"></span>`;
      el.appendChild(li);
      return li.querySelector(".office-what");
    });
    const li = document.createElement("li");
    li.innerHTML = `<span class="office-dot office-dot-cat"></span><span class="office-who">${CAT_NAME}, the cat</span><span class="office-what"></span>`;
    el.appendChild(li);
    rows.push(li.querySelector(".office-what"));
    return rows;
  }
  function updateLegend(rows) {
    if (!rows) return;
    agents.forEach((a, i) => { if (rows[i].textContent !== a.label) rows[i].textContent = a.label; });
    const cl = cat.label;
    const last = rows[rows.length - 1];
    if (last.textContent !== cl) last.textContent = cl;
  }

  /* ---------------- mount ---------------- */
  function mount(container, opts) {
    opts = opts || {};
    const canvas = document.createElement("canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", "Animated illustration of the AI agent team's office: six agents, Siggi and Alan Isaac the cat moving between desks, the kitchen, meeting rooms, the game room and the entrance.");
    container.appendChild(canvas);
    const rows = buildLegend(opts.legend);
    reset();

    let running = !(opts.paused), visible = true, last = 0, raf = 0, legendT = 0;
    function size() {
      const w = Math.max(320, container.clientWidth);
      dpr = Math.min(2, global.devicePixelRatio || 1);
      layout(w);
      canvas.style.width = cssW + "px"; canvas.style.height = cssH + "px";
      canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
      bg = null;
      render(canvas);
    }
    function frame(ts) {
      raf = 0;
      if (!running || !visible) return;
      const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016);
      last = ts;
      update(dt);
      render(canvas);
      legendT += dt;
      if (legendT > 0.25) { legendT = 0; updateLegend(rows); }
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && running && visible) { last = 0; raf = requestAnimationFrame(frame); } }
    const ro = new ResizeObserver(() => size());
    ro.observe(container);
    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; kick(); });
    io.observe(container);
    size(); updateLegend(rows);
    kick();
    return {
      play() { running = true; kick(); },
      pause() { running = false; },
      get running() { return running; },
      // advance the simulation without drawing every step (testing, still frames)
      simulate(seconds) { const n = Math.ceil(seconds / 0.05); for (let i = 0; i < n; i++) update(0.05); render(canvas); updateLegend(rows); },
      destroy() { running = false; ro.disconnect(); io.disconnect(); if (raf) cancelAnimationFrame(raf); canvas.remove(); },
    };
  }

export { mount };
