import { ArrowLeft, Check, Rocket, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from 'motion/react'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate()
  const [websites, setWebsites] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)
  const { userData } = useSelector(state => state.user)

  const handleDeploy = async (e, id) => {
    e.stopPropagation()
    try {
      const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${id}`, { withCredentials: true })
      window.open(result.data.url, "_blank")
      setWebsites((prev) => prev.map((w) => w._id === id ? { ...w, deployed: true, deployUrl: result.data.url } : w))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleGetAllWebsite = async () => {
      try {
        setLoading(true)
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getall`, { withCredentials: true })
        setWebsites(result.data)
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load websites")
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    handleGetAllWebsite()
  }, [])

  const handleCopy = async (e, site) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(site.deployUrl)
    setCopiedId(site._id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/10 transition">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <button
            onClick={() => navigate("/generate")}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition">
            + New Website
          </button>
        </div>
      </div>

      <div className="px-6 py-10 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-sm text-zinc-400 mb-1">Welcome Back</p>
          <h1 className="text-3xl font-bold">{userData?.name}</h1>
        </motion.div>

        {loading && <div className="mt-24 text-center text-zinc-400">Loading your websites...</div>}
        {error && !loading && <div className="mt-24 text-center text-red-400">{error}</div>}
        {!loading && websites?.length === 0 && (
          <div className="mt-24 text-center text-zinc-400">
            <p className="mb-4">You have no websites yet.</p>
            <button
              onClick={() => navigate("/generate")}
              className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:scale-105 transition">
              + Create your first website
            </button>
          </div>
        )}

        {websites?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites.map((w, i) => {
              const copied = copiedId === w._id
              return (
                <motion.div
                  key={w._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(`/editor/${w._id}`)}
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col cursor-pointer"
                >
                  {/* ✅ FIX 1 — No iframe, lightweight preview card instead */}
                  <div className="relative h-40 bg-gradient-to-br from-indigo-950 via-purple-950 to-black flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 70% 20%, #8b5cf6 0%, transparent 40%)' }} />
                    <div className="relative text-center px-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2">
                        <span className="text-lg">🌐</span>
                      </div>
                      <p className="text-xs text-zinc-400 truncate max-w-[180px]">{w.title}</p>
                    </div>
                    {w.deployed && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-medium">
                        Live ●
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <h3 className="text-base font-semibold line-clamp-2">{w.title}</h3>
                    <p className="text-xs text-zinc-400">
                      Last Updated {new Date(w.updatedAt).toLocaleDateString()}
                    </p>

                    {!w.deployed ? (
                      // ✅ FIX 2 — bg-gradient-to-r instead of bg-linear-to-r
                      <button
                        onClick={(e) => handleDeploy(e, w._id)}
                        className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 transition">
                        <Rocket size={18} />
                        Deploy
                      </button>
                    ) : (
                      // ✅ FIX 3 — comma replaced with semicolon in onClick
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); handleCopy(e, w); }}
                        whileTap={{ scale: 0.95 }}
                        className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                          ${copied
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-white/10 hover:bg-white/20 border border-white/10"
                          }`}
                      >
                        {copied ? <><Check size={14} /> Link Copied</> : <><Share2 size={14} /> Share Link</>}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
