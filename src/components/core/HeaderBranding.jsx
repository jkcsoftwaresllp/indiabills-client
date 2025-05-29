import React from "react";

const HeaderBranding = ({first_title, last_title}) => (
    <div id="logo">
        <h1 className="text-3xl font-extrabold">
            {first_title}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                {last_title}
            </span>
        </h1>
    </div>
);

export default HeaderBranding;