import React, { useState, useEffect } from "react";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import MobileField from "../../components/FormComponent/MobileField";
import ImageUpload from "../../components/FormComponent/ImageUpload";
import { getData, updateRow } from "../../network/api";
import { useNavigate } from "react-router-dom";
import { getOption } from "../../utils/FormHelper";
import { useStore } from "../../store/store";

const EditOrganization = () => {
  const [organization, setOrganization] = useState(null);
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();

  const { errorPopup, successPopup } = useStore();

  useEffect(() => {
    const fetchOrganization = async () => {
      const response = await getData("/organization");
      setOrganization(response);
    };
    fetchOrganization();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For date fields, ensure proper format
    if (e.target.type === "date") {
      setOrganization((prev) =>
        prev
          ? {
              ...prev,
              [name]: new Date(value).toISOString(),
            }
          : null
      );
    } else {
      setOrganization((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleSubmit = async () => {
    if (organization) {
      const response = await updateRow("/organization/update", organization);
      if (response !== 200) {
        errorPopup("Error updating organization");
        return;
      }
      successPopup("Organization updated successfully");
      navigate("/organization");
    }
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex w-full gap-4">
            <InputBox
              name="organizationName"
              type="string"
              label="Organization Name"
              placeholder=""
              value={organization.organizationName}
              onChange={handleChange}
            />
            <div className="flex w-full gap-4 items-center">
              <ImageUpload
                placeholder="Upload Logo ⤴ | 24 x 24"
                setImage={setLogo}
              />
            </div>
            <InputBox
              name="gstin"
              type="string"
              label="GSTIN"
              placeholder=""
              value={organization.gstin}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-full gap-4">
            <InputBox
              multiline
              maxRows={3}
              name="about"
              type="string"
              label="About"
              placeholder=""
              value={organization.about}
              onChange={handleChange}
            />
            <InputBox
              name="tagline"
              type="string"
              label="Motto"
              placeholder="Your tagline for your brand"
              value={organization.tagline}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-full gap-4">
            <InputBox
              name="email"
              type="string"
              label="Email"
              placeholder="example@domain"
              value={organization.email}
              onChange={handleChange}
            />
            <InputBox
              startText="https://www."
              name="website"
              type="string"
              label="Website"
              placeholder="yourorganization.com"
              value={organization.website}
              onChange={handleChange}
            />
            <MobileField
              label="Mobile"
              name="phone"
              setData={setOrganization}
              data={organization}
            />
          </div>
          <div className="flex w-full gap-4">
            <InputBox
              name="bankBranch"
              type="string"
              label="Branch"
              placeholder=""
              value={organization.bankBranch}
              onChange={handleChange}
            />
            <InputBox
              name="accountNumber"
              type="string"
              label="A/C No."
              placeholder="xxxxxx"
              value={organization.accountNumber}
              onChange={handleChange}
            />
            <InputBox
              name="ifscCode"
              type="string"
              label="IFSC Code"
              placeholder="xxxxxx"
              value={organization.ifscCode}
              onChange={handleChange}
            />
            <InputBox
              name="upi"
              type="string"
              label="UPI ID"
              placeholder="xxxxx@upi"
              value={organization.upi}
              onChange={handleChange}
            />
          </div>
          <div className="flex w-full gap-4">
            <div className="w-4/12">
              <Dropdown
                name="state"
                label="State"
                options={getOption("state")}
                selectedData={organization}
                setValue={setOrganization}
              />
            </div>
            <InputBox
              name="addressLine"
              type="string"
              label="Address Line"
              placeholder="Office building, Street Name, District"
              value={organization.addressLine}
              onChange={handleChange}
            />
            <InputBox
              name="fiscalStart"
              type="date"
              label="Fiscal Year (Starting)"
              value={
                organization.fiscalStart
                  ? organization.fiscalStart.split("T")[0]
                  : ""
              }
              onChange={handleChange}
            />
          </div>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded mt-4"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrganization;
