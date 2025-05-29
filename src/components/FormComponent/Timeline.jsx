import { FC } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Stepper = ({ steps, currentStep }) => {
  return (
      <div className="flex justify-between">
        {steps?.map((step, i) => (
          <div key={i} className={`step-item ${currentStep === i + 1 ? "active" : ""} ${i + 1 < currentStep ? "complete" : ""}`}>
            <div className="step">
              {i + 1 < currentStep ? <CheckCircleIcon /> : i + 1}
            </div>
            <p className="text-gray-500">{step}</p>
          </div>
        ))}
      </div>
  );
};

export default Stepper;
