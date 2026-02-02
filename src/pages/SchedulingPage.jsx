import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ✅ IMPORTANT: use initialized instances
import { auth, db } from "../firebase";

const GOOGLE_MAPS_SCRIPT_ID = "google-maps-js";

function loadGoogleMapsPlaces(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps && window.google.maps.places) {
      resolve();
      return;
    }

    const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Google Maps script failed to load."))
      );
      return;
    }

    if (!apiKey) {
      reject(
        new Error("Missing Google Maps API key (PARCEL_GOOGLE_MAPS_API_KEY).")
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places`;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Maps script failed to load."));
    document.head.appendChild(script);
  });
}

// Simple placeholder replacer: {{name}}, {{date}}, etc.
function fillTemplate(str, vars) {
  if (!str) return "";
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = vars[key];
    return val === undefined || val === null ? "" : String(val);
  });
}

const SchedulingPage = ({ setPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    date: "",
    timeSlot: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState(null);

  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const appId = "vallejotech";

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  // Ensure anonymous auth for customers
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch((e) =>
          console.error("Auth initialization failed:", e)
        );
      }
    });
    return () => unsubscribe();
  }, []);

  // Load Google Maps Places ONLY on this page
  useEffect(() => {
    const apiKey = process.env.PARCEL_GOOGLE_MAPS_API_KEY;

    loadGoogleMapsPlaces(apiKey)
      .then(() => {
        setMapsReady(true);
        setMapsError(null);
      })
      .catch((e) => {
        console.error(e);
        setMapsReady(false);
        setMapsError(e.message || "Failed to load Google Maps.");
      });
  }, []);

  // Initialize Places Autocomplete once Maps is ready
  useEffect(() => {
    if (!mapsReady) return;
    if (!addressInputRef.current) return;
    if (!window.google || !window.google.maps || !window.google.maps.places)
      return;

    if (autocompleteRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
        types: ["address"],
      }
    );

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (place?.formatted_address) {
        setFormData((prev) => ({ ...prev, address: place.formatted_address }));
        setError(null);
      }
    });
  }, [mapsReady]);

  // Availability fetch
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.date) return;

      setCheckingAvailability(true);
      try {
        const appointmentsRef = collection(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "appointments"
        );

        const q = query(appointmentsRef, where("date", "==", formData.date));
        const querySnapshot = await getDocs(q);
        const booked = querySnapshot.docs.map((doc) => doc.data().timeSlot);
        setBookedSlots(booked);
      } catch (err) {
        console.error("Availability Check Error:", err);
      } finally {
        setCheckingAvailability(false);
      }
    };

    fetchAvailability();
  }, [formData.date]);

  async function fetchTemplate(templateId) {
    const tplRef = doc(db, "emailTemplates", templateId);
    const snap = await getDoc(tplRef);
    if (!snap.exists()) return null;
    return snap.data();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address) {
      setError("Please select a valid address from the suggestions.");
      return;
    }

    setLoading(true);
    setError(null);

    const watchdog = setTimeout(() => {
      setLoading(false);
      setError("Network Timeout: Firestore is not responding. Please try again.");
    }, 15000);

    try {
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }

      // 1) Save appointment
      const apptRef = collection(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "appointments"
      );
      console.log("1) Writing appointment...");
      await addDoc(apptRef, {
        ...formData,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        status: "pending",
      });

      // 2) Load templates from Firestore
      const vars = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        date: formData.date,
        time: formData.timeSlot,
        description: formData.description,
      };
      console.log("2) Reading templates...");

      const customerTpl = await fetchTemplate("appointment_confirmation");
      const businessTpl = await fetchTemplate("business_alert");

      console.log("3) Writing mail docs...");
      // 3) Write mail docs to the extension watched collection
      const mailRef = collection(db, "artifacts", appId, "public", "data", "mail");

      // --- Customer confirmation email ---
      if (customerTpl?.subject && customerTpl?.html) {
        await addDoc(mailRef, {
          to: formData.email,
          replyTo: "support@vallejotech.org",
          message: {
            subject: fillTemplate(customerTpl.subject, vars),
            html: fillTemplate(customerTpl.html, vars),
          },
        });
      } else {
        // Fallback if template missing
        await addDoc(mailRef, {
          to: formData.email,
          replyTo: "support@vallejotech.org",
          message: {
            subject: "Your Vallejo Tech Appointment Request",
            html: `<p>Hi ${formData.name},</p><p>We received your request for ${formData.date} at ${formData.timeSlot}. We will contact you to confirm.</p>`,
          },
        });
      }

      // --- Business alert email ---
      if (businessTpl?.subject && businessTpl?.html) {
        await addDoc(mailRef, {
          to: "support@vallejotech.org",
          replyTo: formData.email,
          message: {
            subject: fillTemplate(businessTpl.subject, vars),
            html: fillTemplate(businessTpl.html, vars),
          },
        });
      } else {
        // Fallback if template missing
        await addDoc(mailRef, {
          to: "support@vallejotech.org",
          replyTo: formData.email,
          message: {
            subject: `New Appointment Request – ${formData.name}`,
            html: `
              <h2>New Appointment Request</h2>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Phone:</strong> ${formData.phone}</p>
              <p><strong>Address:</strong> ${formData.address}</p>
              <p><strong>Date:</strong> ${formData.date}</p>
              <p><strong>Time:</strong> ${formData.timeSlot}</p>
              <p><strong>Description:</strong> ${formData.description}</p>
            `,
          },
        });
      }

      setSuccess(true);
    } catch (err) {
      console.error("Submission Error:", err);
      setError(`Failed to submit: ${err.message}`);
    } finally {
      clearTimeout(watchdog);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-blue-500/30 p-10 rounded-3xl text-center shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black italic uppercase text-white mb-4 tracking-tighter">
            Request Sent
          </h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Your appointment has been requested. We will review the details and contact you for confirmation.
          </p>
          <button
            onClick={() =>
              setPage ? setPage("home") : (window.location.href = "/")
            }
            className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-l-4 border-blue-600 pl-6">
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
            Schedule <span className="text-blue-600">Service</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-2">
            Vallejo Tech // Appointment Scheduling
          </p>
        </header>

        {mapsError && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-yellow-200 text-xs font-medium">
            Address suggestions are unavailable right now. You can still type your address manually.
            <div className="mt-1 opacity-70">{mapsError}</div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#0a0a0a] border border-white/5 p-8 md:p-10 rounded-3xl shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input
                  required
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 focus:outline-none transition-all"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 focus:outline-none transition-all"
                  placeholder="email@address.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input
                  type="tel"
                  required
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 focus:outline-none transition-all"
                  placeholder="(707) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input
                  ref={addressInputRef}
                  required
                  className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 focus:outline-none transition-all"
                  placeholder={mapsReady ? "Start typing your address..." : "Loading address suggestions..."}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500/50 focus:outline-none transition-all text-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, timeSlot: "" })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex justify-between">
                <span>Time Slot</span>
                {checkingAvailability && <Loader2 className="animate-spin text-blue-500" size={12} />}
              </label>
              <select
                required
                disabled={!formData.date || checkingAvailability}
                className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500/50 focus:outline-none transition-all text-sm appearance-none"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              >
                <option value="">Select Time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                    {slot} {bookedSlots.includes(slot) ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
              Description of Issue
            </label>
            <textarea
              required
              rows="4"
              className="w-full bg-[#050505] border border-white/10 rounded-2xl py-4 px-6 focus:border-blue-500/50 focus:outline-none transition-all text-sm"
              placeholder="Please describe what's wrong with your device..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !formData.timeSlot}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Submit Appointment Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SchedulingPage;
