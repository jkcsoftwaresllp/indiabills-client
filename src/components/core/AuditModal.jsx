import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { useStore } from "../../store/store";

const AuditModal = ({ heading, children }) => {
    const { showAudit, closeAudit } = useStore();

    const handleClose = () => {
        closeAudit();
    };

    return (
        <Dialog
            open={showAudit}
            onClose={handleClose}
            sx={{ backdropFilter: "blur(10px)" }}
            BackdropProps={{ style: { backgroundColor: "transparent"} }}
            PaperProps={{
                style: {
                    background: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "2rem",
                    padding: "1rem",
                },
            }}
        >
            <DialogContent>
                <DialogContentText>
                    {heading}
                </DialogContentText>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default AuditModal;