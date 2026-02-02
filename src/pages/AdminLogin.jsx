import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ShieldAlert, Chrome, Lock } from "lucide-react";

import { auth, db } from "../firebase";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1) Google SSO
      const result = await signInWithPopup(auth, provider);
      const uid = result?.user?.uid;

      if (!uid) {
        throw new Error("Sign-in succeeded but no UID returned.");
      }

      // 2) Check Firestore admin gate: admins/{uid}
      const adminRef = doc(db, "admins", uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        // Not authorized → sign out immediately
        await signOut(auth);
        setError("Authorization failed. This Google account is not approved for admin access.");
        setLoading(false);
        return;
      }

      // ✅ Authorized: App will show AdminDashboard since user stays logged in
      setLoading(false);
    } catch (err) {
      console.error("Admin Login Error:", err);
      setError("Authorization failed. Please try again or use an approved admin account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 bg-[#0a0a0a] border border-white/5 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Lock size={120} />
        </div>

        <div className="text-center relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-blue-600/10 border border-blue-600/20 mb-6">
            <ShieldAlert className="text-blue-500 w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Admin <span className="text-blue-600">Gate</span>
          </h2>
          <p className="mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">
            Vallejo Tech Internal Systems
          </p>
        </div>

        <div className="mt-8 space-y-4 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-500 text-[10px] font-black uppercase text-center">
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-black uppercase tracking-widest rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <Chrome className="h-5 w-5 text-blue-300 group-hover:text-blue-100" />
            </span>
            {loading ? "Verifying..." : "Sign in with Google"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
            Authorized Personnel Only <br />
            Access is logged and monitored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
