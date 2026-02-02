import React from "react";

const GlassCard = ({
  children,
  className = "",
  as: Component = "div",
}) => {
  return (
    <Component
      className={`
        bg-black/70
        backdrop-blur-md
        border border-white/10
        rounded-2xl
        shadow-2xl
        transition-all duration-300
        hover:border-blue-500/20
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
