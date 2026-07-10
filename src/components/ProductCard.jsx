export default function ProductCard({ product, onClick }) {
  const options =
    product.options.sizes ||
    product.options.styles ||
    product.options.quantities ||
    [];
  const optionCount = product.options.visualStyles
    ? product.options.visualStyles.length
    : options.length;
  const prices = options.map((option) => option.price);
  const minPrice = Math.min(...prices, product.basePrice);
  const maxPrice = Math.max(...prices, product.basePrice);
  const priceLabel =
    minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;

  return (
    <button type="button" className="productCard" onClick={onClick}>
      <div className="productImageWrap">
        <img src={product.image} alt={product.name} className="productImage" />
      </div>

      <div className="productInfo">
        <div>
          <div className="productMeta">
            <span>{product.category}</span>
            <span>
              {optionCount} {optionCount === 1 ? "option" : "options"}
            </span>
          </div>

          <h3>{product.name}</h3>

          <p>{product.description}</p>
        </div>

        <div className="productFooter">
          <span className="productPrice">{priceLabel}</span>
          <span className="productAction">View</span>
        </div>
      </div>
    </button>
  );
}
