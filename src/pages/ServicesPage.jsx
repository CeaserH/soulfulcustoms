// src/pages/ServicesPage.jsx
import React from "react";
import GlassCard from "../components/GlassCard";
import {
  Activity,
  ShieldAlert,
  HardDrive,
  Settings2,
  Monitor,
  Cpu,
  Database,
  CheckCircle2,
} from "lucide-react";

const LABOR_RATE = "$100 / hr";

const servicesData = [
  {
    title: "Diagnostics & Optimization",
    icon: Activity,
    description:
      "We find the real issue—software bottlenecks, failing hardware, or misconfigurations—then explain options clearly before any work begins.",
    pricing: "Flat diagnostic + quoted repair options",
  },
  {
    title: "Cybersecurity & Cleanup",
    icon: ShieldAlert,
    description:
      "Malware removal, system cleanup, and basic hardening to help protect your device and restore performance—no scare tactics, no upsells.",
    pricing: "Typically flat-rate (quoted upfront)",
  },
  {
    title: "Hardware Replacement & Upgrades",
    icon: HardDrive,
    description:
      "From drive and battery replacements to RAM upgrades—installed cleanly, tested thoroughly, and confirmed stable before return.",
    pricing: `Labor billed hourly (${LABOR_RATE}) + parts`,
  },
  {
    title: "OS Install & Data Migration",
    icon: Settings2,
    description:
      "Fresh Windows/macOS installs, driver setup, updates, and secure data migration—built for reliability, not quick fixes.",
    pricing: "Commonly flat-rate + quoted add-ons",
  },
  {
    title: "On-Demand Remote Support",
    icon: Monitor,
    description:
      "Fast help without the trip. Great for software issues, setup, troubleshooting, tune-ups, and guided fixes—secure remote sessions.",
    pricing: "$75 / hr",
  },
  {
    title: "Signature Custom Builds",
    icon: Cpu,
    description:
      "Custom PCs built for gaming, productivity, or specialized workloads—clean cable management, thermal checks, and stability testing.",
    pricing: `Labor billed hourly (${LABOR_RATE}) + parts`,
  },
  {
    title: "HDD/SSD Recovery & Drive Cloning",
    icon: Database,
    description:
      "Data recovery attempts and drive cloning for failing storage. We take a careful, non-destructive approach whenever possible.",
    pricing: `Labor billed hourly (${LABOR_RATE}) (quoted after evaluation)`,
  },
];

export default function ServicesPage({ onSelectService }) {
  return (
    <div className="py-16 max-w-6xl mx-auto px-6 space-y-14">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tight">
          Our Services
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
          Professional diagnostics, repair, and system engineering for PCs and
          laptops. Clear communication. No pressure. No surprises.
        </p>
      </div>

      {/* Trust/Promise Banner */}
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">
              Our Promise
            </p>
            <p className="text-white font-black text-lg">
              If we can’t repair it, you pay nothing.
            </p>
            <p className="text-gray-400 text-sm">
              Appointment & consultation are <span className="text-white font-bold">100% free</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400">
            <CheckCircle2 size={16} className="text-blue-500" />
            Transparent Quotes Before Work Begins
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {servicesData.map((service) => (
          <GlassCard
            key={service.title}
            className="p-8 flex flex-col gap-5 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => onSelectService?.(service.title)}
          >
            <service.icon className="w-10 h-10 text-blue-500" />

            <h3 className="font-black text-lg uppercase tracking-tight">
              {service.title}
            </h3>

            <p className="text-gray-300 text-sm flex-1 leading-relaxed">
              {service.description}
            </p>

            <div className="pt-3 border-t border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Pricing
              </p>
              <p className="text-white font-black text-sm">{service.pricing}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Pricing Note */}
      <div className="max-w-4xl mx-auto text-center pt-10 space-y-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-relaxed">
          Labor Rate: <span className="text-white font-bold">{LABOR_RATE}</span>
        </p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Flat-fee services cover diagnostics and specialized procedures only.
          Where labor applies, you’ll always get a clear quote before we proceed.
        </p>
      </div>
    </div>
  );
}
