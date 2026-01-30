import ProductCardV2 from "./ProductCardV2";
import styles from "./styles/ProductGrid.module.css";
import { useStore } from "../../store/store";

export default function ProductGrid({ products, iswishlisted = false, onToggleWishlist, showQuantity = true, }) {
  const { customerData } = useStore();

  return (
    <div className={styles.grid}>
      {products.map((product) => {
        const isWishlisted = customerData.wishlist.some(item => item.id === product.id);
        return (
          <ProductCardV2
            key={product.id}
            product={product}
            onAddToCart={(p) => console.log("Add to cart:", p)}
            isWishlisted={iswishlisted || isWishlisted}
            onToggleWishlist={onToggleWishlist}
            showQuantity={showQuantity}
          />
        );
      })}
    </div>
  );
}
