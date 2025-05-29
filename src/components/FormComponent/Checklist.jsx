import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Stepper = ({ list }) => {

    return (
        <div className="flex justify-between">
            {list?.map((step, i) => (
                <div key={i} className={`step-item ${step.done ? "complete" : ""}`}>
                    <div className="step">
                        {step.done ? <CheckCircleIcon /> : i + 1}
                    </div>
                    <p className="text-gray-500">{step.item}</p>
                </div>
            ))}
        </div>
    );
};

export default Stepper;