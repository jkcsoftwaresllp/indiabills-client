import imageCompression from "browser-image-compression";
import { Paper, Popper } from "@mui/material";
import { styled } from "@mui/system";

export const formatCurrency = (amount) => {
  return Number(amount).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};

const CustomPopper = styled(Popper)(() => ({
  zIndex: 6000,
  "& .MuiAutocomplete-listbox": {
    backgroundColor: "transparent",
    backdropFilter: "blur(10px)",
    borderRadius: "10px",
    padding: "0",
  },
}));

const CustomPaper = styled(Paper)(() => ({
  backgroundColor: "transparent",
  backdropFilter: "blur(10px)",
  borderRadius: "10px",
  padding: "8px",
}));

const initializeFormData = (metadata) => {
  const initialFormData = {};
  metadata.forEach((field) => {
    if (field.toAdd) {
      if (String(field.name).includes("mobile")) {
        initialFormData[field.name] = "+91";
      } else {
        initialFormData[field.name] = field.type === "number" ? 0 : "";
      }
    }
  });
  return initialFormData;
};

function groupByCategory(data) {
  return data.reduce((acc, item) => {
    if (item.toAdd) {
      const key = item.category;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
    }
    return acc;
  }, {});
}

function cutShort(title) {
  if (title === "products") return "itemId";

  let result = title;
  if (title.endsWith("s")) {
    result = title.slice(0, -1);
  }
  result = result.toLowerCase() + "Id";

  return result;
}

function cutToName(title) {
  title = title.toLowerCase();
  if (title.endsWith("s")) {
    title = title.slice(0, -1);
  }
  title += "Name";

  return title;
}

function getOption(itemName) {
  switch (itemName) {
    case "role":
      return ["Admin", "Operators", "Customer", "Delivery", "Reporter"];
    case "measuringUnit":
      return ["mg", "g"];
    case "state":
      return [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jammu & Kashmir",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttarakhand",
        "Uttar Pradesh",
        "West Bengal",
      ];
    case "offerType":
      return ["default"];
    default:
      console.error("unapproved dropdown:", itemName);
      return [];
  }
}

function getRequiredField(title) {
  switch (title) {
    case "users":
      return ["userName", "email", "role", "password"];
    case "suppliers":
      return [
        "supplierName",
        "businessName",
        "mobileNumber",
        "email",
        "addressLine1",
        "city",
        "state",
        "pinCode",
        "beneficiaryName",
        "accountNumber",
        "ifscCode",
        "virtualPaymentAddress",
      ];
    case "products":
      return [
        "productName",
        "category",
        "unitMRP",
        "manufacturer",
        "marketer",
        "upc",
        "hsn",
        "cgst",
        "sgst",
        "igst",
        "cess",
        "loadPrice",
        "unloadingPrice",
      ];
    case "offers":
      return [
        "offerType",
        "offerName",
        "startDate",
        "endDate",
        "products",
        "offers",
        "discountValue",
        "discountPercentage",
        "maximumDiscountValue",
        "minimumPurchase",
        "offerApplicabilityFrequency",
        "applicableTo",
        "status",
      ];
    case "customers":
      return [
       "first_name",
       "last_name",
       "email",
       "phone",
       "password",
       "confirm_password",
       "customer_type",
      ];

    case "transports":
      return [
        "transportName",
        "businessName",
        "vehicleName",
        "email",
        "mobileNumber",
        "addressLine1",
        "city",
        "district",
        "state",
        "pinCode",
        "branchOffer",
        "aadharNumber",
        "panNumber",
        "driverName",
        "driverMobileNumber",
        "status",
      ];
    case "inventory":
    case "invoice":
      return [""];
    default:
      console.error("unapproved required fields:", title);
      return [];
  }
}

export const validateForm = (title, formData) => {
  const requiredFields = getRequiredField(title);
  for (const field of requiredFields) {
    if (!formData[field]) {
      console.error(`Not found: ${formData[field]}`);
      return false;
    }
  }
  return true;
};

const groupByRole = (users) => {
  return users.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {});
};

const renameAndOptimize = async (userName, image) => {
  const imgName = userName.replace(/\s/g, "_");
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const originalExtension = image.name.split(".").pop();
  const uniqueImgName = `${imgName}_${uniqueSuffix}.${originalExtension}`;

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  console.log(`Compressing image: ${image.name} of type ${image.type}`);
  const compressedImage = await imageCompression(image, options);

  const newImage = new File([compressedImage], uniqueImgName, {
    type: image.type,
  });
  console.log(`Image compressed and renamed to: ${uniqueImgName}`);
  return {
    image: newImage,
    name: uniqueImgName,
  };
};

function getLabel(metadata) {
  return metadata.map((data) => ({
    label: data.label,
    name: String(data.name),
  }));
}

const sortDataByLabels = (data, labels) => {
  return data.map((item) => {
    const sortedItem = {};
    labels.forEach((label) => {
      if (label.name in item) {
        sortedItem[label.name] = item[label.name];
      }
    });
    return sortedItem;
  });
};

const extractLabelNames = (labels) => {
  return labels.map((label) => label.label);
};

async function AddFormSubmit(title, formData, e) {
  console.log(formData);

  // const res = await addRow(`/${title}/add`, formData)
  // if (res !== 200) {
  //   errorPopup(`Couldn't add the ${title}!`);
  //   return;
  // }
  // successPopup(`${title} added successfully!`);
  // navigate(`/${title}`);
}

export const formatToIndianCurrency = (amount) => {
  switch (typeof amount) {
    case "string":
      const [integerPart, decimalPart] = amount.split(".");
      const lastThreeDigits = integerPart.slice(-3);
      const otherDigits = integerPart.slice(0, -3);
      const formattedIntegerPart =
        otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
        (otherDigits ? "," : "") +
        lastThreeDigits;
      return decimalPart
        ? `${formattedIntegerPart}.${decimalPart}`
        : formattedIntegerPart;
    case "number":
      return amount.toLocaleString("en-IN");
    default:
      return "N/A";
  }
};

export const extractCustomerName = (customerString) => {
  const noDigits = customerString.replace(/^\d+\s*/, "");
  const noBrackets = noDigits.replace(/\s*\(.*?\)\s*$/, "");
  return noBrackets.trim();
};

export const handleFormFieldChange = (setData) => (e) => {
  const { name, value, type } = e.target;
  setData((prevState) => ({
    ...prevState,
    [name]: type === "number" ? Number(value) : value,
  }));
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateDDMMYYYY = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export {
  groupByCategory,
  initializeFormData,
  cutShort,
  cutToName,
  getOption,
  getRequiredField,
  groupByRole,
  getLabel,
  renameAndOptimize,
  sortDataByLabels,
  extractLabelNames,
  AddFormSubmit,
  CustomPaper,
  CustomPopper,
};

