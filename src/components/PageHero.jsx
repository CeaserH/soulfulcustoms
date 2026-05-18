import React from "react";

export default function PageHero({
    title,
    subtitle
}) {
    return (
        <section className="pageHero">

            <div className="heroGlow glow1"></div>
            <div className="heroGlow glow2"></div>

            <div className="pageHeroContent">

                <h1>{title}</h1>

                <p>
                    {subtitle}
                </p>

            </div>

        </section>
    );
}