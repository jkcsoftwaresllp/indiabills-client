import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
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
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [rateType, setRateType] = useState("purchasePrice");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProductById(id);
        
        if (response.status !== 200 || !response.data) {
          console.error("Failed to fetch product:", response);
          return;
        }
        
        const productData = response.data;

        // Handle tax data from nested taxes object or direct properties
        const taxes = productData.taxes || {};
        const totalTax =
          (Number(taxes.cgst) || Number(productData.cgst) || 0) +
          (Number(taxes.sgst) || Number(productData.sgst) || 0) +
          (Number(taxes.cess) || Number(productData.cess) || 0);

        // Map API response to component state
        const mappedData = {
          ...productData,
          itemName: productData.name,
          unitMRP: productData.unitMrp,
          cgst: taxes.cgst || productData.cgst || 0,
          sgst: taxes.sgst || productData.sgst || 0,
          cess: taxes.cess || productData.cess || 0,
          upc: productData.barcode || productData.upc
        };

        mappedData.purchasePriceWithoutTax = calculatePurchasePriceWithoutTax(
          mappedData.purchasePrice,
          totalTax
        );

        setData(mappedData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
    return parseFloat((purchasePrice / (1 + taxRate / 100)).toFixed(3));
  };

  useEffect(() => {
    if (!data) return;

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
          key="name"
          name="name"
          type="text"
          label="Item Name"
          value={data.name}
          onChange={handleChange}
        />,
        <InputBox
          key="description"
          name="description"
          type="text"
          label="Description"
          value={data.description}
          onChange={handleChange}
        />,
        <InputBox
          key="categoryID"
          name="categoryID"
          type="number"
          label="Category ID"
          value={data.categoryID}
          onChange={handleChange}
        />,
        <InputBox
          optional
          key="manufacturer"
          name="manufacturer"
          type="text"
          label="Manufacturer"
          value={data.manufacturer}
          onChange={handleChange}
        />,
        <InputBox
          key="brand"
          name="brand"
          type="text"
          label="Brand"
          value={data.brand}
          onChange={handleChange}
        />,
        <InputBox
          key="barcode"
          name="barcode"
          type="text"
          label="Barcode"
          value={data.barcode}
          onChange={handleChange}
        />,
      ],
    },
    {
      category: "Pricing Information",
      elements: [
        <InputBox
          key="unitOfMeasure"
          name="unitOfMeasure"
          type="string"
          label="Unit of Measure"
          value={data.unitOfMeasure}
          onChange={handleChange}
        />,
        <InputBox
          key="unitMRP"
          name="unitMRP"
          type="number"
          label="Unit MRP"
          value={data.unitMRP}
          onChange={handleChange}
        />,
        <InputBox
          key="salePrice"
          name="salePrice"
          type="number"
          label="Sale Price"
          value={data.salePrice}
          onChange={handleChange}
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
          />
        ) : (
          <InputBox
            key="purchasePrice"
            name="purchasePrice"
            type="number"
            label="Purchase Rate (with taxes)"
            value={data.purchasePrice}
            onChange={handleChange}
          />
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
        />,
        <InputBox
          key="sgst"
          name="sgst"
          type="number"
          label="SGST (%)"
          value={data.sgst}
          onChange={handleChange}
        />,
        <InputBox
          key="cess"
          name="cess"
          type="number"
          label="CESS (%)"
          value={data.cess}
          onChange={handleChange}
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
        />,
        <InputBox
          key="maxStockLevel"
          name="maxStockLevel"
          type="number"
          label="Max Stock Level"
          value={data.maxStockLevel}
          onChange={handleChange}
        />,
        <InputBox
          key="weight"
          name="weight"
          type="number"
          label="Weight"
          value={data.weight}
          onChange={handleChange}
        />,
        <InputBox
          key="reorderLevel"
          name="reorderLevel"
          type="number"
          label="Reorder Level"
          value={data.reorderLevel}
          onChange={handleChange}
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
        #{id}
      </Typography>
      <InspectData data={data} metadata={metadata} title={"products"} id={id} />
    </Box>
  );
};

export default InspectProduct;
