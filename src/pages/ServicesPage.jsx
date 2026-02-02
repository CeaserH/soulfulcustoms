import React from "react";
import GlassCard from "../components/GlassCard";
import {
  Activity,
  ShieldAlert,
  HardDrive,
  Settings2,
  Monitor,
  Cpu,
} from "lucide-react";

const LABOR_RATE = "$100 / hr";

const servicesData = [
  {
    title: "Diagnostic & Optimization",
    icon: Activity,
    description:
      "Comprehensive system analysis to pinpoint software bottlenecks or failing hardware.",
    pricing: "$75 + Labor",
  },
  {
    title: "Cybersecurity & Cleanup",
    icon: ShieldAlert,
    description:
      "Advanced malware removal and system hardening. We secure your digital identity.",
    pricing: "$125 + Labor",
  },
  {
    title: "Hardware Replacement",
    icon: HardDrive,
    description:
      "Professional replacement of failing components or performance upgrades.",
    pricing: LABOR_RATE,
  },
  {
    title: "HDD / SSD Recovery & Cloning",
    icon: HardDrive,
    description:
      "Drive recovery, data transfer, and disk-to-disk cloning for failing or upgraded storage devices.",
    pricing: LABOR_RATE,
  },
  {
    title: "OS Engineering & Migration",
    icon: Settings2,
    description:
      "Clean deployment of Windows or macOS environments. Secure data migration.",
    pricing: "$150 + Labor",
  },
  {
    title: "On-Demand Remote Support",
    icon: Monitor,
    description:
      "Secure, encrypted remote sessions for rapid software troubleshooting.",
    pricing: "$75 / hr",
  },
  {
    title: "Signature Custom Builds",
    icon: Cpu,
    description:
      "Design and assembly of tailored systems for gaming, productivity, or specialized workloads.",
    pricing: LABOR_RATE,
  },
];

export default function ServicesPage({ setPage, onSelectService }) {
  const handleClick = (serviceTitle) => {
    if (typeof onSelectService === "function") {
      onSelectService(serviceTitle);
      return;
    }

    if (typeof setPage === "function") {
      setPage("scheduling");
    }
  };

  return (
    <div className="py-16 max-w-6xl mx-auto px-6 space-y-14">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black uppercase tracking-tight">
          Our Services
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          Professional diagnostics, repair, and system engineering for PCs and
          laptops. Transparent pricing. No shortcuts.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {servicesData.map((service) => (
          <GlassCard
            key={service.title}
            className="p-8 flex flex-col gap-5 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => handleClick(service.title)}
          >
            <service.icon className="w-10 h-10 text-blue-500" />
            <h3 className="font-black text-lg uppercase tracking-tight">
              {service.title}
            </h3>
            <p className="text-gray-300 text-sm flex-1 leading-relaxed">
              {service.description}
            </p>
            <p className="text-white font-black text-sm">
              {service.pricing}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Trust Guarantees */}
      <div className="max-w-4xl mx-auto text-center space-y-3 pt-6">
        <p className="text-sm md:text-base font-black uppercase tracking-wide text-white">
          If we cannot repair it, you pay nothing.
        </p>
        <p className="text-[12px] font-bold uppercase tracking-widest text-blue-500">
          Appointment and consultation are 100% free.
        </p>
      </div>

      {/* Labor Disclaimer */}
      <div className="max-w-4xl mx-auto text-center pt-6">
        <p className="text-[11px] text-gray-500 uppercase tracking-widest leading-relaxed">
          Labor Rate: <span className="text-white font-bold">$100 / hr</span>
          <br />
          Flat-fee services cover diagnostics and specialized procedures only.
          Labor is billed separately where applicable.
        </p>
      </div>
    </div>
  );
}
