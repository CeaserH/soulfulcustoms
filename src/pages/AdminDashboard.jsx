import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  User,
  LayoutDashboard,
  LogOut,
  Clock,
  Search,
  CheckCircle2,
  Trash2,
  Loader2,
  Archive,
  History,
  FileText,
  ShieldCheck,
  Calendar,
} from "lucide-react";

import { auth, db } from "../firebase";

const AdminDashboard = ({ onExit }) => {
  const [view, setView] = useState("queue");
  const [appointments, setAppointments] = useState([]);
  const [completedDocs, setCompletedDocs] = useState([]);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const appId = "vallejotech";
  const activeCollection = "appointments";
  const completedCollection = "completed_appointments";

  const formatTimestamp = (ts) => {
    if (!ts) return "Processing...";
    const date = ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Auth + Admin Gate Check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);

      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const adminRef = doc(db, "admins", u.uid);
        const adminSnap = await getDoc(adminRef);
        setIsAdmin(adminSnap.exists());
      } catch (e) {
        console.error(e);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // Firestore subscriptions (admins only)
  useEffect(() => {
    if (!user || !isAdmin) return;

    const activeRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      activeCollection
    );
    const compRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      completedCollection
    );

    const unsubActive = onSnapshot(
      activeRef,
      (s) => {
        const docs = s.docs.map((d) => ({ id: d.id, ...d.data() }));

        // ✅ Oldest first (createdAt ascending)
        docs.sort(
          (a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
        );

        setAppointments(docs);
      },
      (e) => setError(e.message)
    );

    const unsubComp = onSnapshot(
      compRef,
      (s) => {
        const docs = s.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Completed newest first is fine
        docs.sort(
          (a, b) => (b.completedAt?.seconds || 0) - (a.completedAt?.seconds || 0)
        );
        setCompletedDocs(docs);
      },
      (e) => setError(e.message)
    );

    return () => {
      unsubActive();
      unsubComp();
    };
  }, [user, isAdmin]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredAppointments = useMemo(() => {
    if (!normalizedSearch) return appointments;
    return appointments.filter((a) => {
      const haystack =
        `${a.name || ""} ${a.email || ""} ${a.phone || ""} ${a.description || ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [appointments, normalizedSearch]);

  const filteredCompleted = useMemo(() => {
    if (!normalizedSearch) return completedDocs;
    return completedDocs.filter((a) => {
      const haystack =
        `${a.name || ""} ${a.email || ""} ${a.phone || ""} ${a.description || ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [completedDocs, normalizedSearch]);

  const handleComplete = async (appt) => {
    if (!user || !isAdmin) return;
    setProcessingId(appt.id);
    setError(null);

    try {
      const completedRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        completedCollection,
        appt.id
      );

      await setDoc(completedRef, {
        ...appt,
        completedAt: serverTimestamp(),
      });

      const activeRef = doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        activeCollection,
        appt.id
      );
      await deleteDoc(activeRef);
    } catch (err) {
      console.error(err);
      setError("Failed to archive record.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id, collName) => {
    if (!user || !isAdmin) return;
    if (!window.confirm("Permanently delete this record?")) return;

    setProcessingId(id);
    setError(null);

    try {
      const docRef = doc(db, "artifacts", appId, "public", "data", collName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error(err);
      setError("Failed to delete record.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      onExit?.();
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" />
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-10 rounded-3xl text-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            Admin <span className="text-blue-600">Login</span> Required
          </h2>
          <button
            onClick={onExit}
            className="mt-8 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl transition-all"
          >
            Return
          </button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-red-500/20 p-10 rounded-3xl text-center">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">
            Access <span className="text-red-500">Denied</span>
          </h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-3">
            This account is not in the admin whitelist.
          </p>
          <button
            onClick={handleLogout}
            className="mt-8 w-full py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <nav className="w-full md:w-72 bg-[#0a0a0a] border-b md:border-b-0 md:border-r border-white/5 p-8 flex flex-col justify-between">
        <div className="space-y-10">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Vallejo<span className="text-blue-600">Tech</span>
            </h1>
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em] mt-1">
              Operator Node
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setView("queue")}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-xs uppercase border transition-all ${
                view === "queue"
                  ? "bg-blue-600/10 text-blue-500 border-blue-600/20"
                  : "text-gray-500 border-transparent hover:text-white"
              }`}
            >
              <LayoutDashboard size={18} /> Active Queue
            </button>

            <button
              onClick={() => setView("archive")}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-xs uppercase border transition-all ${
                view === "archive"
                  ? "bg-blue-600/10 text-blue-500 border-blue-600/20"
                  : "text-gray-500 border-transparent hover:text-white"
              }`}
            >
              <Archive size={18} /> Completed
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-500/70 hover:text-red-500 font-bold text-xs uppercase transition-all border border-transparent hover:border-red-500/20 rounded-xl"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </nav>

      {/* MAIN */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">
              {view === "queue" ? (
                <>
                  Active <span className="text-blue-600">Queue</span>
                </>
              ) : (
                <>
                  Service <span className="text-blue-600">Ledger</span>
                </>
              )}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              {view === "queue"
                ? `Pending Requests: ${appointments.length}`
                : `Archived Records: ${completedDocs.length}`}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="FILTER RECORDS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500/50"
            />
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        {/* Queue */}
        {view === "queue" ? (
          <div className="grid gap-6">
            {filteredAppointments.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <Clock className="mx-auto text-gray-700 mb-4" size={48} />
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                  Queue is currently clear
                </p>
              </div>
            ) : (
              filteredAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-2xl"
                >
                  {processingId === appt.id && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                      <Loader2 className="animate-spin text-blue-500" />
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                          <User size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black uppercase italic">
                            {appt.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                            {appt.email} • {appt.phone}
                          </p>

                          {/* ✅ Submitted timestamp */}
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">
                            Submitted:{" "}
                            <span className="text-gray-400 font-black">
                              {formatTimestamp(appt.createdAt)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-600 uppercase mb-1 flex items-center gap-2">
                          <FileText size={10} /> Request Details
                        </p>
                        <p className="text-sm text-gray-300 italic">
                          "{appt.description}"
                        </p>
                      </div>
                    </div>

                    <div className="md:w-52 flex flex-col justify-between items-end md:border-l border-white/5 md:pl-6">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">
                          Scheduled For
                        </p>
                        <p className="text-2xl font-black">{appt.date}</p>
                        <p className="text-xs font-bold text-gray-500">{appt.timeSlot}</p>
                      </div>

                      <div className="flex gap-2 w-full mt-6">
                        <button
                          onClick={() => handleComplete(appt)}
                          className="flex-1 py-3 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-xl border border-green-500/20 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={14} /> Complete
                        </button>
                        <button
                          onClick={() => handleDelete(appt.id, activeCollection)}
                          className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Completed */
          <div className="space-y-6">
            {filteredCompleted.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <History className="mx-auto text-gray-700 mb-4" size={48} />
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
                  No service history yet
                </p>
              </div>
            ) : (
              filteredCompleted.map((docItem) => (
                <div
                  key={docItem.id}
                  className="bg-[#0a0a0a]/50 border border-white/5 p-6 rounded-3xl group hover:bg-[#0a0a0a] transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                        <ShieldCheck size={18} className="text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-black uppercase italic text-lg">{docItem.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] font-black uppercase text-blue-500/70 flex items-center gap-1">
                            <Calendar size={10} /> Scheduled: {docItem.date}
                          </span>
                          <span className="text-[9px] font-black uppercase text-green-500/70 flex items-center gap-1">
                            <History size={10} /> Closed: {formatTimestamp(docItem.completedAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="bg-black/60 px-4 py-2 rounded-xl border border-white/5 text-center">
                        <p className="text-[8px] font-bold text-gray-500 uppercase">Status</p>
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-tighter">Completed</p>
                      </div>

                      <button
                        onClick={() => handleDelete(docItem.id, completedCollection)}
                        className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-[10px] text-gray-500 italic">
                      <span className="font-black text-gray-600 uppercase not-italic mr-2">
                        Lead Detail:
                      </span>
                      "{docItem.description}"
                    </div>
                    <div className="text-[10px] text-gray-500 italic text-right">
                      <span className="font-black text-gray-600 uppercase not-italic mr-2">
                        Closed:
                      </span>
                      {formatTimestamp(docItem.completedAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
