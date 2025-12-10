import { FiBell } from 'react-icons/fi';
import { useState, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useStore } from "../../store/store";

const Popup = () => {
	const { Popup, setPopup } = useStore();
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
		setPopup({ ...Popup, active: false });
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
					icon={<FiBell />}
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
