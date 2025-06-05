import PageAnimate from "../../components/Animate/PageAnimate";
import { useEffect, useState } from "react";
import { getData } from "../../network/api";
import { NavLink, useParams } from "react-router-dom";
import { Button, Typography, Box, Card, CardContent, CardActions, Grid } from "@mui/material";
import styles from "./styles/InspectCustomer.module.css";

const InspectCustomer = () => {
	const { customerId } = useParams();
	const [addresses, setAddresses] = useState([]);
	const [document, setDocument] = useState();

	useEffect(() => {
		const fetchAddresses = async () => {
			const response = await getData(`/customers/addresses/${customerId}`);
			setAddresses(response);
		};
		fetchAddresses();

		const fetchDocument = async () => {
			const response = await getData(`/customers/document/${customerId}`);
			setDocument(response);
		};
		fetchDocument();
	}, [customerId]);

	return (
  <PageAnimate>
    <Box className={styles.container}>
      {/* Section 1: Edit Customer Details */}
      <Box className={styles.section}>
        <Typography variant="h4" gutterBottom>
          Customer Details
        </Typography>
        <Button variant="contained" color="primary" component={NavLink} to={`/customers/edit/${customerId}`}>
          Edit Customer
        </Button>
      </Box>

      {/* Section 2: Grid of Customer Address Cards */}
      <Box className={styles.section}>
        <Box className={styles.headerFlex}>
          <Typography variant="h4" gutterBottom>
            Addresses Linked
          </Typography>
          <NavLink to={`/customers/address/add/${customerId}`}>
            <Button variant="contained" color="secondary">
              Add Address
            </Button>
          </NavLink>
        </Box>
        <Box className={styles.addressesContainer}>
          {addresses.map((address, index) => (
            <Card key={index} className={styles.addressCard}>
              <CardContent className={styles.cardContent}>
                <Typography variant="h6" component="div" className={styles.addressType}>
                  {address.addressType}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {address.addressLine}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {address.city}, {address.state}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" className={styles.pinCode}>
                  {address.pinCode}
                </Typography>
              </CardContent>
              <CardActions>
                <NavLink to={`/customers/address/${address.addressId}`}>
                  <Button size="small" color="primary">
                    Edit Address
                  </Button>
                </NavLink>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Section 3: Files Uploaded About the Customer */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Documents
        </Typography>
        {document ? (
          <Typography variant="body2" color="textSecondary">
            <h1> Coming Soon ... </h1>
          </Typography>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No documents uploaded.
          </Typography>
        )}
      </Box>
    </Box>
  </PageAnimate>
);
};

export default InspectCustomer;