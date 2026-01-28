import ProductCardV2 from "./ProductCardV2";
import styles from "./styles/ProductGrid.module.css";

export default function ProductGrid({ products, iswishlisted = false, onToggleWishlist, showQuantity = true, }) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCardV2
          key={product.id}
          product={product}
          onAddToCart={(p) => console.log("Add to cart:", p)}
          isWishlisted={iswishlisted}
          onToggleWishlist={onToggleWishlist}
          showQuantity={showQuantity}
        />
      ))}
    </div>
  );
}
