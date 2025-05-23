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
import { Field, Services } from "../../definitions/Types";
import DropdownStream from "./DropdownStream";
import {  useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";
import { MuiTelInput } from "mui-tel-input";

interface Props<T extends Services> {
	metadata: Field<T>[];
	title: string;
}

const AddForm = <T extends Services>({ title, metadata }: Props<T>) => {
	const navigate = useNavigate();
	const { successPopup, errorPopup } = useStore();

	const [formData, setFormData] = useState<T>(initializeFormData(metadata));
	const [image, setImage] = useState<File>();

	const groupedData = groupByCategory<T, Field<T>>(metadata);

	function handleChange(type: string, target: string, value?: string) {
		return function (
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
		) {
			if (type === "number") {
				setFormData((prevState: T) => ({
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
				setFormData((prevState: T) => ({
					...prevState,
					[target]: e.target.value,
				}));
			} else if (type === "autocomplete")
				setFormData((prevState: T) => ({
					...prevState,
					[target]: value,
				}));
			else {
				console.error("Invalid type encountered: " + type + " for " + target);
			}
		};
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		/* const requiredFields = getRequiredField(title);

		for (const field of requiredFields) {
			if (!(formData[(field as keyof Services)])) {
                const metadataItem = metadata.find((item) => item.name === field);
                const label = metadataItem ? metadataItem.label : field;
				errorPopup(`${label} is required`);
				return;
			}
		} */

		if (title === "users") {
			let workaround: string = "";

			if (image) {
				const ImageData = await renameAndOptimize(
					formData.userName as string,
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

			/*const { alternateMobileNumber } = formData;

			if (alternateMobileNumber.toString().length > 0) {
				formData.alternateMobileNumber = null;
			}*/

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
			const updatedProductId = getOptionIDProduct(formData.productId as string);
			formData.productId = Number(updatedProductId);
		}

		addRow(`/${title}/add`, formData)
			.then((res) => {
				// console.log(res);

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
		<form onSubmit={handleSubmit} className="w-full flex gap-3">
			<div className="grid grid-cols-3 h-fit grid-row-2 gap-10">
				{Object.entries(groupedData).map(
					([category, items]: [string, Field<T>[]]) => (
						<div className="shadow-md transition flex flex-col min-w-4 h-fit items-center gap-6 border rounded-2xl p-8 backdrop-filter backdrop-blur-lg bg-white bg-opacity-90" key={category} >
							<h2 className="font-semibold lowercase mb-2">{category}</h2>
							{items.map((item: Field<T>, index: number) => {
								if (item.autocomplete) {
									const options: string[] = getOption(item.name as string);
									// console.log(options);
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
									} else if ((item.name as string).includes("mobile")) {
										const field = String(formData[item.name]);
										return (
											<MuiTelInput
												key={index}
												label={item.label}
												name={item.name as string}
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
											<div key={index} className={"idms-transparent-bg w-full"}>
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
					)
				)}
			</div>
			<div className="flex justify-center">
				<button type="submit" className="p-3 m-5 shadow-xl idms-submit">
					<CheckCircleIcon />
				</button>
			</div>
		</form>
	);
};

export default AddForm;
