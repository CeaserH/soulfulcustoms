import React from "react";

import {
Link,
useLocation
} from "react-router-dom";

import {
useCart
} from "../context/CartContext";

import logo from "../assets/logo.png";

export default function Navbar() {

const location =
useLocation();

const {
cart
} = useCart();

const cartCount = cart.reduce(

(total,item)=>

total + item.quantity,

0

);

return(

<header className="navbar">

<div className="navLeft">

<Link
to="/"
className="logoLink"
>

<img

src={logo}

alt="Soulful Customs"

className="navLogo"

/>

</Link>

</div>

<nav>

<Link

to="/"

className={

location.pathname === "/"

?

"activeNav"

:

""

}

>

Home

</Link>

<Link

to="/shop"

className={

location.pathname === "/shop"

?

"activeNav"

:

""

}

>

Shop

</Link>

<Link

to="/about"

className={

location.pathname === "/about"

?

"activeNav"

:

""

}

>

About

</Link>

<Link

to="/contact"

className={

location.pathname === "/contact"

?

"activeNav"

:

""

}

>

Contact

</Link>

</nav>

<div className="navRight">

<Link

to="/checkout"

className="cartButton"

>

🛒

<span
className="cartCount"
>

{cartCount}

</span>

</Link>

</div>

</header>

);

}