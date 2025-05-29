import React from "react";
import SearchBar from "../../components/LayoutComponent/SearchBar";

const ShopLayout = ({ setProduct, children }) => {
  return (
    <div>
      <section>
        {/* search bar maybe? */}
      </section>

      <main>{children}</main>
    </div>
  );
};

export default ShopLayout;
