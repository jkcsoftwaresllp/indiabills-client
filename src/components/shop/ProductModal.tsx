import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Item } from "../../definitions/Types";
import { useStore } from "../../store/store";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product: Item;
    selectedVariants: { [key: string]: string };
    setSelectedVariants: React.Dispatch<React.SetStateAction<{
        [key: string]: string;
    }>>
}

const ProductModal: React.FC<Props> = ({ isOpen, onClose, product, selectedVariants, setSelectedVariants }) => {
    const { selectedProducts, updateProductVariants } = useStore();
    const [quantity, setQuantity] = useState(1);

    const handleVariantClick = (key: string, value: string) => {
        const currentVariants = selectedProducts[Number(product.itemId)]?.variants || {};
        setSelectedVariants(() => ({
            ...currentVariants,
            [key]: currentVariants[key] === value ? "" : value,
        }));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(Number(e.target.value));
    };

    const handleSave = () => {
        if (Object.keys(selectedVariants).length === product.variants?.length) {
            updateProductVariants(Number(product.itemId), selectedVariants);
            onClose();
        } else {
            alert("Please select all variants");
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Select Variant and Quantity</DialogTitle>
            <DialogContent>
                {product.variants?.map((variant, index) => (
                    <FormControl component="fieldset" key={index} className="mb-4">
                        <FormLabel component="legend">{variant.key}</FormLabel>
                        <RadioGroup row>
                            {variant.values.map((value, idx) => (
                                <FormControlLabel
                                    key={idx}
                                    control={<Radio checked={selectedVariants[variant.key] === value} onChange={() => handleVariantClick(variant.key, value)} />}
                                    label={value}
                                    value={value}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                ))}
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductModal;