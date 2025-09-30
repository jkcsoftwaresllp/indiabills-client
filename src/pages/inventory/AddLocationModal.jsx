import React, { useState } from "react";
import Modal from "../../components/InventoryComponents/Modal";
import { getOption } from "../../utils/FormHelper";
import DropdownStream from "../../components/FormComponent/DropdownStream";
import InputBoxStream from "../../components/FormComponent/InputBoxStream";
import { createWarehouse } from "../../network/api"; // ✅ use same API as AddWarehouse.jsx
import { useStore } from "../../store/store";

// ✅ Define LocationMetadata locally
const LocationMetadata = [
  {
    name: "name",
    type: "string",
    label: "Warehouse Name",
    placeholder: "",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
  {
    name: "code",
    type: "string",
    label: "Warehouse Code",
    placeholder: "WH001",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
  {
    name: "capacity",
    type: "number",
    label: "Capacity",
    placeholder: "(cm3)",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
  {
    name: "addressLine",
    type: "string",
    label: "Address",
    placeholder: "Plot no. & Other details",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
  {
    name: "city",
    type: "string",
    label: "City",
    placeholder: "Patna, Delhi, etc.",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
  {
    name: "state",
    type: "string",
    label: "State",
    placeholder: "",
    category: "Shipping",
    autocomplete: true,
    required: true,
    toAdd: true,
  },
  {
    name: "pinCode",
    type: "string",
    label: "Pin Code",
    placeholder: "xxxxxx",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
  {
    name: "managerName",
    type: "text",
    label: "Manager Name",
    placeholder: "Name of the manager",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
  {
    name: "managerPhone",
    type: "text",
    label: "Manager Phone",
    placeholder: "Phone number of the manager",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
];

const AddLocationModal = ({ open, handleClose, fetchLocations }) => {
  const [locationFormData, setLocationFormData] = useState({});
  const { successPopup, errorPopup } = useStore();

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

  const submitLocation = async () => {
    // ✅ Validation
    const requiredFields = ["name", "code", "addressLine", "city", "state", "pinCode"];
    for (let field of requiredFields) {
      if (!locationFormData[field]) {
        errorPopup(`Please fill in ${field}`);
        return;
      }
    }

    try {
    const payload = {
      ...locationFormData,
      capacity: locationFormData.capacity
        ? parseInt(locationFormData.capacity, 10)
        : 0, // ✅ ensure integer
      isActive: true,
    };

    const status = await createWarehouse(payload);

      if (status === 200 || status === 201) {
        successPopup("Warehouse created successfully!");
        fetchLocations().then(() => handleClose());
      } else {
        errorPopup("Failed to create warehouse");
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);
      errorPopup("Failed to create warehouse");
    }
  };

  return (
    <Modal
      title={"Add warehouse"}
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
                    handleChange={handleLocationChange}
                  />
                </div>
              );
            } else {
              return (
                <div key={location.name} className="idms-transparent-bg">
                  <InputBoxStream
                    moreVisible={true}
                    field={location}
                    value={locationFormData[location.name]}
                    handleChange={handleLocationChange}
                  />
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    </Modal>
  );
};

export default AddLocationModal;
