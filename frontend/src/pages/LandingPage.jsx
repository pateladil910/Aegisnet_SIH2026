// pages/LandingPage.jsx — AegisNet Animated Landing Page
export default function LandingPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#020617] z-50 overflow-hidden">
      <iframe
        src="/landing.html"
        title="AegisNet Environmental Monitoring"
        className="w-full h-full border-0 block"
        style={{ width: '100vw', height: '100vh', border: 'none' }}
      />
    </div>
  )
}
