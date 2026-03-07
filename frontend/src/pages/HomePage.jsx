import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

/* ── fonts ── */
const injectFonts = () => {
  if (document.getElementById("mfont")) return;
  const l = document.createElement("link");
  l.id = "mfont";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(l);
};

/* ── global css ── */
const STYLES = `
@keyframes fadeUp   {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn   {from{opacity:0}to{opacity:1}}
@keyframes pulse    {0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.5}}
@keyframes float    {0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes ticker   {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes scanLn   {0%{top:-6%}100%{top:106%}}
@keyframes spin     {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes slideIn  {from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideUp  {from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes shimmer  {0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes glow     {0%,100%{box-shadow:0 0 20px rgba(29,78,216,.3)}50%{box-shadow:0 0 40px rgba(29,78,216,.6)}}
@keyframes ripple   {0%{transform:scale(0);opacity:.6}100%{transform:scale(4);opacity:0}}

*{margin:0;padding:0;box-sizing:border-box}
html,body,#root{height:100%;overflow-x:hidden}
body{background:#f0f6ff;font-family:'DM Sans',sans-serif}

/* ── nav ── */
.home-nav-btn{background:none;border:none;color:#475569;font-weight:600;font-size:14px;cursor:pointer;padding:8px 16px;border-radius:8px;transition:all .2s;font-family:'DM Sans',sans-serif;position:relative}
.home-nav-btn:hover{color:#1d4ed8;background:rgba(29,78,216,.07)}
.home-nav-btn::after{content:'';position:absolute;bottom:0;left:50%;right:50%;height:2px;background:#1d4ed8;border-radius:2px;transition:all .25s}
.home-nav-btn:hover::after{left:16px;right:16px}
.home-portal-btn{padding:10px 18px;background:linear-gradient(135deg,#1d4ed8,#1e40af);color:#fff;border:none;border-radius:10px;font-weight:800;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 8px 24px rgba(29,78,216,.25);transition:all .22s}
.home-portal-btn:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(29,78,216,.34)}

/* ── scanner ── */
.scan-wrap{position:absolute;inset:0;pointer-events:none;overflow:hidden;border-radius:24px}
.scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(99,179,244,.8),transparent);animation:scanLn 3.5s linear infinite}

/* ── ticker ── */
.ticker-wrap{overflow:hidden;white-space:nowrap;background:linear-gradient(90deg,#1d4ed8,#0891b2,#1d4ed8);padding:11px 0}
.ticker-inner{display:inline-flex;animation:ticker 28s linear infinite}
.ticker-item{display:inline-flex;align-items:center;gap:10px;margin-right:56px;color:rgba(255,255,255,.9);font-size:12px;font-weight:700;letter-spacing:.3px}

/* ── dashboard card ── */
.dash-card{background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:22px 24px;transition:all .25s}
.dash-card:hover{box-shadow:0 12px 36px rgba(29,78,216,.1);transform:translateY(-2px)}

/* ── stat card ── */
.stat-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:20px 22px;flex:1;transition:all .25s;position:relative;overflow:hidden}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.stat-card:hover{box-shadow:0 8px 28px rgba(0,0,0,.08);transform:translateY(-2px)}

/* ── badge ── */
.badge{display:inline-flex;align-items:center;padding:4px 11px;border-radius:20px;font-size:11.5px;font-weight:700;letter-spacing:.2px}
.badge-green{background:#d1fae5;color:#065f46}
.badge-blue{background:#dbeafe;color:#1e40af}
.badge-amber{background:#fef3c7;color:#92400e}
.badge-red{background:#fee2e2;color:#991b1b}
.badge-purple{background:#ede9fe;color:#5b21b6}
.badge-geo{background:linear-gradient(135deg,#fef3c7,#fde68a);color:#92400e;border:1px solid #fcd34d}

/* ── buttons ── */
.btn-blue{padding:10px 22px;background:linear-gradient(135deg,#1d4ed8,#1e40af);color:#fff;border:none;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .22s;box-shadow:0 4px 14px rgba(29,78,216,.25)}
.btn-blue:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(29,78,216,.38)}
.btn-blue:active{transform:translateY(0)}
.btn-outline-blue{padding:10px 22px;background:transparent;color:#1d4ed8;border:1.5px solid #1d4ed8;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .22s}
.btn-outline-blue:hover{background:#1d4ed8;color:#fff;transform:translateY(-1px)}

/* ── progress bar ── */
.prog-bar{height:8px;border-radius:6px;background:#e2e8f0;overflow:hidden}
.prog-fill{height:100%;border-radius:6px;transition:width 1.2s cubic-bezier(.4,0,.2,1)}

/* ── feature pill ── */
.feat-pill{background:#fff;border:1.5px solid #e2e8f0;border-radius:50px;padding:10px 20px;display:inline-flex;align-items:center;gap:10px;font-weight:600;font-size:14px;color:#334155;transition:all .25s;cursor:default}
.feat-pill:hover{border-color:#1d4ed8;color:#1d4ed8;box-shadow:0 6px 20px rgba(29,78,216,.14);transform:translateY(-3px)}

/* ── modal overlay ── */
.modal-overlay{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(2,6,23,.7);backdrop-filter:blur(12px);animation:fadeIn .2s ease}
.modal-box{background:#fff;border-radius:28px;box-shadow:0 40px 100px rgba(0,0,0,.28),0 0 0 1px rgba(255,255,255,.1);position:relative;animation:slideUp .32s cubic-bezier(.34,1.56,.64,1)}

/* ── toast ── */
.toast{position:fixed;top:22px;right:26px;z-index:9999;border-radius:14px;padding:13px 22px;font-size:14px;font-weight:700;box-shadow:0 12px 40px rgba(0,0,0,.18);animation:slideIn .3s cubic-bezier(.34,1.56,.64,1);max-width:400px;display:flex;align-items:center;gap:10px}
.toast-success{background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #86efac;color:#166534}
.toast-error{background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5;color:#991b1b}

/* ── section headers ── */
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #f1f5f9}
.section-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:#0f172a}
.section-sub{font-size:13px;color:#64748b;margin-top:3px}

@media (max-width: 1100px){
  .home-hero-grid{grid-template-columns:1fr !important;gap:36px !important}
  .home-hero-right{height:440px !important;margin-left:0 !important}
  .home-stats-grid{grid-template-columns:repeat(2,1fr) !important}
  .home-workflow-grid{grid-template-columns:repeat(2,1fr) !important}
}
@media (max-width: 768px){
  .home-navbar{padding:14px 18px !important;flex-wrap:wrap !important;gap:12px !important}
  .home-nav-right{flex-wrap:wrap !important;gap:8px !important}
  .home-hero{padding:28px 18px 40px !important}
  .home-hero-title{font-size:40px !important}
  .home-hero-right{height:320px !important}
  .home-section{padding:54px 18px !important}
  .home-stats-grid{grid-template-columns:1fr !important}
  .home-workflow-grid{grid-template-columns:1fr !important}
  .home-comparison td,.home-comparison th{padding:14px 12px !important;font-size:13px !important}
}
`;

/* ════════════════════════════════
   3-D SCENE  (patient-trial graph)
   ════════════════════════════════ */
function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
    camera.position.set(0, 0, 30);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dl1 = new THREE.DirectionalLight(0x3b82f6, 3);
    dl1.position.set(6, 8, 6);
    scene.add(dl1);

    const dl2 = new THREE.DirectionalLight(0x06b6d4, 2);
    dl2.position.set(-8, -4, 4);
    scene.add(dl2);

    const pl = new THREE.PointLight(0x10b981, 4, 50);
    pl.position.set(0, 0, 12);
    scene.add(pl);

    const nodeData = [
      { pos: [0, 0, 0], r: 1.1, color: 0x1d4ed8, em: 0x1e40af, type: "hub" },
      { pos: [6.5, 3, 1], r: 0.8, color: 0x0891b2, em: 0x0e7490, type: "hub" },
      { pos: [-5.5, 4, -1], r: 0.8, color: 0x7c3aed, em: 0x5b21b6, type: "hub" },
      { pos: [4, -5, 2], r: 0.8, color: 0x0891b2, em: 0x0e7490, type: "hub" },
      { pos: [-5, -4, 0], r: 0.8, color: 0x7c3aed, em: 0x5b21b6, type: "hub" },
      { pos: [3, 1, 3], r: 0.38, color: 0x10b981, em: 0x059669, type: "pt" },
      { pos: [-3, 2, 2], r: 0.38, color: 0x10b981, em: 0x059669, type: "pt" },
      { pos: [2, -3, 1], r: 0.38, color: 0x34d399, em: 0x10b981, type: "pt" },
      { pos: [-2, -2, 3], r: 0.38, color: 0x10b981, em: 0x059669, type: "pt" },
      { pos: [5, 0, -2], r: 0.32, color: 0x6ee7b7, em: 0x10b981, type: "pt" },
      { pos: [-4, 0, -3], r: 0.32, color: 0x6ee7b7, em: 0x10b981, type: "pt" },
      { pos: [0, 6, 0], r: 0.38, color: 0x10b981, em: 0x059669, type: "pt" },
      { pos: [0, -6, 1], r: 0.32, color: 0x34d399, em: 0x10b981, type: "pt" },
      { pos: [8.5, 0, 0], r: 0.35, color: 0x10b981, em: 0x059669, type: "pt" },
      { pos: [-7.5, 2, 1], r: 0.35, color: 0x6ee7b7, em: 0x10b981, type: "pt" },
    ];

    const meshes = nodeData.map((nd) => {
      const geo = new THREE.SphereGeometry(nd.r, 24, 24);
      const mat = new THREE.MeshPhongMaterial({
        color: nd.color,
        shininess: 160,
        emissive: nd.em,
        emissiveIntensity: 0.45,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(...nd.pos);
      m.userData = { ...nd, origPos: [...nd.pos] };
      scene.add(m);
      return m;
    });

    meshes
      .filter((m) => m.userData.type === "hub")
      .forEach((m) => {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(m.userData.r * 2.2, 20, 20),
          new THREE.MeshBasicMaterial({
            color: m.userData.color,
            transparent: true,
            opacity: 0.07,
            side: THREE.BackSide,
          })
        );
        halo.position.copy(m.position);
        scene.add(halo);
      });

    const edgePairs = [
      [0, 1],[0, 2],[0, 3],[0, 4],[0, 5],[0, 6],[0, 7],[0, 8],
      [1, 9],[1, 6],[2, 10],[2, 11],[3, 12],[3, 7],[4, 13],[4, 14],
      [1, 5],[2, 8],[3, 9],
    ];

    const edgeMeshes = edgePairs
      .filter(([a, b]) => meshes[a] && meshes[b])
      .map(([a, b]) => {
        const pa = meshes[a].position;
        const pb = meshes[b].position;
        const dir = pb.clone().sub(pa);
        const len = dir.length();

        const geo = new THREE.CylinderGeometry(0.028, 0.028, len, 5);
        const mat = new THREE.MeshBasicMaterial({
          color: a === 0 ? 0x3b82f6 : 0x93c5fd,
          transparent: true,
          opacity: a === 0 ? 0.5 : 0.28,
        });

        const edge = new THREE.Mesh(geo, mat);
        edge.position.copy(pa.clone().lerp(pb, 0.5));
        edge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        scene.add(edge);
        return { mesh: edge, a, b };
      });

    const pGeo = new THREE.BufferGeometry();
    const pN = 240;
    const pPos = new Float32Array(pN * 3);
    const pCol = new Float32Array(pN * 3);
    const pal = [
      [0.23, 0.51, 0.96],
      [0.02, 0.71, 0.83],
      [0.06, 0.73, 0.51],
      [0.49, 0.23, 0.93],
    ];

    for (let i = 0; i < pN; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 65;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 65;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 28 - 8;
      const c = pal[i % 4];
      pCol[i * 3] = c[0];
      pCol[i * 3 + 1] = c[1];
      pCol[i * 3 + 2] = c[2];
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.13,
        vertexColors: true,
        transparent: true,
        opacity: 0.48,
      })
    );
    scene.add(particles);

    const rings = [0x3b82f6, 0x06b6d4, 0x7c3aed].map((c, i) => {
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(9 + i * 2, 0.04, 8, 120),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.14 })
      );
      r.rotation.x = Math.PI / (3 + i);
      r.rotation.y = (Math.PI / 5) * i;
      scene.add(r);
      return r;
    });

    const signals = Array.from({ length: 6 }, (_, i) => {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.9 })
      );
      scene.add(m);
      return { mesh: m, target: (i % 4) + 1, t: Math.random() };
    });

    const mg = new THREE.Group();
    scene.add(mg);
    meshes.forEach((m) => {
      scene.remove(m);
      mg.add(m);
    });

    let t = 0;
    let raf;

    const animate = () => {
      t += 0.006;
      mg.rotation.y = t * 0.11;
      mg.rotation.x = Math.sin(t * 0.07) * 0.11;

      meshes
        .filter((m) => m.userData.type === "hub")
        .forEach((m, i) => m.scale.setScalar(1 + Math.sin(t * 1.2 + i * 1.5) * 0.08));

      meshes
        .filter((m) => m.userData.type === "pt")
        .forEach((m, i) => {
          const o = m.userData.origPos;
          m.position.x = o[0] + Math.sin(t * 0.8 + i) * 0.38;
          m.position.y = o[1] + Math.cos(t * 0.6 + i) * 0.38;
        });

      edgeMeshes.forEach(({ mesh, a, b }) => {
        const pa = meshes[a].position.clone();
        const pb = meshes[b].position.clone();
        const dir = pb.clone().sub(pa);
        mesh.position.copy(pa.lerp(pb, 0.5));
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        );
      });

      signals.forEach((sig) => {
        sig.t = (sig.t + 0.013) % 1;
        const ta = meshes[0];
        const tb = meshes[sig.target];
        if (ta && tb) {
          sig.mesh.position.lerpVectors(ta.position, tb.position, sig.t);
          sig.mesh.material.opacity = 0.4 + Math.sin(sig.t * Math.PI) * 0.6;
        }
      });

      rings[0].rotation.z = t * 0.08;
      rings[1].rotation.z = -t * 0.06;
      rings[2].rotation.y = t * 0.05;
      particles.rotation.y = t * 0.024;
      particles.rotation.x = t * 0.011;
      pl.position.x = Math.sin(t * 0.7) * 7;
      pl.position.y = Math.cos(t * 0.5) * 5;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    const onMouse = (e) => {
      const mx = (e.clientX / innerWidth - 0.5) * 2;
      const my = (e.clientY / innerHeight - 0.5) * 2;
      camera.position.x += (mx * 3.5 - camera.position.x) * 0.032;
      camera.position.y += (-my * 2.2 - camera.position.y) * 0.032;
      camera.lookAt(0, 0, 0);
    };

    const onResize = () => {
      const W2 = el.clientWidth;
      const H2 = el.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };

    addEventListener("mousemove", onMouse);
    addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("mousemove", onMouse);
      removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

/* ── Counter ── */
function Counter({ target, suffix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        let x = 0;
        const step = target / 55;
        const id = setInterval(() => {
          x = Math.min(x + step, target);
          setV(Math.round(x));
          if (x >= target) clearInterval(id);
        }, 20);
        obs.disconnect();
      },
      { threshold: 0.3 }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Mini bar chart ── */
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80, padding: "4px 0" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: "100%",
              background: "#1d4ed8",
              borderRadius: "4px 4px 0 0",
              height: `${(d.v / max) * 64}px`,
              opacity: 0.7 + i * 0.03,
              transition: "height .8s ease",
            }}
          />
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Score ring ── */
function ScoreRing({ score, size = 56 }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const col = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={col}
        strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray .8s" }}
      />
      <text
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        fontSize={size * 0.22}
        fontWeight={800}
        fill={col}
      >
        {score}%
      </text>
    </svg>
  );
}

/* ════════════════════════════════
   HOME PAGE
   ════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();
  const [vis, setVis] = useState(false);

  useEffect(() => {
    injectFonts();

    if (!document.getElementById("medtrix-home-styles")) {
      const style = document.createElement("style");
      style.id = "medtrix-home-styles";
      style.innerHTML = STYLES;
      document.head.appendChild(style);
    }

    const t = setTimeout(() => setVis(true), 80);
    return () => clearTimeout(t);
  }, []);

  const ticker = [
    "🔬 DiaCare-2025 · 91% Match",
    "❤️ CardioShield · 87% Match",
    "🫁 LUNGWISE · 79% Match",
    "💊 HyperBlock · 84% Match",
    "🧬 OncoEarly · 76% Match",
    "🩸 MetaboSync · 88% Match",
  ];

  const stats = [
    { v: 12847, s: "+", l: "Patients Matched", c: "#1d4ed8" },
    { v: 890, s: "+", l: "Active Trials", c: "#0891b2" },
    { v: 98, s: "%", l: "Match Accuracy", c: "#10b981" },
    { v: 24, s: "/7", l: "AI Processing", c: "#7c3aed" },
  ];

  const pills = [
    "Eligibility Matching",
    "Rule-Based Logic",
    "Confidence Ranking",
    "Explainable AI",
    "HIPAA Privacy",
    "Geographic Filter",
    "PDF Record Parsing",
    "Anonymized Patient IDs",
    "Researcher Portal",
    "Doctor Dashboard",
    "Real-Time Matching",
  ];

  const workflow = [
    {
      icon: "📤",
      title: "Upload Data",
      desc: "Doctor uploads anonymized patient records. Researcher uploads trial eligibility criteria.",
      color: "#3b82f6",
      step: "01",
    },
    {
      icon: "🔍",
      title: "Parse Criteria",
      desc: "Free-text eligibility criteria are automatically converted into structured logical rules.",
      color: "#7c3aed",
      step: "02",
    },
    {
      icon: "⚙️",
      title: "Rule Filter",
      desc: "Each patient record is checked against hard yes/no thresholds — age, disease, lab values.",
      color: "#0891b2",
      step: "03",
    },
    {
      icon: "📊",
      title: "Score & Rank",
      desc: "Patients are scored for compatibility and ranked by confidence against each available trial.",
      color: "#10b981",
      step: "04",
    },
    {
      icon: "💬",
      title: "Explain Results",
      desc: "Plain-English explanations are generated for every eligible or not-eligible result.",
      color: "#f59e0b",
      step: "05",
    },
    {
      icon: "✅",
      title: "Act & Enroll",
      desc: "Doctors receive actionable recommendations. Researchers see ranked patient pools instantly.",
      color: "#ef4444",
      step: "06",
    },
  ];

  const miniBars = [
    { l: "M", v: 42 },
    { l: "T", v: 30 },
    { l: "W", v: 58 },
    { l: "T", v: 47 },
    { l: "F", v: 68 },
    { l: "S", v: 39 },
  ];

  return (
    <div style={{ background: "#f0f6ff" }}>
      {/* NAVBAR */}
      <header
        className="home-navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,.78)",
          borderBottom: "1px solid rgba(15,23,42,.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 6%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg,#1d4ed8,#10b981)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(29,78,216,.22)",
            }}
          >
            M
          </div>
          <div>
            <div style={{ fontWeight: 900, color: "#0f172a", letterSpacing: 0.2 }}>MEDTRIX</div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>
              AI-powered Clinical Trial Matching
            </div>
          </div>
        </div>

        <div className="home-nav-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="home-nav-btn">Home</button>
          <button className="home-nav-btn" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
            Features
          </button>
          <button className="home-nav-btn" onClick={() => document.getElementById("workflow")?.scrollIntoView({ behavior: "smooth" })}>
            Workflow
          </button>
          <button className="home-portal-btn" onClick={() => navigate("/dashboard")}>
            Dashboard Portal
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        className="home-hero"
        style={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          padding: "0 6%",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(155deg,#eef5ff 0%,#e4f0fb 50%,#edfdf5 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.034,
            backgroundImage:
              "linear-gradient(#1d4ed8 1px,transparent 1px),linear-gradient(90deg,#1d4ed8 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(59,130,246,.14),transparent 70%)",
            top: -110,
            left: -80,
            filter: "blur(55px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(6,182,212,.1),transparent 70%)",
            bottom: 0,
            right: "7%",
            filter: "blur(48px)",
          }}
        />

        <div
          className="home-hero-grid"
          style={{ width: "100%", display: "grid", gridTemplateColumns: "46% 52%", gap: 24, alignItems: "center" }}
        >
          {/* LEFT */}
          <div style={{ zIndex: 2 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(16,185,129,.1)",
                border: "1px solid rgba(16,185,129,.3)",
                borderRadius: 50,
                padding: "6px 16px",
                marginBottom: 24,
                animation: vis ? "fadeUp .6s ease both" : "none",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#10b981",
                  animation: "pulse 2s infinite",
                }}
              />
              <span style={{ fontSize: 12, color: "#065f46", fontWeight: 700 }}>
                LIVE TRIAL MATCHING ACTIVE
              </span>
            </div>

            <h1
              className="home-hero-title"
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 60,
                fontWeight: 900,
                lineHeight: 1.07,
                color: "#0f172a",
                marginBottom: 18,
                animation: vis ? "fadeUp .75s .08s ease both" : "none",
              }}
            >
              CONNECT
              <br />
              <span style={{ color: "#1d4ed8" }}>PATIENTS TO</span>
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg,#0891b2,#10b981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                CLINICAL TRIALS.
              </span>
            </h1>

            <p
              style={{
                fontSize: 16,
                color: "#475569",
                lineHeight: 1.75,
                maxWidth: 430,
                marginBottom: 34,
                animation: vis ? "fadeUp .75s .15s ease both" : "none",
              }}
            >
              Medtrix instantly matches anonymized patient records with suitable clinical trials
              using intelligent eligibility matching. Precision medicine, at scale.
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                marginBottom: 40,
                animation: vis ? "fadeUp .75s .22s ease both" : "none",
              }}
            >
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-blue"
                style={{ padding: "14px 32px", fontSize: 15 }}
              >
                Dashboard Portal →
              </button>

              <button
                onClick={() => navigate("/researcher")}
                className="btn-outline-blue"
                style={{ padding: "14px 28px", fontSize: 15 }}
              >
                Researcher Portal
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: 22,
                flexWrap: "wrap",
                animation: vis ? "fadeUp .75s .29s ease both" : "none",
              }}
            >
              {[["🔒", "HIPAA Ready"], ["⚡", "<200ms"], ["🏥", "850+ Trials"], ["🌍", "Pan-India"]].map(
                ([ic, lb]) => (
                  <div key={lb} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 15 }}>{ic}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{lb}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="home-hero-right"
            style={{
              height: 560,
              marginLeft: "2%",
              position: "relative",
              zIndex: 2,
              animation: vis ? "fadeIn 1.1s .2s ease both" : "none",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 24,
                background: "rgba(255,255,255,.48)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(29,78,216,.12)",
                boxShadow:
                  "0 26px 86px rgba(29,78,216,.11),inset 0 1px 0 rgba(255,255,255,.8)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <ThreeScene />
              <div className="scan-wrap">
                <div className="scan-line" />
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: 18,
                  zIndex: 10,
                  background: "rgba(255,255,255,.9)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 10,
                  padding: "8px 14px",
                  border: "1px solid rgba(29,78,216,.1)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#1d4ed8",
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  PATIENT–TRIAL NETWORK · LIVE
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {[["#1d4ed8", "Trials"], ["#10b981", "Patients"], ["#7c3aed", "Signals"]].map(
                    ([c, l]) => (
                      <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: c,
                          }}
                        />
                        <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>
                          {l}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 18,
                  right: 18,
                  background: "rgba(255,255,255,.84)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 10,
                  padding: "8px 16px",
                  border: "1px solid rgba(29,78,216,.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: "#1d4ed8" }}>
                  AI MATCHING ENGINE
                </span>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {[["#10b981", "5 Eligible"], ["#f59e0b", "2 Pending"], ["#3b82f6", "12 Active"]].map(
                    ([c, l]) => (
                      <span key={l} style={{ fontSize: 11, fontWeight: 700, color: c }}>
                        {l}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...ticker, ...ticker].map((t, i) => (
            <div key={i} className="ticker-item">
              <span>{t}</span>
              <span style={{ opacity: 0.35 }}>◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="home-section" style={{ padding: "64px 6%", background: "#fff" }}>
        <div
          className="home-stats-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="stat-card"
              style={{
                textAlign: "center",
                padding: "30px 18px",
                background: "linear-gradient(135deg,#f8faff,#eef5ff)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 48,
                  fontWeight: 900,
                  color: s.c,
                  lineHeight: 1,
                }}
              >
                <Counter target={s.v} suffix={s.s} />
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748b",
                  marginTop: 9,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE PILLS & COMPARISON */}
      <section
        id="features"
        className="home-section"
        style={{ padding: "80px 6%", background: "#f0f6ff" }}
      >
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 48,
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 14,
            }}
          >
            Everything You Need.
          </h2>
          <p style={{ color: "#64748b", fontSize: 18, maxWidth: 500, margin: "0 auto" }}>
            Smart tools designed to make clinical matching simple, fast, and transparent.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            justifyContent: "center",
            maxWidth: 900,
            margin: "0 auto 60px",
          }}
        >
          {pills.map((p, i) => (
            <div
              key={i}
              className="feat-pill"
              style={{
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#fff",
                borderRadius: 50,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: ["#3b82f6", "#10b981", "#7c3aed", "#f59e0b"][i % 4],
                }}
              />
              {p}
            </div>
          ))}
        </div>

        <div
          className="dash-card"
          style={{
            overflow: "hidden",
            maxWidth: 860,
            margin: "0 auto",
            boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              padding: "20px 28px",
              background: "#1d4ed8",
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            Medtrix vs The Old Way
          </div>

          <table className="home-comparison" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8faff" }}>
                {["Feature", "Old Way", "With Medtrix"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "16px 28px",
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#64748b",
                      textAlign: "left",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Matching Speed", "Days of Work", "Seconds"],
                ["Review Style", "Manual Errors", "AI Precision"],
                ["Explanations", "None", "Clear Reasons"],
                ["Patient Scale", "Limited", "Unlimited"],
              ].map(([f, t, m], i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td
                    style={{
                      padding: "18px 28px",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#334155",
                    }}
                  >
                    {f}
                  </td>
                  <td style={{ padding: "18px 28px", fontSize: 15, color: "#94a3b8" }}>{t}</td>
                  <td
                    style={{
                      padding: "18px 28px",
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#1d4ed8",
                    }}
                  >
                    {m}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

     {/* WORKFLOW */}
<section
  id="workflow"
  className="home-section"
  style={{
    padding: "96px 6%",
    background: "linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)",
    position: "relative",
    overflow: "hidden",
  }}
>
  <div
    style={{
      position: "absolute",
      top: 0,
      left: "10%",
      width: 260,
      height: 260,
      borderRadius: "50%",
      background: "radial-gradient(circle,rgba(29,78,216,.08),transparent 70%)",
      filter: "blur(20px)",
    }}
  />
  <div
    style={{
      position: "absolute",
      bottom: 0,
      right: "8%",
      width: 260,
      height: 260,
      borderRadius: "50%",
      background: "radial-gradient(circle,rgba(16,185,129,.08),transparent 70%)",
      filter: "blur(20px)",
    }}
  />

  <div style={{ textAlign: "center", marginBottom: 70, position: "relative", zIndex: 2 }}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#eff6ff",
        color: "#1d4ed8",
        borderRadius: 50,
        padding: "8px 18px",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        marginBottom: 18,
      }}
    >
      Smart Workflow
    </div>

    <h2
      style={{
        fontFamily: "'Playfair Display',serif",
        fontSize: 46,
        fontWeight: 900,
        color: "#0f172a",
        marginBottom: 14,
      }}
    >
      How Medtrix Works
    </h2>

    <p
      style={{
        color: "#64748b",
        fontSize: 18,
        maxWidth: 700,
        margin: "0 auto",
        lineHeight: 1.8,
      }}
    >
      An intelligent end-to-end workflow that transforms raw clinical information into
      ranked, explainable trial matches for faster recruitment.
    </p>
  </div>

  <div
    className="timeline-wrapper"
    style={{
      position: "relative",
      maxWidth: 1200,
      margin: "0 auto",
      zIndex: 2,
    }}
  >
    {/* center line */}
    <div
      className="timeline-line"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: 6,
        borderRadius: 10,
        background: "linear-gradient(180deg,#1d4ed8 0%,#0891b2 50%,#10b981 100%)",
        boxShadow: "0 0 24px rgba(29,78,216,.18)",
      }}
    />

    {workflow.map((item, i) => {
      const isLeft = i % 2 === 0;

      return (
        <div
          key={i}
          className="timeline-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 90px 1fr",
            alignItems: "center",
            marginBottom: 42,
            position: "relative",
          }}
        >
          {/* LEFT SIDE */}
          <div
            style={{
              display: "flex",
              justifyContent: isLeft ? "flex-end" : "flex-start",
              opacity: isLeft ? 1 : 0.18,
              pointerEvents: isLeft ? "auto" : "none",
            }}
          >
            {isLeft && (
              <div
                className="timeline-card"
                style={{
                  width: "92%",
                  background: "rgba(255,255,255,.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: 22,
                  padding: "24px 24px 22px",
                  boxShadow: "0 18px 40px rgba(15,23,42,.08)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${item.color}, transparent)`,
                  }}
                />

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 24,
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}33`,
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: item.color,
                        letterSpacing: 1,
                      }}
                    >
                      STEP {item.step}
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#0f172a",
                        marginTop: 4,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p style={{ color: "#64748b", lineHeight: 1.8, fontSize: 14.5 }}>
                  {item.desc}
                </p>
              </div>
            )}
          </div>

          {/* MIDDLE NODE */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              zIndex: 3,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#ffffff,#eff6ff)",
                border: `4px solid ${item.color}`,
                boxShadow: `0 0 0 8px ${item.color}18, 0 10px 30px rgba(15,23,42,.12)`,
                display: "grid",
                placeItems: "center",
                fontSize: 24,
                fontWeight: 900,
                color: item.color,
              }}
            >
              {item.icon}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div
            style={{
              display: "flex",
              justifyContent: !isLeft ? "flex-start" : "flex-end",
              opacity: !isLeft ? 1 : 0.18,
              pointerEvents: !isLeft ? "auto" : "none",
            }}
          >
            {!isLeft && (
              <div
                className="timeline-card"
                style={{
                  width: "92%",
                  background: "rgba(255,255,255,.95)",
                  border: "1px solid #e2e8f0",
                  borderRadius: 22,
                  padding: "24px 24px 22px",
                  boxShadow: "0 18px 40px rgba(15,23,42,.08)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${item.color}, transparent)`,
                  }}
                />

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 24,
                      background: `${item.color}18`,
                      border: `1px solid ${item.color}33`,
                    }}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 800,
                        color: item.color,
                        letterSpacing: 1,
                      }}
                    >
                      STEP {item.step}
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#0f172a",
                        marginTop: 4,
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p style={{ color: "#64748b", lineHeight: 1.8, fontSize: 14.5 }}>
                  {item.desc}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section className="home-section" style={{ padding: "86px 6%", background: "#f8fbff" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 44,
              fontWeight: 900,
              color: "#0f172a",
              marginBottom: 14,
            }}
          >
            Built for Live Clinical Operations
          </h2>
          <p style={{ color: "#64748b", fontSize: 18, maxWidth: 660, margin: "0 auto" }}>
            Doctors and researchers work from dedicated dashboards with transparent matching scores,
            patient ranking, and secure report flow.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: 22,
            alignItems: "stretch",
          }}
        >
          <div className="dash-card" style={{ padding: 24 }}>
            <div className="section-header">
              <div>
                <div className="section-title">Matching Overview</div>
                <div className="section-sub">Trial eligibility results and performance trends</div>
              </div>
              <div className="badge badge-blue">Live</div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 16,
                marginBottom: 22,
              }}
            >
              {[
                ["Eligible", 92, "#10b981"],
                ["Maybe", 64, "#f59e0b"],
                ["Rejected", 28, "#ef4444"],
              ].map(([l, s, c]) => (
                <div
                  key={l}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 14,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <ScoreRing score={s} />
                  <div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{l}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: c }}>{s}%</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-header" style={{ marginBottom: 14 }}>
              <div>
                <div className="section-title" style={{ fontSize: 18 }}>Weekly Recruitment Pulse</div>
                <div className="section-sub">Patient-trial engagement trend</div>
              </div>
            </div>

            <BarChart data={miniBars} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="dash-card" style={{ padding: 22 }}>
              <div className="section-header" style={{ marginBottom: 14 }}>
                <div>
                  <div className="section-title" style={{ fontSize: 18 }}>Top Trial</div>
                  <div className="section-sub">Best performing active study</div>
                </div>
              </div>

              <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>
                DiaCare-2025
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#64748b", fontWeight: 700 }}>Eligibility Confidence</span>
                  <span style={{ fontSize: 13, color: "#10b981", fontWeight: 800 }}>91%</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: "91%", background: "#10b981" }} />
                </div>
              </div>

              <div className="badge badge-green">Matched 324 patients</div>
            </div>

            <div className="dash-card" style={{ padding: 22 }}>
              <div className="section-header" style={{ marginBottom: 14 }}>
                <div>
                  <div className="section-title" style={{ fontSize: 18 }}>Privacy Layer</div>
                  <div className="section-sub">Researcher-safe identity model</div>
                </div>
              </div>

              <ul style={{ paddingLeft: 18, color: "#475569", lineHeight: 2 }}>
                <li>Anonymized patient IDs</li>
                <li>Secure trial report exchange</li>
                <li>No direct patient identity exposure</li>
                <li>Role-based dashboard access</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-section" style={{ padding: "80px 6% 110px", background: "#fff" }}>
        <div
          style={{
            borderRadius: 32,
            background: "linear-gradient(135deg,#0f172a 0%,#1d4ed8 52%,#0891b2 100%)",
            padding: "54px 40px",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(15,23,42,.18)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(255,255,255,.14),transparent 70%)",
              right: -40,
              top: -40,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(16,185,129,.18),transparent 70%)",
              left: -60,
              bottom: -60,
            }}
          />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,.12)",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 50,
                padding: "8px 18px",
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              READY TO GO LIVE
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 46,
                fontWeight: 900,
                marginBottom: 14,
              }}
            >
              Open the Dashboard Portal
            </h2>

            <p
              style={{
                maxWidth: 760,
                margin: "0 auto 28px",
                color: "rgba(255,255,255,.86)",
                lineHeight: 1.8,
                fontSize: 17,
              }}
            >
              Start from the Doctor Dashboard to upload patient data, or jump directly into the
              Researcher Portal to create trials and monitor matched reports.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  padding: "14px 28px",
                  background: "#fff",
                  color: "#1d4ed8",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Doctor Dashboard
              </button>

              <button
                onClick={() => navigate("/researcher")}
                style={{
                  padding: "14px 28px",
                  background: "transparent",
                  color: "#fff",
                  border: "1.5px solid rgba(255,255,255,.35)",
                  borderRadius: 12,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Researcher Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}