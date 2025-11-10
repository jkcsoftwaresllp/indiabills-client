// SetupComponents/WarehouseSetup.jsx
import { memo } from "react";
import InputBoxStream from "../../../components/FormComponent/InputBoxStream";
import DropdownStream from "../../../components/FormComponent/DropdownStream";
import SetupTemplate from "../../../components/core/SetupTemplate";
import { getOption } from "../../../utils/FormHelper";
import styles from "./WarehouseSetup.module.css";

const WarehouseSetup = memo(
  ({ setPage, locationFormData, setLocationFormData, finish, LocationMetadata }) => {
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

    const main = (
      <div className={styles.mainContainer}>
        {LocationMetadata.map((location) => {
          if (location.toAdd) {
            return (
              <div key={location.name} className={styles.formItem}>
                {location.autocomplete ? (
                  <DropdownStream
                    moreVisible={true}
                    field={location}
                    options={getOption("state")}
                    required={true}
                    handleChange={handleLocationChange}
                  />
                ) : (
                  <InputBoxStream
                    moreVisible={true}
                    field={location}
                    value={locationFormData[location.name]}
                    handleChange={handleLocationChange}
                  />
                )}
              </div>
            );
          }
          return null; 
        })}
      </div>
    );

    return (
      <SetupTemplate
        heading="Add a [Warehouse]."
        main={main}
        navigation="final"
        setPage={setPage}
        finish={finish}
      />
    );
  },
);

WarehouseSetup.displayName = "WarehouseSetup";

export default WarehouseSetup;