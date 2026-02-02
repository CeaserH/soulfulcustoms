import React from "react";
import {
  CalendarCheck,
  PhoneCall,
  Truck,
  Wrench,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

export default function AboutPage({ setPage }) {
  const steps = [
    {
      title: "Schedule an Appointment",
      icon: CalendarCheck,
      description:
        "Customers schedule service through our website or by phone. Appointments and consultations are always free.",
    },
    {
      title: "Confirmation Call",
      icon: PhoneCall,
      description:
        "If booked online, we follow up with a quick call to confirm details, answer questions, and set expectations.",
    },
    {
      title: "Device Pickup",
      icon: Truck,
      description:
        "We pick up your device and safely transport it to our workshop for diagnostics and repair.",
    },
    {
      title: "Repair & Testing",
      icon: Wrench,
      description:
        "We diagnose the issue, perform the repair, and thoroughly test the system to ensure stability and performance.",
    },
    {
      title: "Return & Payment",
      icon: CreditCard,
      description:
        "Your device is returned once repairs are complete. Payment is collected only if the repair is successful — no fix, no fee.",
    },
  ];

  return (
    <div className="py-16 px-6 max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
          About <span className="text-blue-600">Vallejo Tech</span>
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
          Honest, local computer repair focused on transparency, education, and results.
        </p>
      </div>

      {/* About Us */}
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 space-y-4">
        <h3 className="text-2xl font-black uppercase tracking-tight text-white">
          Our Story
        </h3>

        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
          Vallejo Tech was founded by local computer specialist{" "}
          <span className="text-white font-bold">Ceaser Hernandez</span> with a
          simple mission: to provide the Vallejo community with honest, expert,
          and affordable technical support—without subscriptions.
        </p>

        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
          In an industry often plagued by confusing jargon and inflated pricing,
          we prioritize transparency and education. Every diagnostic is thorough,
          and every repair is handled with care.
        </p>

        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
          Unlike big-box stores, Vallejo Tech is built around personal service.
          We believe technology should work for you—not the other way around.
          Our goal is to get your devices running smoothly so you can focus on
          what matters most.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Transparent
            </p>
            <p className="text-gray-300 text-sm">
              Clear pricing, honest answers, no pressure.
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Local & Personal
            </p>
            <p className="text-gray-300 text-sm">
              One technician. One point of contact.
            </p>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              No Fix, No Fee
            </p>
            <p className="text-gray-300 text-sm">
              If we can’t repair it, you pay nothing.
            </p>
          </div>
        </div>
      </div>

      {/* Process / Roadmap */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
            How It Works
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
            A simple, straightforward process designed for convenience and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-blue-600/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                  <step.icon className="text-blue-500" size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                  Step {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2">
                {step.title}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Small clarity note */}
        <div className="max-w-4xl mx-auto text-center pt-2">
          <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-relaxed">
            Online bookings receive a quick confirmation call to verify details and lock in your time window.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => (typeof setPage === "function" ? setPage("scheduling") : null)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20"
        >
          <CheckCircle2 size={18} />
          Book Appointment
        </button>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-4">
          Appointment and consultation are 100% free.
        </p>
      </div>
    </div>
  );
}
