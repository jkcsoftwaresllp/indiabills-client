import React from "react";
import {Product} from "../../definitions/Types";
import SearchBar from "../../components/LayoutComponent/SearchBar";

interface Props {
    setProduct:  React.Dispatch<React.SetStateAction<Product[]>>,
    children: React.ReactNode,
}

const ShopLayout: React.FC<Props> = ({ setProduct, children }) => {
    return (
        <div>
            <section>
            {/* search bar maybe? */}
            </section>


            <main>
                {children}
            </main>
        </div>
    )
}

export default ShopLayout;