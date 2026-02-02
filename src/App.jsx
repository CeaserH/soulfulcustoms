import React, { useEffect, useState } from "react";

import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SchedulingPage from "./pages/SchedulingPage";

// Admin pages (hidden)
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Firebase auth (for admin gate)
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const logoSmallUrl =
  "https://raw.githubusercontent.com/CeaserH/logo/main/logosmall.png";

// ✅ Base path: GitHub Pages uses /vallejo-tech, custom domain uses root
const BASE_PATH =
  window.location.hostname === "ceaserh.github.io" ? "/vallejo-tech" : "";

// Normalize pathname by removing BASE_PATH if present
function normalizePath(pathname) {
  const path = (pathname || "/").toLowerCase();
  if (BASE_PATH && path.startsWith(BASE_PATH)) {
    const stripped = path.slice(BASE_PATH.length);
    return stripped.length ? stripped : "/";
  }
  return path;
}

// Map URL path -> internal page state
function pathToPage(pathname) {
  const cleaned = normalizePath(pathname);

  if (cleaned.startsWith("/admin")) return "admin";
  if (cleaned.startsWith("/services")) return "services";
  if (cleaned.startsWith("/about")) return "about";
  if (cleaned.startsWith("/contact")) return "contact";
  if (cleaned.startsWith("/schedule") || cleaned.startsWith("/scheduling"))
    return "scheduling";

  return "home";
}

// Map internal page state -> URL path (with BASE_PATH when needed)
function pageToPath(page) {
  switch (page) {
    case "services":
      return `${BASE_PATH}/services`;
    case "about":
      return `${BASE_PATH}/about`;
    case "contact":
      return `${BASE_PATH}/contact`;
    case "scheduling":
      return `${BASE_PATH}/schedule`;
    case "admin":
      return `${BASE_PATH}/admin`;
    case "home":
    default:
      return `${BASE_PATH}/`;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [user, setUser] = useState(null);

  // 1) On load, restore route if redirected by GitHub Pages 404.html
  useEffect(() => {
    const savedPath = sessionStorage.getItem("spa:path");
    const savedSearch = sessionStorage.getItem("spa:search") || "";
    const savedHash = sessionStorage.getItem("spa:hash") || "";

    if (savedPath) {
      sessionStorage.removeItem("spa:path");
      sessionStorage.removeItem("spa:search");
      sessionStorage.removeItem("spa:hash");

      const restored = savedPath + savedSearch + savedHash;
      window.history.replaceState({}, "", restored);
    }

    setCurrentPage(pathToPage(window.location.pathname));
  }, []);

  // 2) Back/forward navigation
  useEffect(() => {
    const handler = () => setCurrentPage(pathToPage(window.location.pathname));
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // 3) Track Firebase auth user for admin page gate
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  // 4) Controlled navigation helper
  const goTo = (page) => {
    const nextPath = pageToPath(page);
    window.history.pushState({}, "", nextPath);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "services":
        return <ServicesPage setPage={goTo} />;
      case "about":
        return <AboutPage setPage={goTo} />;
      case "contact":
        return <ContactPage setPage={goTo} />;
      case "scheduling":
        return <SchedulingPage setPage={goTo} />;

      // Hidden admin route
      case "admin":
        return user ? (
          <AdminDashboard onExit={() => goTo("home")} />
        ) : (
          <AdminLogin />
        );

      case "home":
      default:
        return <HomePage setPage={goTo} />;
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <button onClick={() => goTo("home")} className="flex items-center gap-3">
            <img
              src={logoSmallUrl}
              alt="Vallejo Tech"
              className="w-9 h-9 object-contain"
            />
            <span className="text-xl font-black tracking-tighter italic">
              VALLEJO<span className="text-blue-600">TECH</span>
            </span>
          </button>

          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  currentPage === item.id
                    ? "text-blue-500"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => goTo("scheduling")}
              className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Book Appointment
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="flex-grow">{renderPage()}</div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center space-y-3">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} Vallejo Tech
          </p>

          {currentPage === "home" && (
            <p className="text-[9px] text-gray-500">
              Background photo:{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:Vallejo_-_panoramio_(7).jpg"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-blue-400"
              >
                “Vallejo – Panoramio (7)”
              </a>{" "}
              by Patrick Nouhailler, licensed under{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-blue-400"
              >
                CC BY-SA 3.0
              </a>
              .
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
