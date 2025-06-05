import React, { useState, useCallback } from "react";
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
import styles from "./styles/AddUser.module.css"; // import CSS module

const AddUser = () => {
	const { successPopup, errorPopup } = useStore();
	const navigate = useNavigate();

	const [formData, setFormData] = useState(initializeFormData(UserMetadata));
	const [page, setPage] = useState(1);
	const [image, setImage] = useState();

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

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: type === "number" ? Number(value) : value,
		}));
	};

	const submit = async () => {
		let workaround = "";
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
			avatar: workaround,
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
    <div className={styles.container}>
      <button className={styles.goBackButton} onClick={() => navigate(-1)}>
        <ArrowBackIosNewIcon /> Go back
      </button>

      <h1 className={styles.title}>
        register a new<span className={styles.highlight}> user</span> :)
      </h1>

      <Timeline steps={steps} currentStep={page} />

      <div>
        <div className={styles.contentWrapper}>
          <main>
            {page === 1 && (
              <BasicPage
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                setImage={setImage}
              />
            )}
            {page === 2 && (
              <ContactPage
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
              />
            )}
            {page === 3 && (
              <OtherPage formData={formData} setFormData={setFormData} />
            )}
          </main>

          <div className={styles.buttonsWrapper}>
            {page === 3 && (
              <button
                className={`${styles.button} ${styles.submitButton}`}
                onClick={submit}
              >
                <CheckCircleIcon />
              </button>
            )}
            {page < 3 && (
              <button
                className={`${styles.button} ${styles.navButton}`}
                onClick={nextPage}
              >
                <ArrowForwardIosIcon />
              </button>
            )}
            {page >= 2 && (
              <button
                className={`${styles.button} ${styles.navButton}`}
                onClick={backPage}
              >
                <ArrowBackIosNewIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </PageAnimate>
);
};

export default AddUser;

const BasicPage = React.memo(({ formData, handleChange, setImage }) => (
  <MultiPageAnimate>
    <div className={styles.pageContainer}>
      <main className={styles.flexColumn}>
        <InputBox name="userName" type="string" label="User Name" placeholder="__________" value={formData.userName} onChange={handleChange} />
        <InputBox name="password" type="password" label="Password" placeholder="*********" value={formData.password} onChange={handleChange} />
        <ImageUpload setImage={setImage} />
      </main>
    </div>
  </MultiPageAnimate>
));
BasicPage.displayName = "BasicPage";

const ContactPage = React.memo(({ formData, handleChange }) => (
  <MultiPageAnimate>
    <div className={styles.pageContainer}>
      <main className={styles.gridTwoColumns}>
        <InputBox name="email" type="string" label="Email" placeholder="example@domain.com" value={formData.email} onChange={handleChange} />
        <InputBox name="mobileNumber" type="number" label="Mobile Number" placeholder="XXXXXX" value={formData.mobileNumber} onChange={handleChange} />
      </main>
    </div>
  </MultiPageAnimate>
));
ContactPage.displayName = "ContactPage";

const OtherPage = React.memo(({ formData, setFormData }) => (
  <MultiPageAnimate>
    <div className={styles.pageContainer}>
      <main className={styles.gridTwoColumns}>
        <Dropdown name="role" label="Role" options={getOption("role")} selectedData={formData.role} setValue={setFormData} />
      </main>
    </div>
  </MultiPageAnimate>
));

OtherPage.displayName = 'OtherPage';
