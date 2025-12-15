import "./NoDataFoundReadOnly.css";

const NoDataFoundReadOnly = ({ title = "data" }) => {
  return (
    <div className="no-data-readonly-container">
      {/* Content */}
      <div className="no-data-readonly-content">
        {/* Text Content */}
        <h2 className="no-data-readonly-title">No {title.toLowerCase()}</h2>
        <p className="no-data-readonly-description">
          There's no {title.toLowerCase()} to display at the moment. Check back
          later for updates.
        </p>

        {/* Decorative Elements */}
        <div className="no-data-readonly-decorative">
          <div className="decorative-dot"></div>
          <div className="decorative-dot"></div>
          <div className="decorative-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default NoDataFoundReadOnly;
