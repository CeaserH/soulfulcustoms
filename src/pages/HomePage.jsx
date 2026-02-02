import React from "react";
import { MapPin, ChevronRight } from "lucide-react";

export default function HomePage({ setPage }) {
  const logoMainUrl = "https://raw.githubusercontent.com/CeaserH/logo/main/logo.png";
  const backgroundImage =
    "https://upload.wikimedia.org/wikipedia/commons/3/33/Vallejo_-_panoramio_%287%29.jpg";

  return (
    <main className="relative flex-grow">
      {/* Static background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />

      {/* Foreground content (scrolls normally) */}
      <div className="relative z-10 flex items-center py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="flex flex-col items-center space-y-8">
            <div className="w-full max-w-[480px] md:max-w-[620px]">
              <img
                src={logoMainUrl}
                alt="Vallejo Tech"
                className="w-full h-auto object-contain brightness-110 drop-shadow-[0_0_35px_rgba(37,99,235,0.25)]"
              />
            </div>

            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full">
              <MapPin size={14} className="text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                Vallejo, CA — Pick-up & Drop-off
              </span>
            </div>
          </div>

          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
            System. <br />
            <span className="text-blue-600">Restored.</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-2xl max-w-2xl font-medium leading-relaxed mx-auto">
            Expert repair for PCs and laptops. From OS restoration and virus removal
            to replacing failing hardware.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              onClick={() => setPage("scheduling")}
              aria-label="Book an appointment"
              className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-900/20"
            >
              Book Appointment
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => setPage("about")}
              aria-label="Learn more about Vallejo Tech"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
