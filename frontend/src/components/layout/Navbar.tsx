import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShieldAlert, 
  Activity, 
  Map as MapIcon, 
  BellRing, 
  Sliders, 
  BarChart3, 
  Play, 
  Flame, 
  Waves, 
  Wind,
  CheckCircle2,
  Compass,
  LogOut
} from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

interface NavbarProps {
  connected: boolean;
  onSimulationTriggered?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ connected, onSimulationTriggered }) => {
  const [simulating, setSimulating] = useState(false);
  const [simSuccess, setSimSuccess] = useState<string | null>(null);

  const triggerSim = async (hazardType: 'flood' | 'fire' | 'pollution', nodeId: string, riskScore: number) => {
    try {
      setSimulating(true);
      await apiClient.simulateAlert({
        nodeId,
        hazardType,
        riskScore,
        severity: riskScore >= 75 ? 'critical' : 'warning',
        reading: {
          waterLevelCm: hazardType === 'flood' ? 92 : 25,
          smokePpm: hazardType === 'fire' ? 240 : 80,
          tempC: hazardType === 'fire' ? 49.5 : 29.0,
          flame: hazardType === 'fire',
          humidity: 75
        }
      });
      setSimSuccess(`Injected ${hazardType.toUpperCase()} at ${nodeId}`);
      setTimeout(() => setSimSuccess(null), 4000);
      if (onSimulationTriggered) onSimulationTriggered();
    } catch (e: any) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-500/10'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
    }`;

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1720px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-600/30 ring-1 ring-blue-400/40">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-wider text-slate-100">AEGISNET</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60">
                  SIH26178
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Edge AI Environmental Mesh</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" className={navItemClass}>
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Command Ops</span>
            </NavLink>
            <NavLink to="/map" className={navItemClass}>
              <MapIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Public Map</span>
            </NavLink>
            <NavLink to="/alerts" className={navItemClass}>
              <BellRing className="w-3.5 h-3.5 text-red-400" />
              <span>Alert Feed</span>
            </NavLink>
            <NavLink to="/analytics" className={navItemClass}>
              <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
              <span>Analytics & Forecast</span>
            </NavLink>
            <NavLink to="/settings/thresholds" className={navItemClass}>
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Thresholds</span>
            </NavLink>
            <NavLink to="/landing" className={navItemClass}>
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Landing Page</span>
            </NavLink>
          </nav>
        </div>

        {/* Live Status & Demo Scenario Injector */}
        <div className="flex items-center gap-3">
          {simSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{simSuccess}</span>
            </div>
          )}

          {/* Quick Demo Scenario Triggers for Judges */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-lg">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono px-2 flex items-center gap-1">
              <Play className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> Live Demo:
            </span>
            <button
              onClick={() => triggerSim('flood', 'node_002', 88)}
              disabled={simulating}
              className="text-xs flex items-center gap-1 px-2.5 py-1 rounded bg-blue-950/80 hover:bg-blue-900/80 text-blue-300 border border-blue-800/60 transition-colors"
            >
              <Waves className="w-3 h-3 text-blue-400" />
              <span>Flood Surge</span>
            </button>
            <button
              onClick={() => triggerSim('fire', 'node_005', 92)}
              disabled={simulating}
              className="text-xs flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900/80 text-red-300 border border-red-800/60 transition-colors"
            >
              <Flame className="w-3 h-3 text-red-400" />
              <span>Wildfire</span>
            </button>
            <button
              onClick={() => triggerSim('pollution', 'node_004', 78)}
              disabled={simulating}
              className="text-xs flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 transition-colors"
            >
              <Wind className="w-3 h-3 text-amber-400" />
              <span>Toxic AQI</span>
            </button>
          </div>

          {/* Real-time Connection Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[11px] font-mono text-slate-300">
              {connected ? 'MESH ONLINE' : 'DISCONNECTED'}
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={() => {
              localStorage.removeItem('aegisnet_token');
              localStorage.removeItem('aegisnet_user');
              window.location.href = '/';
            }}
            title="Log out and return to Landing Page"
            className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-800/60 transition-all cursor-pointer"
          >
            <LogOut className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
