import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCode,
  Sliders,
  Palette,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DesignVisualizerScreen: React.FC = () => {
  const [selectedDesign, setSelectedDesign] = useState<'polo_logo' | 'crest_gold' | 'cap_emblem'>('polo_logo');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(50); // stitches per frame step
  const [stitchProgress, setStitchProgress] = useState(3200);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showNeedleGrid, setShowNeedleGrid] = useState(true);
  const [showJumpStitches, setShowJumpStitches] = useState(true);

  // Design Catalog specs
  const DESIGNS = {
    polo_logo: {
      name: 'Summer Polo Chest Emblem',
      filename: 'POLO_CHEST_V2.DST',
      totalStitches: 8450,
      widthMm: 85,
      heightMm: 72,
      colors: [
        { needle: 1, name: 'Royal Blue #1E40AF', color: '#1E40AF', stitches: 3200 },
        { needle: 2, name: 'Bright Crimson #EF4444', color: '#EF4444', stitches: 2100 },
        { needle: 3, name: 'Gold Leaf #F59E0B', color: '#F59E0B', stitches: 1950 },
        { needle: 4, name: 'Snow White #FFFFFF', color: '#E2E8F0', stitches: 1200 },
      ],
    },
    crest_gold: {
      name: 'Royal Heritage Blazer Crest',
      filename: 'CREST_GOLD_HERITAGE.EMB',
      totalStitches: 14800,
      widthMm: 110,
      heightMm: 98,
      colors: [
        { needle: 1, name: 'Metallic Gold #D97706', color: '#D97706', stitches: 6400 },
        { needle: 2, name: 'Deep Navy #0F172A', color: '#0F172A', stitches: 4200 },
        { needle: 3, name: 'Ruby Satin #DC2626', color: '#DC2626', stitches: 2600 },
        { needle: 4, name: 'Silver White #F1F5F9', color: '#94A3B8', stitches: 1600 },
      ],
    },
    cap_emblem: {
      name: '3D Puff 6-Panel Cap Logo',
      filename: 'CAP_PUFF_3D.DST',
      totalStitches: 6200,
      widthMm: 65,
      heightMm: 50,
      colors: [
        { needle: 1, name: 'Stealth Black #18181B', color: '#18181B', stitches: 3800 },
        { needle: 2, name: 'Safety Neon Lime #84CC16', color: '#84CC16', stitches: 1800 },
        { needle: 3, name: 'Pure White #FFFFFF', color: '#CBD5E1', stitches: 600 },
      ],
    },
  };

  const current = DESIGNS[selectedDesign];

  // Animation player loop
  useEffect(() => {
    let animationFrame: number;
    if (isPlaying) {
      const step = () => {
        setStitchProgress((prev) => {
          if (prev >= current.totalStitches) {
            setIsPlaying(false);
            return current.totalStitches;
          }
          return Math.min(current.totalStitches, prev + playbackSpeed);
        });
        animationFrame = requestAnimationFrame(step);
      };
      animationFrame = requestAnimationFrame(step);
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, playbackSpeed, current.totalStitches]);

  const progressPercent = Math.min(100, Math.round((stitchProgress / current.totalStitches) * 100));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            DST / EMB Interactive Stitch Simulator
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Virtual machine stitch player, needle trajectory preview, density map, and color sequences
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Preset Selector */}
          <select
            value={selectedDesign}
            onChange={(e) => {
              setSelectedDesign(e.target.value as any);
              setStitchProgress(2000);
              setIsPlaying(false);
            }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 cursor-pointer"
          >
            <option value="polo_logo">Polo Chest Logo (8.4k stitches)</option>
            <option value="crest_gold">Blazer Gold Crest (14.8k stitches)</option>
            <option value="cap_emblem">3D Puff Cap Logo (6.2k stitches)</option>
          </select>
        </div>
      </div>

      {/* Main Studio View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Stitch Simulation Canvas */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Canvas Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-mono font-bold text-slate-800">
                  {current.filename}
                </span>
                <span className="text-[11px] text-slate-400 font-sans">
                  ({current.widthMm}mm × {current.heightMm}mm)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setShowNeedleGrid(!showNeedleGrid)}
                  className={`px-2.5 py-1 rounded-md font-medium border text-[11px] transition-colors cursor-pointer ${
                    showNeedleGrid ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Needle Grid
                </button>
                <button
                  onClick={() => setShowJumpStitches(!showJumpStitches)}
                  className={`px-2.5 py-1 rounded-md font-medium border text-[11px] transition-colors cursor-pointer ${
                    showJumpStitches ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Jump Stitches
                </button>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-600">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                    className="p-1 hover:text-slate-900 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono px-1 font-semibold">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                    className="p-1 hover:text-slate-900 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Embroidery Canvas Area */}
            <div className="w-full h-80 bg-[#1E2538] rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden select-none">
              {/* Hoop Outline */}
              <div
                className="w-64 h-64 rounded-full border-2 border-dashed border-amber-500/40 absolute pointer-events-none flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <span className="text-[9px] text-amber-400/50 absolute top-2 font-mono uppercase tracking-widest">
                  150mm Round Hoop
                </span>
              </div>

              {/* Grid Lines if active */}
              {showNeedleGrid && (
                <div
                  className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              )}

              {/* Virtual Embroidery Stitch Rendering (SVG Path based on progress) */}
              <svg
                viewBox="0 0 300 300"
                className="w-64 h-64 transition-transform duration-150 relative z-10"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Crosshairs */}
                <line x1="150" y1="20" x2="150" y2="280" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="20" y1="150" x2="280" y2="150" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* Color Layer 1 (Base tatami fill) */}
                <path
                  d="M90 150 C90 110, 210 110, 210 150 C210 190, 90 190, 90 150 Z"
                  fill="none"
                  stroke={current.colors[0]?.color || '#1E40AF'}
                  strokeWidth="8"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                  opacity={stitchProgress > 500 ? 1 : stitchProgress / 500}
                />

                {/* Color Layer 2 (Inner satin contour) */}
                {stitchProgress > 2000 && (
                  <path
                    d="M110 150 C110 125, 190 125, 190 150 C190 175, 110 175, 110 150 Z"
                    fill="none"
                    stroke={current.colors[1]?.color || '#EF4444'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity={stitchProgress > 2500 ? 1 : 0.6}
                  />
                )}

                {/* Color Layer 3 (Emblem icon star / crest) */}
                {stitchProgress > 4000 && (
                  <polygon
                    points="150,90 162,130 205,130 170,155 183,195 150,170 117,195 130,155 95,130 138,130"
                    fill="none"
                    stroke={current.colors[2]?.color || '#F59E0B'}
                    strokeWidth="4"
                    strokeDasharray="2 1"
                    opacity={stitchProgress > 4800 ? 1 : 0.7}
                  />
                )}

                {/* Color Layer 4 (Lettering details) */}
                {stitchProgress > 6000 && (
                  <text
                    x="150"
                    y="155"
                    textAnchor="middle"
                    fill={current.colors[3]?.color || '#FFFFFF'}
                    fontSize="18"
                    fontWeight="900"
                    fontFamily="monospace"
                    letterSpacing="2"
                  >
                    EMB TRACK
                  </text>
                )}

                {/* Active needle head simulated cursor */}
                <circle
                  cx={150 + Math.sin(stitchProgress / 40) * 45}
                  cy={150 + Math.cos(stitchProgress / 40) * 35}
                  r="4"
                  fill="#38BDF8"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </svg>

              {/* Status overlay badge */}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-lg border border-slate-700 text-[11px] text-slate-300 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Needle Position: X: +12.4mm | Y: -08.1mm</span>
              </div>
            </div>

            {/* Playback Controls & Scrubber */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  Stitch Progress: <strong className="font-mono text-blue-600">{stitchProgress.toLocaleString()}</strong> / {current.totalStitches.toLocaleString()}
                </span>
                <span className="font-extrabold text-slate-900">{progressPercent}%</span>
              </div>

              {/* Scrubber slider */}
              <input
                type="range"
                min="0"
                max={current.totalStitches}
                value={stitchProgress}
                onChange={(e) => setStitchProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play Stitch Loop'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setStitchProgress(0);
                      setIsPlaying(false);
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer"
                    title="Reset to 0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                  <span>Simulation Speed:</span>
                  {[20, 50, 150].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-1 rounded text-[11px] cursor-pointer ${
                        playbackSpeed === spd ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {spd === 20 ? '1x' : spd === 50 ? '3x' : '10x Fast'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Colorway & Needle Sequence Specs */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Palette className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Needle & Thread Color Sequence
            </h3>
          </div>

          <div className="space-y-3">
            {current.colors.map((c, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Needle #{c.needle}
                    </span>
                    <span className="text-[11px] text-slate-500">{c.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-800 text-[11px] block">
                    {c.stitches.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">stitches</span>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Specs box */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              DST Header Diagnostics
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Color Stops</span>
                <span className="font-bold text-slate-800">{current.colors.length - 1} Stop Commands</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Trims Count</span>
                <span className="font-bold text-slate-800">14 Trims</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Tajima Code Format</span>
                <span className="font-bold text-slate-800">Tajima DST (Exp)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Est. Run Duration</span>
                <span className="font-bold text-slate-800">11m 45s (@ 750 SPM)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
