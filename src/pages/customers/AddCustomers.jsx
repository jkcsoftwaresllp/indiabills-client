import React, { useState, useCallback } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getOption, renameAndOptimize, validateForm } from "../../utils/FormHelper";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addRow, uploadImg } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../components/FormComponent/ImageUpload";
import MobileField from "../../components/FormComponent/MobileField";
import Timeline from "../../components/FormComponent/Timeline";

const AddCustomers = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [image, setImage] = useState();
  const [formData, setFormData] = useState({});
  const [page, setPage] = useState(1);

  const backPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const nextPage = useCallback(() => {
    if (page < 3) {
      setPage(page + 1);
    }
  }, [page]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const submit = async () => {
    if (!validateForm("customers", formData)) {
      errorPopup(`Complete all required fields before submitting!`);
      return;
    }

    let workaround = "";
    if (image) {
      const ImageData = await renameAndOptimize(formData.customerName, image);
      const response = await uploadImg(ImageData.image, true);
      if (response !== 200) {
        console.error("Failed to upload the image");
        return;
      }
      workaround = ImageData.name;
    }

    const finalData = {
      ...formData,
      avatar: workaround,
    };

    addRow("/customers/add", finalData).then((status) => {
      if (status === 201 || status === 200) {
        successPopup("Customer registered successfully!");
        navigate("/customers");
      } else {
        errorPopup("Failed to register the customer :(");
      }
    });
  };

  const steps = ["User", "Verification", "Address"];

  return (
    <PageAnimate>
      <div className={"h-full flex flex-col gap-12 justify-center items-center"}>
        <button
          className={"self-start flex items-center"}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosNewIcon /> Go back
        </button>

        <h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
          register a new<span className={"text-rose-400"}> customer</span> :)
        </h1>

        <Timeline steps={steps} currentStep={page} />

        <div>
          <div className={"h-full w-full flex justify-center"}>
            <main>
              {page === 1 && (
                <BasicPage
                  setImage={setImage}
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                />
              )}
              {page === 2 && (
                <BusinessPage
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                />
              )}
              {page === 3 && (
                <AddressPage
                  formData={formData}
                  setFormData={setFormData}
                  handleChange={handleChange}
                />
              )}
            </main>

            <div className={"p-2 flex flex-col gap-4"}>
              {page === 3 && (
                <button
                  className="p-3 flex-grow shadow-xl form-button-submit"
                  onClick={submit}
                >
                  <CheckCircleIcon />
                </button>
              )}
              {page < 3 && (
                <button
                  className="p-3 flex-grow shadow-xl form-button-nav"
                  onClick={nextPage}
                >
                  <ArrowForwardIosIcon />
                </button>
              )}
              {page >= 2 && (
                <button
                  className="p-3 flex-grow shadow-xl form-button-nav"
                  onClick={backPage}
                >
                  <ArrowBackIosNewIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageAnimate>
  );
};

export default AddCustomers;

const BasicPage = React.memo(({ formData, handleChange, setFormData, setImage }) => {
  return (
    <MultiPageAnimate>
      <div className="p-8 flex flex-col items-center gap-8 idms-bg">
        <main className="grid grid-cols-2 gap-6">
          <InputBox
            name="customerName"
            type="string"
            label="Customer Name"
            placeholder={""}
            value={formData.customerName}
            onChange={handleChange}
          />
          <ImageUpload setImage={setImage} />
          <MobileField
            label={"Mobile"}
            name={"mobile"}
            setData={setFormData}
            data={formData}
          />
          <InputBox
            name="email"
            type="string"
            label="Email"
            placeholder={"example@domain.com"}
            value={formData.email}
            onChange={handleChange}
          />
          <Dropdown
            name={"gender"}
            label="Gender"
            options={["Male", "Female", "Others", "Prefer not to say"]}
            selectedData={formData}
            setValue={setFormData}
          />
          <InputBox
            name="password"
            type="password"
            label="Password"
            placeholder={"Password"}
            value={formData.password}
            onChange={handleChange}
          />
        </main>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = "BasicPage";

const BusinessPage = React.memo(({ formData, handleChange }) => {
  return (
    <MultiPageAnimate>
      <div className="p-8 flex flex-col items-center gap-8 idms-bg">
        <main className="grid grid-cols-2 gap-6">
          <InputBox
            name="businessName"
            type="string"
            label="Business Name"
            placeholder={"Business Name"}
            value={formData.businessName}
            onChange={handleChange}
          />
          <InputBox
            name="gstin"
            type="text"
            label="GSTIN"
            placeholder={"GSTIN"}
            value={formData.gstin}
            onChange={handleChange}
          />
          <InputBox
            name="fssai"
            type="text"
            label="FSSAI"
            placeholder={"FSSAI"}
            value={formData.fssai}
            onChange={handleChange}
          />
          <InputBox
            name="registrationNumber"
            type="text"
            label="Registration Number"
            placeholder={"Registration Number"}
            value={formData.registrationNumber}
            onChange={handleChange}
          />
          <InputBox
            name="aadharNumber"
            type="text"
            label="Aadhar Number"
            placeholder={"Aadhar Number"}
            value={formData.aadharNumber}
            onChange={handleChange}
          />
          <InputBox
            name="panNumber"
            type="text"
            label="PAN Number"
            placeholder={"PAN Number"}
            value={formData.panNumber}
            onChange={handleChange}
          />
        </main>
      </div>
    </MultiPageAnimate>
  );
});

BusinessPage.displayName = "BusinessPage";

const AddressPage = React.memo(({ formData, handleChange, setFormData }) => {
  return (
    <MultiPageAnimate>
      <div className="p-8 flex flex-col items-center gap-8 idms-bg">
        <main className="flex flex-col gap-6">
          <InputBox
            required
            name="addressType"
            type="string"
            label="Address Type"
            placeholder={""}
            value={formData.addressType}
            onChange={handleChange}
          />
          <InputBox
            multiline={true}
            required
            name="addressLine"
            type="string"
            label="Address Line"
            placeholder={"Plot, Street, Town"}
            value={formData.addressLine}
            onChange={handleChange}
          />
          <div className={"grid grid-cols-2 gap-4"}>
            <InputBox
              name="landmark"
              type="string"
              label="Landmark"
              placeholder={""}
              value={formData.landmark}
              onChange={handleChange}
            />
            <InputBox
              required
              name="city"
              type="string"
              label="City"
              placeholder={""}
              value={formData.city}
              onChange={handleChange}
            />
            <Dropdown
              required
              name={"state"}
              label="State"
              options={getOption("state")}
              selectedData={formData}
              setValue={setFormData}
            />
            <InputBox
              required
              name="pinCode"
              type="string"
              label="Pin Code"
              placeholder={"00000"}
              value={formData.pinCode}
              onChange={handleChange}
            />
          </div>
        </main>
      </div>
    </MultiPageAnimate>
  );
});

AddressPage.displayName = "AddressPage";
