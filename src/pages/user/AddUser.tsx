import React, { useState, useCallback } from "react";
import { User } from "../../definitions/Types";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addRow, uploadImg } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { UserMetadata } from "../../definitions/Metadata";
import { getOption, initializeFormData, renameAndOptimize } from "../../utils/FormHelper";
import ImageUpload from "../../components/FormComponent/ImageUpload";

const AddUser = () => {
	const { successPopup, errorPopup } = useStore();
	const navigate = useNavigate();

	const [formData, setFormData] = useState<User>(initializeFormData(UserMetadata));
	const [page, setPage] = useState<number>(1);
	const [image, setImage] = useState<File | undefined>();

	const backPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const nextPage = useCallback(() => {
		if (page < 3) {
			setPage(page + 1);
		}
	}, [page]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value, type } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: type === "number" ? Number(value) : value,
		}));
	};

	const submit = async () => {
		let workaround: string = "";
		if (image) {
			const ImageData = await renameAndOptimize(formData.userName, image);
			const response = await uploadImg(ImageData.image, true);
			if (response !== 200) {
				console.error("Failed to upload the image");
				return;
			}
			workaround = ImageData.name;
		}

		const finalData = {
			...formData,
			["avatar"]: workaround,
		};

		addRow("/users/add", finalData).then((status) => {
			if (status === 201 || status === 200) {
				successPopup("User registered successfully!");
				navigate('/users');
			} else {
				errorPopup("Failed to register the user :(");
			}
		});
	};

	const steps = ["Basic Info", "Contact Details", "Other Details"];

	return (
		<PageAnimate>
			<div className={"h-full flex flex-col gap-12 justify-center items-center"}>
				<button className={"self-start flex items-center"} onClick={() => navigate(-1)}>
					<ArrowBackIosNewIcon /> Go back
				</button>

				<h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
					register a new<span className={"text-rose-400"}> user</span> :)
				</h1>

				<Timeline steps={steps} currentStep={page} />

				<div>
					<div className={"h-full w-full flex justify-center"}>
						<main>
							{page === 1 && <BasicPage formData={formData} setFormData={setFormData} handleChange={handleChange} setImage={setImage} />}
							{page === 2 && <ContactPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
							{page === 3 && <OtherPage formData={formData} setFormData={setFormData} />}
						</main>

						<div className={"p-2 flex flex-col gap-4"}>
							{page === 3 && <button className="p-3 flex-grow shadow-xl form-button-submit" onClick={submit}> <CheckCircleIcon /></button>}
							{page < 3 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={nextPage}> <ArrowForwardIosIcon /></button>}
							{page >= 2 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={backPage}> <ArrowBackIosNewIcon /></button>}
						</div>
					</div>
				</div>
			</div>
		</PageAnimate>
	);
};

export default AddUser;

interface Props {
	formData: User;
	handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
	setFormData: React.Dispatch<React.SetStateAction<User>>;
	setImage?: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const BasicPage = React.memo(({ formData, handleChange, setImage }: Props) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="flex flex-col gap-6">
					<InputBox name="userName" type="string" label="User Name" placeholder={"__________"} value={formData.userName} onChange={handleChange} />
					<InputBox name="password" type="password" label="Password" placeholder={"*********"} value={formData.password} onChange={handleChange} />
					<ImageUpload setImage={setImage} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

BasicPage.displayName = 'BasicPage';

const ContactPage = React.memo(({ formData, handleChange }: Props) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<InputBox name="email" type="string" label="Email" placeholder={"example@domain.com"} value={formData.email} onChange={handleChange} />
					<InputBox name="mobileNumber" type="number" label="Mobile Number" placeholder={"XXXXXX"} value={formData.mobileNumber} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

ContactPage.displayName = 'ContactPage';

const OtherPage = React.memo(({ formData, setFormData }: Props) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<Dropdown name={"role"} label="Role" options={getOption("role")} selectedData={formData.role} setValue={setFormData} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

OtherPage.displayName = 'OtherPage';