export function getStockQuantity(product) {
  const quantity = Number(product.stockQuantity ?? 0);
  return Number.isSafeInteger(quantity) && quantity > 0 ? quantity : 0;
}

export function isOutOfStock(product) {
  return getStockQuantity(product) === 0;
}
