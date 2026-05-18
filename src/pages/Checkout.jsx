import React from "react";

import {
useCart
} from "../context/CartContext";

export default function Checkout() {

const {
cart,
setCart
} = useCart();

const subtotal = cart.reduce(

(total,item)=>

total +

(item.price * item.quantity),

0

);

const removeItem = (id)=>{

setCart(

cart.filter(

item=>

item.id !== id

)

);

};

const updateQuantity=(id,value)=>{

const qty=Math.max(
1,
parseInt(value)||1
);

setCart(

cart.map(

item=>

item.id===id

?

{

...item,

quantity:qty

}

:

item

)

);

};

const increaseQuantity=(id)=>{

setCart(

cart.map(

item=>

item.id===id

?

{

...item,

quantity:

item.quantity+1

}

:

item

)

);

};

const decreaseQuantity=(id)=>{

setCart(

cart.map(

item=>

item.id===id

?

{

...item,

quantity:

Math.max(
1,
item.quantity-1
)

}

:

item

)

);

};

return(

<section className="checkoutPage">

<div className="checkoutContainer">

<div className="checkoutLeft">

<h1>

Shopping Cart

</h1>

{

cart.length===0

?

(

<div className="emptyCart">

<p>

Your cart is empty

</p>

</div>

)

:

(

cart.map(item=>(

<div

className="checkoutItem"

key={item.id}

>

<img

src={item.image}

alt=""

/>

<div
className="checkoutInfo"
>

<h3>

{item.name}

</h3>

<p>

{item.size}

</p>

<div
className="quantityControl"
>

<button

onClick={()=>

decreaseQuantity(
item.id
)

}

>

−

</button>

<input

type="number"

min="1"

value={item.quantity}

onChange={(e)=>

updateQuantity(

item.id,

e.target.value

)

}

/>

<button

onClick={()=>

increaseQuantity(
item.id
)

}

>

+

</button>

</div>

</div>

<div
className="checkoutActions"
>

<h4>

$

{

(

item.price *

item.quantity

).toFixed(2)

}

</h4>

<button

onClick={()=>

removeItem(
item.id
)

}

>

Remove

</button>

</div>

</div>

))

)

}

</div>

<div className="checkoutRight">

<h2>

Order Summary

</h2>

<div className="summaryRow">

<span>

Subtotal

</span>

<span>

$

{subtotal.toFixed(2)}

</span>

</div>

<div className="summaryRow">

<span>

Shipping

</span>

<span>

Calculated Later

</span>

</div>

<div className="summaryTotal">

<span>

Total

</span>

<span>

$

{subtotal.toFixed(2)}

</span>

</div>

<button
className="primaryBtn"
>

Proceed To Checkout

</button>

</div>

</div>

</section>

);

}