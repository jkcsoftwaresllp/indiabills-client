import React, { useState } from "react";
import Modal from "../../components/InventoryComponents/Modal";
import { LocationMetadata } from "../../definitions/Metadata";
import { initializeFormData, getOption } from "../../utils/FormHelper";
import DropdownStream from "../../components/FormComponent/DropdownStream";
import InputBoxStream from "../../components/FormComponent/InputBoxStream";
import { quickAdd } from "../../network/api";
import { useStore } from "../../store/store";

interface AddLocationModalProps {
    open: boolean;
    handleClose: () => void;
    fetchLocations: () => Promise<void>;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ open, handleClose, fetchLocations }) => {
    const [locationFormData, setLocationFormData] = useState<Location>({} as Location);
        
    const { errorPopup } = useStore();

    const handleLocationChange =
        (type: string, name: string, value?: string) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (type === "autocomplete") {
                setLocationFormData((prevState: Location) => ({
                    ...prevState,
                    [name]: value,
                }));
            } else {
                setLocationFormData((prevState: Location) => ({
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
                                            handleLocationChange as unknown as (
                                                type: string,
                                                target: string
                                            ) => (
                                                e: React.ChangeEvent<
                                                    HTMLInputElement | HTMLTextAreaElement
                                                >
                                            ) => void
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
                                        value={locationFormData[location.name as keyof Location]}
                                        handleChange={
                                            handleLocationChange as unknown as (
                                                type: string,
                                                target: string
                                            ) => (
                                                e: React.ChangeEvent<
                                                    HTMLInputElement | HTMLTextAreaElement
                                                >
                                            ) => void
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