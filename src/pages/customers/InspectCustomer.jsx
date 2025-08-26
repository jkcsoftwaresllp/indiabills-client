import PageAnimate from "../../components/Animate/PageAnimate";
import { useEffect, useState } from "react";
import { getCustomerById } from "../../network/api";
import { NavLink, useParams } from "react-router-dom";
import { Button, Typography, Box, Card, CardContent, CardActions, Grid } from "@mui/material";

const InspectCustomer = () => {
	const { customerId } = useParams();
	const [addresses, setAddresses] = useState([]);
	const [profile, setProfile] = useState({});
	const [document, setDocument] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const customerData = await getCustomerById(customerId);
			setProfile(customerData);
			setLoading(false);
		};

		fetchData();
	}, [customerId]);

	if (loading) {
		return (
			<PageAnimate>
				<Box display="flex" justifyContent="center" alignItems="center" height="50vh">
					<Typography>Loading...</Typography>
				</Box>
			</PageAnimate>
		);
	}

	return (
		<PageAnimate>
			<Box p={4}>
				{/* Section 1: Edit Customer Details */}
				<Box mb={4}>
					<Typography variant="h4" gutterBottom>
						{profile.name} Details
					</Typography>
					{profile.email && (
						<Typography variant="body1" color="textSecondary" gutterBottom>
							{profile.email}
						</Typography>
					)}
					{profile.phone && (
						<Typography variant="body1" color="textSecondary" gutterBottom>
							{profile.phone}
						</Typography>
					)}
					{profile.businessName && (
						<Typography variant="body1" color="textSecondary" gutterBottom>
							Business: {profile.businessName}
						</Typography>
					)}
					{profile.customerType && (
						<Typography variant="body1" color="textSecondary" gutterBottom>
							Type: {profile.customerType}
						</Typography>
					)}
					<Button variant="contained" color="primary" component={NavLink} to={`/customers/edit/${customerId}`}>
						Edit Customer
					</Button>
				</Box>

				{/* Section 2: Grid of Customer Address Cards */}
				<Box mb={4} className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>Financial Information</Typography>
							<Typography variant="body2">Credit Limit: ₹{profile.creditLimit || 0}</Typography>
							<Typography variant="body2">Outstanding Balance: ₹{profile.outstandingBalance || 0}</Typography>
							<Typography variant="body2">Loyalty Points: {profile.loyaltyPoints || 0}</Typography>
						</CardContent>
					</Card>
					<Card>
						<CardContent>
							<Typography variant="h6" gutterBottom>Account Status</Typography>
							<Typography variant="body2">Status: {profile.isActive ? 'Active' : 'Inactive'}</Typography>
							<Typography variant="body2">Blacklisted: {profile.isBlacklisted ? 'Yes' : 'No'}</Typography>
							{profile.blacklistReason && (
								<Typography variant="body2">Reason: {profile.blacklistReason}</Typography>
							)}
						</CardContent>
					</Card>
				</Box>
			</Box>
		</PageAnimate>
	);
};

export default InspectCustomer;