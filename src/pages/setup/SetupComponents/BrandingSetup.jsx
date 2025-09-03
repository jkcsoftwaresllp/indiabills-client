// SetupComponents/BrandingSetup.jsx
import React, { memo } from "react";
import InputBox from "../../../components/FormComponent/InputBox";
import ImageUpload from "../../../components/FormComponent/ImageUpload";
import Dropdown from "../../../components/FormComponent/Dropdown";
import MobileField from "../../../components/FormComponent/MobileField";
import SetupTemplate from "../../../components/core/SetupTemplate";
import { getOption } from "../../../utils/FormHelper";
import styles from "./BrandingSetup.module.css";

const BrandingSetup = memo(
  ({
    setPage,
    setLogo,
    organization,
    setOrganization,
    navigation = "one-page",
  }) => {
    const handleChange = (e) => {
      const { name, value, type } = e.target;
      setOrganization((prevState) => ({
        ...prevState,
        [name]: type === "number" ? Number(value) : value,
      }));
    };

    const main = (
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <div className={styles.inputRow}>
            <InputBox
              name="organizationName"
              type="string"
              label="Organization Name"
              placeholder={""}
              value={organization?.organizationName}
              onChange={(e) => handleChange?.(e)}
            />
            <div className={styles.imageUploadContainer}>
              <ImageUpload
                placeholder="Upload Logo ⤴ | 24 x 24"
                setImage={setLogo}
              />
            </div>
            <InputBox
              name="gstin"
              type="string"
              label="GSTIN"
              placeholder={""}
              value={organization?.gstin}
              onChange={(e) => handleChange?.(e)}
            />
          </div>
          <div className={styles.inputRow}>
            <InputBox
              multiline
              maxRows={3}
              name={"about"}
              type="string"
              label="About"
              placeholder={""}
              value={organization?.about}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              name="tagline"
              type="string"
              label="Motto"
              placeholder={"Your tagline for your brand"}
              value={organization?.tagline}
              onChange={(e) => handleChange?.(e)}
            />
          </div>
          <div className={styles.inputRow}>
            <InputBox
              name={"email"}
              type="string"
              label="Email"
              placeholder={"example@domain"}
              value={organization?.email}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              startText="https://www."
              name={"website"}
              type="string"
              label="Website"
              placeholder={"yourorganization.com"}
              value={organization?.website}
              onChange={(e) => handleChange?.(e)}
            />
            <MobileField
              label={"Mobile"}
              name={"phone"}
              setData={setOrganization}
              data={organization}
            />
          </div>
          {/* <div className={styles.inputRow}>
            <InputBox
              name={"bankBranch"}
              type="string"
              label="Branch"
              placeholder={""}
              value={organization?.bankBranch}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              name={"accountNumber"}
              type="string"
              label="A/C No."
              placeholder={"xxxxxx"}
              value={organization?.accountNumber}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              name={"ifscCode"}
              type="number"
              label="IFSC Code"
              placeholder={"xxxxxx"}
              value={organization?.ifscCode}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              name={"upi"}
              type="string"
              label="UPI ID"
              placeholder={"xxxxx@upi"}
              value={organization?.upi}
              onChange={(e) => handleChange?.(e)}
            />
          </div> */}
          <div className={styles.inputRow}>
            <div className={styles.dropdownContainer}>
              <Dropdown
                name={"state"}
                label="State"
                options={getOption("state")}
                selectedData={organization}
                setValue={setOrganization}
              />
            </div>
            <InputBox
              name={"addressLine"}
              type="string"
              label="Address Line"
              placeholder={"Office building, Street Name, District"}
              value={organization?.addressLine}
              onChange={(e) => handleChange?.(e)}
            />
          </div>
        </div>
      </div>
    );

    return (
      <SetupTemplate
        big={true}
        heading="Setup your [Organization]."
        main={main}
        navigation={navigation}
        setPage={setPage}
      />
    );
  }
);

BrandingSetup.displayName = "BrandingSetup";

export default BrandingSetup;
