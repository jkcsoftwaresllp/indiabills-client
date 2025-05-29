import React, { useEffect, useState } from "react";
import InputBoxStream from "./InputBoxStream";
import { groupByCategory } from "../../utils/FormHelper";
import CancelIcon from "@mui/icons-material/Cancel";
import { deleteRow, getRow, updateRow } from "../../network/api";
import InputBoxReadonly from "./InputBoxReadonly";
import { Button, CircularProgress } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import PromptButton from "../LayoutComponent/PromptButton";
import { amber } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";
import DivAnimate from "../Animate/DivAnimate";
import FormAnimate from "../Animate/FormAnimate";
import { useStore } from "../../store/store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const UpdateForm = ({ title, id, metadata }) => {
    const [data, setData] = useState({});
    const { successPopup, errorPopup } = useStore();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(data);
    const [isEditMode, setIsEditMode] = useState(false);

    const pathParameter = useParams();
    const path = Object.values(pathParameter)[0];
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const result = await getRow(`/${title}/edit/${id}`);
            if (result) {
                setData(result);
                setFormData(result);
                setLoading(false);
            } else {
                console.error("Cannot fetch the definitions");
            }
        };
        fetchData();
    }, [title, id, metadata]);

    const groupedData = groupByCategory(metadata);

    function handleChange(type, target) {
        return function (e) {
            if (type === "number") {
                setFormData({ ...formData, [target]: Number(e.target.value) });
            } else if (
                type === "string" ||
                type === "email" ||
                type === "password" ||
                type === "date" ||
                type === "Date"
            ) {
                setFormData({ ...formData, [target]: e.target.value });
            } else {
                console.error("Invalid type encountered: " + type + " for " + target);
            }
        };
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = { ...formData };

        // Remove unnecessary fields
        ["lastEditedDate", "lastEditedBy", "dateAdded", "addedBy"].forEach((field) => {
            if (field in dataToSend) {
                delete dataToSend[field];
            }
        });

        updateRow(`/${title}/edit/${id}`, dataToSend)
            .then((res) => {
                if (res === 200) {
                    successPopup(`${title} updated successfully!`);
                    navigate(`/${title}`);
                } else {
                    errorPopup(`Couldn't update ${title}!`);
                }
            })
            .catch((error) => {
                errorPopup(`Couldn't update ${title}!`);
                console.error("An error occurred:", error);
            });
    };

    if (loading) {
        return (
            <div className="w-full h-screen grid place-items-center">
                <CircularProgress />
            </div>
        );
    }

    const readonlyClass = "w-fit flex gap-3 p-4";
    const fieldContainer = "p-6 transition flex flex-col w-fit h-fit items-center gap-6 rounded-2xl";

    return (
        <main className="w-full flex items-center">
            <form onSubmit={handleSubmit} className="h-full w-full flex flex-col justify-center items-center">
                <div
                    className={!isEditMode ? `${readonlyClass} idms-control` : `${readonlyClass} opacity-40 cursor-not-allowed`}
                >
                    {metadata
                        .filter((field) => field.readonly)
                        .map((field, index) => (
                            <div
                                key={index}
                                className="flex flex-col w-fit h-fit items-center gap-4 rounded-2xl p-4 cursor-not-allowed"
                            >
                                <InputBoxReadonly field={field} value={data[field.name]} />
                            </div>
                        ))}
                </div>

                <div className={`transition py-4 px-8 w-fit grid grid-cols-3 gap-8 mt-3 idms-bg`}>
                    {Object.entries(groupedData)
                        .sort((a, b) => a[1].length - b[1].length)
                        .filter(([, items]) => items.some((item) => !item.readonly))
                        .map(([category, items]) => (
                            <div
                                key={category}
                                className={!isEditMode ? fieldContainer : `${fieldContainer} hover:shadow-lg`}
                            >
                                <h2 className="font-semibold lowercase"> {category} </h2>
                                {items
                                    .filter((item) => !item.readonly)
                                    .map((item) => {
                                        if (typeof item.name === "string") {
                                            return isEditMode ? (
                                                <FormAnimate key={item.name}>
                                                    <InputBoxStream
                                                        field={item}
                                                        value={data[item.name]}
                                                        handleChange={handleChange}
                                                        disabled={!isEditMode}
                                                    />
                                                </FormAnimate>
                                            ) : (
                                                <FormAnimate key={item.name}>
                                                    <InputBoxReadonly field={item} value={data[item.name]} />
                                                </FormAnimate>
                                            );
                                        } else {
                                            console.log(item.name);
                                            return null;
                                        }
                                    })}
                            </div>
                        ))}
                </div>
            </form>
            <div id="buttons" className="h-full flex flex-col items-center gap-2 p-3">
                <Button
                    onClick={() => setIsEditMode(!isEditMode)}
                    variant="outlined"
                    sx={{
                        color: amber[700],
                        width: "4rem",
                        p: "0.75rem",
                        borderColor: amber[500],
                        "&:hover": {
                            backgroundColor: amber[100],
                            color: amber[900],
                            borderColor: amber[900],
                        },
                    }}
                >
                    <DivAnimate>
                        {isEditMode ? <CancelIcon /> : <EditRoundedIcon />}
                    </DivAnimate>
                </Button>
                {isEditMode && (
                    <DivAnimate>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="py-3 px-4 shadow-xl idms-submit"
                        >
                            <CheckCircleIcon />
                        </button>
                    </DivAnimate>
                )}
                {!isEditMode && (
                    <DivAnimate>
                        <PromptButton
                            icon={<DeleteIcon />}
                            title="Delete"
                            content="Are you sure you want to delete this item?"
                            onClick={() =>
                                deleteRow(`/${title}/delete/${path}`).then(() => {
                                    navigate("/" + title);
                                })
                            }
                        />
                    </DivAnimate>
                )}
            </div>
        </main>
    );
};

export default UpdateForm;
