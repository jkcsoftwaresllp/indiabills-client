// SetupComponents/AdminSetup.jsx
import React, { memo } from "react";
import InputBox from "../../../components/FormComponent/InputBox";
import ImageUpload from "../../../components/FormComponent/ImageUpload";
import SetupTemplate from "../../../components/core/SetupTemplate";
import { MuiTelInput } from "mui-tel-input";
import styles from "./AdminSetup.module.css";

const AdminSetup = memo(({ setPage, setImage, admin, setAdmin }) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setAdmin((prevState) => ({
      ...prevState,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const main = (
    <div className={styles.mainContainer}>
      <ImageUpload setImage={setImage} />
      <div className={styles.formContainer}>
        <div className={styles.inputRow}>
          <InputBox
            moreVisible={true}
            name="userName"
            type="string"
            label="Name"
            placeholder={"___________"}
            value={admin?.userName}
            onChange={(e) => handleChange?.(e)}
          />
        </div>
        <div className={styles.inputRow}>
          <div className={styles.inputColumn}>
            <InputBox
              moreVisible={true}
              name={"email"}
              type="string"
              label="Email"
              placeholder={"example@domain"}
              value={admin?.email}
              onChange={(e) => handleChange?.(e)}
            />
          </div>
          <MuiTelInput
            style={{ borderRadius: "1rem" }}
            label={"Phone"}
            name={"phone"}
            defaultCountry="IN"
            onlyCountries={["FR", "IN", "BE", "SA"]}
            InputProps={{ inputProps: { maxLength: 15 } }}
            placeholder={"XXXXXXX"}
            onChange={(value) => setAdmin({ ...admin, ["mobile"]: value })}
            value={admin.mobile}
          />
        </div>
        <div className={styles.inputRow}>
          <InputBox
            moreVisible={true}
            name={"password"}
            type="password"
            label="Password"
            placeholder={"******"}
            value={admin?.password}
            onChange={(e) => handleChange?.(e)}
          />
          <InputBox
            moreVisible={true}
            name={"confirmPassword"}
            type="password"
            label="Confirm Password"
            placeholder={"******"}
            value={admin?.confirmPassword}
            onChange={(e) => handleChange?.(e)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <SetupTemplate
      heading="Create a [Root] User."
      main={main}
      navigation="both"
      setPage={setPage}
    />
  );
});

AdminSetup.displayName = "AdminSetup";

export default AdminSetup;