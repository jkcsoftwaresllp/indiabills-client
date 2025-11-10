import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    Checkbox,
} from "@mui/material";

const ProductSelectionModal = ({
    open,
    onClose,
    products,
    selectedProducts,
    setSelectedProducts,
}) => {
    const handleToggle = (product) => {
        const currentIndex = selectedProducts.findIndex((p) => p.id === product.id);
        const newSelectedProducts = [...selectedProducts];

        if (currentIndex === -1) {
            newSelectedProducts.push(product);
        } else {
            newSelectedProducts.splice(currentIndex, 1);
        }

        setSelectedProducts(newSelectedProducts);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select Products</DialogTitle>
            <DialogContent>
                <List>
                    {products.map((product) => (
                        <ListItem key={product.id} button onClick={() => handleToggle(product)}>
                            <Checkbox
                                checked={selectedProducts.some((p) => p.id === product.id)}
                                tabIndex={-1}
                                disableRipple
                            />
                            <ListItemText sx={{ textTransform: "capitalize" }} primary={product.name} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductSelectionModal;