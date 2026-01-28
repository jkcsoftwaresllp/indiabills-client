import React from 'react'
import CartPage from '../../components/EcommerceCart/CartPage'
import styles from "./styles/EcommerceCustomerCart.module.css";

function EcommerceCustomerCart() {
    return (
        <div className={styles.wrapper} >
            <CartPage />
        </div>
    )
}

export default EcommerceCustomerCart
