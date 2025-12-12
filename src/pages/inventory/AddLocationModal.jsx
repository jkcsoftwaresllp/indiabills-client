import { useState } from "react";
import Modal from "../../components/InventoryComponents/Modal";
import { getOption } from "../../utils/FormHelper";
import DropdownStream from "../../components/FormComponent/DropdownStream";
import InputBoxStream from "../../components/FormComponent/InputBoxStream";
import { createWarehouse } from "../../network/api";
import { useStore } from "../../store/store";
import styles from './AddLocationModal.module.css';

// ✅ Define LocationMetadata locally with all warehouse fields
const LocationMetadata = [
  {
    name: "name",
    type: "string",
    label: "Warehouse Name",
    placeholder: "e.g., Main Warehouse",
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
    label: "Capacity (cm³)",
    placeholder: "0",
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
    placeholder: "Select State",
    category: "Shipping",
    autocomplete: true,
    required: true,
    toAdd: true,
  },
  {
    name: "pinCode",
    type: "string",
    label: "Pin Code",
    placeholder: "123456",
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
    placeholder: "+91 99999 99999",
    category: "Shipping",
    required: true,
    toAdd: true,
  },
];

const AddLocationModal = ({ open, handleClose, fetchLocations }) => {
  const [locationFormData, setLocationFormData] = useState({});
  const [errors, setErrors] = useState({});
  const { successPopup, errorPopup } = useStore();

  const handleLocationChange =
    (type, name, value) =>
    (e) => {
      if (type === "autocomplete") {
        setLocationFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      } else {
        setLocationFormData((prevState) => ({
          ...prevState,
          [name]: e.target.value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["name", "code", "capacity", "addressLine", "city", "state", "pinCode", "managerName", "managerPhone"];

    for (let field of requiredFields) {
      if (!locationFormData[field]) {
        newErrors[field] = `${field} is required`;
      }
    }

    if (locationFormData.capacity && (isNaN(locationFormData.capacity) || locationFormData.capacity < 0)) {
      newErrors.capacity = "Capacity must be a non-negative number";
    }

    if (locationFormData.pinCode && !/^\d{4,10}$/.test(locationFormData.pinCode)) {
      newErrors.pinCode = "PIN code must be 4-10 digits";
    }

    if (locationFormData.managerPhone) {
      const cleanPhone = locationFormData.managerPhone.replace(/[\s-+]/g, '');
      if (!/^[1-9]\d{6,14}$/.test(cleanPhone)) {
        newErrors.managerPhone = "Manager phone must be 7-15 digits";
      }
    }

    if (locationFormData.code && !/^[a-zA-Z0-9-_]+$/.test(locationFormData.code)) {
      newErrors.code = "Code can only contain letters, numbers, hyphens, and underscores";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitLocation = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        ...locationFormData,
        capacity: locationFormData.capacity
          ? parseInt(locationFormData.capacity, 10)
          : 0,
        isActive: true,
      };

      const status = await createWarehouse(payload);

      if (status === 200 || status === 201) {
        successPopup("Warehouse created successfully!");
        setLocationFormData({});
        setErrors({});
        fetchLocations().then(() => handleClose());
      } else {
        errorPopup("Failed to create warehouse");
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);
      errorPopup("Failed to create warehouse");
    }
  };

  const handleClose_internal = () => {
    setLocationFormData({});
    setErrors({});
    handleClose();
  };

  return (
    <Modal
      title={"Add New Warehouse"}
      handleClose={handleClose_internal}
      open={open}
      submit={submitLocation}
    >
      <div className={styles.modalContent}>
        <div className={styles.formGrid}>
          {LocationMetadata.map((location) => {
            if (location.toAdd) {
              if (location.autocomplete) {
                return (
                  <div key={location.name} className={styles.formField}>
                    <label className={styles.fieldLabel}>{location.label} {location.required && <span className={styles.required}>*</span>}</label>
                    <DropdownStream
                      moreVisible={true}
                      field={location}
                      options={getOption("state")}
                      required={true}
                      handleChange={handleLocationChange}
                    />
                    {errors[location.name] && <span className={styles.error}>{errors[location.name]}</span>}
                  </div>
                );
              } else {
                return (
                  <div key={location.name} className={styles.formField}>
                    <label className={styles.fieldLabel}>{location.label} {location.required && <span className={styles.required}>*</span>}</label>
                    <InputBoxStream
                      moreVisible={true}
                      field={location}
                      value={locationFormData[location.name]}
                      handleChange={handleLocationChange}
                    />
                    {errors[location.name] && <span className={styles.error}>{errors[location.name]}</span>}
                  </div>
                );
              }
            }
            return null;
          })}
        </div>
      </div>
    </Modal>
  );
};

export default AddLocationModal;
