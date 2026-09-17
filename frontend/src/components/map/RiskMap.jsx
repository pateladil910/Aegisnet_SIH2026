// components/map/RiskMap.jsx — Light Positron Basemap with Correlation Rings & Drift Vectors
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SENSOR_CATEGORIES } from '../../store/useStore'
import 'leaflet/dist/leaflet.css'

const GUJARAT_CENTER = [23.12, 72.62]
const DEFAULT_ZOOM = 11

function getSeverityColor(node) {
  if (node.status === 'offline') return '#94A3B8'
  if (node.severity === 'emergency' || node.risk_score >= 70) return '#C62828'
  if (node.severity === 'warning' || node.risk_score >= 50) return '#E0621A'
  if (node.severity === 'watch' || node.risk_score >= 35) return '#B58900'
  return '#2E7D32' // Advisory / Normal
}

function MapFlyTo({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, zoom || 12, { duration: 1.2 })
  }, [center, zoom])
  return null
}

function MapClickHandler({ onMapClick, placementMode }) {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    if (placementMode) container.style.cursor = 'crosshair'
    else container.style.cursor = ''
  }, [placementMode, map])

  useMapEvents({
    click: (e) => {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function RiskMap({
  nodes = [],
  height = '100%',
  center = GUJARAT_CENTER,
  zoom = DEFAULT_ZOOM,
  placementMode = false,
  onMapClick = null,
  showCorrelationRings = true,
  showWindDrift = true,
}) {
  // Correlated alert nodes (high risk)
  const highRiskNodes = nodes.filter((n) => n.risk_score >= 50)

  // Correlation line points between correlated nodes
  const correlationLines = highRiskNodes.length >= 2
    ? highRiskNodes.map((n) => [n.latitude, n.longitude])
    : []

  return (
    <div style={{ height, width: '100%' }} className="relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Light Positron CartoDB Basemap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        <MapFlyTo center={center} zoom={zoom} />
        <MapClickHandler onMapClick={onMapClick} placementMode={placementMode} />

        {/* ─── Cross-Node Correlation Dashed Rings & Lines ───────────────── */}
        {showCorrelationRings && highRiskNodes.length >= 2 && (
          <>
            <Polyline
              positions={correlationLines}
              pathOptions={{ color: '#C62828', weight: 2, dashArray: '6, 8', opacity: 0.8 }}
            />
            {highRiskNodes.map((n) => (
              <Circle
                key={`corr-ring-${n.node_id}`}
                center={[n.latitude, n.longitude]}
                radius={2400}
                pathOptions={{
                  color: '#C62828',
                  fillColor: '#C62828',
                  fillOpacity: 0.08,
                  weight: 1.5,
                  dashArray: '4, 4',
                }}
              />
            ))}
          </>
        )}

        {/* ─── Simulated Wind Drift Cone for Industrial Gas & Smoke ──────── */}
        {showWindDrift && (
          <Polyline
            positions={[
              [22.9734, 72.5898], // Narol-Vatva
              [23.0150, 72.6350], // Downwind Plume Sector
              [23.0350, 72.6650],
            ]}
            pathOptions={{ color: '#6B4FA0', weight: 3, opacity: 0.6, dashArray: '4, 6' }}
          />
        )}

        {/* ─── Node Pins with Color-Coded Severity ───────────────────────── */}
        {nodes.map((node) => {
          const color = getSeverityColor(node)
          const isEmergency = node.risk_score >= 70
          const catInfo = SENSOR_CATEGORIES.find((c) => c.id === node.category)

          return (
            <CircleMarker
              key={node.node_id}
              center={[node.latitude, node.longitude]}
              radius={isEmergency ? 11 : 8}
              pathOptions={{
                color: '#FFFFFF',
                weight: 2,
                fillColor: color,
                fillOpacity: 0.95,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <span className="font-mono text-xs font-bold">
                  {catInfo?.icon} {node.node_id} — {node.severity.toUpperCase()} ({node.risk_score}%)
                </span>
              </Tooltip>

              <Popup>
                <div className="p-1 space-y-2 text-xs font-sans min-w-[200px]">
                  <div className="flex items-center justify-between border-b border-[#E3E8EF] pb-1.5">
                    <span className="font-bold text-[#0F172A] font-mono">{node.node_id}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase text-white"
                      style={{ backgroundColor: color }}
                    >
                      {node.severity}
                    </span>
                  </div>

                  <div>
                    <div className="font-semibold text-[#0F172A]">{node.name}</div>
                    <div className="text-[11px] text-[#475569]">{node.location}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 bg-[#F7F9FB] p-2 rounded-lg text-[11px] font-mono">
                    <div>
                      <span className="text-[#475569]">Risk:</span>{' '}
                      <b style={{ color }}>{node.risk_score}/100</b>
                    </div>
                    <div>
                      <span className="text-[#475569]">Battery:</span> <b>{node.battery_pct}%</b>
                    </div>
                    <div>
                      <span className="text-[#475569]">Link:</span> <b>{node.connectivity?.split(' ')[0]}</b>
                    </div>
                    <div>
                      <span className="text-[#475569]">Siren:</span>{' '}
                      <b>{node.local_siren ? '🚨 ACTIVE' : 'Idle'}</b>
                    </div>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <Link
                      to={`/nodes/${node.node_id}`}
                      className="text-[11px] text-[#0B6E4F] hover:underline font-mono font-bold"
                    >
                      Inspect Telemetry Spec →
                    </Link>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
