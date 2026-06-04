export default function ProductCard({
  product,

  onClick,
}) {
  return (
    <div className="productCard" onClick={onClick}>
      <img src={product.image} alt={product.name} className="productImage" />

      <div className="productInfo">
        <h3>{product.name}</h3>

        <p>{product.description}</p>

        <span className="productPrice">
          Starting at ${product.basePrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
