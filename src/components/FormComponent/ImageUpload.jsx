import React, { useState } from "react";
import { TextField } from '@mui/material';
import styles from './styles/ImageUpload.module.css';

const ImageUpload = ({ setImage, placeholder, dontExpand }) => {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.log("No file selected");
        }
    };

    const clearImage = () => {
        setImage(undefined);
        setPreview(null);
    };

    return (
  <div
    className={`${styles.container} ${
      dontExpand ? styles.fitWidth : styles.fullWidth
    }`}
  >
    {!preview && (
      <TextField
        name="image"
        type="file"
        label={placeholder ? placeholder : "Upload Avatar ⤴"}
        inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
        onChange={handleImageChange}
        variant="outlined"
        InputLabelProps={{ shrink: false }}
        className={`${styles.fileInputRoot} ${styles.fileInputLabel} ${styles.fileInputElement}`}
        fullWidth
      />
    )}
    {preview && (
      <div className={styles.previewBox} onClick={clearImage}>
        <img src={preview} alt="Preview" style={{ width: '40px', height: '40px' }} />
        <p className={styles.previewText}>Click to dismiss</p>
      </div>
    )}
  </div>
);
};

export default ImageUpload;