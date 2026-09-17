import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CommandDashboard } from './pages/CommandDashboard';
import { PublicMap } from './pages/PublicMap';
import { NodeDetailPage } from './pages/NodeDetailPage';
import { AlertHistoryPage } from './pages/AlertHistoryPage';
import { ThresholdConfigPage } from './pages/ThresholdConfigPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { apiClient } from './lib/apiClient';
import { getSocket } from './lib/socket';
import { AegisNode, AlertItem, SensorReading } from './types';

export const App: React.FC = () => {
  const [nodes, setNodes] = useState<AegisNode[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [connected, setConnected] = useState(false);

  const fetchInitialData = useCallback(async () => {
    try {
      const [nodesData, alertsData] = await Promise.all([
        apiClient.getNodes(),
        apiClient.getAlerts()
      ]);
      setNodes(nodesData);
      setAlerts(alertsData);
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();

    const socket = getSocket();

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    // Live Telemetry Event
    socket.on('telemetry:update', (data: { reading: SensorReading; node: AegisNode }) => {
      setNodes(prev => {
        const idx = prev.findIndex(n => n._id === data.node._id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = data.node;
          return updated;
        }
        return [...prev, data.node];
      });
    });

    // Live Node Status
    socket.on('node:status', (updatedNode: AegisNode) => {
      setNodes(prev => {
        const idx = prev.findIndex(n => n._id === updatedNode._id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = updatedNode;
          return updated;
        }
        return [...prev, updatedNode];
      });
    });

    // Live Alert Event
    socket.on('alert:new', (newAlert: AlertItem) => {
      setAlerts(prev => {
        // Prevent duplicate alerts
        if (prev.some(a => a._id === newAlert._id)) return prev;
        return [newAlert, ...prev];
      });
    });

    // Alert Resolved Event
    socket.on('alert:resolved', ({ alertId, resolvedAt }: { alertId: string; resolvedAt: string }) => {
      setAlerts(prev =>
        prev.map(a => (a._id === alertId ? { ...a, status: 'resolved', resolvedAt } : a))
      );
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('telemetry:update');
      socket.off('node:status');
      socket.off('alert:new');
      socket.off('alert:resolved');
    };
  }, [fetchInitialData]);

  const handleResolveAlert = async (id: string) => {
    try {
      await apiClient.resolveAlert(id);
      setAlerts(prev =>
        prev.map(a => (a._id === id ? { ...a, status: 'resolved', resolvedAt: new Date().toISOString() } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const isAuthenticated = () => Boolean(localStorage.getItem('aegisnet_token'));

  return (
    <Router>
      <Routes>
        {/* Direct Landing Page — opened on root when not logged in */}
        <Route
          path="/"
          element={
            isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LandingPage />
          }
        />

        {/* Always accessible standalone landing page */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Standalone login — no AppShell wrapper */}
        <Route path="/login" element={<LoginPage />} />

        {/* All other pages share the AppShell layout */}
        <Route element={<AppShell connected={connected} onRefresh={fetchInitialData} />}>
          <Route path="/map" element={<PublicMap nodes={nodes} alerts={alerts} />} />
          <Route path="/public-map" element={<PublicMap nodes={nodes} alerts={alerts} />} />
          <Route
            path="/dashboard"
            element={
              <CommandDashboard
                nodes={nodes}
                alerts={alerts}
                onResolveAlert={handleResolveAlert}
              />
            }
          />
          <Route path="/nodes/:id" element={<NodeDetailPage />} />
          <Route
            path="/alerts"
            element={
              <AlertHistoryPage
                alerts={alerts}
                onResolveAlert={handleResolveAlert}
              />
            }
          />
          <Route path="/settings/thresholds" element={<ThresholdConfigPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated() ? '/dashboard' : '/'} replace />
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};
