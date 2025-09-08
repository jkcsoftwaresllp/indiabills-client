// Setup.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { addRow, uploadImg, apiLogin, checkSetup } from "../../network/api";
import { uploadImg } from "../../network/api";
import { quickAdd } from "../../network/api";
// import {
//   initializeFlexibleOptions,
//   initializePrefs,
// } from "../../utils/PrefsHelper";
import { renameAndOptimize } from "../../utils/FormHelper";
import { useStore } from "../../store/store";
// import { getOption, initializeFormData } from "../../utils/FormHelper";
// import { useAuth } from "../../hooks/useAuth";

import bg1 from "../../assets/bg_setup.png";
import bg2 from "../../assets/bg_setup_2.png";
import bg3 from "../../assets/bg_setup_3.png";
import bg4 from "../../assets/bg_setup_4.png";

import LandingSetup from "./SetupComponents/LandingSetup";
import BrandingSetup from "./SetupComponents/BrandingSetup";
// import AdminSetup from "./SetupComponents/AdminSetup";
// import WarehouseSetup from "./SetupComponents/WarehouseSetup";

import styles from "./Setup.module.css";

// const LocationMetadata = [
//   {
//     name: "warehouseId",
//     type: "string",
//     label: "Location ID",
//     placeholder: "Location ID",
//     category: "Shipping",
//     autocomplete: false,
//     required: false,
//     readonly: true,
//     toAdd: false,
//   },
//   {
//     name: "warehouseName",
//     type: "string",
//     label: "Warehouse Name",
//     placeholder: "",
//     category: "Shipping",
//     autocomplete: false,
//     required: true,
//     readonly: false,
//     toAdd: true,
//   },
//   {
//     name: "capacity",
//     type: "number",
//     label: "Capacity",
//     placeholder: "(cm3)",
//     category: "Shipping",
//     autocomplete: false,
//     required: true,
//     readonly: false,
//     toAdd: true,
//   },
//   {
//     name: "addressLine",
//     type: "string",
//     label: "Address",
//     placeholder: "Plot no. & Other details",
//     category: "Shipping",
//     autocomplete: false,
//     required: true,
//     readonly: false,
//     toAdd: true,
//   },
//   {
//     name: "landmark",
//     type: "string",
//     label: "Landmark",
//     placeholder: "Near anything recognisable?",
//     category: "Shipping",
//     autocomplete: false,
//     required: false,
//     readonly: false,
//     toAdd: true,
//   },
//   {
//     name: "city",
//     type: "string",
//     label: "City",
//     placeholder: "Patna, Delhi, etc.",
//     category: "Shipping",
//     autocomplete: false,
//     required: true,
//     readonly: false,
//     toAdd: true,
//   },
//   {
//     name: "district",
//     type: "string",
//     label: "District",
//     placeholder: "Specify district or area",
//     category: "Shipping",
//     autocomplete: false,
//     required: true,
//     readonly: false,
//     toAdd: true,
//   },
//   {
//     name: "state",
//     type: "string",
//     label: "State",
//     placeholder: "",
//     category: "Shipping",
//     autocomplete: true,
//     required: true,
//     readonly: false,
//     toAdd: true,
//   },
//   {
//     name: "pinCode",
//     type: "number",
//     label: "Pin Code",
//     placeholder: "xxxxxx",
//     category: "Shipping",
//     autocomplete: false,
//     required: true,
//     readonly: false,
//     toAdd: true,
//   },
//   {
//     name: "dateAdded",
//     type: "date",
//     label: "Date Added",
//     placeholder: "Date",
//     category: "Additional Info",
//     readonly: true,
//     autocomplete: false,
//   },
//   {
//     name: "addedBy",
//     type: "string",
//     label: "Added By",
//     placeholder: "Name",
//     category: "Additional Info",
//     readonly: true,
//     autocomplete: false,
//   },
//   {
//     name: "lastEditedDate",
//     type: "date",
//     label: "Last Edited Date",
//     placeholder: "Date",
//     category: "Additional Info",
//     readonly: true,
//     autocomplete: false,
//   },
//   {
//     name: "lastEditedBy",
//     type: "string",
//     label: "Last Edited By",
//     placeholder: "Name",
//     category: "Additional Info",
//     readonly: true,
//     autocomplete: false,
//   },
// ];

const Setup = () => {
  const { errorPopup, successPopup } = useStore();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  // const { login } = useAuth();

  useEffect(() => {
    async function fetchData() {
      // TODO : Ask to implelement this API
      // const answer = await checkSetup();
      // if (!answer) {
      //   navigate("/login");
      // }
    }
    fetchData().then();
  }, [navigate]);

  const getBackgroundImage = () => {
    switch (page) {
      case 1:
        return bg1;
      case 2:
        return bg2;
      case 3:
        return bg3;
      case 4:
        return bg4;
      default:
        return bg1;
    }
  };

  /* SETUP ORGANIZATION */
  const [logo, setLogo] = useState();
  const [organization, setOrganization] = useState({
    organizationName: "",
    about: "",
    gstin: "",
    tagline: "",
    logo: "", // image_name.extension
    phone: "",
    email: "",
    website: "",
    addressLine: "",
    state: "",
    // upi: "",
    // accountNumber: "",
    // ifscCode: "",
    // bankBranch: "",
  });

  const [errors, setErrors] = useState({});

  /* VALIDATION FUNCTION */
  const validateOrganization = () => {
    let newErrors = {};

    if (!organization.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
    }

    if (!organization.about.trim()) {
      newErrors.about = "About section is required";
    }

    // if (organization.gstin && !/^[0-9A-Z]{15}$/.test(organization.gstin)) {
    //   newErrors.gstin = "Invalid GSTIN (must be 15 alphanumeric characters)";
    // }

    if (!organization.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(organization.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!organization.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organization.email)) {
      newErrors.email = "Invalid email format";
    }

    if (
      organization.website &&
      !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(organization.website)
    ) {
      newErrors.website = "Invalid website URL";
    }

    if (!organization.addressLine.trim()) {
      newErrors.addressLine = "Address is required";
    }

    if (!organization.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!logo) {
      newErrors.logo = "Logo file is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitOrganization = async () => {
    /* UPLOAD IMAGE */
    let workaround = "";

    if (!validateOrganization()) {
      console.error("Validation failed:", errors);
      return;
    }

    if (logo) {
      const ImageData = await renameAndOptimize(
        organization.organizationName,
        logo
      );
      const response = await uploadImg(ImageData.image, true);
      if (response !== 200) {
        console.error("Failed to upload the image");
        return;
      }
      workaround = response.logoUrl;
    }

    // const extractInitials = (name) => {
    //   const words = name.trim().split(/\s+/);
    //   if (words.length > 1) {
    //     return words.map((word) => word[0].toUpperCase()).join("");
    //   } else {
    //     return name.substring(0, 2).toUpperCase();
    //   }
    // };

    quickAdd("/org", {
      ...organization,
      ["logo"]: workaround,
    }).then((res) => {
      if (res.status !== 201) {
        errorPopup("Couldn't add organization");
        return;
      } else {
        successPopup("Welcome!");
        navigate("/");
      }
    });
  };

  // /* CREATE ROOT USER */
  // const [image, setImage] = useState();
  // const [admin, setAdmin] = useState({
  //   userName: "",
  //   email: "",
  //   mobile: "",
  //   role: "admin",
  //   avatar: "", // image_name.extension
  //   password: "",
  //   confirmPassword: "",
  // });

  // const submitAdmin = async () => {
  //   /* VALIDATION */
  //   if (admin.password !== admin.confirmPassword) {
  //     errorPopup("Passwords don't match");
  //     return;
  //   }

  //   /* UPLOAD IMAGE */
  //   let workaround = "";
  //   if (image) {
  //     const ImageData = await renameAndOptimize(admin.userName, image);
  //     const response = await uploadImg(ImageData.image, true);
  //     if (response !== 200) {
  //       console.error("Failed to upload the image");
  //       return;
  //     }
  //     workaround = ImageData.name;
  //   }
  //   /* ADD / SIGN-IN */
  //   const response = await addRow(`/auth/signup`, {
  //     ...admin,
  //     ["avatar"]: workaround,
  //   });
  //   if (response !== 200) {
  //     console.error("Failed to add the user");
  //     return;
  //   } else {
  //     console.log("User added:", response);
  //   }
  //   /* LOGIN */ // Creating Session ...
  //   const loginResponse = await apiLogin({
  //     email: admin.email,
  //     password: admin.password,
  //   });

  //   const session = loginResponse.data;
  //   console.log(session);

  //   const payload = {
  //     id: session.user.id,
  //     name: session.user.name,
  //     role: session.user.role,
  //     avatar: session.avatar,
  //     token: session.token,
  //   };

  //   login(payload);
  // };

  // /* ADD WAREHOUSE */
  // const [locationFormData, setLocationFormData] = useState(
  //   initializeFormData(LocationMetadata)
  // );

  // const submitLocation = () => {
  //   console.log(locationFormData);
  //   quickAdd("/inventory/warehouses/add", locationFormData).then((res) => {
  //     if (res.status !== 200) {
  //       errorPopup("Couldn't add location");
  //       return;
  //     }
  //   });
  // };

  // async function finish() {
  //   await submitAdmin();
  //   submitLocation();
  //   initializePrefs(organization.organizationName);
  //   initializeFlexibleOptions();
  //   submitOrganization();
  // }

  return (
    <main
      className={`${styles.main}`}
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
      }}
    >
      {page === 1 && <LandingSetup setPage={setPage} />}
      {page === 2 && (
        <BrandingSetup
          setPage={(value) => submitOrganization()}
          setLogo={setLogo}
          organization={organization}
          setOrganization={setOrganization}
        />
      )}
      {/* {page === 3 && (
        <AdminSetup
          setPage={setPage}
          setImage={setImage}
          admin={admin}
          setAdmin={setAdmin}
        />
      )}
      {page === 4 && (
        <WarehouseSetup
          setPage={setPage}
          locationFormData={locationFormData}
          setLocationFormData={setLocationFormData}
          finish={finish}
          LocationMetadata={LocationMetadata}
        />
      )} */}
    </main>
  );
};

export default Setup;
