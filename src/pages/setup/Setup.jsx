// noinspection SpellCheckingInspection

import bg1 from "../../assets/bg_setup.png";
import bg2 from "../../assets/bg_setup_2.png";
import bg3 from "../../assets/bg_setup_3.png";
import bg4 from "../../assets/bg_setup_4.png";

// import bg1 from "../../assets/bg_setup_1.svg";
import InputBox from "../../components/FormComponent/InputBox";
import React, { useEffect, useState, memo } from "react";
import { addRow, uploadImg, apiLogin, checkSetup } from "../../network/api";
import SetupTemplate from "../../components/core/SetupTemplate";
import { initializeFlexibleOptions, initializePrefs } from "../../utils/PrefsHelper";
import { quickAdd } from "../../network/api";
import { renameAndOptimize } from "../../utils/FormHelper";
import { useStore } from "../../store/store";
import { getOption, initializeFormData } from "../../utils/FormHelper";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../../components/FormComponent/ImageUpload";
import { useAuth } from "../../hooks/useAuth";
import Dropdown from "../../components/FormComponent/Dropdown";
import { MuiTelInput } from "mui-tel-input";
import DropdownStream from "../../components/FormComponent/DropdownStream";
import InputBoxStream from "../../components/FormComponent/InputBoxStream";
import MobileField from "../../components/FormComponent/MobileField";

const Setup = () => {
  const { errorPopup, successPopup } = useStore();

  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { login } = useAuth();

  useEffect(() => {
    async function fetchData() {
      const answer = await checkSetup();
      if (!answer) {
        navigate("/login");
      }
    }

    fetchData().then();
  }, []);

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
    upi: "",
    accountNumber: "",
    ifscCode: "",
    bankBranch: "",
  });

  const submitOrganization = async () => {
    /* UPLOAD IMAGE */
    let workaround = "";
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
      workaround = ImageData.name;
    }

    const extractInitials = (name) => {
      const words = name.trim().split(/\s+/);
      if (words.length > 1) {
        return words.map((word) => word[0].toUpperCase()).join("");
      } else {
        return name.substring(0, 2).toUpperCase();
      }
    };

    quickAdd("/organization/add", {
      ...organization,
      initials: extractInitials(organization.organizationName),
      ["logo"]: workaround,
    }).then((res) => {
      if (res.status !== 200) {
        errorPopup("Couldn't add organization");
        return;
      } else {
        successPopup("Welcome!");
        navigate("/");
      }
    });
  };

  /* CREATE ROOT USER */
  const [image, setImage] = useState();
  const [admin, setAdmin] = useState({
    userName: "",
    email: "",
    mobile: "",
    role: "admin",
    avatar: "", // image_name.extension
    password: "",
    confirmPassword: "",
  });

  const submitAdmin = async () => {
    /* VALIDATION */
    if (admin.password !== admin.confirmPassword) {
      errorPopup("Passwords don't match");
      return;
    }

    /* UPLOAD IMAGE */
    let workaround = "";
    if (image) {
      const ImageData = await renameAndOptimize(admin.userName, image);
      const response = await uploadImg(ImageData.image, true);
      if (response !== 200) {
        console.error("Failed to upload the image");
        return;
      }
      workaround = ImageData.name;
    }

    /* ADD / SIGN-IN */
    const response = await addRow(`/auth/signup`, {
      ...admin,
      ["avatar"]: workaround,
    });
    if (response !== 200) {
      console.error("Failed to add the user");
      return;
    } else {
      console.log("User added:", response);
    }

    /* LOGIN */
    const loginResponse = await apiLogin({
      email: admin.email,
      password: admin.password,
    });

    const session = loginResponse.data;

    const payload = {
      id: session.user.id,
      name: session.user.name,
      role: session.user.role,
      avatar: session.avatar,
      token: session.token,
    };

    login(payload);
  };

  /* ADD WAREHOUSE */
  const [locationFormData, setLocationFormData] = useState(
    initializeFormData(LocationMetadata)
  );

  const submitLocation = () => {
    console.log(locationFormData);
    quickAdd("/inventory/warehouses/add", locationFormData).then((res) => {
      if (res.status !== 200) {
        errorPopup("Couldn't add location");
        return;
      }
    });
  };

  async function finish() {
    await submitAdmin();
    submitLocation();
    initializePrefs(organization.organizationName);
    initializeFlexibleOptions();
    submitOrganization();
  }

  return (
    <main
      className="grid place-items-center w-full rounded-xl p-4"
      style={{
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100dvh",
      }}
    >
      {page === 1 && <LandingSetup setPage={setPage} />}
      {page === 2 && (
        <BrandingSetup
          setPage={setPage}
          setLogo={setLogo}
          organization={organization}
          setOrganization={setOrganization}
        />
      )}
      {page === 3 && (
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
        />
      )}
    </main>
  );
};

export default Setup;
