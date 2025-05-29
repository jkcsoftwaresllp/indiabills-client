import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRow } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import {
  Box,
  Typography,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";

const InspectProduct = () => {
  const { itemId } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [rateType, setRateType] = useState("purchasePrice");

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRow(`/products/edit/${itemId}`);
      const fetchedData = response;

      const totalTax =
        (Number(fetchedData.cgst) || 0) +
        (Number(fetchedData.sgst) || 0) +
        (Number(fetchedData.cess) || 0);

      fetchedData.purchasePriceWithoutTax = calculatePurchasePriceWithoutTax(
        fetchedData.purchasePrice,
        totalTax
      );

      setData(fetchedData);
    };

    fetchData().then(() => {
      setLoading(false);
    });
  }, [itemId]);

  const handleChange = handleFormFieldChange(setData);

  const handleRateTypeChange = (event) => {
    setRateType(event.target.value);
  };

  const calculatePurchasePrice = (purchasePriceWithoutTax, taxRate) => {
    return parseFloat(
      (Number(purchasePriceWithoutTax) * (1 + Number(taxRate) / 100)).toFixed(3)
    );
  };

  const calculatePurchasePriceWithoutTax = (purchasePrice, taxRate) => {
    return parseFloat(
      (purchasePrice / (1 + taxRate / 100)).toFixed(3)
    );
  };

  useEffect(() => {
    const totalTax =
      (Number(data.cgst) || 0) +
      (Number(data.sgst) || 0) +
      (Number(data.cess) || 0);

    switch (rateType) {
      case "purchasePriceWithoutTax":
        setData((prevState) => ({
          ...prevState,
          purchasePrice: calculatePurchasePrice(
            prevState.purchasePriceWithoutTax,
            totalTax
          ),
        }));
        break;
      case "purchasePrice":
        setData((prevState) => ({
          ...prevState,
          purchasePriceWithoutTax: calculatePurchasePriceWithoutTax(
            Number(prevState.purchasePrice),
            totalTax
          ),
        }));
        break;
      default:
        break;
    }
  }, [
    data.cgst,
    data.sgst,
    data.cess,
    rateType,
    data.purchasePriceWithoutTax,
    data.purchasePrice,
  ]);

  const metadata = [
    {
      category: "Basic Information",
      elements: [
        <InputBox
          key="itemName"
          name="itemName"
          type="text"
          label="Item Name"
          value={data.itemName}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="description"
          name="description"
          type="text"
          label="Description"
          value={data.description}
          onChange={handleChange}
          placeholder=""
        />,
        <Dropdown
          key="category"
          name="category"
          label="Category"
          options={[
            "electronics",
            "gadgets",
            "sports",
            "home decorations",
            "toys",
            "clothing",
            "accessories",
            "gaming",
            "food",
          ]}
          selectedData={data}
          setValue={setData}
        />,
        <InputBox
          optional
          key="manufacturer"
          name="manufacturer"
          type="text"
          label="Manufacturer"
          value={data.manufacturer}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="marketer"
          name="marketer"
          type="text"
          label="Marketer"
          value={data.marketer}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="upc"
          name="upc"
          type="text"
          label="UPC"
          value={data.upc}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="hsn"
          name="hsn"
          type="text"
          label="HSN"
          value={data.hsn}
          onChange={handleChange}
          placeholder=""
        />,
      ],
    },
    {
      category: "Pricing Information",
      elements: [
        <InputBox
          key="packSize"
          name="packSize"
          type="number"
          label="Pack Size"
          value={data.packSize}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="unitMRP"
          name="unitMRP"
          type="number"
          label="Unit MRP"
          value={data.unitMRP}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="salePrice"
          name="salePrice"
          type="number"
          label="Sale Price"
          value={data.salePrice}
          onChange={handleChange}
          placeholder=""
        />,
        <FormControl component="fieldset" key="rateType">
          <FormLabel component="legend">Enter Rate Type</FormLabel>
          <RadioGroup
            row
            aria-label="rateType"
            name="rateType"
            value={rateType}
            onChange={handleRateTypeChange}
          >
            <FormControlLabel
              value="purchasePrice"
              control={<Radio />}
              label="Purchase Rate (With Tax)"
            />
            <FormControlLabel
              value="purchasePriceWithoutTax"
              control={<Radio />}
              label="Purchase Price Without Tax"
            />
          </RadioGroup>
        </FormControl>,
        rateType === "purchasePriceWithoutTax" ? (
          <InputBox
            key="purchasePriceWithoutTax"
            name="purchasePriceWithoutTax"
            type="number"
            label="Purchase Price (without taxes)"
            value={data.purchasePriceWithoutTax}
            onChange={handleChange}
            placeholder=""
          />
        ) : (
          <InputBox
            key="purchasePrice"
            name="purchasePrice"
            type="number"
            label="Purchase Rate (with taxes)"
            value={data.purchasePrice}
            onChange={handleChange}
            placeholder=""
          />
        ),
        rateType === "purchasePriceWithoutTax" ? (
          <>
            <p>
              Purchase Rate:{" "}
              {data.purchasePrice !== undefined
                ? Number(data.purchasePrice).toFixed(2)
                : ""}
            </p>
            <p>
              Purchase Price Without Tax:{" "}
              {data.purchasePriceWithoutTax.toFixed(2)}
            </p>
          </>
        ) : (
          <>
            <p>
              Purchase Price Without Tax:{" "}
              {data.purchasePriceWithoutTax
                ? data.purchasePriceWithoutTax.toFixed(2)
                : ""}
            </p>
            <p>
              Purchase Rate: {Number(data.purchasePrice).toFixed(2)}
            </p>
          </>
        ),
      ],
    },
    {
      category: "Tax Information",
      elements: [
        <InputBox
          key="cgst"
          name="cgst"
          type="number"
          label="CGST (%)"
          value={data.cgst}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="sgst"
          name="sgst"
          type="number"
          label="SGST (%)"
          value={data.sgst}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="cess"
          name="cess"
          type="number"
          label="CESS (%)"
          value={data.cess}
          onChange={handleChange}
          placeholder=""
        />,
      ],
    },
    {
      category: "Inventory Information",
      elements: [
        <InputBox
          key="dimensions"
          name="dimensions"
          type="string"
          label="Dimensions"
          value={data.dimensions}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="weight"
          name="weight"
          type="number"
          label="Weight"
          value={data.weight}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="reorderLevel"
          name="reorderLevel"
          type="number"
          label="Reorder Level"
          value={data.reorderLevel}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="loadingPrice"
          name="loadingPrice"
          type="number"
          label="Loading Price"
          value={data.loadingPrice}
          onChange={handleChange}
          placeholder=""
        />,
        <InputBox
          key="unloadingPrice"
          name="unloadingPrice"
          type="number"
          label="Unloading Price"
          value={data.unloadingPrice}
          onChange={handleChange}
          placeholder=""
        />,
      ],
    },
  ];

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        #{itemId}
      </Typography>
      <InspectData
        data={data}
        metadata={metadata}
        title={"products"}
        id={itemId}
      />
    </Box>
  );
};

export default InspectProduct;
