import React, { useEffect, useState, useCallback } from "react";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { OfferMetadata } from "../../definitions/Metadata";
import PageAnimate from "../../components/Animate/PageAnimate";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addRow, getStuff } from "../../network/api";
import InputBox from "../../components/FormComponent/InputBox";
import ProductSelectionModal from "../../components/FormComponent/ProductSelectionModal";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Timeline from "../../components/FormComponent/Timeline";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import DropdownStream from "../../components/FormComponent/DropdownStream";
import { Field, Offer } from "../../definitions/Types";
import { getOption, groupByCategory, initializeFormData } from "../../utils/FormHelper";

interface Options {
    id: number;
    name: string;
}

const AddOffers = () => {
    const navigate = useNavigate();
    const { successPopup, errorPopup } = useStore();
    const [products, setProducts] = useState<Options[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Options[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [discountType, setDiscountType] = useState<'value' | 'percentage'>('value');

    const handleDiscountTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDiscountType(e.target.value as 'value' | 'percentage');
    };
  

    const [formData, setFormData] = useState<Offer>({} as Offer);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const fetchData = async () => {
            const productsData = await getStuff("/products/options");
            setProducts(productsData as Options[]);
        };
        fetchData().then();
    }, []);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const updatedFormData = {
            ...formData,
            products: selectedProducts.map(product => product.id),
            discountType: discountType,
        };

        console.log(updatedFormData);

        addRow(`/offers/add`, updatedFormData)
            .then((res) => {
                if (res === 200) {
                    successPopup(`Offer registered successfully!`);
                    navigate("/offers");
                } else {
                    errorPopup(`Couldn't add the offer!`);
                }
            })
            .catch((error) => {
                errorPopup(`Server Error!`);
                console.error("An error occurred:", error);
            });
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const steps = ["Basic Info", "Details", "Products"];

    return (
        <PageAnimate>
            <div className={"h-full flex flex-col gap-12 justify-center items-center"}>
                <button className={"self-start flex items-center"} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewIcon/> Go back
                </button>

                <h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
                    register a new<span className={"text-rose-400"}> offer</span> :)
                </h1>

                <Timeline steps={steps} currentStep={page} />

                <div>
                    <div className={"h-full w-full flex justify-center"}>
                        <main>
                            {page === 1 && <BasicPage formData={formData} setFormData={setFormData} handleChange={handleChange} />}
                            {page === 2 && <DetailsPage formData={formData} setFormData={setFormData} handleChange={handleChange} discountType={discountType} handleDiscountTypeChange={handleDiscountTypeChange}/>}
                            {page === 3 && <ProductsPage formData={formData} setFormData={setFormData} handleChange={handleChange} handleOpenModal={handleOpenModal} />}
                        </main>

                        <div className={"p-2 flex flex-col gap-4"}>
                            {page === 3 && <button className="p-3 flex-grow shadow-xl form-button-submit" onClick={handleSubmit}> <CheckCircleIcon /></button>}
                            {page < 3 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={nextPage}> <ArrowForwardIosIcon /></button>}
                            {page >= 2 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={backPage}> <ArrowBackIosNewIcon /></button>}
                        </div>
                    </div>
                </div>
            </div>

            <ProductSelectionModal
                open={isModalOpen}
                onClose={handleCloseModal}
                products={products}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
            />
        </PageAnimate>
    );
};

export default AddOffers;

interface Props {
    formData: Offer;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<Offer>>;
    handleOpenModal?: () => void;
}

const BasicPage = React.memo(({ formData, handleChange }: Props) => {
    return (
        <MultiPageAnimate>
            <div className="p-8 flex flex-col items-center gap-8 idms-bg">
                <main className="grid grid-cols-2 gap-6">
                    <InputBox
                        name="offerName"
                        type="string"
                        label="Offer Name"
                        placeholder=""
                        value={formData.offerName}
                        onChange={handleChange}
                    />
                    <InputBox
                        name="description"
                        type="string"
                        label="Description"
                        placeholder=""
                        value={formData.description}
                        onChange={handleChange}
                    />
                </main>
            </div>
        </MultiPageAnimate>
    );
});

BasicPage.displayName = 'BasicPage';

const DetailsPage = React.memo(({ formData, handleChange, discountType, handleDiscountTypeChange }: Props) => {
    
    return (
      <MultiPageAnimate>
        <div className="p-8 flex flex-col items-center gap-8 idms-bg">
          <main className="grid grid-cols-3 gap-6">
            <div className="col-span-3 flex items-center gap-4">
              <label>
                <input
                  type="radio"
                  name="discountType"
                  value="value"
                  checked={discountType === 'value'}
                  onChange={handleDiscountTypeChange}
                />
                Value
              </label>
              <label>
                <input
                  type="radio"
                  name="discountType"
                  value="percentage"
                  checked={discountType === 'percentage'}
                  onChange={handleDiscountTypeChange}
                />
                Percentage
              </label>
            </div>
            {discountType === 'value' ? (
              <InputBox
                name="discount"
                type="number"
                label="Discount Value"
                placeholder=""
                value={formData.discount}
                onChange={handleChange}
              />
            ) : (
              <InputBox
                name="discount"
                type="number"  
                label="Discount Percentage"
                placeholder=""
                value={formData.discount}
                onChange={handleChange}
              />
            )}
            <InputBox
              name="startDate"
              type="date"
              label="Start Date"
              placeholder="YYYY-MM-DD"
              value={formData.startDate}
              onChange={handleChange}
            />
            <InputBox
              name="endDate"
              type="date"
              label="End Date"
              placeholder="YYYY-MM-DD"
              value={formData.endDate}
              onChange={handleChange}
            />
          </main>
        </div>
      </MultiPageAnimate>
    );
  });

DetailsPage.displayName = 'DetailsPage';

const ProductsPage = React.memo(({ formData, handleOpenModal }: Props) => {
    return (
        <MultiPageAnimate>
            <div className="p-8 flex flex-col items-center gap-8 idms-bg">
                <main className="grid grid-cols-1 gap-6">
                    <button
                        onClick={handleOpenModal}
                        className="shadow-md mt-5 hover:brightness-90 transition flex min-w-4 h-fit items-center gap-2 border rounded-2xl p-6 backdrop-filter backdrop-blur-lg bg-white bg-opacity-90"
                    >
                        <PlaylistAddCheckIcon /> Select Products
                    </button>
                </main>
            </div>
        </MultiPageAnimate>
    );
});

ProductsPage.displayName = 'ProductsPage';
