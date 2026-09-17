import React from 'react';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#020617] fixed inset-0 z-50">
      <iframe
        src="/landing.html"
        title="AegisNet — AI-Powered Edge Environmental Monitoring"
        className="w-full h-full border-0 block"
        style={{ width: '100vw', height: '100vh', border: 'none' }}
      />
    </div>
  );
};
