import React, { useState } from 'react'
import styles from "./styles/EcommerceCustomerWishlist.module.css";
import avatar1 from "../../assets/images/avatar.jpg"
import DashboardTop from '../../components/EcommerceDashboard/DashboardTop';
import ProductGrid from '../../components/EcommerceDashboard/ProductGrid';

function EcommerceCustomerWishlist() {
    const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max (256 GB)",
        brand: "Apple",
        image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS3nC2qKUux8jHgT56FG6XmqIAHdyBUoqUr14lWt4FYNbOAgtqNgXwSXeZoRyrxMV6Nusxcn1G-z9oErJjcPPeoatnJe3UpGvYuHbL74P0TXPnnWSzFPSRGQ9HW08YTYm8r5LcQIh4&usqp=CAc",
        price: 134999,
        mrp: 159999,
        discount: 15,
        rating: 4.7,
        reviews: 12034,
        stock: 4,
        expiry: null,
        dimensions: "159.9 x 76.7 x 8.25 mm",
        weight: 221,
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra (512 GB)",
        brand: "Samsung",
        image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTZB7hHkMFCZ5coN1nuoJmU-580Gn6lhxt_EBSre_pGyxz3oan_K10qXJ_mch-rF3pW3fUA8l-Qmo22n7deN6pLISmt_2OsSZVP5SIVCBWsjRrbmrVa-JHs&usqp=CAc",
        price: 129999,
        mrp: 149999,
        discount: 13,
        rating: 4.6,
        reviews: 9842,
        stock: 7,
        expiry: null,
        dimensions: "162.3 x 79 x 8.6 mm",
        weight: 233,
    },
    {
        id: 3,
        name: "OnePlus 12 (256 GB)",
        brand: "OnePlus",
        image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTiOcDNJLlMnscG6NyCkqfSiJ-f-Bb16E1aAQTdLEMnES87x2fzVJB9jyK4d0reLGTjJGmJkHB3AtcHNE7ASQk5lCHSVkOboVuqtSUySDpRJiTcxUVrdv8K9er1vJY0uANcQJHtH48&usqp=CAc",
        price: 69999,
        mrp: 79999,
        discount: 12,
        rating: 4.5,
        reviews: 15620,
        stock: 12,
        expiry: null,
        dimensions: "164.3 x 75.8 x 9.2 mm",
        weight: 220,
    },
    {
        id: 4,
        name: "Sony WH-1000XM5 Wireless Headphones ",
        brand: "Sony",
        image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSzG0OhhtBafEngdNmmpfNgrgcVzvEEec0AK8wWCcJn9XMQ6TqPK76CriuwiqrcX0_7tJgzv66yXleIFe6Am92NPj9cwi1jpY8wlkKAyYF20avEb80UThYwkC4mPtp6szf-v24TDvU&usqp=CAc",
        price: 29999,
        mrp: 34999,
        discount: 14,
        rating: 4.8,
        reviews: 18345,
        stock: 10,
        expiry: null,
        dimensions: "Folded: 191 x 80 x 34 mm",
        weight: 250,
    },
    {
        id: 5,
        name: "Apple Watch Series 9 (45mm, GPS)",
        brand: "Apple",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHkzz0ooE7b_sc2a7z8Jc6wUUACiRBSkav6Q&s",
        price: 41999,
        mrp: 45999,
        discount: 9,
        rating: 4.6,
        reviews: 7421,
        stock: 6,
        expiry: null,
        dimensions: "45 x 38 x 10.7 mm",
        weight: 51,
    },
    {
        id: 6,
        name: "HP Pavilion 15 Laptop (i7, 16GB, 1TB SSD)",
        brand: "HP",
        image: "https://m.media-amazon.com/images/I/71RUyskVR+L.jpg",
        price: 84999,
        mrp: 99999,
        discount: 15,
        rating: 4.4,
        reviews: 5238,
        stock: 3,
        expiry: null,
        dimensions: "360 x 234 x 17.9 mm",
        weight: 1750,
    },
];

    const [activeCategory, setActiveCategory] = useState("mobiles");
    return (
        <div className={styles.wrapper} >
            <DashboardTop
                user={{ name: "Joy", avatar: avatar1, wishlistCount: 3, cartCount: 5, }}
                stats={{ orders: 12, cart: 3, wishlist: 5 }}
                onSearch={(value) => console.log("Search:", value)}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory} />
                <ProductGrid iswishlisted={true} products={products} />
        </div>
    )
}

export default EcommerceCustomerWishlist
