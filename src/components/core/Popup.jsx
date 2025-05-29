import { useState, useEffect } from "react";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Alert, Snackbar } from "@mui/material";
import { useStore } from "../../store/store";

const Popup = () => {
	const { Popup } = useStore();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (Popup.active) {
			setOpen(true);
		}
	}, [Popup.active]);

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		Popup.active = false;
		setOpen(false);
	};

	return (
		<>
			<Snackbar
				open={open}
				autoHideDuration={5000}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert
					severity={Popup.variant}
					icon={<CircleNotificationsIcon />}
					sx={{ width: "100%" }}
					onClose={handleClose}
				>
					{Popup.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Popup;
