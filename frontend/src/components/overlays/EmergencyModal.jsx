// components/overlays/EmergencyModal.jsx — Irreversible Action Confirmation Dialog
import { useState } from 'react'
import { useStore } from '../../store/useStore'

export default function EmergencyModal() {
  const modalData = useStore((s) => s.emergencyModalData)
  const setModalData = useStore((s) => s.setEmergencyModalData)
  const [confirmText, setConfirmText] = useState('')

  if (!modalData) return null

  const handleConfirm = () => {
    if (modalData.requireTyped && confirmText.trim().toUpperCase() !== 'CONFIRM') return
    modalData.onConfirm()
    setModalData(null)
    setConfirmText('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in font-sans">
      <div className="bg-white dark:bg-slate-900 border border-red-500/30 dark:border-red-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center gap-3.5 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center text-xl font-bold flex-shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">{modalData.title || 'Emergency Confirmation'}</h3>
            <p className="text-[11px] text-red-600 dark:text-red-400 font-sans font-semibold">Irreversible State Escalation</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          {modalData.message || 'Are you sure you want to broadcast this emergency escalation to all inter-agency command centers?'}
        </p>

        {modalData.requireTyped && (
          <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            <label className="text-[11px] text-slate-600 dark:text-slate-300 block font-sans font-medium">
              Type <b className="text-red-600 dark:text-red-400 font-mono">CONFIRM</b> to execute action:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:border-red-600 focus:ring-2 focus:ring-red-500/30 focus:outline-none uppercase"
            />
          </div>
        )}

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={modalData.requireTyped && confirmText.trim().toUpperCase() !== 'CONFIRM'}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold py-2.5 rounded-full text-xs font-sans transition-all shadow-md shadow-red-500/20"
          >
            Authorize Emergency Action
          </button>
          <button
            type="button"
            onClick={() => {
              setModalData(null)
              setConfirmText('')
            }}
            className="px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs font-sans border border-slate-200 dark:border-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
