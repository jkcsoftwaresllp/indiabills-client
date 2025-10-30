import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTransportPartnerById, updateTransportPartner } from "../../network/api";
import InspectData from "../../layouts/form/InspectData";
import InputBox from "../../components/FormComponent/InputBox";
import { Box, Typography, CircularProgress } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";
import { useStore } from "../../store/store";

const EditTransport = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { successPopup, errorPopup } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransportPartnerById(id);
        if (response) {
          setData(response);
        }
      } catch (error) {
        errorPopup("Failed to fetch transport partner details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, errorPopup]);

  const handleChange = handleFormFieldChange(setData);

  const handleSave = async (updatedData) => {
    try {
      const response = await updateTransportPartner(id, updatedData);
      if (response?.status === 200 || response === 200) {
        successPopup("Transport partner updated successfully");
        return true;
      } else {
        throw new Error();
      }
    } catch {
      errorPopup("Failed to update transport partner");
      return false;
    }
  };

  const metadata = [
    {
      category: "Basic Information",
      elements: [
        <InputBox
          key="name"
          name="name"
          label="Transport Partner Name"
          value={data.name || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="business_name"
          name="business_name"
          label="Business Name"
          value={data.business_name || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="contact_person"
          name="contact_person"
          label="Contact Person"
          value={data.contact_person || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="email"
          name="email"
          type="email"
          label="Email"
          value={data.email || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="phone"
          name="phone"
          label="Phone"
          value={data.phone || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="alternate_phone"
          name="alternate_phone"
          label="Alternate Phone"
          value={data.alternate_phone || ""}
          onChange={handleChange}
        />,
      ],
    },
    {
      category: "Address Information",
      elements: [
        <InputBox
          key="address_line1"
          name="address_line1"
          label="Address Line 1"
          value={data.address_line1 || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="address_line2"
          name="address_line2"
          label="Address Line 2"
          value={data.address_line2 || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="city"
          name="city"
          label="City"
          value={data.city || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="state"
          name="state"
          label="State"
          value={data.state || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="pin_code"
          name="pin_code"
          label="PIN Code"
          value={data.pin_code || ""}
          onChange={handleChange}
        />,
      ],
    },
    {
      category: "Financial & Vehicle Information",
      elements: [
        <InputBox
          key="pan_number"
          name="pan_number"
          label="PAN Number"
          value={data.pan_number || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="gst_number"
          name="gst_number"
          label="GST Number"
          value={data.gst_number || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="base_rate"
          name="base_rate"
          type="number"
          label="Base Rate"
          value={data.base_rate || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="rate_per_km"
          name="rate_per_km"
          type="number"
          label="Rate per KM"
          value={data.rate_per_km || ""}
          onChange={handleChange}
        />,
        <InputBox
          key="vehicle_details"
          name="vehicle_details"
          label="Vehicle Details"
          value={data.vehicle_details || ""}
          onChange={handleChange}
        />,
      ],
    },
  ];

  if (loading) {
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
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Transport Partner #{id}
      </Typography>
      <InspectData
        data={data}
        metadata={metadata}
        title="Transport Partner"
        id={id}
        onSave={handleSave}
      />
    </Box>
  );
};

export default EditTransport;
