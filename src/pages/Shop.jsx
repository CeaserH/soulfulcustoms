import products
from "../data/products";

import ProductCard
from "../components/ProductCard";

export default function Shop(){

return(

<section className="shopPage">

<h1>

Canvas Collection

</h1>

<div className="productGrid">

{

products.map(

product=>(

<ProductCard

key={product.id}

product={product}

/>

)

)

}

</div>

</section>

);

}