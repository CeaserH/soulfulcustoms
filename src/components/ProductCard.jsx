import {
useCart
}
from "../context/CartContext";

export default function ProductCard({

product

}){

const {

addToCart

}=useCart();

return(

<div className="productCard">

<img

src={product.image}

alt=""

/>

<div className="productInfo">

<h3>

{product.name}

</h3>

<p>

{product.description}

</p>

<span>

{product.size}

</span>

<div className="priceRow">

<h4>

$

{product.price}

</h4>

<button

onClick={()=>

addToCart(

product

)

}

>

Add To Cart

</button>

</div>

</div>

</div>

);

}