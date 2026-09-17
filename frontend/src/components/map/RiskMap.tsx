import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AegisNode } from '../../types';

interface RiskMapProps {
  nodes: AegisNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  simplified?: boolean; // For public view
}

export const RiskMap: React.FC<RiskMapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  simplified = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Tapi River Basin (Surat / Gujarat Catchment)
    const map = L.map(mapContainerRef.current, {
      center: [21.2014, 72.8258],
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dark-themed tiles from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; AegisNet',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when nodes or selectedNode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers that no longer exist
    markersRef.current.forEach((marker, id) => {
      if (!nodes.find(n => n._id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    nodes.forEach(node => {
      const isSelected = node._id === selectedNodeId;
      const isAlert = node.status === 'alert';
      const isWarning = node.status === 'warning';
      const [lon, lat] = node.location.coordinates;

      let colorClass = 'bg-emerald-500 text-white ring-emerald-400/50';
      let pinColor = '#16a34a';
      if (isAlert) {
        colorClass = 'bg-red-600 text-white ring-red-400 animate-pulse';
        pinColor = '#dc2626';
      } else if (isWarning) {
        colorClass = 'bg-yellow-500 text-slate-900 ring-yellow-400/50';
        pinColor = '#eab308';
      }

      const pulseRingHtml = isAlert
        ? `<div class="absolute -inset-2 rounded-full bg-red-600 opacity-75 animate-ping"></div>`
        : '';

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${pulseRingHtml}
          <div class="relative w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-xs font-bold shadow-lg ring-4 ${
        isSelected ? 'ring-cyan-400 scale-125 transition-transform' : 'ring-slate-950/80'
      }">
            <span>${node._id.replace('node_', '')}</span>
          </div>
          <div class="absolute top-9 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] text-slate-200 whitespace-nowrap shadow-md pointer-events-none group-hover:scale-105 transition-transform">
            ${node.label}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-node-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      let marker = markersRef.current.get(node._id);
      if (!marker) {
        marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          onSelectNode(node._id);
        });
        markersRef.current.set(node._id, marker);
      } else {
        marker.setLatLng([lat, lon]);
        marker.setIcon(customIcon);
      }
    });
  }, [nodes, selectedNodeId, onSelectNode, simplified]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 shadow-xl text-xs space-y-1.5">
        <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Catchment Mesh
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Normal (Risk &lt; 50)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span>Watch (Risk 50-74)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
          <span>Critical Alert (Risk &ge; 75)</span>
        </div>
      </div>
    </div>
  );
};
