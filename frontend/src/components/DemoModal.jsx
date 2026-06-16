import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

const phases = [
  "Analyzing your idea...",
  "Designing layout...",
  "Writing HTML & CSS...",
  "Adding animations...",
  "Final checks...",
]

const STEPS = [
  { tag: "Step 1 of 4", title: "Describe your website", desc: "Type what you want — ShivForge AI understands plain English. No coding required." },
  { tag: "Step 2 of 4", title: "AI builds your site", desc: "The AI writes HTML, CSS, and JavaScript — responsive across all devices, production-ready." },
  { tag: "Step 3 of 4", title: "Edit with AI chat", desc: "Ask for changes in plain English. The AI updates your site in real-time." },
  { tag: "Step 4 of 4", title: "Deploy in one click", desc: "Your site goes live instantly — share a link with anyone in the world." },
]

const PROMPT_TEXT = "Build me a modern portfolio website for a UI/UX designer. Dark theme, purple accents, hero section, projects grid, and a contact form."

export default function DemoModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [progress, setProgress] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [deployed, setDeployed] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [aiTyping, setAiTyping] = useState(true)
  const progRef = useRef(null)

  // Typewriter on step 0
  useEffect(() => {
    if (step !== 0) return
    setTypedText("")
    let i = 0
    const t = setInterval(() => {
      i++
      setTypedText(PROMPT_TEXT.slice(0, i))
      if (i >= PROMPT_TEXT.length) clearInterval(t)
    }, 22)
    return () => clearInterval(t)
  }, [step])

  // Progress bar on step 1
  useEffect(() => {
    if (step !== 1) return
    setProgress(0)
    setPhaseIdx(0)
    let val = 0
    progRef.current = setInterval(() => {
      val += val < 30 ? 2.5 : val < 70 ? 1.5 : 0.7
      if (val >= 95) {
        val = 95
        clearInterval(progRef.current)
        setTimeout(() => setStep(2), 600)
      }
      setProgress(Math.round(val))
      setPhaseIdx(Math.min(Math.floor((val / 100) * phases.length), phases.length - 1))
    }, 200)
    return () => clearInterval(progRef.current)
  }, [step])

  // AI typing on step 2
  useEffect(() => {
    if (step !== 2) return
    setAiTyping(true)
    const t = setTimeout(() => setAiTyping(false), 1800)
    return () => clearTimeout(t)
  }, [step])

  const handleDeploy = () => {
    setDeploying(true)
    setTimeout(() => { setDeploying(false); setDeployed(true) }, 1400)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Topbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                ShivForge AI — How it works
              </span>
            </div>
            {/* Step pills */}
            <div className="hidden sm:flex items-center gap-2">
              {["Describe", "Generate", "Edit", "Deploy"].map((label, i) => (
                <span key={i} className={`px-3 py-0.5 rounded-full text-[11px] font-medium border transition-all
                  ${i < step ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : i === step ? "bg-white/10 text-white border-white/20"
                  : "text-white/30 border-white/10"}`}>
                  {i < step ? "✓ " : ""}{label}
                </span>
              ))}
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition ml-3">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">{STEPS[step].tag}</p>
            <h2 className="text-xl font-bold text-white mb-1">{STEPS[step].title}</h2>
            <p className="text-sm text-zinc-400 mb-5">{STEPS[step].desc}</p>

            {/* Step 0 — Prompt */}
            {step === 0 && (
              <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Your prompt</p>
                <div className="w-full h-20 text-sm text-zinc-300 leading-relaxed bg-white/5 rounded-lg p-3 border border-white/10 font-mono">
                  {typedText}<span className="animate-pulse">|</span>
                </div>
                <div className="flex justify-end mt-3">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:scale-105 transition">
                    ✦ Generate Website
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 — Progress */}
            {step === 1 && (
              <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-purple-400 mb-3">{phases[phaseIdx]}</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-500">
                  <span>{phases[phaseIdx]}</span>
                  <span>{progress}%</span>
                </div>
                <p className="text-center text-xs text-zinc-600 mt-4">Estimated time: ~8–12 minutes in real usage</p>
              </div>
            )}

            {/* Step 2 — Editor */}
            {step === 2 && (
              <div className="bg-black/50 border border-white/10 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Chat</p>
                    <div className="px-3 py-2 bg-white text-black text-xs rounded-xl rounded-br-sm mb-2 ml-auto w-fit max-w-[90%]">
                      Make the navbar dark with a logo on the left
                    </div>
                    <div className="px-3 py-2 bg-white/5 border border-white/10 text-zinc-400 text-xs rounded-xl rounded-bl-sm mb-2 max-w-[90%]">
                      Updated! Dark navbar added with your logo on the left.
                    </div>
                    <div className="px-3 py-2 bg-white text-black text-xs rounded-xl rounded-br-sm ml-auto w-fit max-w-[90%]">
                      Add a contact form at the bottom
                    </div>
                    {aiTyping ? (
                      <div className="px-3 py-2 bg-white/5 border border-white/10 text-zinc-500 text-xs rounded-xl rounded-bl-sm max-w-[90%] italic mt-2">
                        Typing...
                      </div>
                    ) : (
                      <div className="px-3 py-2 bg-white/5 border border-white/10 text-zinc-400 text-xs rounded-xl rounded-bl-sm max-w-[90%] mt-2">
                        Contact form added with name, email and message fields!
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Live Preview</p>
                    <div className="rounded-lg overflow-hidden border border-white/10">
                      <div className="bg-[#1e1b4b] px-3 py-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span className="text-[9px] text-indigo-300 font-medium">YourBrand</span>
                      </div>
                      <div className="bg-gradient-to-b from-[#1e1b4b] to-[#312e81] px-4 py-5 text-center">
                        <p className="text-white text-[10px] font-bold">Welcome to YourBrand</p>
                        <p className="text-indigo-300 text-[8px] mt-1">Premium services for modern teams</p>
                        <div className="inline-block bg-indigo-500 text-white text-[7px] px-2 py-1 rounded mt-2">Get Started</div>
                      </div>
                      <div className="bg-white p-2">
                        <p className="text-[8px] text-zinc-400 mb-1">Contact us</p>
                        <div className="bg-zinc-100 rounded px-2 py-1 text-[7px] text-zinc-400 mb-1">Your name</div>
                        <div className="bg-zinc-100 rounded px-2 py-1 text-[7px] text-zinc-400 mb-1">Email address</div>
                        <div className="inline-block bg-indigo-500 text-white text-[7px] px-2 py-1 rounded">Send</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Deploy */}
            {step === 3 && (
              <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">portfolio-site</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Ready to deploy</p>
                  </div>
                  <button
                    onClick={handleDeploy}
                    disabled={deployed || deploying}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold hover:scale-105 transition disabled:opacity-60"
                  >
                    {deploying ? "Deploying..." : deployed ? "✓ Deployed" : "🚀 Deploy"}
                  </button>
                </div>
                {deployed && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3"
                  >
                    <span className="text-green-400 text-lg">✓</span>
                    <span className="font-mono text-xs text-green-400 flex-1">shivforge.app/site/portfolio-a3f9b</span>
                    <button className="text-xs bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-lg">
                      Copy
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-zinc-600">Step {step + 1} of 4</span>
              <div className="flex gap-2">
                {step > 0 && step !== 1 && (
                  <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition">
                    ← Back
                  </button>
                )}
                {step < 3 && step !== 1 && (
                  <button onClick={() => setStep(s => s + 1)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold hover:scale-105 transition">
                    Next →
                  </button>
                )}
                {step === 3 && (
                  <button onClick={onClose} className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition">
                    Try it yourself →
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}