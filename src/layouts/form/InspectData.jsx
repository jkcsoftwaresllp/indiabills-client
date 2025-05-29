import React from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import { updateRow } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";

const InspectData = ({ data, metadata = [], url, title, id }) => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", data);

    const dataToSend = { ...data };
    // spaghetti code 101 ↴
    if ("lastEditedDate" in dataToSend) {
      delete dataToSend.lastEditedDate;
    }
    if ("lastEditedBy" in dataToSend) {
      delete dataToSend.lastEditedBy;
    }
    if ("dateAdded" in dataToSend) {
      delete dataToSend.dateAdded;
    }
    if ("addedBy" in dataToSend) {
      delete dataToSend.addedBy;
    }

    updateRow(url ? url : `/${title}/edit/${id}`, dataToSend)
      .then((res) => {
        if (res === 200) {
          successPopup(`${title} added successfully!`);
          navigate(`/${title}`);
        } else {
          errorPopup(`Couldn't add ${title}!`);
        }
      })
      .catch((error) => {
        errorPopup(`Couldn't add ${title}!`);
        console.error("An error occurred:", error);
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      {metadata?.map((section, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography sx={{ fontWeight: "600" }} variant="h6" gutterBottom>
            {section.category}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {section.elements.map((element, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              {element}
            </Box>
          ))}
        </Box>
      ))}
      <Button type="submit" variant="contained" color="primary">
        Save Changes
      </Button>
    </Box>
  );
};

export default InspectData;
