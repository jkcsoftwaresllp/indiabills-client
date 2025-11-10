import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import { createOffer } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";

const AddOffer = () => {
	const { successPopup, errorPopup } = useStore();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		offerType: 'product_discount',
		discountType: 'percentage',
		discountValue: 0,
		maxDiscountAmount: 0,
		minOrderAmount: 0,
		startDate: '',
		endDate: '',
		isActive: true
	});
	const [page, setPage] = useState(1);

	const backPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1);
		}
	}, [page]);

	const nextPage = useCallback(() => {
		if (page < 2) {
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
  const payload = {
    name: formData.name.trim(),
    description: formData.description?.trim() || "",
    offer_type: formData.offerType,
    discount_type: formData.discountType,
    discount_value: Number(formData.discountValue) || 0,
    max_discount_amount: Number(formData.maxDiscountAmount) || 0,
    min_order_amount: Number(formData.minOrderAmount) || 0,
    start_date: new Date(formData.startDate).toISOString(),
    end_date: new Date(formData.endDate).toISOString(),
    is_active: Boolean(formData.isActive),
  };

  const status = await createOffer(payload);

  if (status === 201 || status === 200) {
    successPopup("Offer created successfully!");
    navigate('/offers');
  } else {
    errorPopup("Failed to create the offer :(");
  }
};


	const steps = ["Basic Info", "Discount Details"];

	return (
		<PageAnimate>
			<div className={"h-full flex flex-col gap-12 justify-center items-center"}>
				<button className={"self-start flex items-center"} onClick={() => navigate(-1)}>
					<FiArrowLeft/> Go back
				</button>

				<h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
					create a new<span className={"text-rose-400"}> offer</span> :)
				</h1>

				<Timeline steps={steps} currentStep={page} />

				<div>
					<div className={"h-full w-full flex justify-center"}>
						<main>
							{page === 1 && <BasicPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
							{page === 2 && <DiscountPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
						</main>

						<div className={"p-2 flex flex-col gap-4"}>
							{page === 2 && <button className="p-3 flex-grow shadow-xl form-button-submit" onClick={submit}> <FiCheckCircle /></button>}
							{page < 2 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={nextPage}> <FiArrowRight /></button>}
							{page >= 2 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={backPage}> <FiArrowLeft /></button>}
						</div>
					</div>
				</div>
			</div>
		</PageAnimate>
	);
};

export default AddOffer;

const BasicPage = React.memo(({ formData, handleChange, setFormData }) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<InputBox name="name" type="string" label="Offer Name" placeholder={"Summer Sale"} value={formData.name} onChange={handleChange} />
					<InputBox name="description" type="string" label="Description" placeholder={"Offer description"} value={formData.description} onChange={handleChange} />
					<Dropdown name={"offerType"} label="Offer Type" options={["product_discount", "order_discount", "shipping_discount"]} selectedData={formData} setValue={setFormData} />
					<InputBox name="startDate" type="date" label="Start Date" value={formData.startDate} onChange={handleChange} />
					<InputBox name="endDate" type="date" label="End Date" value={formData.endDate} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

BasicPage.displayName = 'BasicPage';

const DiscountPage = React.memo(({ formData, handleChange, setFormData }) => {
	return (
		<MultiPageAnimate>
			<div className="p-8 flex flex-col items-center gap-8 idms-bg">
				<main className="grid grid-cols-2 gap-6">
					<Dropdown name={"discountType"} label="Discount Type" options={["percentage", "fixed"]} selectedData={formData} setValue={setFormData} />
					<InputBox name="discountValue" type="number" label="Discount Value" placeholder={"10"} value={formData.discountValue} onChange={handleChange} />
					<InputBox name="maxDiscountAmount" type="number" label="Maximum Discount Amount" placeholder={"1000"} value={formData.maxDiscountAmount} onChange={handleChange} />
					<InputBox name="minOrderAmount" type="number" label="Minimum Order Amount" placeholder={"500"} value={formData.minOrderAmount} onChange={handleChange} />
				</main>
			</div>
		</MultiPageAnimate>
	);
});

DiscountPage.displayName = 'DiscountPage';