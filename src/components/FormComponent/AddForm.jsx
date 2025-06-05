import React, { useState } from "react";
import InputBoxStream from "./InputBoxStream";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
	groupByCategory,
	initializeFormData,
	getOption,
	renameAndOptimize,
} from "../../utils/FormHelper";
import { addRow, uploadImg } from "../../network/api";
import DropdownStream from "./DropdownStream";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";
import { MuiTelInput } from "mui-tel-input";
import styles from './styles/AddForm.module.css';

const AddForm = ({ title, metadata }) => {
	const navigate = useNavigate();
	const { successPopup, errorPopup } = useStore();

	const [formData, setFormData] = useState(initializeFormData(metadata));
	const [image, setImage] = useState();

	const groupedData = groupByCategory(metadata);

	function handleChange(type, target, value) {
		return function (e) {
			if (type === "number") {
				setFormData((prevState) => ({
					...prevState,
					[target]: Number(e.target.value),
				}));
			} else if (
				type === "string" ||
				type === "email" ||
				type === "password" ||
				type === "Date" ||
				type === "date"
			) {
				setFormData((prevState) => ({
					...prevState,
					[target]: e.target.value,
				}));
			} else if (type === "autocomplete") {
				setFormData((prevState) => ({
					...prevState,
					[target]: value,
				}));
			} else {
				console.error("Invalid type encountered: " + type + " for " + target);
			}
		};
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (title === "users") {
			let workaround = "";

			if (image) {
				const ImageData = await renameAndOptimize(
					formData.userName,
					image
				);

				console.info("image processed:", ImageData);

				const response = await uploadImg(ImageData.image);

				if (response !== 200) {
					console.error("Failed to upload the image");
					return;
				}

				workaround = ImageData.name;
			}

			const response = await addRow(`/users/add`, {
				...formData,
				["avatar"]: workaround,
			});

			if (response !== 200) {
				console.error("Failed to add the user");
				return;
			}

			successPopup(`${title} added successfully!`);
			navigate(`/${title}`);
			return;
		}

		if (title === "offers" && formData.productId) {
			const updatedProductId = getOptionIDProduct(formData.productId);
			formData.productId = Number(updatedProductId);
		}

		addRow(`/${title}/add`, formData)
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
  <form onSubmit={handleSubmit} className={styles.form}>
    <div className={styles.gridWrapper}>
      {Object.entries(groupedData).map(([category, items]) => (
        <div className={styles.categoryCard} key={category}>
          <h2 className={styles.categoryTitle}>{category}</h2>
          {items.map((item, index) => {
            if (item.autocomplete) {
              const options = getOption(item.name);
              return (
                <DropdownStream
                  key={index}
                  field={item}
                  handleChange={handleChange}
                  options={options}
                  required={item.required ? item.required : false}
                />
              );
            } else {
              if (item.name === "avatar") {
                return <ImageUpload key={index} setImage={setImage} />;
              } else if ((item.name).includes("mobile")) {
                const field = String(formData[item.name]);
                return (
                  <MuiTelInput
                    key={index}
                    label={item.label}
                    name={item.name}
                    defaultCountry="IN"
                    onlyCountries={["FR", "IN", "BE", "SA"]}
                    InputProps={{ inputProps: { maxLength: 15 } }}
                    placeholder={"XXXXXXX"}
                    onChange={(value) =>
                      setFormData({ ...formData, [item.name]: value })
                    }
                    value={field}
                  />
                );
              } else {
                return (
                  <div key={index} className={styles.transparentBg}>
                    <InputBoxStream
                      field={item}
                      required={item.required}
                      value={formData[item.name]}
                      handleChange={handleChange}
                    />
                  </div>
                );
              }
            }
          })}
        </div>
      ))}
    </div>
    <div className={styles.submitWrapper}>
      <button type="submit" className={styles.submitButton}>
        <CheckCircleIcon />
      </button>
    </div>
  </form>
);
};

export default AddForm;
