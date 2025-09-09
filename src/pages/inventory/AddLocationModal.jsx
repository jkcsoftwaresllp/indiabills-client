import React, { useState } from "react";
import Modal from "../../components/InventoryComponents/Modal";
import { getOption } from "../../utils/FormHelper";
import DropdownStream from "../../components/FormComponent/DropdownStream";
import InputBoxStream from "../../components/FormComponent/InputBoxStream";
import { quickAdd } from "../../network/api";
import { useStore } from "../../store/store";

// ✅ Define LocationMetadata locally
const LocationMetadata = [
  {
    name: "warehouseId",
    type: "string",
    label: "Location ID",
    placeholder: "Location ID",
    category: "Shipping",
    autocomplete: false,
    required: false,
    readonly: true,
    toAdd: false,
  },
  {
    name: "warehouseName",
    type: "string",
    label: "Warehouse Name",
    placeholder: "",
    category: "Shipping",
    autocomplete: false,
    required: true,
    readonly: false,
    toAdd: true,
  },
  {
    name: "capacity",
    type: "number",
    label: "Capacity",
    placeholder: "(cm3)",
    category: "Shipping",
    autocomplete: false,
    required: true,
    readonly: false,
    toAdd: true,
  },
  {
    name: "addressLine",
    type: "string",
    label: "Address",
    placeholder: "Plot no. & Other details",
    category: "Shipping",
    autocomplete: false,
    required: true,
    readonly: false,
    toAdd: true,
  },
  {
    name: "landmark",
    type: "string",
    label: "Landmark",
    placeholder: "Near anything recognisable?",
    category: "Shipping",
    autocomplete: false,
    required: false,
    readonly: false,
    toAdd: true,
  },
  {
    name: "city",
    type: "string",
    label: "City",
    placeholder: "Patna, Delhi, etc.",
    category: "Shipping",
    autocomplete: false,
    required: true,
    readonly: false,
    toAdd: true,
  },
  {
    name: "district",
    type: "string",
    label: "District",
    placeholder: "Specify district or area",
    category: "Shipping",
    autocomplete: false,
    required: true,
    readonly: false,
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
    readonly: false,
    toAdd: true,
  },
  {
    name: "pinCode",
    type: "number",
    label: "Pin Code",
    placeholder: "xxxxxx",
    category: "Shipping",
    autocomplete: false,
    required: true,
    readonly: false,
    toAdd: true,
  },
  {
    name: "dateAdded",
    type: "date",
    label: "Date Added",
    placeholder: "Date",
    category: "Additional Info",
    readonly: true,
    autocomplete: false,
  },
  {
    name: "addedBy",
    type: "string",
    label: "Added By",
    placeholder: "Name",
    category: "Additional Info",
    readonly: true,
    autocomplete: false,
  },
  {
    name: "lastEditedDate",
    type: "date",
    label: "Last Edited Date",
    placeholder: "Date",
    category: "Additional Info",
    readonly: true,
    autocomplete: false,
  },
  {
    name: "lastEditedBy",
    type: "string",
    label: "Last Edited By",
    placeholder: "Name",
    category: "Additional Info",
    readonly: true,
    autocomplete: false,
  },
];

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
