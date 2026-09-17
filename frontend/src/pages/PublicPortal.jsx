// pages/PublicPortal.jsx — Citizen-Facing Public Safety Portal (No Login Required)
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, REGIONS } from '../store/useStore'
import clsx from 'clsx'

export default function PublicPortal() {
  const advisories = useStore((s) => s.advisories)
  const language = useStore((s) => s.publicLanguage)
  const setLanguage = useStore((s) => s.setPublicLanguage)
  const [selectedZone, setSelectedZone] = useState('ahmedabad')
  const [phone, setPhone] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const activeAdvisory = advisories[0]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!phone) return
    setSubscribed(true)
    setTimeout(() => setSubscribed(false), 4000)
    setPhone('')
  }

  // Multilingual UI Dictionary
  const UI_TEXT = {
    en: {
      portalTitle: 'Gujarat Citizen Environmental Safety Portal',
      subtitle: 'Official, verified disaster advisories and safety guidance from GSDMA.',
      statusNormal: 'Normal Conditions in Your Area',
      statusWarning: 'Advisory Active: Caution Advised',
      statusEmergency: 'EMERGENCY: Immediate Precaution Required',
      whatShouldIDo: 'What Should You Do Right Now?',
      verifiedBadge: 'Verified Official GSDMA Broadcast',
      subscribeTitle: 'Get Free Instant SMS Emergency Alerts',
      subscribeDesc: 'Receive verified evacuation notices directly on your mobile during cyclones, floods, and toxic smog.',
      subscribeBtn: 'Subscribe for SMS Alerts',
      backToAgency: '← Authority / Agency Command Login',
    },
    gu: {
      portalTitle: 'ગુજરાત નાગરિક પર્યાવરણ સુરક્ષા પોર્ટલ',
      subtitle: 'GSDMA દ્વારા માન્ય સત્તાવાર આપત્તિ ચેતવણીઓ અને સલામતી માર્ગદર્શન.',
      statusNormal: 'તમારા વિસ્તારમાં સ્થિતિ સામાન્ય છે',
      statusWarning: 'ચેતવણી જારી: સાવચેતી રાખવાની સલાહ',
      statusEmergency: 'કટોકટી: તાત્કાલિક સાવચેતી જરૂરી',
      whatShouldIDo: 'તમારે અત્યારે શું કરવું જોઈએ?',
      verifiedBadge: 'GSDMA માન્ય સત્તાવાર પ્રસારણ',
      subscribeTitle: 'મફત ઇન્સ્ટન્ટ SMS ચેતવણી મેળવો',
      subscribeDesc: 'પૂર, વાવાઝોડું કે ઝેરી ગેસ દરમિયાન સીધા તમારા ફોન પર મેસેજ મેળવો.',
      subscribeBtn: 'SMS ચેતવણી માટે સબ્સ્ક્રાઇબ કરો',
      backToAgency: '← સત્તાવાર અધિકારી પ્રવેશ',
    },
    hi: {
      portalTitle: 'गुजरात नागरिक पर्यावरण सुरक्षा पोर्टल',
      subtitle: 'GSDMA द्वारा अधिकृत आधिकारिक आपदा सलाह और सुरक्षा मार्गदर्शन।',
      statusNormal: 'आपके क्षेत्र में स्थिति सामान्य है',
      statusWarning: 'चेतावनी सक्रिय: सावधानी बरतने की सलाह',
      statusEmergency: 'आपातकाल: तुरंत सावधानी बरतें',
      whatShouldIDo: 'आपको अभी क्या करना चाहिए?',
      verifiedBadge: 'GSDMA अधिकृत आधिकारिक प्रसारण',
      subscribeTitle: 'मुफ्त आपातकालीन SMS अलर्ट प्राप्त करें',
      subscribeDesc: 'बाढ़, आग या जहरीली गैस की स्थिति में सीधे अपने मोबाइल पर आधिकारिक चेतावनी पाएं।',
      subscribeBtn: 'SMS अलर्ट के लिए सब्सक्राइब करें',
      backToAgency: '← अधिकारी कमांड लॉगिन',
    },
  }

  const t = UI_TEXT[language] || UI_TEXT.en
  const currentText = activeAdvisory ? activeAdvisory[language] || activeAdvisory.en : null

  return (
    <div className="text-slate-900 dark:text-slate-100 font-sans pb-16 animate-slide-up">
      {/* ─── Top Citizen Sub-Bar (Below TopHeader) ─────────────────────────── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
            🌍
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
              Aegis<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Net</span> Citizen Safety
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              GSDMA Public Environmental Network
            </div>
          </div>
        </div>

        {/* Right: Language Switcher & Agency Link */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-xs font-medium">
            <button
              onClick={() => setLanguage('en')}
              className={clsx(
                'px-3 py-1 rounded-full transition-all',
                language === 'en' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('gu')}
              className={clsx(
                'px-3 py-1 rounded-full transition-all',
                language === 'gu' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={clsx(
                'px-3 py-1 rounded-full transition-all',
                language === 'hi' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 font-bold text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              हिन्दी
            </button>
          </div>

          <Link
            to="/dashboard"
            className="hidden sm:inline-block text-xs font-mono font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
          >
            ← Command Center
          </Link>
        </div>
      </div>

      {/* ─── Main Content Container ─────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Portal Introduction Banner */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.portalTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {t.subtitle}
          </p>

          {/* Region Picker for Citizen */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-full px-4 py-2 shadow-xs text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400">📍 Your Zone:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="font-bold text-blue-600 dark:text-cyan-400 bg-transparent focus:outline-none cursor-pointer"
              >
                {REGIONS.filter((r) => r.id !== 'all').map((r) => (
                  <option key={r.id} value={r.id} className="dark:bg-slate-900">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─── Big High-Contrast Status Banner ──────────────────────────── */}
        {activeAdvisory ? (
          <div className="bg-amber-500/10 border-2 border-amber-500/30 dark:border-amber-500/40 rounded-3xl p-6 shadow-sm space-y-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                  {t.statusWarning}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full">
                {t.verifiedBadge}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {currentText?.title || activeAdvisory.en.title}
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                📍 Zone: <b className="text-slate-800 dark:text-slate-200">{activeAdvisory.zone}</b> · Published {activeAdvisory.published_at}
              </p>
            </div>

            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-amber-500/20">
              {currentText?.message || activeAdvisory.en.message}
            </p>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
              ✓
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                {t.statusNormal}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                All hydrological levels, forest thermal arrays, and industrial air monitors are operating within safe seasonal limits.
              </p>
            </div>
          </div>
        )}

        {/* ─── "What Should I Do Right Now?" Action Card ─────────────────── */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛡️</span> {t.whatShouldIDo}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-blue-600 dark:text-cyan-400">1. Immediate Health & Shelter</div>
              <p className="text-slate-600 dark:text-slate-300">
                {currentText?.action || 'Keep residential windows closed during industrial thermal inversions.'}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl space-y-1">
              <div className="font-bold text-blue-600 dark:text-cyan-400">2. Emergency Contacts</div>
              <p className="text-slate-600 dark:text-slate-300">
                Dial <b className="text-slate-900 dark:text-white">101</b> for Fire, <b className="text-slate-900 dark:text-white">108</b> for Medical EMS, or <b className="text-slate-900 dark:text-white">1077</b> for GSDMA State Disaster Control.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Free SMS Alerts Subscription Form ─────────────────────────── */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>📱</span> {t.subscribeTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.subscribeDesc}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md shadow-blue-500/20 whitespace-nowrap"
            >
              {subscribed ? '✓ Subscribed Successfully!' : t.subscribeBtn}
            </button>
          </form>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            Zero spam. Powered directly by Gujarat State Disaster Management Authority emergency gateway.
          </p>
        </div>
      </main>
    </div>
  )
}
