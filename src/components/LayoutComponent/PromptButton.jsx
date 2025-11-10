import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Slide,
} from "@mui/material";
import { forwardRef, useState } from "react";

const Transition = forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const PromptButton = ({ icon, title, content, onClick }) => {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleConfirm = () => {
		onClick();
		handleClose();
	};

	return (
		<div>
			<Button
				sx={{
					width: "4rem",
					p: "0.75rem",
				}}
				variant="outlined"
				color="error"
				onClick={handleClickOpen}
			>
				{icon}
			</Button>
			<Dialog
				sx={{ backdropFilter: "blur(10px)" }}
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-describedby="alert"
				PaperProps={{
					style: {
						background: "none",
						backgroundColor: "rgba(255, 255, 255, 0.5)",
						backdropFilter: "blur(10px)",
						borderRadius: "10px",
						padding: "1rem",
					},
				}}
				BackdropProps={{ style: { backgroundColor: "transparent" } }}
			>
				<DialogTitle className="font-extrabold">{title}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert" className="font-extrabold">
						{content}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={handleClose}>
						Cancel
					</Button>
					<Button color="primary" onClick={handleConfirm}>
						Proceed
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default PromptButton;
