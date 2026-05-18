import React from "react";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

export default function Home() {

    return (

        <section className="luxHero">

            <div className="heroOverlay"></div>

            <img
                src={logo}
                className="luxLogo"
                alt=""
            />

            <h1>

                Preserve
                Your
                Moments

            </h1>

            <p>

                Museum-quality photography prints,
                premium finishes,
                handcrafted presentation.

            </p>

            <div className="heroButtons">

                <Link
                    to="/order"
                    className="primaryBtn"
                >
                    Order Prints
                </Link>

                <Link
                    to="/about"
                    className="secondaryBtn"
                >
                    Our Story
                </Link>

            </div>

            <section className="brandStrip">

<div className="colorLine"></div>

<p>

Custom Prints • Canvas • Portraits • Wall Art • Keepsakes

</p>

<div className="colorLine"></div>

</section>

        </section>

    );
}