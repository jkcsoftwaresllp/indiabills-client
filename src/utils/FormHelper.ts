import imageCompression from "browser-image-compression";
import { Field, Services, User } from "../definitions/Types";
import { Paper, Popper } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

export const formatCurrency = (amount: number | string): string => {
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

const initializeFormData = <T>(metadata: Field<T>[]): T => {
  const initialFormData: Partial<T> = {};
  metadata.forEach((field) => {
    if (field.toAdd) {
      if ((field.name as string).includes("mobile")) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        initialFormData[field.name] = "+91";
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        initialFormData[field.name] = field.type === "number" ? 0 : "";
      }
    }
  });
  return initialFormData as T;
};

function groupByCategory<T extends Services, K extends Field<T>>(
  data: K[],
): Record<string, K[]> {
  return data.reduce((acc: Record<string, K[]>, item: K) => {
    if (item.toAdd) {
      // Filter fields with toAdd = true
      const key = item.category;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
    }
    return acc;
  }, {});
}

function cutShort(title: string): string {
  if (title === "products") return "itemId";

  let result = title;
  if (title.endsWith("s")) {
    result = title.slice(0, -1);
  }
  result = result.toLowerCase() + "Id";

  return result; // e.g., products -> productId
}

function cutToName(title: string): string {
  title = title.toLowerCase();
  if (title.endsWith("s")) {
    title = title.slice(0, -1);
  }
  title += "Name";

  return title; // e.g = products -> productName
}

function getOption(itemName: string): string[] {
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

function getRequiredField(title: string): string[] {
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
        "customerName",
        "email",
        "mobile",
        "addressType",
        "addressLine",
        "city",
        "state",
        "pinCode",
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
      return [""];
    case "invoice":
      return [""];
    default:
      console.error("unapproved required fields:", title);
      return [];
  }
}

export const validateForm = (title: string, formData: any): boolean => {
  const requiredFields = getRequiredField(title);

  for (const field of requiredFields) {
    if (!formData[field]) {
      console.error(`Not found: ${formData[field]}`);
      return false;
    }
  }
  return true;
};

const groupByRole = (users: User[]) => {
  return users.reduce(
    (acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = [];
      }
      acc[user.role].push(user);
      return acc;
    },
    {} as Record<string, User[]>,
  );
};

interface ImageData {
  image: File;
  name: string;
}

const renameAndOptimize = async (
  userName: string,
  image: File,
): Promise<ImageData> => {
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

interface Labels {
  label: string;
  name: string;
}

function getLabel<T extends Services>(metadata: Field<T>[]): Labels[] {
  return metadata.map((data) => ({
    label: data.label,
    name: data.name as string,
  }));
}

const sortDataByLabels = <T extends Services>(
  data: T[],
  labels: Labels[],
): T[] => {
  // console.log(api, labels);

  return data.map((item) => {
    const sortedItem: Partial<T> = {};
    labels.forEach((label) => {
      if (label.name in item) {
        sortedItem[label.name as keyof T] = item[label.name as keyof T];
      }
    });
    return sortedItem as T;
  });
};

const extractLabelNames = (labels: Labels[]): string[] => {
  return labels.map((label) => label.label);
};

async function AddFormSubmit(
  title: string,
  formData: object,
  e: React.FormEvent<HTMLFormElement>,
): Promise<void> {
  console.log(formData);

  // const res = await addRow(`/${title}/add`, formData)

  // if (res !== 200) {
  // errorPopup(`Couldn't add the ${title}!`);
  // return ;
  // }

  // successPopup(`${title} added successfully!`);
  // navigate(`/${title}`);
}

export const formatToIndianCurrency = (amount: string | number): string => {
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

export const extractCustomerName = (customerString: string): string => {
  const noDigits = customerString.replace(/^\d+\s*/, "");
  const noBrackets = noDigits.replace(/\s*\(.*?\)\s*$/, "");
  return noBrackets.trim();
};

export const handleFormFieldChange =
  <T>(setData: React.Dispatch<React.SetStateAction<T>>) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateDDMMYYYY = (date: Date): string => {
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
