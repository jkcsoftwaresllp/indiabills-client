import PageAnimate from "../../components/Animate/PageAnimate";
import { useEffect, useState } from "react";
import { getData } from "../../network/api";
import { NavLink, useParams } from "react-router-dom";
import { Button, Typography, Box, Card, CardContent, CardActions, Grid } from "@mui/material";

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
			<Box p={4}>
				{/* Section 1: Edit Customer Details */}
				<Box mb={4}>
					<Typography variant="h4" gutterBottom>
						Customer Details
					</Typography>
					<Button variant="contained" color="primary" component={NavLink} to={`/customers/edit/${customerId}`}>
						Edit Customer
					</Button>
				</Box>

				{/* Section 2: Grid of Customer Address Cards */}
				<Box mb={4}>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="h4" gutterBottom>
							Addresses Linked
						</Typography>
						<NavLink to={`/customers/address/add/${customerId}`}>
							<Button variant="contained" color="secondary">
								Add Address
							</Button>
						</NavLink>
					</Box>
					<Box display="flex" overflow="auto" className="horizontal-scroll">
						{addresses.map((address, index) => (
							<Card key={index} className="m-2 capitalize" style={{ minWidth: '120px'}}>
								<CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
									<Typography variant="h6" component="div" sx={{ marginBottom: '.6rem' }}>
										{address.addressType}
									</Typography>
									<Typography variant="body2" color="textSecondary" component="p">
										{address.addressLine}
									</Typography>
									<Typography variant="body2" color="textSecondary" component="p">
										{address.city}, {address.state}
									</Typography>
									<Typography variant="body2" color="textSecondary" component="p" sx={{ marginTop: '.3rem' }}>
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