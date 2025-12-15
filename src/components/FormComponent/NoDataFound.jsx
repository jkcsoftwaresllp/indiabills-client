import { FiArrowRight } from "react-icons/fi";
import "./NoDataFound.css";

const NoDataFound = ({ title, onAddNew }) => {
  // Remove trailing 's' for singular form, handle special cases
  const singularTitle = title.endsWith("s")
    ? title.slice(0, -1).toLowerCase()
    : title.toLowerCase();

  return (
    <div className="no-data-container">
      {/* Content */}
      <div className="no-data-content">
        {/* Text Content */}
        <h2 className="no-data-title">No {title.toLowerCase()} yet</h2>
        <p className="no-data-description">
          Start by creating your first {singularTitle}. It will appear here
          once added to your system.
        </p>

        {/* Action Button */}
        <button
          onClick={onAddNew}
          className="no-data-button"
          aria-label={`Create new ${singularTitle}`}
        >
          <span>Create {singularTitle}</span>
          <FiArrowRight className="button-icon" />
        </button>

        {/* Decorative Elements */}
        <div className="no-data-decorative">
          <div className="decorative-dot"></div>
          <div className="decorative-dot"></div>
          <div className="decorative-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
