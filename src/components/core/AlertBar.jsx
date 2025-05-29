import { Alert, Snackbar } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const AlertBox = ({ title, message, navigateTo, active }) => {
	const navigate = useNavigate();

	return (
		<>
			<Snackbar
				open={active}
				autoHideDuration={1000}
				onClose={() => {
					navigate(`/${navigateTo}`);
				}}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={() => {
						navigate(`/${title}`);
					}}
					severity="success"
					sx={{ width: "100%" }}
				>
					{message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default AlertBox;
