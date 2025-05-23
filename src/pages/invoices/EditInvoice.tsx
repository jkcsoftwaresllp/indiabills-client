import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRow, updateRow } from "../../network/api";
import { Metadata } from "../../definitions/Types";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import { Box, Typography, CircularProgress, Button, Divider } from "@mui/material";
import { handleFormFieldChange } from "../../utils/FormHelper";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";

const EditInvoice = () => {
  const { invoiceId } = useParams();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRow(`/invoices/edit/${invoiceId}`);
    //   console.log(response);
      setData(response);
      setLoading(false);
    };

    fetchData().then();
  }, [invoiceId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    setData((prevData: any) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = { ...data };
      // Remove unnecessary fields
      delete dataToSend.lastEditedDate;
      delete dataToSend.lastEditedBy;
      delete dataToSend.dateAdded;
      delete dataToSend.addedBy;

      console.log(dataToSend);

      if (dataToSend.onlineMethod) {
        dataToSend.payments.onlineMethod = dataToSend.onlineMethod;
      }

      if (dataToSend.paymentMode) {
        dataToSend.payments.paymentMode = dataToSend.paymentMode;
      }

    //   return ;

      const response = await updateRow(`/invoices/edit/${invoiceId}`, dataToSend);

      if (response !== 200) {
        errorPopup("Failed to update ");
        return ;
      }

      successPopup("Invoice updated successfully!");
      navigate(`/invoices`);
    } catch (error) {
      console.error("Error updating invoice:", error);
      errorPopup("Failed to update ");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const metadata: Metadata[] = [
    {
      category: "Invoice Information",
      elements: [
        <InputBox key="invoiceNumber" name="invoice.payments.orders.invoiceNumber" type="string" label="Invoice Number" value={data.invoice?.invoiceNumber} onChange={handleChange} placeholder="" />,
        <InputBox key="invoiceDate" name="iinvoice.nvoiceDate" type="date" label="Invoice Date" value={formatDate(data.invoice?.invoiceDate)} onChange={handleChange} placeholder="" />,
        <InputBox key="dueDate" name="invoice.dueDate" type="date" label="Due Date" value={formatDate(data.invoice?.dueDate)} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Payment Information",
      elements: [
        <Dropdown key="paymentMode" name="paymentMode" label="Payment Mode" options={[ "credit", "offline", "online"]} selectedData={data.payments} setValue={setData} />,
        <Dropdown key="onlineMethod" name="onlineMethod" label="Online Method" options={[ "none", "upi", "card" ]} selectedData={data.payments} setValue={setData} />,
        <InputBox key="paymentStatus" name="payments.paymentStatus" type="string" label="Payment Status" value={data.payments?.paymentStatus} onChange={handleChange} placeholder="" />,
      ],
    },
    {
      category: "Order Information",
      elements: [
        <InputBox key="orderDate" name="orders.orderDate" type="date" label="Order Date" value={formatDate(data.orders?.orderDate)} onChange={handleChange} placeholder="" />,
        <InputBox key="orderStatus" name="orders.orderStatus" type="string" label="Order Status" value={data.orders?.orderStatus} onChange={handleChange} placeholder="" />,
        <InputBox key="shippingAddress" name="orders.shippingAddress" type="string" label="Shipping Address" value={data.orders?.shippingAddress} onChange={handleChange} placeholder="" />,
        <InputBox key="totalAmount" name="orders.totalAmount" type="number" label="Total Amount" value={data.orders?.totalAmount} onChange={handleChange} placeholder="" />,
        <InputBox key="taxAmount" name="orders.taxAmount" type="number" label="Tax Amount" value={data.orders?.taxAmount} onChange={handleChange} placeholder="" />,
        <InputBox key="discountApplied" name="orders.discountApplied" type="number" label="Discount Applied" value={data.orders?.discountApplied} onChange={handleChange} placeholder="" />,
        <InputBox key="shippingCost" name="orders.shippingCost" type="number" label="Shipping Cost" value={data.orders?.shippingCost} onChange={handleChange} placeholder="" />,
        <InputBox key="shippingDate" name="orders.shippingDate" type="date" label="Shipping Date" value={formatDate(data.orders?.shippingDate)} onChange={handleChange} placeholder="" />,
      ],
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSave} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Invoice #{invoiceId}
      </Typography>
      {metadata.map((section, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: '600' }} variant="h6" gutterBottom>
            {section.category}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {section.elements?.map((element, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              {element}
            </Box>
          ))}
        </Box>
      ))}
      <Button type="submit" variant="contained" color="primary">
        Save Changes
      </Button>
    </Box>
  );
};

export default EditInvoice;