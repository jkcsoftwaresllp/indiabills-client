import React, { useState } from "react";
import Modal from "../../components/InventoryComponents/Modal";
import { initializeFormData, getOption } from "../../utils/FormHelper";
import DropdownStream from "../../components/FormComponent/DropdownStream";
import InputBoxStream from "../../components/FormComponent/InputBoxStream";
import { quickAdd } from "../../network/api";
import { useStore } from "../../store/store";

const AddLocationModal = ({ open, handleClose, fetchLocations }) => {
    const [locationFormData, setLocationFormData] = useState({});

    const { errorPopup } = useStore();

    const handleLocationChange =
        (type, name, value) =>
        (e) => {
            if (type === "autocomplete") {
                setLocationFormData((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
            } else {
                setLocationFormData((prevState) => ({
                    ...prevState,
                    [name]: e.target.value,
                }));
            }
        };

    const submitLocation = () => {
        quickAdd("/inventory/warehouses/add", locationFormData).then((res) => {
            if (res.status === 200) {
                fetchLocations().then(() => handleClose());
            } else {
                errorPopup("Couldn't add location");
            }
        });
    };

    return (
        <Modal
            title={"Add Location to your warehouse"}
            handleClose={handleClose}
            open={open}
            submit={submitLocation}
        >
            <div className="grid grid-cols-2 gap-8 p-6">
                {LocationMetadata.map((location) => {
                    if (location.toAdd) {
                        if (location.autocomplete) {
                            return (
                                <div key={location.name}>
                                    <DropdownStream
                                        moreVisible={true}
                                        field={location}
                                        options={getOption("state")}
                                        required={true}
                                        handleChange={
                                            handleLocationChange
                                        }
                                    />
                                </div>
                            );
                        } else {
                            return (
                                <div key={location.name} className={"idms-transparent-bg"}>
                                    <InputBoxStream
                                        moreVisible={true}
                                        field={location}
                                        value={locationFormData[location.name]}
                                        handleChange={
                                            handleLocationChange
                                        }
                                    />
                                </div>
                            );
                        }
                    }
                })}
            </div>
        </Modal>
    );
};

export default AddLocationModal;
