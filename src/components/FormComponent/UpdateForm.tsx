import React, {useEffect, useState} from "react";
import InputBoxStream from "./InputBoxStream";
import {groupByCategory} from "../../utils/FormHelper";
import CancelIcon from "@mui/icons-material/Cancel";
import {deleteRow, getRow, updateRow} from "../../network/api";
import InputBoxReadonly from "./InputBoxReadonly";
import {Button, CircularProgress} from "@mui/material";
import {Field, Services} from "../../definitions/Types"
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import PromptButton from "../LayoutComponent/PromptButton";
import {amber} from "@mui/material/colors";
import {useNavigate, useParams} from "react-router-dom";
import DivAnimate from "../Animate/DivAnimate";
import FormAnimate from "../Animate/FormAnimate";
import {useStore} from "../../store/store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Props<T extends Services> {
    title: string;
    id: string;
    metadata: Field<T>[];
}

const UpdateForm = <T extends Services>({ title, id, metadata, }: Props<T>) => {

    const [data, setData] = useState({} as T);

    const {successPopup, errorPopup} = useStore();

    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState<T>(data);
    const [isEditMode, setIsEditMode] = useState<boolean>(false); // New state for edit mode

    const pathParameter = useParams();
    const path = Object.values(pathParameter)[0];

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const result: T = await getRow(`/${title}/edit/${id}`);
            console.log(result);
            if (result) {
                setData(result); // for viewing
                setFormData(result); // for editing
                setLoading(false);
            } else {
                console.error("Cannot fetch the definitions");
            }
        };
        fetchData().then();
    }, [title, id, setData, metadata]);

    const groupedData = groupByCategory<T, Field<T>>(metadata);

    function handleChange(type: string, target: string) {
        return function (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) {
            if (type === "number") {
                setFormData({...formData, [target]: Number(e.target.value)});
            } else if (
                type === "string" ||
                type === "email" ||
                type === "password" ||
                type === "date"
            ) {
                setFormData({...formData, [target]: e.target.value});
            } else if (type === "Date") {
                setFormData({...formData, [target]: e.target.value});
            } else {
                console.error("Invalid type encountered: " + type + " for " + target);
            }
        };
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("called!");
        e.preventDefault();
        const dataToSend: Partial<Services> = {
            ...formData,
        } as Partial<Services>;
        // spaghetti code 101 ↴
        if ("lastEditedDate" in dataToSend) {
            delete dataToSend.lastEditedDate;
        }
        if ("lastEditedBy" in dataToSend) {
            delete dataToSend.lastEditedBy;
        }
        if ("dateAdded" in dataToSend) {
            delete dataToSend.dateAdded;
        }
        if ("addedBy" in dataToSend) {
            delete dataToSend.addedBy;
        }

        updateRow(`/${title}/edit/${id}`, dataToSend)
            .then((res) => {
                if (res === 200) {

                    successPopup(`${title} added successfully!`);
                    navigate(`/${title}`);

                } else {
                    errorPopup(`Couldn't add ${title}!`);
                }
            })
            .catch((error) => {
                errorPopup(`Couldn't add ${title}!`);
                console.error("An error occurred:", error);
            });
    };

    if (loading) {
        return (
            <div className="w-full h-screen grid place-items-center">
                <CircularProgress/>
            </div>
        );
    } else {

        const readonlyClass = "w-fit flex gap-3 p-4"
        const fieldContainer = "p-6 transition flex flex-col w-fit h-fit items-center gap-6 rounded-2xl"

        return (
            <main className="w-full flex items-center">

                <form onSubmit={handleSubmit} className={"h-full w-full flex flex-col justify-center items-center"}>

                    <div
                        className={!isEditMode ? `${readonlyClass} idms-control` : `${readonlyClass} opacity-40 cursor-not-allowed`}>
                        {/* `metadata` is only a structure | `definitions` is the collection of values */}
                        {metadata
                            .filter((field) => field.readonly)
                            .map((field, index) => {
                                return (
                                    <div key={index}
                                         className="flex flex-col w-fit h-fit items-center gap-4 rounded-2xl p-4 cursor-not-allowed">
                                        <InputBoxReadonly field={field} value={data[field.name]}/>
                                    </div>
                                );
                            })}
                    </div>

                    <div className={`transition py-4 px-8 w-fit grid grid-cols-3 gap-8 mt-3 idms-bg`}>
                        {Object.entries(groupedData)
                            .sort((a, b) => a[1].length - b[1].length) // Sort based on the length of each category's items array
                            .filter(([, items]: [string, Field<T>[]]) => items.some((item: Field<T>) => !item.readonly))
                            .map(([category, items]: [string, Field<T>[]]) => (

                                    <div key={category}
                                         className={!isEditMode ? fieldContainer : `${fieldContainer} hover:shadow-lg`}>
                                        <h2 className="font-semibold lowercase"> {category} </h2>
                                        {items
                                            .filter((item: Field<T>) => !item.readonly)
                                            .map((item: Field<T>) => {
                                                if (typeof item.name === "string") {
                                                    return isEditMode ? (
                                                        <FormAnimate key={item.name}>
                                                            <InputBoxStream
                                                                field={item as Field<Services>} // typescript is mess
                                                                value={data[item.name]}
                                                                handleChange={handleChange}
                                                                disabled={!isEditMode}
                                                            />
                                                        </FormAnimate>
                                                    ) : (
                                                        <FormAnimate key={item.name}>
                                                            <InputBoxReadonly field={item} value={data[item.name]}/>
                                                        </FormAnimate>
                                                    );
                                                } else {
                                                    console.log(item.name)
                                                    return null;
                                                } // handling the case where item.name is a symbol
                                            })}
                                    </div>
                                )
                            )}
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
                            {isEditMode ? <CancelIcon/> : <EditRoundedIcon/>}
                        </DivAnimate>
                    </Button>
                    {isEditMode && (

                        <DivAnimate>

                            <button
                                onClick={handleSubmit}
                                type="submit"
                                className="py-3 px-4 shadow-xl idms-submit"
                            ><CheckCircleIcon/></button>
                        </DivAnimate>
                    )}
                    {!isEditMode && (

                        <DivAnimate>

                            <PromptButton
                                icon={<DeleteIcon/>}
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
    }
};

export default UpdateForm;
