// client/src/components/core/NavSection.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface Button {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles: string[]; // Include roles for consistency
}

interface Props {
  buttons: Button[];
}

const NavSection: React.FC<Props> = ({ buttons }) => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-2">
      {buttons.map((button, index) => (
        <button
          className="text-sky-100 ml-2 transition self-start p-2 w-full hover:text-rose-500 flex items-center"
          key={index}
          onClick={() => navigate(button.to)}
        >
          {button.icon}
          <span className="ml-3 transition-opacity duration-300">
            {button.label}
          </span>
        </button>
      ))}
    </section>
  );
};

export default NavSection;