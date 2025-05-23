import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { deleteCredit, updateCredit } from "../../network/api";
import { useStore } from "../../store/store";
import { formatDate } from "../../utils/FormHelper";

interface Credit {
  creditId: number;
  customerId: number;
  creditAmount: number;
  debitAmount: number;
  debitNumber: string;
  amountDate: string;
  debitMethod: string;
  balance: number;
  adjustment: number;
  invoiceId: number;
  invoiceNumber: number;
  orderId: number;
  remarks: string;
  dateAdded: string;
  addedBy: string;
  lastEditedDate: string;
  lastEditedBy: string;
}

interface EditCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditDataOld: Credit[];
  onEditSuccess: () => void;
}

const EditCreditModal = ({
  isOpen,
  onClose,
  creditDataOld,
  onEditSuccess,
}: EditCreditModalProps) => {
  const { successPopup, errorPopup, Organization } = useStore();
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [formData, setFormData] = useState<Partial<Credit>>({});

  const creditData = creditDataOld.filter(
    (credit) => credit.debitNumber !== null,
  );

  const handleSelect = (credit: Credit) => {
    setSelectedCredit(credit);
    // Initialize formData with existing values
    setFormData({
      creditId: credit.creditId,
      debitAmount: credit.amount || 0,
      debitNumber: credit.debitNumber || "",
      remarks: credit.remarks || "",
      amountDate: credit.amountDate,
      debitMethod: credit.debitMethod || "cash",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCredit || !formData) return;

    try {
      const response = await updateCredit({
        creditId: formData.creditId,
        debitAmount: formData.debitAmount,
        debitNumber: formData.debitNumber,
        remarks: formData.remarks,
        amountDate: formData.amountDate?.split("T")[0],
        debitMethod: formData.debitMethod,
      });
      if (response.status === 200) {
        successPopup("Credit updated successfully");
        onEditSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error updating credit:", error);
      errorPopup("Failed to update credit");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (creditId: number) => {
    if (!window.confirm("Are you sure you want to delete this debit entry?")) {
      return;
    }
    try {
      const response = await deleteCredit(creditId);
      if (response === 200) {
        successPopup("Debit entry deleted successfully");
        onEditSuccess(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting credit:", error);
      errorPopup("Failed to delete debit entry");
    }
  };

  // If no formData is set yet, don't render the form
  const renderForm = () => {
    if (!selectedCredit || !formData) return null;

    return (
      <form onSubmit={handleSubmit} className="p-4">
        <Grid container spacing={2}>
          {/* Read-only Fields */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Credit ID"
              value={selectedCredit.creditId}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Invoice Number"
              value={`${Organization.initials}-${selectedCredit.invoiceNumber || "N/A"}`}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Editable Fields */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Debit Amount"
              name="debitAmount"
              type="number"
              value={formData.debitAmount}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Debit Method"
              name="debitMethod"
              value={formData.debitMethod}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="check">Check</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Debit Number"
              name="debitNumber"
              value={formData.debitNumber}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Amount Date"
              name="amountDate"
              type="date"
              value={formData.amountDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </form>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Debit</DialogTitle>
      <DialogContent>
        {!selectedCredit ? (
          <List>
            {creditData.map((credit) => (
              <ListItem
                key={credit.creditId}
                button
                onClick={() => handleSelect(credit)}
                divider
              >
                <ListItemText
                  primary={`DEB-${credit.debitNumber}`}
                  secondary={
                    <>
                      Date: {formatDate(credit.amountDate)}
                      <br />
                      Amount: ₹{credit.amount}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent ListItem click
                        handleSelect(credit);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent ListItem click
                        handleDelete(credit.creditId);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          renderForm()
        )}
      </DialogContent>
      <DialogActions>
        {selectedCredit ? (
          <>
            <Button
              onClick={() => {
                setSelectedCredit(null);
                setFormData(null);
              }}
            >
              Back to List
            </Button>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Update
            </Button>
          </>
        ) : (
          <Button onClick={onClose}>Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditCreditModal;
