import React from "react";
import { useState } from 'react';
import { TextField } from '@mui/material';

interface Props {
    setImage:  React.Dispatch<React.SetStateAction<File | undefined>>;
    placeholder?: string;
    dontExpand?: boolean;
}

const ImageUpload: React.FC<Props> = ({ setImage, placeholder, dontExpand }) => {
    const [preview, setPreview] = useState<string | ArrayBuffer | null>();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // console.log(file);
        } else {
            console.log("No file selected");
        }
    };

    const clearImage = () => {
        setImage(undefined);
        setPreview(null);
    }

    return (
        <div className={`flex flex-col cursor-pointer ${dontExpand? `w-fit`: `w-full`}`}>
            {!preview && (
            <TextField
                name="image"
                type="file"
                label={ placeholder? `${placeholder}` : "Upload Avatar ⤴"}
                inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
                onChange={handleImageChange}
                variant="outlined"
                InputLabelProps={{
                    shrink: false
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderRadius: '1rem',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        width: '100%',
                        textAlign: 'center', // Center the placeholder text
                    },
                    '& .MuiInputBase-root input[type=file]': {
                        opacity: 0,
                        color: '#ffffff',
                    },
                }}
                fullWidth
            />
            )}
            {preview && (
                <div onClick={() => clearImage()} className={"flex justify-center items-center gap-5 border p-2"}>
                    <img src={preview as string} alt="Preview" style={{ width: '40px', height: '40px' }} />
                    <p className={"opacity-50"} > Click to dismiss </p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
