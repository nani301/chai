"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";
import {
  ShoppingBag,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Plus,
  Minus,
  X,
  Check,
  Droplets,
  Flame,
  Cookie,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Eye,
  RotateCcw,
  UtensilsCrossed,
} from "lucide-react";

// ============================================================================
// STEP 1: EDIT YOUR RESTAURANT INFO HERE (100% BEGINNER FRIENDLY)
// Change your cafe name, menu items, prices, or WhatsApp number below.
// ============================================================================
const RESTAURANT_DATA = {
  name: "Barish & Brew",
  tagline: "Monsoon Windows. Slow-Simmered Chai. Oven-Warm Biscuits.",
  subTagline:
    "Wipe the rain-fogged glass with your cursor or finger, then scroll down to pour a fresh copper-kettle cutting chai.",
  craftOrigin: "Est. 1984 · Banjara Hills Flagship · Copper Handi Brewed",

  contact: {
    phone: "+91 98765 43210",
    whatsappNumber: "919876543210", // Digits only for instant 1-click WhatsApp checkout
    address: "Plot 42, Road No. 12, Banjara Hills, Hyderabad 500034",
    googleMapsLink: "https://maps.google.com",
  },

  hours: [
    { days: "Monday – Thursday", time: "07:00 AM – 11:00 PM" },
    { days: "Friday – Sunday (Monsoon Late Kettle)", time: "06:30 AM – 01:00 AM" },
  ],

  aromaNotes: [
    {
      title: "Green Cardamom",
      origin: "Idukki Hills · Freshly Pounded",
      temp: "94°C Infusion",
      align: "left" as const,
      xOffset: -260,
      yOffset: -95,
    },
    {
      title: "Crushed Ginger",
      origin: "Heirloom Organic · Stone Ground",
      temp: "First Boil Extract",
      align: "right" as const,
      xOffset: 260,
      yOffset: -115,
    },
    {
      title: "Assam Estate Leaf",
      origin: "Upper Brahmaputra · Second Flush",
      temp: "24-Min Copper Simmer",
      align: "left" as const,
      xOffset: -250,
      yOffset: 40,
    },
    {
      title: "Reduced Malai Crema",
      origin: "Caramelized Buffalo Milk · Saffron Kissed",
      temp: "High-Pour Froth",
      align: "right" as const,
      xOffset: 250,
      yOffset: 55,
    },
  ],

  orbitBiscuits: [
    {
      id: "orb-osmania",
      name: "Warm Osmania Biscuits",
      pairingNote: "Sweet-salty saffron shortbread · 180°C golden crust",
      price: 160,
      menuId: "item-3",
    },
    {
      id: "orb-khari",
      name: "Flaky Butter Khari",
      pairingNote: "64-layer hand-laminated puff · Shatters on dip",
      price: 140,
      menuId: "item-4",
    },
    {
      id: "orb-nankhatai",
      name: "Pistachio Nankhatai",
      pairingNote: "Ghee-roasted semolina crumb · Crushed green pista",
      price: 175,
      menuId: "item-5",
    },
  ],

  categories: [
    "All",
    "Signature Chai",
    "Artisan Biscuits",
    "Monsoon Bites",
  ] as const,

  menu: [
    {
      id: "item-1",
      name: "24-Minute Dum Irani Chai",
      category: "Signature Chai",
      price: 120,
      currency: "₹",
      kicker: "House Signature · 180 ml Cutting Glass",
      description:
        "Slow-simmered in a sealed copper handi with reduced mawa milk, pounded green elaichi, and single-estate Assam orthodox leaf.",
      artType: "irani-chai" as const,
      calories: "145 kcal",
      prepTime: "Poured live",
    },
    {
      id: "item-2",
      name: "Adrak Tulsi Monsoon Cutting",
      category: "Signature Chai",
      price: 95,
      currency: "₹",
      kicker: "Rainy Evening Classic · 160 ml",
      description:
        "Mortar-pounded heirloom ginger root, wild purple tulsi leaves, Tellicherry black pepper, and jaggery-kissed kadak brew.",
      artType: "adrak-chai" as const,
      calories: "110 kcal",
      prepTime: "4 mins",
    },
    {
      id: "item-3",
      name: "Warm Osmania Biscuit Tin (6 Pcs)",
      category: "Artisan Biscuits",
      price: 160,
      currency: "₹",
      kicker: "Baked Every 45 Mins · Cultured Butter",
      description:
        "Hyderabadi heritage shortbread brushed with saffron milk wash and finished with a delicate sweet-and-sea-salt crumble made for dipping.",
      artType: "osmania" as const,
      calories: "320 kcal",
      prepTime: "Oven warm",
    },
    {
      id: "item-4",
      name: "Flaky Butter Khari Basket",
      category: "Artisan Biscuits",
      price: 140,
      currency: "₹",
      kicker: "64-Layer Laminated Puff · 8 Fingers",
      description:
        "Hand-folded French-method Indian puff pastry fingers baked in stone deck ovens until caramelized, airy, and crisp.",
      artType: "khari" as const,
      calories: "290 kcal",
      prepTime: "Oven warm",
    },
    {
      id: "item-5",
      name: "Roasted Pistachio Nankhatai (5 Pcs)",
      category: "Artisan Biscuits",
      price: 175,
      currency: "₹",
      kicker: "Pure A2 Ghee Shortbread · Nutmeg",
      description:
        "Velvety gram-flour and semolina shortbread cookies crowned with Iranian green pistachios and freshly grated nutmeg.",
      artType: "nankhatai" as const,
      calories: "340 kcal",
      prepTime: "Oven warm",
    },
    {
      id: "item-6",
      name: "Irani Bun Maska & Whipped Malai",
      category: "Monsoon Bites",
      price: 135,
      currency: "₹",
      kicker: "Griddle Toasted · Cultured White Butter",
      description:
        "Pillow-soft tutti-frutti milk bun toasted over cast iron and slathered with house-churned white makkhan and demerara sugar.",
      artType: "bun-maska" as const,
      calories: "360 kcal",
      prepTime: "5 mins",
    },
    {
      id: "item-7",
      name: "Punjabi Onion Samosa & Mint Chutney",
      category: "Monsoon Bites",
      price: 115,
      currency: "₹",
      kicker: "2 Crisp Pockets · Crushed Coriander",
      description:
        "Flaky ajwain pastry pockets stuffed with caramelized monsoon red onions, roasted cumin, and green chili tamarind glaze.",
      artType: "samosa" as const,
      calories: "280 kcal",
      prepTime: "7 mins",
    },
    {
      id: "item-8",
      name: "Zaffrani Malai Bun & Khoya Dip",
      category: "Monsoon Bites",
      price: 155,
      currency: "₹",
      kicker: "Kashmiri Saffron · Reduced Milk Crust",
      description:
        "Brioche milk bun soaked in warm saffron cardamom cream and served with a caramelized handi khoya reduction.",
      artType: "malai-bun" as const,
      calories: "390 kcal",
      prepTime: "6 mins",
    },
  ],

  testimonials: [
    {
      name: "Aarav Mehta",
      role: "Principal Architect",
      organization: "Studio Deccan",
      outcome: "Hosted 14 client design reviews at Window Booth #3 this monsoon",
      quote:
        "Before discovering Barish & Brew, rainy evening client meetings felt rushed in noisy coffee chains. Their 24-minute Dum Irani Chai and oven-warm Osmania biscuits turned our monsoon studio reviews into a ritual.",
    },
    {
      name: "Sana Qureshi",
      role: "Culinary Editor",
      organization: "The Southern Table",
      outcome: "Rated #1 Artisanal Chai Room in Hyderabad's 2026 Monsoon Guide",
      quote:
        "Most cafes use pre-mixed syrups, but here you watch the copper kettle pour from a foot high into fluted glass. The 64-layer Butter Khari holds its crunch even after a three-second dip in piping hot chai.",
    },
    {
      name: "Vikramaditya Rao",
      role: "Editorial Photographer",
      organization: "Monsoon Frames",
      outcome: "Reserved 9 weekend twilight tables via instant WhatsApp concierge",
      quote:
        "Wiping the condensation off the brass-framed window while the aroma of pounded Idukki cardamom fills the booth is pure cinema. The Bun Maska literally melts on contact.",
    },
  ],
};

// ============================================================================
// PRE-ALLOCATED SCRATCH OBJECTS FOR ZERO-GC 60FPS THREE.JS RENDER LOOP
// ============================================================================
const _scratchVec3 = new THREE.Vector3();
const _scratchLookAt = new THREE.Vector3();
const _scratchMatrix = new THREE.Matrix4();
const _scratchPosition = new THREE.Vector3();
const _scratchEuler = new THREE.Euler();
const _scratchQuaternion = new THREE.Quaternion();
const _scratchScale = new THREE.Vector3();

// ============================================================================
// BESPOKE PROCEDURAL CULINARY ARTWORK (ZERO EXTERNAL URLS / ZERO 404S)
// Renders studio-grade SVG culinary illustrations for every menu card
// ============================================================================
function ProceduralMenuArtwork({
  artType,
  title,
}: {
  artType:
    | "irani-chai"
    | "adrak-chai"
    | "osmania"
    | "khari"
    | "nankhatai"
    | "bun-maska"
    | "samosa"
    | "malai-bun";
  title: string;
}) {
  return (
    <div
      role="img"
      aria-label={title}
      className="relative h-56 w-full overflow-hidden bg-[#18110D] flex items-center justify-center select-none"
    >
      {/* Studio radial lighting backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(208,112,48,0.28)_0%,rgba(42,26,18,0.65)_55%,rgba(18,13,10,0.98)_100%)]" />

      {/* Subtle architectural travertine surface line */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#110C09] to-[#231812]/80 border-t border-[#F7EFE4]/5" />

      <svg
        viewBox="0 0 320 220"
        className="relative z-10 h-full w-full transition-transform duration-500 group-hover:scale-105"
      >
        <defs>
          <linearGradient id={`brass-${artType}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C5121" />
            <stop offset="50%" stopColor="#E6BA72" />
            <stop offset="100%" stopColor="#6D4419" />
          </linearGradient>
          <linearGradient id={`chai-${artType}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E59B58" />
            <stop offset="55%" stopColor="#B8642A" />
            <stop offset="100%" stopColor="#683010" />
          </linearGradient>
          <linearGradient id={`glass-${artType}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="75%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.34)" />
          </linearGradient>
          <radialGradient id={`biscuit-${artType}`} cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#F4C785" />
            <stop offset="70%" stopColor="#CE8B43" />
            <stop offset="100%" stopColor="#8E5219" />
          </radialGradient>
        </defs>

        {/* Contact shadow on tabletop */}
        <ellipse
          cx="160"
          cy="184"
          rx="76"
          ry="12"
          fill="rgba(0,0,0,0.65)"
        />

        {(artType === "irani-chai" || artType === "adrak-chai") && (
          <g>
            {/* Vintage Brass Saucer */}
            <ellipse
              cx="160"
              cy="176"
              rx="64"
              ry="11"
              fill={`url(#brass-${artType})`}
            />
            <ellipse
              cx="160"
              cy="173"
              rx="46"
              ry="6"
              fill="#4E2F11"
              opacity="0.6"
            />

            {/* Fluted Cutting Chai Glass */}
            <polygon
              points="126,64 194,64 182,172 138,172"
              fill="rgba(255,248,238,0.08)"
              stroke="rgba(255,245,230,0.45)"
              strokeWidth="2"
            />
            {/* Hot Spiced Chai Liquid */}
            <polygon
              points="129,84 191,84 180,169 140,169"
              fill={`url(#chai-${artType})`}
            />
            {/* Malai Crema Foam Ring */}
            <ellipse cx="160" cy="84" rx="31" ry="6.5" fill="#F8DEC0" />
            <ellipse cx="158" cy="83" rx="22" ry="3.5" fill="#FFF2E2" />

            {/* Faceted Flutes */}
            <line
              x1="142"
              y1="66"
              x2="147"
              y2="170"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.5"
            />
            <line
              x1="154"
              y1="66"
              x2="156"
              y2="170"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.5"
            />
            <line
              x1="166"
              y1="66"
              x2="165"
              y2="170"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.5"
            />
            <line
              x1="178"
              y1="66"
              x2="173"
              y2="170"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.5"
            />
            {/* Glass Rim */}
            <ellipse
              cx="160"
              cy="64"
              rx="34"
              ry="6"
              fill="none"
              stroke="rgba(255,250,240,0.65)"
              strokeWidth="2"
            />

            {/* Rising Steam Wisps */}
            <path
              d="M148,52 C142,38 158,28 150,14"
              fill="none"
              stroke="rgba(255,242,226,0.45)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M168,54 C175,38 158,26 168,12"
              fill="none"
              stroke="rgba(255,242,226,0.35)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Whole Cardamom & Ginger Garnish on Saucer */}
            <ellipse
              cx="116"
              cy="173"
              rx="8"
              ry="4.5"
              transform="rotate(-18 116 173)"
              fill="#7A9A5B"
            />
            <ellipse
              cx="202"
              cy="174"
              rx="10"
              ry="5"
              transform="rotate(15 202 174)"
              fill={artType === "adrak-chai" ? "#D69E5C" : "#8AA868"}
            />
          </g>
        )}

        {artType === "osmania" && (
          <g>
            {/* Brass Platter */}
            <ellipse
              cx="160"
              cy="176"
              rx="82"
              ry="13"
              fill={`url(#brass-${artType})`}
            />
            {/* Stacked Golden Osmania Biscuits */}
            {[
              { cx: 132, cy: 156, r: 28 },
              { cx: 188, cy: 158, r: 28 },
              { cx: 160, cy: 140, r: 30 },
              { cx: 156, cy: 116, r: 29 },
            ].map((b, i) => (
              <g key={i}>
                <ellipse
                  cx={b.cx}
                  cy={b.cy + 6}
                  rx={b.r}
                  ry={b.r * 0.48}
                  fill="#7A4414"
                />
                <ellipse
                  cx={b.cx}
                  cy={b.cy}
                  rx={b.r}
                  ry={b.r * 0.48}
                  fill={`url(#biscuit-${artType})`}
                  stroke="#A86523"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx={b.cx}
                  cy={b.cy - 1}
                  rx={b.r * 0.72}
                  ry={b.r * 0.3}
                  fill="none"
                  stroke="#FCE5C2"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  opacity="0.65"
                />
              </g>
            ))}
          </g>
        )}

        {artType === "khari" && (
          <g>
            <ellipse
              cx="160"
              cy="176"
              rx="80"
              ry="12"
              fill={`url(#brass-${artType})`}
            />
            {/* Laminated Flaky Puff Pastry Layers */}
            {[
              { x: 108, y: 134, rot: -12 },
              { x: 148, y: 126, rot: 8 },
              { x: 126, y: 102, rot: -4 },
            ].map((k, idx) => (
              <g
                key={idx}
                transform={`translate(${k.x}, ${k.y}) rotate(${k.rot})`}
              >
                <rect
                  x="0"
                  y="8"
                  width="68"
                  height="26"
                  rx="5"
                  fill="#8B4F1B"
                />
                <rect
                  x="0"
                  y="0"
                  width="68"
                  height="24"
                  rx="5"
                  fill={`url(#biscuit-${artType})`}
                  stroke="#F7D59C"
                  strokeWidth="1"
                />
                <line
                  x1="6"
                  y1="8"
                  x2="62"
                  y2="8"
                  stroke="#7A4313"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <line
                  x1="6"
                  y1="14"
                  x2="62"
                  y2="14"
                  stroke="#7A4313"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <line
                  x1="6"
                  y1="19"
                  x2="62"
                  y2="19"
                  stroke="#7A4313"
                  strokeWidth="1"
                  opacity="0.6"
                />
              </g>
            ))}
          </g>
        )}

        {artType === "nankhatai" && (
          <g>
            <ellipse
              cx="160"
              cy="176"
              rx="82"
              ry="12"
              fill={`url(#brass-${artType})`}
            />
            {[
              { cx: 124, cy: 154, r: 27 },
              { cx: 192, cy: 155, r: 27 },
              { cx: 158, cy: 134, r: 30 },
            ].map((n, idx) => (
              <g key={idx}>
                <ellipse
                  cx={n.cx}
                  cy={n.cy + 5}
                  rx={n.r}
                  ry={n.r * 0.55}
                  fill="#9C6932"
                />
                <ellipse
                  cx={n.cx}
                  cy={n.cy}
                  rx={n.r}
                  ry={n.r * 0.52}
                  fill="#F5D7A1"
                  stroke="#C99655"
                  strokeWidth="1.5"
                />
                {/* Crushed Green Pistachio Crown */}
                <ellipse
                  cx={n.cx}
                  cy={n.cy - 2}
                  rx="8"
                  ry="4.5"
                  fill="#7FA655"
                />
                <circle cx={n.cx - 3} cy={n.cy - 3} r="2" fill="#A9C97D" />
                <circle cx={n.cx + 4} cy={n.cy - 1} r="1.8" fill="#5D8236" />
              </g>
            ))}
          </g>
        )}

        {(artType === "bun-maska" || artType === "malai-bun") && (
          <g>
            <ellipse
              cx="160"
              cy="176"
              rx="84"
              ry="13"
              fill={`url(#brass-${artType})`}
            />
            {/* Bottom toasted bun half */}
            <path
              d="M104,154 Q160,174 216,154 L210,168 Q160,182 110,168 Z"
              fill="#D89B56"
            />
            {/* Thick Whipped Cultured Butter / Malai Layer */}
            <path
              d="M102,146 Q130,158 160,148 Q190,158 218,146 L216,156 Q160,172 104,156 Z"
              fill="#FFF6E5"
            />
            {/* Glossy Domed Brioche Crown */}
            <path
              d="M102,146 C102,92 218,92 218,146 Z"
              fill={`url(#biscuit-${artType})`}
            />
            {/* Specular highlight on glazed bun */}
            <ellipse
              cx="146"
              cy="112"
              rx="26"
              ry="9"
              transform="rotate(-10 146 112)"
              fill="rgba(255,250,240,0.32)"
            />
            {/* Saffron strands or tutti-frutti */}
            <circle cx="175" cy="122" r="2.2" fill="#B93829" />
            <circle cx="142" cy="128" r="2" fill="#6A994E" />
            <circle cx="162" cy="115" r="2" fill="#E07A2A" />
          </g>
        )}

        {artType === "samosa" && (
          <g>
            <ellipse
              cx="160"
              cy="176"
              rx="84"
              ry="13"
              fill={`url(#brass-${artType})`}
            />
            {/* Crisp Golden Triangle Samosas */}
            <polygon
              points="136,88 96,166 174,162"
              fill={`url(#biscuit-${artType})`}
              stroke="#8B4F1B"
              strokeWidth="2"
            />
            <polygon
              points="178,94 142,168 218,164"
              fill="#D79447"
              stroke="#7A4313"
              strokeWidth="2"
            />
            {/* Mint Chutney Bowl */}
            <ellipse cx="222" cy="166" rx="18" ry="8" fill="#4A2E14" />
            <ellipse cx="222" cy="164" rx="15" ry="6" fill="#5E8C49" />
          </g>
        )}
      </svg>
    </div>
  );
}

// ============================================================================
// ACT 1: INTERACTIVE FOGGY RAIN WINDOW OVERLAY (HTML5 2D CANVAS PHYSICS)
// Uses globalCompositeOperation = 'destination-out' with soft radial brush
// ============================================================================
function FoggyRainWindow({
  onWipeProgress,
  resetTrigger,
}: {
  onWipeProgress?: (pct: number) => void;
  resetTrigger: number;
}) {
  const fogCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const wipeCountRef = useRef(0);

  // Initialize or Reset Fog Layer
  const paintCondensationFog = useCallback(() => {
    const canvas = fogCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    wipeCountRef.current = 0;
    if (onWipeProgress) onWipeProgress(0);

    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "rgba(22, 26, 31, 0.90)");
    grad.addColorStop(0.5, "rgba(31, 35, 40, 0.86)");
    grad.addColorStop(1, "rgba(18, 20, 24, 0.92)");

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle warm indoor condensation mist speckles
    ctx.fillStyle = "rgba(255, 244, 228, 0.045)";
    for (let i = 0; i < 360; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      const rr = Math.random() * 44 + 12;
      ctx.beginPath();
      ctx.arc(rx, ry, rr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pre-wipe a soft central peephole so the user immediately sees the 3D cup glowing behind the fog
    ctx.globalCompositeOperation = "destination-out";
    const cx = canvas.width * 0.5;
    const cy = canvas.height * 0.48;
    const peepGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
    peepGrad.addColorStop(0, "rgba(0,0,0,0.45)");
    peepGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = peepGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.fill();
  }, [onWipeProgress]);

  useEffect(() => {
    paintCondensationFog();
    window.addEventListener("resize", paintCondensationFog);
    return () => window.removeEventListener("resize", paintCondensationFog);
  }, [paintCondensationFog, resetTrigger]);

  // Cursor & Touch Wiping Interaction
  useEffect(() => {
    const canvas = fogCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const wipeAt = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      const radius = 92;
      const radial = ctx.createRadialGradient(x, y, 12, x, y, radius);
      radial.addColorStop(0, "rgba(0,0,0,0.96)");
      radial.addColorStop(0.6, "rgba(0,0,0,0.58)");
      radial.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = radial;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      wipeCountRef.current += 1;
      if (onWipeProgress) {
        onWipeProgress(Math.min(100, Math.round(wipeCountRef.current / 1.15)));
      }
    };

    const handleMouseMove = (e: MouseEvent) => wipeAt(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        wipeAt(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onWipeProgress]);

  // Animated Monsoon Raindrops & Streaks Layer
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drops = Array.from({ length: 90 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 3.0 + 1.4,
      speedY: Math.random() * 1.9 + 0.65,
      wobble: Math.random() * 100,
      trailLength: Math.random() * 24 + 10,
    }));

    const renderRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of drops) {
        d.y += d.speedY;
        d.wobble += 0.03;
        d.x += Math.sin(d.wobble) * 0.25;

        if (d.y > canvas.height + 24) {
          d.y = -24;
          d.x = Math.random() * canvas.width;
        }

        const trailGrad = ctx.createLinearGradient(
          d.x,
          d.y - d.trailLength,
          d.x,
          d.y
        );
        trailGrad.addColorStop(0, "rgba(255, 245, 230, 0)");
        trailGrad.addColorStop(1, "rgba(255, 238, 210, 0.36)");
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = d.r * 0.62;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.trailLength);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 246, 232, 0.45)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
          d.x - d.r * 0.3,
          d.y - d.r * 0.3,
          d.r * 0.35,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fill();
      }

      animId = requestAnimationFrame(renderRain);
    };

    renderRain();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <canvas ref={fogCanvasRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={rainCanvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 border-[12px] border-[#150F0C]/85 shadow-[inset_0_0_90px_rgba(0,0,0,0.82)]" />
    </div>
  );
}

// ============================================================================
// THREE.JS STUDIO PBR 3D SCENE (COMPOSITE 10-PART PROCEDURAL MODEL + INSTANCED STEAM)
// ============================================================================
function ThreeChaiStage({
  scrollRefValue,
  isBiscuitDipped,
  finishPreset,
  cameraPreset,
}: {
  scrollRefValue: React.MutableRefObject<number>;
  isBiscuitDipped: boolean;
  finishPreset: "heritage-brass" | "aged-copper" | "smoked-glass";
  cameraPreset: "scroll-auto" | "top-crema" | "side-pour";
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const dipStateRef = useRef(isBiscuitDipped);
  const finishRef = useRef(finishPreset);
  const cameraModeRef = useRef(cameraPreset);

  useEffect(() => {
    dipStateRef.current = isBiscuitDipped;
  }, [isBiscuitDipped]);

  useEffect(() => {
    finishRef.current = finishPreset;
  }, [finishPreset]);

  useEffect(() => {
    cameraModeRef.current = cameraPreset;
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isHeadless =
      typeof navigator !== "undefined" &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    // 1. Scene & Horizon-Matched Exponential Fog
    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(0x120d0a);
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(0x120d0a, 0.045);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 6.8);

    // 3. Renderer (ACESFilmicToneMapping + SRGBColorSpace)
    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isHeadless ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflections (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 5. Studio 3-Point Warm/Cool Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xffe6c2, 0x243044, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffb870, 2.6);
    keyLight.position.set(4.5, 7.5, 5.0);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    const d = 4.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x7098ff, 1.15);
    rimLight.position.set(-5.0, 4.0, -4.5);
    scene.add(rimLight);

    const warmFillLight = new THREE.PointLight(0xe07830, 1.8, 12);
    warmFillLight.position.set(0, 1.8, 2.5);
    scene.add(warmFillLight);

    // 6. Procedural Textures (SRGBColorSpace + MaxAnisotropy)
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // Procedural Walnut Wood & Brass Inlay Tabletop Texture
    const tableCanvas = document.createElement("canvas");
    tableCanvas.width = 512;
    tableCanvas.height = 512;
    const tCtx = tableCanvas.getContext("2d")!;
    tCtx.fillStyle = "#1c120c";
    tCtx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 180; i++) {
      tCtx.fillStyle =
        i % 2 === 0 ? "rgba(48, 29, 18, 0.35)" : "rgba(18, 10, 6, 0.35)";
      tCtx.fillRect(0, (i * 512) / 180, 512, 3);
    }
    const tableTex = new THREE.CanvasTexture(tableCanvas);
    tableTex.colorSpace = THREE.SRGBColorSpace;
    tableTex.anisotropy = maxAniso;

    // Procedural Frothy Malai Crema Texture
    const cremaCanvas = document.createElement("canvas");
    cremaCanvas.width = 256;
    cremaCanvas.height = 256;
    const cCtx = cremaCanvas.getContext("2d")!;
    const cGrad = cCtx.createRadialGradient(128, 128, 12, 128, 128, 128);
    cGrad.addColorStop(0, "#fff3df");
    cGrad.addColorStop(0.65, "#f0caa0");
    cGrad.addColorStop(1, "#c87d3b");
    cCtx.fillStyle = cGrad;
    cCtx.fillRect(0, 0, 256, 256);
    // Cardamom specs & micro-bubbles
    for (let i = 0; i < 90; i++) {
      const bx = Math.random() * 256;
      const by = Math.random() * 256;
      const br = Math.random() * 3.5 + 1;
      cCtx.fillStyle =
        i % 7 === 0 ? "rgba(62, 42, 22, 0.55)" : "rgba(255, 250, 242, 0.45)";
      cCtx.beginPath();
      cCtx.arc(bx, by, br, 0, Math.PI * 2);
      cCtx.fill();
    }
    const cremaTex = new THREE.CanvasTexture(cremaCanvas);
    cremaTex.colorSpace = THREE.SRGBColorSpace;
    cremaTex.anisotropy = maxAniso;

    // Soft radial contact shadow texture
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext("2d")!;
    const sGrad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    sGrad.addColorStop(0, "rgba(0, 0, 0, 0.78)");
    sGrad.addColorStop(0.55, "rgba(0, 0, 0, 0.32)");
    sGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);

    // 7. Grounding Tabletop & Contact Shadow
    const tableGeo = new THREE.CylinderGeometry(5.5, 5.5, 0.2, 64);
    const tableMat = new THREE.MeshStandardMaterial({
      map: tableTex,
      roughness: 0.72,
      metalness: 0.08,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.position.y = -0.1;
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    const contactShadowGeo = new THREE.PlaneGeometry(3.4, 3.4);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.015;
    scene.add(contactShadow);

    // ========================================================================
    // 8. COMPOSITE 10-PART PROCEDURAL HERO MODEL (`chaiStageGroup`)
    // Pivoted at bottom-center (Y = 0) flush with tabletop
    // ========================================================================
    const chaiStageGroup = new THREE.Group();
    chaiStageGroup.position.set(0, 0, 0);
    scene.add(chaiStageGroup);

    // PART 1: LatheGeometry Vintage Brass Saucer (Primary Silhouette Base)
    const saucerPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.75, 0.0),
      new THREE.Vector2(1.15, 0.08),
      new THREE.Vector2(1.32, 0.16),
      new THREE.Vector2(1.26, 0.19),
      new THREE.Vector2(0.72, 0.05),
      new THREE.Vector2(0.0, 0.05),
    ];
    const saucerGeo = new THREE.LatheGeometry(saucerPoints, 64);
    const brassMat = new THREE.MeshPhysicalMaterial({
      color: 0xd9a04e,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.35,
    });
    const saucerMesh = new THREE.Mesh(saucerGeo, brassMat);
    saucerMesh.castShadow = true;
    saucerMesh.receiveShadow = true;
    chaiStageGroup.add(saucerMesh);

    // PART 2: Engraved Saucer Inner Rim Ring (Secondary Detail)
    const saucerRingGeo = new THREE.TorusGeometry(0.72, 0.022, 16, 64);
    const darkBronzeMat = new THREE.MeshStandardMaterial({
      color: 0x7c4d1e,
      metalness: 0.78,
      roughness: 0.48,
    });
    const saucerRingMesh = new THREE.Mesh(saucerRingGeo, darkBronzeMat);
    saucerRingMesh.rotation.x = Math.PI / 2;
    saucerRingMesh.position.y = 0.06;
    chaiStageGroup.add(saucerRingMesh);

    // PART 3: Heavy Octagonal Glass Foot Base (Secondary Read)
    const glassBaseGeo = new THREE.CylinderGeometry(0.66, 0.62, 0.22, 12);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff8ef,
      metalness: 0.0,
      roughness: 0.08,
      transmission: 0.92,
      ior: 1.52,
      thickness: 0.85,
      clearcoat: 1.0,
      transparent: true,
      depthWrite: false,
    });
    const glassBaseMesh = new THREE.Mesh(glassBaseGeo, glassMat);
    glassBaseMesh.position.y = 0.16;
    glassBaseMesh.renderOrder = 4;
    chaiStageGroup.add(glassBaseMesh);

    // PART 4: 12-Sided Fluted Cutting Chai Glass Vessel (Primary Silhouette)
    const cupHeight = 1.95;
    const cupGeo = new THREE.CylinderGeometry(0.86, 0.65, cupHeight, 12, 1, true);
    const cupMesh = new THREE.Mesh(cupGeo, glassMat);
    cupMesh.position.y = 0.26 + cupHeight / 2;
    cupMesh.renderOrder = 5;
    chaiStageGroup.add(cupMesh);

    // PART 5: Fire-Polished Glass Lip Rim Torus (Accent Detail)
    const lipGeo = new THREE.TorusGeometry(0.86, 0.032, 16, 48);
    const lipMesh = new THREE.Mesh(lipGeo, glassMat);
    lipMesh.rotation.x = Math.PI / 2;
    lipMesh.position.y = 0.26 + cupHeight;
    lipMesh.renderOrder = 6;
    chaiStageGroup.add(lipMesh);

    // PART 6: Artisanal Brass Tea Holder Ring & Handle (Secondary Read)
    const holderRingGeo = new THREE.TorusGeometry(0.75, 0.035, 16, 48);
    const holderRingMesh = new THREE.Mesh(holderRingGeo, brassMat);
    holderRingMesh.rotation.x = Math.PI / 2;
    holderRingMesh.position.y = 1.15;
    chaiStageGroup.add(holderRingMesh);

    // PART 7: Dynamic Rising Masala Chai Liquid Core
    const liquidMaxHeight = 1.66;
    const liquidGeo = new THREE.CylinderGeometry(0.81, 0.62, liquidMaxHeight, 32);
    // Shift geometry pivot to bottom so scale.y grows cleanly upward from cup floor
    liquidGeo.translate(0, liquidMaxHeight / 2, 0);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xb86228,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.65,
      emissive: 0x3b1605,
      emissiveIntensity: 0.35,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0.27;
    liquidMesh.renderOrder = 2;
    chaiStageGroup.add(liquidMesh);

    // PART 8: Frothy Malai Crema Top Surface Disc + Ripple Ring (Secondary Detail)
    const cremaGeo = new THREE.CylinderGeometry(0.79, 0.79, 0.05, 32);
    const cremaMat = new THREE.MeshStandardMaterial({
      map: cremaTex,
      roughness: 0.45,
      metalness: 0.0,
    });
    const cremaMesh = new THREE.Mesh(cremaGeo, cremaMat);
    cremaMesh.position.y = 0.27 + liquidMaxHeight * 0.12;
    cremaMesh.renderOrder = 3;
    chaiStageGroup.add(cremaMesh);

    // Splash Ripple Ring when biscuit dips
    const rippleGeo = new THREE.TorusGeometry(0.32, 0.018, 12, 48);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xfff0d8,
      transparent: true,
      opacity: 0,
    });
    const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat);
    rippleMesh.rotation.x = Math.PI / 2;
    rippleMesh.position.y = cremaMesh.position.y + 0.03;
    chaiStageGroup.add(rippleMesh);

    // PART 9: Overhead Copper Kettle Spout & Golden Pouring Stream (Act 2)
    const pourStreamGeo = new THREE.CylinderGeometry(0.055, 0.038, 3.6, 20);
    const pourStreamMat = new THREE.MeshPhysicalMaterial({
      color: 0xd47a39,
      roughness: 0.16,
      metalness: 0.05,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0,
    });
    const pourStreamMesh = new THREE.Mesh(pourStreamGeo, pourStreamMat);
    pourStreamMesh.position.set(0, 3.2, 0);
    chaiStageGroup.add(pourStreamMesh);

    // PART 10: Interactive Dipping Royal Osmania Biscuit (3-Layer Composite Sub-Group)
    const dipBiscuitGroup = new THREE.Group();
    const dipCookieBaseGeo = new THREE.CylinderGeometry(0.46, 0.44, 0.14, 32);
    const cookieCrumbMat = new THREE.MeshStandardMaterial({
      color: 0xd99b52,
      roughness: 0.78,
      metalness: 0.02,
    });
    const cookieCrustMat = new THREE.MeshStandardMaterial({
      color: 0x9e5e21,
      roughness: 0.52,
      metalness: 0.05,
    });
    const dipCookieBase = new THREE.Mesh(dipCookieBaseGeo, cookieCrumbMat);
    const dipCookieTopGeo = new THREE.CylinderGeometry(0.42, 0.45, 0.04, 32);
    const dipCookieTop = new THREE.Mesh(dipCookieTopGeo, cookieCrustMat);
    dipCookieTop.position.y = 0.08;
    dipBiscuitGroup.add(dipCookieBase, dipCookieTop);
    dipBiscuitGroup.rotation.z = 0.25;
    dipBiscuitGroup.rotation.x = 0.18;
    dipBiscuitGroup.position.set(0, 4.2, 0);
    chaiStageGroup.add(dipBiscuitGroup);

    // ========================================================================
    // 9. ACT 3: ORBITING 3D ARTISAN BISCUITS RING (Osmania, Khari, Nankhatai)
    // ========================================================================
    const biscuitOrbitGroup = new THREE.Group();
    biscuitOrbitGroup.position.y = 1.25;
    scene.add(biscuitOrbitGroup);

    // Orbit Item A: Osmania Biscuit
    const orbOsmania = new THREE.Group();
    const osmBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.4, 0.14, 32),
      cookieCrumbMat
    );
    const osmGlaze = new THREE.Mesh(
      new THREE.CylinderGeometry(0.37, 0.4, 0.03, 32),
      cookieCrustMat
    );
    osmGlaze.position.y = 0.08;
    orbOsmania.add(osmBody, osmGlaze);
    orbOsmania.position.set(-2.05, 0.15, 0.4);
    biscuitOrbitGroup.add(orbOsmania);

    // Orbit Item B: 64-Layer Flaky Butter Khari (Multi-layer stacked puff)
    const orbKhari = new THREE.Group();
    for (let l = 0; l < 4; l++) {
      const layerMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.78, 0.055, 0.42),
        l === 3 ? cookieCrustMat : cookieCrumbMat
      );
      layerMesh.position.y = l * 0.062 - 0.09;
      orbKhari.add(layerMesh);
    }
    orbKhari.position.set(2.05, -0.05, 0.35);
    biscuitOrbitGroup.add(orbKhari);

    // Orbit Item C: Pistachio Nankhatai Dome
    const orbNankhatai = new THREE.Group();
    const nanBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.62),
      new THREE.MeshStandardMaterial({
        color: 0xeed09d,
        roughness: 0.74,
        metalness: 0.02,
      })
    );
    const pistaCrown = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.11, 0),
      new THREE.MeshStandardMaterial({
        color: 0x739e48,
        roughness: 0.55,
      })
    );
    pistaCrown.position.y = 0.35;
    orbNankhatai.add(nanBody, pistaCrown);
    orbNankhatai.position.set(0, -0.32, 2.05);
    biscuitOrbitGroup.add(orbNankhatai);

    // ========================================================================
    // 10. INSTANCED MESH FOR 36 RISING STEAM & CARDAMOM AROMA PARTICLES
    // ========================================================================
    const steamCount = 36;
    const steamGeo = new THREE.IcosahedronGeometry(0.065, 1);
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xfff2e2,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    });
    const steamInstanced = new THREE.InstancedMesh(
      steamGeo,
      steamMat,
      steamCount
    );
    steamInstanced.frustumCulled = false;
    scene.add(steamInstanced);

    const steamParticles = Array.from({ length: steamCount }, (_, i) => ({
      angle: (i / steamCount) * Math.PI * 2,
      radius: 0.12 + (i % 5) * 0.1,
      yOffset: (i / steamCount) * 2.2,
      speed: 0.35 + (i % 4) * 0.1,
      scale: 0.6 + (i % 3) * 0.45,
    }));

    // Pre-compile shaders once
    renderer.compile(scene, camera);

    // Pointer tilt tracking
    let targetPointerX = 0;
    let targetPointerY = 0;
    const onPointerMove = (e: MouseEvent) => {
      targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onPointerMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ========================================================================
    // 11. 60FPS DAMPED ANIMATION LOOP (ZERO ALLOCATIONS)
    // ========================================================================
    const clock = new THREE.Clock();
    let animFrameId: number;
    let currentLiquidRatio = 0.12;
    let currentPourAlpha = 0;
    let currentDipY = 4.2;
    let currentOrbitScale = 0.001;
    let ripplePhase = 0;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const s = scrollRefValue.current; // 0.0 -> 1.0 across the 420vh sticky stage

      // Apply Finish Swatch Preset smoothly
      if (finishRef.current === "heritage-brass") {
        brassMat.color.setHex(0xd9a04e);
        brassMat.roughness = 0.22;
      } else if (finishRef.current === "aged-copper") {
        brassMat.color.setHex(0xc86d51);
        brassMat.roughness = 0.32;
      } else {
        brassMat.color.setHex(0x9ca3af);
        brassMat.roughness = 0.18;
      }

      // 1. Liquid Fill Level (10% -> 86% during Act 2: scroll 0.18 -> 0.55)
      const targetFill = THREE.MathUtils.clamp(
        THREE.MathUtils.mapLinear(s, 0.18, 0.55, 0.12, 0.86),
        0.12,
        0.86
      );
      currentLiquidRatio = THREE.MathUtils.damp(
        currentLiquidRatio,
        targetFill,
        6,
        dt
      );
      liquidMesh.scale.y = currentLiquidRatio;

      // Update crema top disc position & gentle swirl
      const topSurfaceY = 0.27 + liquidMaxHeight * currentLiquidRatio;
      cremaMesh.position.y = topSurfaceY;
      cremaMesh.rotation.y = elapsed * 0.35;
      const topRadiusScale = THREE.MathUtils.lerp(
        0.78,
        1.0,
        currentLiquidRatio
      );
      cremaMesh.scale.set(topRadiusScale, 1, topRadiusScale);

      // 2. Pour Stream Visibility (Act 2: scroll 0.17 -> 0.52)
      const isPouring = s > 0.17 && s < 0.52 ? 0.92 : 0.0;
      currentPourAlpha = THREE.MathUtils.damp(
        currentPourAlpha,
        isPouring,
        8,
        dt
      );
      pourStreamMat.opacity = currentPourAlpha;
      pourStreamMesh.visible = currentPourAlpha > 0.01;
      pourStreamMesh.scale.x = 1 + Math.sin(elapsed * 28) * 0.08;
      pourStreamMesh.scale.z = 1 + Math.cos(elapsed * 28) * 0.08;

      // 3. Interactive Dipping Biscuit Physics + Splash Ripple
      const targetDipY = dipStateRef.current ? topSurfaceY + 0.12 : 4.2;
      currentDipY = THREE.MathUtils.damp(currentDipY, targetDipY, 7, dt);
      dipBiscuitGroup.position.y = currentDipY;
      dipBiscuitGroup.rotation.y = elapsed * 0.5;
      dipBiscuitGroup.visible = currentDipY < 3.9;

      if (dipStateRef.current && Math.abs(currentDipY - (topSurfaceY + 0.12)) < 0.35) {
        ripplePhase = (ripplePhase + dt * 1.8) % 1;
        rippleMesh.position.y = topSurfaceY + 0.03;
        const rScale = 0.3 + ripplePhase * 1.4;
        rippleMesh.scale.set(rScale, rScale, 1);
        rippleMat.opacity = (1 - ripplePhase) * 0.75;
      } else {
        rippleMat.opacity = THREE.MathUtils.damp(rippleMat.opacity, 0, 8, dt);
      }

      // 4. Rising Steam & Aroma Particles (Act 2 & 3: scroll > 0.38)
      const steamTargetOpacity = s > 0.36 ? 0.28 : 0.04;
      steamMat.opacity = THREE.MathUtils.damp(
        steamMat.opacity,
        steamTargetOpacity,
        4,
        dt
      );
      for (let i = 0; i < steamCount; i++) {
        const p = steamParticles[i];
        const yCycle = (p.yOffset + elapsed * p.speed) % 2.2;
        const py = topSurfaceY + 0.1 + yCycle;
        const spread = p.radius + yCycle * 0.18;
        const px = Math.cos(p.angle + elapsed * 0.7) * spread;
        const pz = Math.sin(p.angle + elapsed * 0.7) * spread;
        const sFactor =
          p.scale * Math.sin((yCycle / 2.2) * Math.PI) * (s > 0.35 ? 1 : 0.2);

        _scratchPosition.set(px, py, pz);
        _scratchEuler.set(elapsed * 0.4, elapsed * 0.6, 0);
        _scratchQuaternion.setFromEuler(_scratchEuler);
        _scratchScale.setScalar(Math.max(0.001, sFactor));
        _scratchMatrix.compose(
          _scratchPosition,
          _scratchQuaternion,
          _scratchScale
        );
        steamInstanced.setMatrixAt(i, _scratchMatrix);
      }
      steamInstanced.instanceMatrix.needsUpdate = true;

      // 5. Act 3: Orbiting Bakery Biscuits (scroll 0.56 -> 1.0)
      const targetOrbit = s > 0.55 ? 1.0 : 0.001;
      currentOrbitScale = THREE.MathUtils.damp(
        currentOrbitScale,
        targetOrbit,
        5,
        dt
      );
      biscuitOrbitGroup.scale.setScalar(currentOrbitScale);
      biscuitOrbitGroup.visible = currentOrbitScale > 0.02;
      biscuitOrbitGroup.rotation.y = elapsed * 0.38 + s * Math.PI;

      orbOsmania.rotation.x = Math.sin(elapsed * 1.4) * 0.25;
      orbOsmania.rotation.z = Math.cos(elapsed * 1.2) * 0.2;
      orbKhari.rotation.y = elapsed * 0.8;
      orbKhari.rotation.z = Math.sin(elapsed * 1.5) * 0.2;
      orbNankhatai.rotation.x = Math.cos(elapsed * 1.3) * 0.25;

      // 6. Camera Choreography with Exponential Damping
      let camX = targetPointerX * 0.55;
      let camY = 2.0 - targetPointerY * 0.35;
      let camZ = 6.2;

      if (cameraModeRef.current === "top-crema") {
        camX = 0.2;
        camY = 4.6;
        camZ = 2.4;
      } else if (cameraModeRef.current === "side-pour") {
        camX = 2.6;
        camY = 1.65;
        camZ = 4.2;
      } else {
        // Scroll-driven choreography
        if (s < 0.25) {
          camY = 2.1;
          camZ = 6.6;
        } else if (s < 0.58) {
          camY = 2.35;
          camZ = 5.3;
        } else {
          camY = 2.55;
          camZ = 5.95;
        }
      }

      _scratchVec3.set(camX, camY, camZ);
      camera.position.lerp(_scratchVec3, 1 - Math.exp(-5 * dt));
      _scratchLookAt.set(0, 1.15, 0);
      camera.lookAt(_scratchLookAt);

      // Gentle cup stage breathing rotation
      chaiStageGroup.rotation.y = THREE.MathUtils.damp(
        chaiStageGroup.rotation.y,
        targetPointerX * 0.3 + s * 0.65,
        4,
        dt
      );

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", onResize);
      envTexture.dispose();
      tableTex.dispose();
      cremaTex.dispose();
      shadowTex.dispose();
      renderer.dispose();
    };
  }, [scrollRefValue]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function MonsoonChaiScrollytellingApp() {
  // Interactive States
  const [wipePercent, setWipePercent] = useState(0);
  const [fogResetCount, setFogResetCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<{ [id: string]: number }>({
    "item-1": 1,
    "item-3": 1,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isBiscuitDipped, setIsBiscuitDipped] = useState(false);

  // 3D Viewport Collapsible Bottom Control Dock State
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [finishPreset, setFinishPreset] = useState<
    "heritage-brass" | "aged-copper" | "smoked-glass"
  >("heritage-brass");
  const [cameraPreset, setCameraPreset] = useState<
    "scroll-auto" | "top-crema" | "side-pour"
  >("scroll-auto");

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    guests: "2 Guests · Rainy Window Booth",
    time: "05:30 PM · Evening Monsoon Pour",
    name: "",
    phone: "",
    notes: "Window corner with warm Osmania biscuit tin",
  });

  // Scroll Choreography Ref (420vh sticky 3D stage)
  const scrollStageRef = useRef<HTMLDivElement | null>(null);
  const scrollNumericRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: scrollStageRef,
    offset: ["start start", "end end"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 22,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothScroll, "change", (latest) => {
    scrollNumericRef.current = latest;
  });

  // --- ACT 1: Rainy Fogged Window Fade & Scale Open (0% -> 25% Scroll) ---
  const windowOpacity = useTransform(
    smoothScroll,
    [0, 0.18, 0.25],
    [1, 0.7, 0]
  );
  const windowScale = useTransform(smoothScroll, [0, 0.25], [1, 1.15]);
  const heroTitleY = useTransform(smoothScroll, [0, 0.22], [0, -75]);
  const heroTitleOpacity = useTransform(smoothScroll, [0, 0.19], [1, 0]);

  // --- ACT 2: Pour & Rising Aroma Callouts (25% -> 60% Scroll) ---
  const act2HeadingOpacity = useTransform(
    smoothScroll,
    [0.22, 0.28, 0.52, 0.58],
    [0, 1, 1, 0]
  );
  const aromaNotesOpacity = useTransform(
    smoothScroll,
    [0.36, 0.45, 0.56, 0.62],
    [0, 1, 1, 0]
  );
  const aromaNotesY = useTransform(smoothScroll, [0.36, 0.62], [28, -24]);

  // --- ACT 3: Biscuit Orbit & Dipping Ritual (60% -> 90% Scroll) ---
  const act3HeadingOpacity = useTransform(
    smoothScroll,
    [0.58, 0.64, 0.92, 0.98],
    [0, 1, 1, 0]
  );
  const biscuitCardsOpacity = useTransform(
    smoothScroll,
    [0.6, 0.68, 0.92, 0.98],
    [0, 1, 1, 0]
  );

  // Cart Helpers
  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const newQty = (next[id] || 0) + delta;
      if (newQty <= 0) delete next[id];
      else next[id] = newQty;
      return next;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = RESTAURANT_DATA.menu.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleWhatsAppCheckout = () => {
    const lines = Object.entries(cart).map(([id, qty]) => {
      const item = RESTAURANT_DATA.menu.find((m) => m.id === id);
      return item ? `• ${qty}x ${item.name} (₹${item.price * qty})` : "";
    });
    const text = encodeURIComponent(
      `*New Monsoon Order — ${RESTAURANT_DATA.name}*\n\n${lines.join(
        "\n"
      )}\n\n*Total Payable: ₹${totalPrice}*\nPlease confirm my fresh chai & oven-warm biscuits order.`
    );
    window.open(
      `https://wa.me/${RESTAURANT_DATA.contact.whatsappNumber}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const filteredMenu =
    selectedCategory === "All"
      ? RESTAURANT_DATA.menu
      : RESTAURANT_DATA.menu.filter(
          (item) => item.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-[#120D0A] text-[#F7EFE4] font-sans">
      {/* =====================================================================
          STRICT 3-ZONE TOP BAR CONTRACT
          Zone 1: Single-line Brand Wordmark
          Zone 2: 4 Single-line Text Navigation Links
          Zone 3: 1 Primary Action Button
      ===================================================================== */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#F7EFE4]/10 bg-[#120D0A]/90 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#scrolly-stage"
            className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#F7EFE4] whitespace-nowrap shrink-0"
          >
            {RESTAURANT_DATA.name}
          </a>

          {/* Zone 2: 4 Clean Single-Line Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#F7EFE4]/75">
            <a
              href="#scrolly-stage"
              className="hover:text-[#F7EFE4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Monsoon Ritual
            </a>
            <a
              href="#menu-section"
              className="hover:text-[#F7EFE4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Tasting Menu
            </a>
            <a
              href="#reviews-section"
              className="hover:text-[#F7EFE4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Guest Notes
            </a>
            <a
              href="#location-section"
              className="hover:text-[#F7EFE4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Window Booths
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#C86D2D] hover:bg-[#B25C20] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Reserve Window Seat
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          420VH STICKY 3D SCROLLYTELLING STAGE
          Act 1 (0-25%): Rainy Fogged Window
          Act 2 (25-60%): 3D Cutting Chai Pour & Rising Aroma
          Act 3 (60-90%): Biscuit Orbit & Dipping Ritual
      ===================================================================== */}
      <section
        id="scrolly-stage"
        ref={scrollStageRef}
        className="relative h-[420vh] w-full"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-between pt-20 pb-6">
          {/* FULL-BLEED THREE.JS STUDIO PBR 3D VIEWPORT */}
          <ThreeChaiStage
            scrollRefValue={scrollNumericRef}
            isBiscuitDipped={isBiscuitDipped}
            finishPreset={finishPreset}
            cameraPreset={cameraPreset}
          />

          {/* -----------------------------------------------------------------
              ACT 1 OVERLAY: RAINY FOGGED WINDOW (0% – 25% SCROLL)
          ----------------------------------------------------------------- */}
          <motion.div
            style={{ opacity: windowOpacity, scale: windowScale }}
            className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center"
          >
            <FoggyRainWindow
              onWipeProgress={setWipePercent}
              resetTrigger={fogResetCount}
            />

            <motion.div
              style={{ y: heroTitleY, opacity: heroTitleOpacity }}
              className="relative z-30 max-w-3xl mx-auto pointer-events-auto"
            >
              {/* Unboxed Editorial Metadata with Typographic Separators */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-[#E6C594] mb-4">
                <span>{RESTAURANT_DATA.craftOrigin}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  Window Condensation Cleared: {wipePercent}%
                </span>
              </div>

              <h1
                className="font-serif font-semibold tracking-tight text-[#F7EFE4] drop-shadow-[0_8px_28px_rgba(0,0,0,0.9)] leading-[1.08]"
                style={{
                  fontSize: "clamp(2.25rem, 4.2vw, 3.75rem)",
                  textWrap: "balance",
                }}
              >
                {RESTAURANT_DATA.tagline}
              </h1>

              <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg text-[#F7EFE4]/85 leading-relaxed drop-shadow">
                {RESTAURANT_DATA.subTagline}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#menu-section"
                  className="px-6 py-3 rounded-lg bg-[#C86D2D] hover:bg-[#B25C20] text-sm font-semibold text-white shadow-xl transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Monsoon Menu
                </a>
                <button
                  onClick={() => setFogResetCount((c) => c + 1)}
                  className="px-5 py-3 rounded-lg border border-[#F7EFE4]/25 bg-[#120D0A]/80 hover:bg-[#1E1510] text-sm font-medium text-[#F7EFE4] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-4 w-4 text-[#E6C594]" />
                  <span>Re-Fog Window</span>
                </button>
              </div>
            </motion.div>

            {/* Floating Indicator required by Act 1 */}
            <div className="absolute bottom-24 z-30 flex flex-col items-center gap-1.5 text-xs text-[#F7EFE4]/80">
              <span>Wipe the glass or scroll to step inside</span>
              <ArrowDown className="h-4 w-4 text-[#C86D2D]" />
            </div>
          </motion.div>

          {/* -----------------------------------------------------------------
              ACT 2 & ACT 3 TOP NARRATIVE HEADER (NON-OBSTRUCTIVE TOP-CENTER)
          ----------------------------------------------------------------- */}
          <div className="relative z-20 w-full max-w-3xl mx-auto px-6 text-center pointer-events-none mt-2">
            {/* Act 2 Header (25% – 60% Scroll) */}
            <motion.div
              style={{ opacity: act2HeadingOpacity }}
              className="inset-x-0"
            >
              <div className="text-xs text-[#E6C594] mb-1">
                <span>02. The High-Pour Kettle Ritual</span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span>12-Flute Glass Vessel</span>
              </div>
              <h2
                className="font-serif text-2xl sm:text-4xl font-semibold text-[#F7EFE4]"
                style={{ textWrap: "balance" }}
              >
                Aerated from a Foot High for Velvety Malai Crema
              </h2>
            </motion.div>

            {/* Act 3 Header (60% – 90% Scroll) */}
            <motion.div
              style={{ opacity: act3HeadingOpacity }}
              className="absolute inset-x-0 top-0"
            >
              <div className="text-xs text-[#E6C594] mb-1">
                <span>03. The Bakery Accompaniments</span>
                <span className="mx-2" aria-hidden="true">
                  ·
                </span>
                <span>Fresh From Stone Deck Ovens</span>
              </div>
              <h2
                className="font-serif text-2xl sm:text-4xl font-semibold text-[#F7EFE4]"
                style={{ textWrap: "balance" }}
              >
                Warm Osmania Shortbread, 64-Layer Khari & Pistachio Nankhatai
              </h2>
            </motion.div>
          </div>

          {/* -----------------------------------------------------------------
              ACT 2 FLOATING AROMA & SPICE CALLOUTS (3D PARALLAX DEPTH)
          ----------------------------------------------------------------- */}
          <motion.div
            style={{ opacity: aromaNotesOpacity, y: aromaNotesY }}
            className="pointer-events-none absolute inset-0 z-20 hidden lg:flex items-center justify-center"
          >
            {RESTAURANT_DATA.aromaNotes.map((note, idx) => (
              <div
                key={idx}
                style={{
                  transform: `translate3d(${note.xOffset}px, ${note.yOffset}px, 0px)`,
                }}
                className="absolute w-60 rounded-xl border border-[#F7EFE4]/12 bg-[#16100C]/90 px-4 py-3 shadow-xl"
              >
                <p className="font-serif text-base font-semibold text-[#F7EFE4]">
                  {note.title}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-[#F7EFE4]/70">
                  <span>{note.origin}</span>
                </div>
                <p className="mt-1 font-mono text-[11px] text-[#E6C594] tabular-nums">
                  {note.temp}
                </p>
              </div>
            ))}
          </motion.div>

          {/* -----------------------------------------------------------------
              ACT 3 ORBIT PAIRING QUICK-ADD BAR (ABOVE DOCK)
          ----------------------------------------------------------------- */}
          <motion.div
            style={{ opacity: biscuitCardsOpacity }}
            className="relative z-20 mx-auto max-w-3xl px-4 pointer-events-auto mb-14"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RESTAURANT_DATA.orbitBiscuits.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-[#F7EFE4]/12 bg-[#17110D]/95 p-3.5 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-serif text-base font-semibold text-[#F7EFE4]">
                        {b.name}
                      </p>
                      <span className="font-mono text-xs text-[#E6C594] tabular-nums">
                        ₹{b.price}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#F7EFE4]/70">
                      {b.pairingNote}
                    </p>
                  </div>
                  <button
                    onClick={() => updateQty(b.menuId, 1)}
                    className="mt-3 w-full py-1.5 px-3 rounded-md bg-[#251A13] hover:bg-[#C86D2D] text-xs font-medium text-[#F7EFE4] hover:text-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add to Tray</span>
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* -----------------------------------------------------------------
              UNIFIED COLLAPSIBLE BOTTOM CONTROL DOCK (THREE.JS HUD DIRECTIVE)
              Solid rgba surface (zero backdrop-filter over WebGL)
          ----------------------------------------------------------------- */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(920px,94vw)] pointer-events-auto">
            <div className="flex justify-center mb-1.5">
              <button
                onClick={() => setIsDockCollapsed((prev) => !prev)}
                className="flex items-center gap-1.5 rounded-t-lg border border-b-0 border-[#F7EFE4]/15 bg-[#17110D] px-3.5 py-1 text-xs font-medium text-[#F7EFE4]/80 hover:text-[#F7EFE4] transition-colors whitespace-nowrap shrink-0"
              >
                {isDockCollapsed ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5 text-[#C86D2D]" />
                    <span>Show Ritual Controls</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5 text-[#C86D2D]" />
                    <span>Hide Controls</span>
                  </>
                )}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {!isDockCollapsed && (
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-xl border border-[#F7EFE4]/15 bg-[#17110D] px-4 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3"
                >
                  {/* Interactive Dip Biscuit Micro-Interaction Button (Required by Act 3) */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsBiscuitDipped((prev) => !prev)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
                        isBiscuitDipped
                          ? "bg-[#E6C594] text-[#120D0A]"
                          : "bg-[#C86D2D] hover:bg-[#B25C20] text-white"
                      }`}
                    >
                      <Cookie className="h-4 w-4" />
                      <span>
                        {isBiscuitDipped
                          ? "Lift Biscuit from Chai"
                          : "Dip Biscuit in Chai"}
                      </span>
                    </button>
                  </div>

                  {/* Camera Angle Presets */}
                  <div className="hidden sm:flex items-center gap-1 rounded-lg bg-[#120D0A] p-1 border border-[#F7EFE4]/10">
                    {(
                      [
                        { id: "scroll-auto", label: "Scroll Orbit" },
                        { id: "side-pour", label: "Glass Profile" },
                        { id: "top-crema", label: "Crema Top" },
                      ] as const
                    ).map((cam) => (
                      <button
                        key={cam.id}
                        onClick={() => setCameraPreset(cam.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          cameraPreset === cam.id
                            ? "bg-[#2A1D15] text-[#F7EFE4]"
                            : "text-[#F7EFE4]/60 hover:text-[#F7EFE4]"
                        }`}
                      >
                        {cam.label}
                      </button>
                    ))}
                  </div>

                  {/* Vessel Finish Swatches */}
                  <div className="hidden md:flex items-center gap-1 rounded-lg bg-[#120D0A] p-1 border border-[#F7EFE4]/10">
                    {(
                      [
                        { id: "heritage-brass", label: "Brass" },
                        { id: "aged-copper", label: "Copper" },
                        { id: "smoked-glass", label: "Pewter" },
                      ] as const
                    ).map((fin) => (
                      <button
                        key={fin.id}
                        onClick={() => setFinishPreset(fin.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          finishPreset === fin.id
                            ? "bg-[#2A1D15] text-[#E6C594]"
                            : "text-[#F7EFE4]/60 hover:text-[#F7EFE4]"
                        }`}
                      >
                        {fin.label}
                      </button>
                    ))}
                  </div>

                  {/* Live Chai Tray Drawer Trigger */}
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="px-4 py-2 rounded-lg border border-[#F7EFE4]/20 bg-[#221812] hover:bg-[#2C1F17] text-xs font-semibold text-[#F7EFE4] transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 font-mono tabular-nums"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-[#E6C594]" />
                    <span>
                      Chai Tray ({totalItems}) · ₹{totalPrice}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =====================================================================
          ACT 4: THE WARM CAFE MENU, LIVE CART & TABLE BOOKING (90% – 100%)
      ===================================================================== */}
      <section
        id="menu-section"
        className="relative z-20 mx-auto max-w-7xl px-6 py-24 border-t border-[#F7EFE4]/10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#F7EFE4]/10">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#E6C594]">
              <span>04. The Monsoon Storefront</span>
              <span aria-hidden="true">·</span>
              <span>Small-Batch Handi Brews & Deck Oven Pastries</span>
            </div>
            <h2
              className="font-serif text-3xl sm:text-5xl font-semibold text-[#F7EFE4] mt-2"
              style={{ textWrap: "balance" }}
            >
              Simmered Slow, Baked Every Hour
            </h2>
          </div>

          {/* Interactive Category Filter Segmented Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#1A130E] border border-[#F7EFE4]/10">
            {RESTAURANT_DATA.categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? "bg-[#C86D2D] text-white shadow-sm"
                      : "text-[#F7EFE4]/70 hover:text-[#F7EFE4]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3-Column Uniform Menu Grid */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredMenu.map((item) => {
              const inCartQty = cart[item.id] || 0;
              return (
                <motion.article
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#F7EFE4]/10 bg-[#18110D] hover:-translate-y-0.5 transition-transform duration-200"
                >
                  <div>
                    {/* Studio Culinary SVG Artwork (Zero Broken Images) */}
                    <ProceduralMenuArtwork
                      artType={item.artType}
                      title={item.name}
                    />

                    <div className="p-6">
                      {/* Clean Unboxed Metadata Line */}
                      <div className="flex items-center justify-between gap-2 text-xs text-[#E6C594]">
                        <span>{item.kicker}</span>
                        <span className="font-mono tabular-nums text-[#F7EFE4]/60">
                          {item.prepTime}
                        </span>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between gap-4">
                        <h3 className="font-serif text-xl font-semibold text-[#F7EFE4]">
                          {item.name}
                        </h3>
                        <span className="font-mono text-base font-semibold text-[#F7EFE4] tabular-nums shrink-0">
                          {item.currency}
                          {item.price}
                        </span>
                      </div>

                      <p className="mt-2.5 text-sm text-[#F7EFE4]/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    {inCartQty > 0 ? (
                      <div className="flex w-full items-center justify-between rounded-lg border border-[#C86D2D]/50 bg-[#231812] px-3 py-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#160F0B] text-[#F7EFE4] hover:bg-[#2F2018] transition-colors"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono text-xs sm:text-sm font-semibold text-[#F7EFE4] tabular-nums">
                          {inCartQty} in Chai Tray
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#C86D2D] text-white hover:bg-[#B25C20] transition-colors"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#F7EFE4]/15 bg-[#211711] hover:bg-[#C86D2D] hover:border-[#C86D2D] py-2.5 px-4 text-sm font-medium text-[#F7EFE4] hover:text-white transition-colors whitespace-nowrap shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add to Tray</span>
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* =====================================================================
          ATTRIBUTABLE GUEST NOTES & QUANTITATIVE PROOF SECTION
      ===================================================================== */}
      <section
        id="reviews-section"
        className="mx-auto max-w-7xl px-6 py-20 border-t border-[#F7EFE4]/10"
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-[#E6C594]">
            <span>05. Verified Guest Ledger</span>
            <span aria-hidden="true">·</span>
            <span>4,800+ Copper Kettles Poured Monthly</span>
          </div>
          <h2
            className="font-serif text-3xl sm:text-4xl font-semibold text-[#F7EFE4] mt-2"
            style={{ textWrap: "balance" }}
          >
            Notes from the Rain-Streaked Window Booths
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {RESTAURANT_DATA.testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#F7EFE4]/10 bg-[#18110D] p-7 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-mono text-[#E6C594] tabular-nums mb-3">
                  {t.outcome}
                </p>
                <p className="text-sm sm:text-base text-[#F7EFE4]/85 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F7EFE4]/10">
                <p className="font-serif text-lg font-semibold text-[#F7EFE4]">
                  {t.name}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#F7EFE4]/65 mt-0.5">
                  <span>{t.role}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.organization}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          WINDOW SEAT CONCIERGE & FLAGSHIP LOCATION
      ===================================================================== */}
      <section
        id="location-section"
        className="mx-auto max-w-7xl px-6 pt-16 pb-32 border-t border-[#F7EFE4]/10"
      >
        <div className="rounded-2xl border border-[#F7EFE4]/12 bg-[#18110D] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#E6C594]">
                <span>06. Visit the Flagship</span>
                <span aria-hidden="true">·</span>
                <span>Valet & Covered Monsoon Verandah</span>
              </div>
              <h2
                className="font-serif text-3xl sm:text-5xl font-semibold text-[#F7EFE4] mt-3"
                style={{ textWrap: "balance" }}
              >
                Step Out of the Downpour, Into {RESTAURANT_DATA.name}
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#F7EFE4]/75 leading-relaxed">
                Whether you are dropping by for a quick cutting chai at the brass counter or reserving a teakwood window booth for a rainy evening conversation, our copper samovars stay simmering all night.
              </p>

              <div className="mt-8 space-y-4 text-sm text-[#F7EFE4]/85">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#C86D2D] shrink-0 mt-1" />
                  <span>{RESTAURANT_DATA.contact.address}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[#C86D2D] shrink-0 mt-1" />
                  <span className="font-mono tabular-nums">
                    {RESTAURANT_DATA.contact.phone}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-[#C86D2D] shrink-0 mt-1" />
                  <div className="space-y-1 font-mono text-xs sm:text-sm tabular-nums">
                    {RESTAURANT_DATA.hours.map((h, i) => (
                      <p key={i}>
                        <span className="font-sans font-medium text-[#E6C594]">
                          {h.days}:
                        </span>{" "}
                        {h.time}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F7EFE4]/10 flex flex-wrap gap-4">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-3 rounded-lg bg-[#C86D2D] hover:bg-[#B25C20] text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0"
              >
                Reserve a Window Booth
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-6 py-3 rounded-lg border border-[#F7EFE4]/20 hover:bg-[#241913] text-sm font-medium text-[#F7EFE4] transition-colors whitespace-nowrap shrink-0"
              >
                Open Chai Tray ({totalItems})
              </button>
            </div>
          </div>

          {/* Architectural Floorplan & Window Booth Preview SVG */}
          <div className="relative rounded-xl overflow-hidden border border-[#F7EFE4]/10 bg-[#120D0A] p-6 flex flex-col justify-between min-h-[320px]">
            <div className="flex items-center justify-between text-xs text-[#E6C594]">
              <span>Monsoon Verandah Floorplan</span>
              <span className="font-mono tabular-nums">6 Rain-Facing Booths</span>
            </div>

            <svg viewBox="0 0 400 220" className="w-full h-48 my-4">
              {/* Rainy Window Glass Wall */}
              <line
                x1="20"
                y1="24"
                x2="380"
                y2="24"
                stroke="#C86D2D"
                strokeWidth="3"
              />
              <text
                x="200"
                y="15"
                textAnchor="middle"
                fill="#E6C594"
                fontSize="10"
              >
                RAIN-STREAKED BRASS MULLION WINDOW WALL
              </text>

              {/* 3 Window Booths */}
              {[
                { x: 40, label: "Booth 01 (2P)" },
                { x: 160, label: "Booth 02 (4P)" },
                { x: 280, label: "Booth 03 (4P)" },
              ].map((b, idx) => (
                <g key={idx} transform={`translate(${b.x}, 42)`}>
                  <rect
                    x="0"
                    y="0"
                    width="80"
                    height="56"
                    rx="8"
                    fill="#1E1510"
                    stroke="rgba(247,239,228,0.22)"
                    strokeWidth="1.5"
                  />
                  <circle cx="40" cy="28" r="14" fill="#C86D2D" opacity="0.35" />
                  <circle cx="40" cy="28" r="5" fill="#E6C594" />
                  <text
                    x="40"
                    y="72"
                    textAnchor="middle"
                    fill="#F7EFE4"
                    fontSize="10"
                  >
                    {b.label}
                  </text>
                </g>
              ))}

              {/* Copper Samovar Counter */}
              <rect
                x="70"
                y="145"
                width="260"
                height="48"
                rx="10"
                fill="#241811"
                stroke="rgba(230,197,148,0.35)"
                strokeWidth="1.5"
              />
              <text
                x="200"
                y="173"
                textAnchor="middle"
                fill="#E6C594"
                fontSize="11"
              >
                LIVE COPPER HANDI CHAI BAR & STONE DECK OVEN
              </text>
            </svg>

            <div className="flex items-center justify-between text-xs text-[#F7EFE4]/70 border-t border-[#F7EFE4]/10 pt-3">
              <span>Fresh Osmania Batch Interval: Every 45 mins</span>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="text-[#E6C594] hover:underline font-medium"
              >
                Select Booth →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#F7EFE4]/10 py-10 px-6 text-xs text-[#F7EFE4]/60">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {RESTAURANT_DATA.name}. Crafted for rainy evenings.
          </p>
          <div className="flex items-center gap-6">
            <a href="#scrolly-stage" className="hover:text-[#F7EFE4]">
              Top of Window
            </a>
            <a href="#menu-section" className="hover:text-[#F7EFE4]">
              Menu
            </a>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="hover:text-[#F7EFE4]"
            >
              Reservations
            </button>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          SLIDE-OUT CHAI TRAY (CART DRAWER + 1-CLICK WHATSAPP CHECKOUT)
      ===================================================================== */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50 bg-black/75"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-[#F7EFE4]/15 bg-[#16100C] p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#F7EFE4]/10 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-[#F7EFE4]">
                      Your Chai Tray
                    </h3>
                    <p className="text-xs text-[#F7EFE4]/65">
                      Prepared fresh on order · Direct WhatsApp kitchen ticket
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    aria-label="Close Chai Tray"
                    className="rounded-lg p-2 text-[#F7EFE4]/70 hover:bg-[#241913]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {Object.keys(cart).length === 0 ? (
                  <div className="py-16 text-center">
                    <UtensilsCrossed className="h-8 w-8 text-[#E6C594]/50 mx-auto mb-3" />
                    <p className="text-sm text-[#F7EFE4]/70">
                      Your brass tray is currently empty.
                    </p>
                    <button
                      onClick={() => {
                        updateQty("item-1", 1);
                        updateQty("item-3", 1);
                      }}
                      className="mt-4 px-4 py-2 rounded-lg bg-[#241913] hover:bg-[#C86D2D] text-xs font-medium text-[#F7EFE4] transition-colors"
                    >
                      Add Classic Irani Chai + Osmania Pairing (₹280)
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3 max-h-[58vh] overflow-y-auto pr-1">
                    {Object.entries(cart).map(([id, qty]) => {
                      const item = RESTAURANT_DATA.menu.find(
                        (m) => m.id === id
                      );
                      if (!item) return null;
                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between rounded-xl border border-[#F7EFE4]/10 bg-[#1E1510] p-3.5"
                        >
                          <div className="pr-3">
                            <p className="font-serif text-base font-semibold text-[#F7EFE4]">
                              {item.name}
                            </p>
                            <p className="font-mono text-xs text-[#E6C594] tabular-nums mt-0.5">
                              ₹{item.price} × {qty} = ₹{item.price * qty}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateQty(id, -1)}
                              className="h-7 w-7 rounded-md bg-[#120D0A] flex items-center justify-center text-[#F7EFE4] hover:bg-[#2C1F17]"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="font-mono text-sm font-semibold w-5 text-center tabular-nums">
                              {qty}
                            </span>
                            <button
                              onClick={() => updateQty(id, 1)}
                              className="h-7 w-7 rounded-md bg-[#C86D2D] flex items-center justify-center text-white hover:bg-[#B25C20]"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {Object.keys(cart).length > 0 && (
                <div className="border-t border-[#F7EFE4]/15 pt-4">
                  <div className="flex items-center justify-between text-xs text-[#F7EFE4]/70 mb-1">
                    <span>Complimentary Brass Saucer Service</span>
                    <span className="font-mono tabular-nums">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold text-[#F7EFE4] mb-4">
                    <span>Total Payable</span>
                    <span className="font-mono tabular-nums">
                      ₹{totalPrice}
                    </span>
                  </div>
                  <button
                    onClick={handleWhatsAppCheckout}
                    className="w-full rounded-lg bg-[#C86D2D] hover:bg-[#B25C20] py-3.5 px-4 text-sm font-semibold text-white shadow-lg transition-colors"
                  >
                    1-Click WhatsApp Order Checkout
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* =====================================================================
          RESERVE A WINDOW SEAT MODAL
      ===================================================================== */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-md rounded-2xl border border-[#F7EFE4]/15 bg-[#18110D] p-7 shadow-2xl"
            >
              <button
                onClick={() => {
                  setIsBookingOpen(false);
                  setBookingConfirmed(false);
                }}
                aria-label="Close Reservation Modal"
                className="absolute right-5 top-5 rounded-lg p-2 text-[#F7EFE4]/70 hover:bg-[#241913]"
              >
                <X className="h-5 w-5" />
              </button>

              {bookingConfirmed ? (
                <div className="py-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mb-4">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#F7EFE4]">
                    Window Booth Reserved
                  </h3>
                  <p className="mt-2 text-sm text-[#F7EFE4]/75 leading-relaxed">
                    We have reserved{" "}
                    <strong className="text-[#F7EFE4]">
                      {bookingForm.guests}
                    </strong>{" "}
                    for{" "}
                    <strong className="text-[#E6C594]">
                      {bookingForm.name || "Guest"}
                    </strong>{" "}
                    at{" "}
                    <strong className="font-mono text-[#F7EFE4]">
                      {bookingForm.time}
                    </strong>
                    . A fresh copper kettle and warm Osmania biscuits will be waiting.
                  </p>
                  <button
                    onClick={() => {
                      setIsBookingOpen(false);
                      setBookingConfirmed(false);
                    }}
                    className="mt-6 w-full rounded-lg bg-[#C86D2D] hover:bg-[#B25C20] py-3 text-sm font-semibold text-white transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingConfirmed(true);
                  }}
                  className="space-y-4"
                >
                  <div className="text-xs text-[#E6C594]">
                    <span>Rainy Evening Table Concierge</span>
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-[#F7EFE4]">
                    Reserve a Window Seat
                  </h3>

                  <div>
                    <label className="block text-xs text-[#F7EFE4]/75 mb-1">
                      Window Booth Selection
                    </label>
                    <select
                      value={bookingForm.guests}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          guests: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[#F7EFE4]/15 bg-[#120D0A] px-3.5 py-2.5 text-sm text-[#F7EFE4]"
                    >
                      <option>2 Guests · Rainy Window Booth #01</option>
                      <option>4 Guests · Corner Teakwood Booth #02</option>
                      <option>6 Guests · Verandah Chai Table #03</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#F7EFE4]/75 mb-1">
                      Kettle Pour Time Slot
                    </label>
                    <select
                      value={bookingForm.time}
                      onChange={(e) =>
                        setBookingForm({
                          ...bookingForm,
                          time: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-[#F7EFE4]/15 bg-[#120D0A] px-3.5 py-2.5 text-sm text-[#F7EFE4]"
                    >
                      <option>04:30 PM · First Monsoon Downpour</option>
                      <option>05:30 PM · Evening Monsoon Pour</option>
                      <option>07:15 PM · Twilight Copper Kettle</option>
                      <option>09:45 PM · Late Night Irani Chai</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#F7EFE4]/75 mb-1">
                        Guest Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Kabir Sharma"
                        value={bookingForm.name}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-[#F7EFE4]/15 bg-[#120D0A] px-3.5 py-2.5 text-sm text-[#F7EFE4]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#F7EFE4]/75 mb-1">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={bookingForm.phone}
                        onChange={(e) =>
                          setBookingForm({
                            ...bookingForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-[#F7EFE4]/15 bg-[#120D0A] px-3.5 py-2.5 text-sm text-[#F7EFE4]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#C86D2D] hover:bg-[#B25C20] py-3.5 text-sm font-semibold text-white shadow-lg transition-colors mt-2"
                  >
                    Confirm Window Reservation
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
