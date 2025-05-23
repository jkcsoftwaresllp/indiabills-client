import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, { useState, useCallback, useEffect } from "react";
import { Item } from "../../definitions/Types";
import { motion, AnimatePresence } from "framer-motion";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import { addRow } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import zIndex from "@mui/material/styles/zIndex";
import { TextInput } from "../../components/FormComponent/TextInput";
import { BigTextInput } from "../../components/FormComponent/BigTextInput";
import { DropdownInput } from "../../components/FormComponent/DropdownInput";
import { CollapsableSection } from "../../components/FormComponent/CollapsableSection";

const AddProducts = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Item>({} as Item);
  const [invalidForm, setInvalidForm] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rateType, setRateType] = useState<string>("purchasePriceWithoutTax"); // Toggle between 'purchasePriceWithoutTax' and 'purchaseRate'

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    // console.log(name, value, type);
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const submit = useCallback(() => {
    if (invalidForm) {
      errorPopup("Invalid Form!");
      return;
    }

    const finalData = {
      ...formData,
      variants: formData.variants?.filter(
        (variant) => variant.key.trim() !== "",
      ),
    };

    delete finalData.purchasePriceWithoutTax;

    console.log(finalData);
    // return ;

    addRow("/products/add", {
      ...finalData,
      purchasePrice: finalData.purchaseRate,
    }).then((status) => {
      if (status === 201) {
        successPopup("Item added successfully");
        navigate("/products");
      } else {
        errorPopup("Failed to add item");
      }
    });
  }, [formData, invalidForm, errorPopup, successPopup, navigate]);

  const handleVariantChange =
    (index: number, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVariants = [...(formData.variants || [])];
      if (field === "key") {
        newVariants[index].key = e.target.value;
      } else {
        newVariants[index].values = e.target.value.split(",");
      }
      setFormData((prevState) => ({
        ...prevState,
        variants: newVariants,
      }));
    };

  const addVariantRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      variants: [...(prevState.variants || []), { key: "", values: [""] }],
    }));
  };

  const steps = ["Basic", "Inventory", "Variants"];

  const calculatePurchaseRate = (
    purchasePriceWithoutTax: number,
    taxRate: number,
  ) => {
    return purchasePriceWithoutTax * (1 + taxRate / 100);
  };

  const calculatePurchasePriceWithoutTax = (
    purchaseRate: number,
    taxRate: number,
  ) => {
    return purchaseRate / (1 + taxRate / 100);
  };

  const handleRateTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRateType(event.target.value);
    setFormData((prevState) => ({
      ...prevState,
      purchasePriceWithoutTax: 0,
      purchaseRate: 0,
    }));
  };

  useEffect(() => {
    const totalTax =
      (formData.cgst || 0) + (formData.sgst || 0) + (formData.cess || 0);

    switch (rateType) {
      case "purchasePriceWithoutTax":
        setFormData((prevState) => ({
          ...prevState,
          purchaseRate: calculatePurchaseRate(
            prevState.purchasePriceWithoutTax || 0,
            totalTax,
          ),
        }));
        break;
      case "purchaseRate":
        setFormData((prevState) => ({
          ...prevState,
          purchasePriceWithoutTax: calculatePurchasePriceWithoutTax(
            prevState.purchaseRate || 0,
            totalTax,
          ),
        }));
        break;
      default:
        break;
    }
  }, [
    formData.cgst,
    formData.sgst,
    formData.cess,
    rateType,
    formData.purchasePriceWithoutTax,
    formData.purchaseRate,
  ]);

  return (
    <PageAnimate>
      <div
        className={"flex flex-col justify-center items-center overflow-scroll"}
      >
        <header className="p-4 flex gap-8 w-full items-center justify-center mt-4 mb-8">
          <button className={"flex items-center"} onClick={() => navigate(-1)}>
            {" "}
            <ArrowBackIosNewIcon />
          </button>
          <h1 className="text-2xl lowercase font-extrabold">
            {" "}
            add to <span className={"text-rose-600"}> item</span> to catalogue.{" "}
          </h1>
        </header>

        <div className="w-full flex justify-center">
          <div className="flex justify-between">
            {page >= 2 && (
              <button
                className="p-3 flex-grow shadow-xl form-button-nav"
                onClick={backPage}
              >
                {" "}
                <ArrowBackIosNewIcon />{" "}
              </button>
            )}
            <Timeline steps={steps} currentStep={page} />
            {page < 3 && (
              <button
                className="p-3 shadow-xl form-button-nav"
                onClick={nextPage}
              >
                {" "}
                <ArrowForwardIosIcon />{" "}
              </button>
            )}
            {page === 3 && (
              <button
                className="p-3 flex-grow shadow-xl form-button-submit"
                onClick={submit}
              >
                {" "}
                <CheckCircleIcon />{" "}
              </button>
            )}
          </div>
        </div>

        <div className={"h-fit p-4 w-full flex justify-center"}>
          {page === 1 && (
            <BasicPage
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
            />
          )}
          {page === 2 && (
            <InventoryPage
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              rateType={rateType}
              handleRateTypeChange={handleRateTypeChange}
            />
          )}
          {page === 3 && (
            <VariantPage
              variants={formData.variants}
              addVariantRow={addVariantRow}
              handleVariantChange={handleVariantChange}
            />
          )}
        </div>
      </div>
    </PageAnimate>
  );
};

export default AddProducts;

interface Props {
  formData?: Item;
  handleChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  setFormData?: React.Dispatch<React.SetStateAction<Item>>;
  addVariantRow?: () => void;
  handleVariantChange?: (
    index: number,
    field: string,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  variants?: { key: string; values: string[] }[];
  rateType?: string;
  handleRateTypeChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicPage = React.memo(({ formData, handleChange }: Props) => {
  return (
    <MultiPageAnimate>
      <div className="flex flex-col w-full items-center rounded-xl">
        <main className="flex flex-col gap-4 w-2/3 mt-8">
          {/* <h1 className="font-bold text-xl"> Item </h1> */}
          <TextInput
            label={"Product Name"}
            name={"itemName"}
            placeholder={"Enter Product Name"}
            value={formData?.itemName}
            onChange={handleChange}
          />
          <BigTextInput
            label={"Product Description"}
            name={"description"}
            placeholder={"Describe the product"}
            value={formData?.description}
            onChange={handleChange}
          />
          <TextInput
            name={"manufacturer"}
            label="Manufacturer"
            maxLength={100}
            placeholder={"Company behind the product"}
            value={formData?.manufacturer}
            onChange={(e) => handleChange?.(e)}
          />

          <CollapsableSection title={"More Details"}>
            <DropdownInput
              label={"Category"}
              name={"category"}
              value={formData?.category}
              onChange={handleChange}
              options={[
                "Electronics",
                "Sports",
                "Home Decorations",
                "Toys",
                "Fashion",
                "Food",
                "Others",
              ]}
            />
            <div id="optional" className="mt-2">
              <div className="flex gap-4 justify-between xs:flex-col">
                <TextInput
                  width={"w-2/4"}
                  label="UPC"
                  name="upc"
                  placeholder="xxxxxxxxxx"
                  value={formData?.upc}
                  onChange={handleChange}
                  maxlength={12}
                />
                <TextInput
                  width={"w-2/4"}
                  label="HSN"
                  name="hsn"
                  placeholder="xxxxxxxxxx"
                  value={formData?.hsn}
                  onChange={handleChange}
                  maxlength={12}
                />
              </div>
              <div className="flex gap-4 justify-between xs:flex-col mt-4">
                <TextInput
                  width={"w-2/3"}
                  label="Dimensions"
                  name="dimensions"
                  placeholder="Length, Width, Height"
                  value={formData?.dimensions}
                  onChange={handleChange}
                  maxlength={100}
                />
                <TextInput
                  width={"w-1/3"}
                  label="Weight"
                  name="weight"
                  placeholder="0"
                  endText="g"
                  value={formData?.weight}
                  onChange={handleChange}
                  maxlength={10}
                />
              </div>
            </div>
          </CollapsableSection>
        </main>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = "BasicPage";

const InventoryPage = React.memo(
  ({ formData, handleChange, rateType, handleRateTypeChange }: Props) => {
    return (
      <MultiPageAnimate>
        <div className="p-8 flex flex-col items-center gap-8 idms-bg">
          <div className="flex justify-between w-full gap-4">
            <InputBox
              name="reorderLevel"
              type="number"
              label="Reorder Level"
              placeholder={"0"}
              value={formData?.reorderLevel}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              name={"packSize"}
              type="number"
              label="Pack size"
              placeholder={"1"}
              max={5}
              maxLength={5}
              value={formData?.packSize}
              onChange={(e) => handleChange?.(e)}
            />
          </div>
          <div className="flex justify-between gap-4 w-full">
            <InputBox
              name="unitMRP"
              type="number"
              label="Unit MRP"
              placeholder={"₹"}
              value={formData?.unitMRP}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              name="salePrice"
              type="number"
              label="Sale Rate"
              placeholder={"₹"}
              value={formData?.salePrice}
              onChange={(e) => handleChange?.(e)}
            />
          </div>
          <div className="flex justify-between w-full gap-4">
            <InputBox
              startText={"%"}
              name={"cess"}
              type="number"
              label="CESS"
              placeholder={"0"}
              value={formData?.cess}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              startText={"%"}
              name={"cgst"}
              type="number"
              label="CGST"
              placeholder={"0"}
              value={formData?.cgst}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              startText={"%"}
              name={"sgst"}
              type="number"
              label="SGST"
              placeholder={"0"}
              value={formData?.sgst}
              onChange={(e) => handleChange?.(e)}
            />
          </div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Enter Rate Type</FormLabel>
            <RadioGroup
              row
              aria-label="rateType"
              name="rateType"
              value={rateType}
              onChange={handleRateTypeChange}
            >
              <FormControlLabel
                value="purchasePriceWithoutTax"
                control={<Radio />}
                label="Without Tax"
              />
              <FormControlLabel
                value="purchaseRate"
                control={<Radio />}
                label="With Tax"
              />
            </RadioGroup>
          </FormControl>

          {rateType === "purchasePriceWithoutTax" && (
            <>
              <InputBox
                name="purchasePriceWithoutTax"
                type="number"
                label="Purchase Price (without taxes)"
                placeholder={"₹"}
                value={formData?.purchasePriceWithoutTax}
                onChange={(e) => handleChange?.(e)}
              />
              <p>
                {" "}
                Purchase Rate with Tax:{" "}
                {formData?.purchaseRate !== undefined
                  ? formData.purchaseRate.toFixed(2)
                  : ""}{" "}
              </p>
            </>
          )}
          {rateType === "purchaseRate" && (
            <>
              <InputBox
                name="purchaseRate"
                type="number"
                label="Purchase Rate with Taxes"
                placeholder={"₹"}
                value={formData?.purchaseRate}
                onChange={(e) => handleChange?.(e)}
              />
              <p>
                {" "}
                Purchase Price without Tax:{" "}
                {formData?.purchasePriceWithoutTax !== undefined
                  ? formData.purchasePriceWithoutTax.toFixed(2)
                  : ""}{" "}
              </p>
            </>
          )}

          <div className="flex justify-between gap-4 w-full">
            <InputBox
              name="loadingPrice"
              type="number"
              label="Loading Price"
              placeholder={"₹"}
              value={formData?.loadingPrice}
              onChange={(e) => handleChange?.(e)}
            />
            <InputBox
              name="unloadingPrice"
              type="number"
              label="Unloading Price"
              placeholder={"₹"}
              value={formData?.unloadingPrice}
              onChange={(e) => handleChange?.(e)}
            />
          </div>
        </div>
      </MultiPageAnimate>
    );
  },
);

InventoryPage.displayName = "InventoryPage";

const VariantPage = React.memo(
  ({ variants, addVariantRow, handleVariantChange }: Props) => {
    return (
      <MultiPageAnimate>
        <div className="p-8 flex flex-col items-center gap-8 idms-bg">
          <main className="flex flex-col gap-6">
            <div className="w-full flex flex-col items-center">
              {variants?.map((variant, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <TextField
                    label="Key"
                    value={variant.key}
                    onChange={handleVariantChange!(index, "key")}
                  />
                  <TextField
                    label="Values (comma separated)"
                    value={variant.values.join(",")}
                    onChange={handleVariantChange!(index, "values")}
                  />
                </div>
              ))}
            </div>
            <button
              className="p-3 flex-grow shadow-xl idms-add opacity-70"
              onClick={addVariantRow}
            >
              <AddCircleOutlineIcon />
            </button>
          </main>
        </div>
      </MultiPageAnimate>
    );
  },
);

VariantPage.displayName = "VariantPage";
