// noinspection SpellCheckingInspection

import bg1 from "../../assets/bg_setup.png";
import bg2 from "../../assets/bg_setup_2.png";
import bg3 from "../../assets/bg_setup_3.png";
import bg4 from "../../assets/bg_setup_4.png";

// import bg1 from "../../assets/bg_setup_1.svg";
import InputBox from "../../components/FormComponent/InputBox";
import React, { useEffect, useState, memo } from "react";
import { LocationMetadata } from "../../definitions/Metadata";
import { addRow, uploadImg, apiLogin, checkSetup } from "../../network/api";
import SetupTemplate from "../../components/core/SetupTemplate";
import { initializeFlexibleOptions,initializePrefs } from "../../utils/PrefsHelper";
import { quickAdd } from "../../network/api";
import { renameAndOptimize } from "../../utils/FormHelper";
import { useStore } from "../../store/store";
import { getOption, initializeFormData } from "../../utils/FormHelper";
import { useNavigate } from "react-router-dom";
import { Organization, User } from "../../definitions/Types";
import ImageUpload from "../../components/FormComponent/ImageUpload";
import { useAuth } from "../../hooks/useAuth";
import Dropdown from "../../components/FormComponent/Dropdown";
import { MuiTelInput } from "mui-tel-input";
import { SessionPayload } from "../../definitions/Types";
import DropdownStream from "../../components/FormComponent/DropdownStream";
import InputBoxStream from "../../components/FormComponent/InputBoxStream";
import MobileField from "../../components/FormComponent/MobileField";

interface Props {
	setPage: React.Dispatch<React.SetStateAction<number>>;
}

interface AdminFields extends User {
	confirmPassword: string;
}

const Setup = () => {
	const { errorPopup, successPopup } = useStore();

	const [page, setPage] = useState<number>(1);
	const navigate = useNavigate();

	const { login } = useAuth();

	useEffect(() => {
		async function fetchData() {
			const answer = await checkSetup();
			if (!answer) {
				navigate("/login");
			}
		}

		fetchData().then();
	}, []);

	const getBackgroundImage = () => {
		switch (page) {
			case 1:
				return bg1;
			case 2:
				return bg2;
			case 3:
				return bg3;
			case 4:
				return bg4;
			default:
				return bg1;
		}
	};

	/* SETUP ORGANIZATION */
	const [logo, setLogo] = useState<File | undefined>();
	const [organization, setOrganization] = useState<Organization>({
		organizationName: "",
		about: "",
		gstin: "",
		tagline: "",
		logo: "", // image_name.extension
		phone: "",
		email: "",
		website: "",
		addressLine: "",
		state: "",

		upi: "",
		accountNumber: "",
		ifscCode: "",
		bankBranch: "",
	});
	const submitOrganization = async () => {
		/* UPLOAD IMAGE */
		let workaround: string = "";
		if (logo) {
			const ImageData = await renameAndOptimize(
				organization.organizationName,
				logo
			);
			const response = await uploadImg(ImageData.image, true);
			if (response !== 200) {
				console.error("Failed to upload the image");
				return;
			}
			workaround = ImageData.name;
		}

		  const extractInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length > 1) {
      return words.map(word => word[0].toUpperCase()).join('');
    } else {
      return name.substring(0, 2).toUpperCase();
    }
  }


		quickAdd("/organization/add", {
			...organization,
    initials: extractInitials(organization.organizationName),
			["logo"]: workaround,
		}).then((res) => {
			if (res.status !== 200) {
				errorPopup("Couldn't add organization");
				return;
			} else {
				successPopup('Welcome!')
				navigate("/");
			}
		});
	};

	/* CREATE ROOT USER */
	const [image, setImage] = useState<File>();
	const [admin, setAdmin] = useState<AdminFields>({
		userName: "",
		email: "",
		mobile: "",
		role: "admin",
		avatar: "", // image_name.extension
		password: "",
		confirmPassword: "",
	});
	const submitAdmin = async () => {
		/* VALIDATION */
		if (admin.password !== admin.confirmPassword) {
			errorPopup("Passwords don't match");
			return;
		}

		/* UPLOAD IMAGE */
		let workaround: string = "";
		if (image) {
			const ImageData = await renameAndOptimize(admin.userName, image);
			// console.info("image processed:", ImageData);
			const response = await uploadImg(ImageData.image, true);
			if (response !== 200) {
				console.error("Failed to upload the image");
				return;
			}
			workaround = ImageData.name;
		}
		/* ADD / SIGN-IN */
		const response = await addRow(`/auth/signup`, {
			...admin,
			["avatar"]: workaround,
		});
		if (response !== 200) {
			console.error("Failed to add the user");
			return;
		} else {
			console.log("User added:", response)
		}
		/* LOGIN */ // Creating Session ...
		const loginResponse = await apiLogin({
			email: admin.email,
			password: admin.password,
		});

		interface UserSession {
			id: number;
			name: string;
			role: "admin" | "operators" | "customer" | "delivery" | "reporter";
		}

		interface Session {
			user: UserSession;
			avatar: string | null;
			token: string;
		}

		const session: Session = loginResponse.data;
		console.log(session);

		const payload: SessionPayload = {
			id: session.user.id,
			name: session.user.name,
			role: session.user.role,
			avatar: session.avatar,
			token: session.token,
		};

		login(payload);
	};

	/* ADD WAREHOUSE */
	const [locationFormData, setLocationFormData] = useState<Location>(
		initializeFormData(LocationMetadata) as unknown as Location
	);
	const submitLocation = () => {
		console.log(locationFormData);
		quickAdd("/inventory/warehouses/add", locationFormData).then((res) => {
			if (res.status !== 200) {
				errorPopup("Couldn't add location");
				return;
			}
		});
	};

	async function finish() {
		await submitAdmin();
		submitLocation();
		initializePrefs(organization.organizationName);
		initializeFlexibleOptions();
		submitOrganization();
	}

	return (
		<main className="grid place-items-center w-full rounded-xl p-4"
			style={{
				backgroundImage: `url(${getBackgroundImage()})`,
				// backgroundImage: `url(${bg1})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				height: "100dvh",
			}}>
			{page === 1 && <LandingSetup setPage={setPage} />}
			{page === 2 && <BrandingSetup setPage={setPage} setLogo={setLogo} organization={organization} setOrganization={setOrganization} />}
			{page === 3 && <AdminSetup setPage={setPage} setImage={setImage} admin={admin} setAdmin={setAdmin}/>}
			{page === 4 && <WarehouseSetup setPage={setPage} locationFormData={locationFormData} setLocationFormData={setLocationFormData} finish={finish}/>}
		</main>
	);
};

export default Setup;

/*-----------LANDING----------*/

const LandingSetup = memo(({ setPage }: Props) => {
	const main = (
		<p className={"text-center text-md"}>
			We commit to provide the modern
			solution for inventory and distributorships. We are excited to have you
			onboard. Let&apos;s get you started with the setup.
		</p>
	);

	return (
		<SetupTemplate heading="Welcome to IndiaBills!" main={main} navigation="next" setPage={setPage}/>
	);
});

LandingSetup.displayName = "LandingSetup";

interface Branding extends Props {
	setLogo: React.Dispatch<React.SetStateAction<File | undefined>>;
	organization: Organization;
	setOrganization: React.Dispatch<React.SetStateAction<Organization>>;
}

/*-----------BRANDING----------*/

const BrandingSetup = memo(
	({ setPage, setLogo, organization, setOrganization }: Branding) => {
		const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
			const { name, value, type } = e.target;
			setOrganization((prevState) => ({
				...prevState,
				[name]: type === "number" ? Number(value) : value,
			}));
		};

		// @formatter:off
        const main = (
			<div className="flex flex-col gap-8">
				<div className="flex flex-col items-center gap-6">
					<div className="flex w-full gap-4">
						<InputBox name="organizationName" type="string" label="Organization Name" placeholder={""} value={organization?.organizationName} onChange={(e) => handleChange?.(e)}/>
                        <div className="flex w-full gap-4 items-center">
                            <ImageUpload placeholder="Upload Logo ⤴ | 24 x 24" setImage={setLogo} />
                        </div>
						<InputBox name="gstin" type="string" label="GSTIN" placeholder={""} value={organization?.gstin} onChange={(e) => handleChange?.(e)}/>
					</div>
					<div className={"flex w-full gap-4"}>
						<InputBox multiline maxRows={3} name={"about"} type="string" label="About" placeholder={""} value={organization?.about} onChange={(e) => handleChange?.(e)}/>
						<InputBox name="tagline" type="string" label="Motto" placeholder={"Your tagline for your brand"} value={organization?.tagline} onChange={(e) => handleChange?.(e)}/>
					</div>
					<div className="flex w-full gap-4">
						<InputBox name={"email"} type="string" label="Email" placeholder={"example@domain"} value={organization?.email} onChange={(e) => handleChange?.(e)}/>
						<InputBox startText="https://www." name={"website"} type="string" label="Website" placeholder={"yourorganization.com"} value={organization?.website} onChange={(e) => handleChange?.(e)}/>
						<MobileField label={"Mobile"} name={"phone"} setData={setOrganization} data={organization} />
					</div>
                    <div className="flex w-full gap-4">
						<InputBox name={"bankBranch"} type="string" label="Branch" placeholder={""} value={organization?.bankBranch} onChange={(e) => handleChange?.(e)}/>
						<InputBox name={"accountNumber"} type="string" label="A/C No." placeholder={"xxxxxx"} value={organization?.accountNumber} onChange={(e) => handleChange?.(e)}/>
						<InputBox name={"ifscCode"} type="number" label="IFSC Code" placeholder={"xxxxxx"} value={organization?.ifscCode} onChange={(e) => handleChange?.(e)}/>
						<InputBox name={"upi"} type="string" label="UPI ID" placeholder={"xxxxx@upi"} value={organization?.upi} onChange={(e) => handleChange?.(e)}/>
					</div>
					<div className="flex w-full gap-4">
						<div className={"w-4/12"}>
                            <Dropdown name={"state"} label="State" options={getOption("state")} selectedData={organization} setValue={setOrganization} />
                        </div>
						<InputBox name={"addressLine"} type="string" label="Address Line" placeholder={"Office building, Street Name, District"} value={organization?.addressLine} onChange={(e) => handleChange?.(e)}/>
					</div>
				</div>
			</div>
		);

		return (
			<SetupTemplate big={true} heading="Setup your [Organization]." main={main} navigation="both" setPage={setPage}/>
		);
	}
);

BrandingSetup.displayName = "BrandingSetup";

/*-----------ADMIN----------*/

interface Admin extends Props {
	setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
	admin: AdminFields;
	setAdmin: React.Dispatch<React.SetStateAction<AdminFields>>;
}

const AdminSetup = memo(({setPage, setImage, admin, setAdmin }: Admin) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value, type } = e.target;
		setAdmin((prevState) => ({
			...prevState,
			[name]: type === "number" ? Number(value) : value,
		}));
	};

	const main = (
		<div>
			<ImageUpload setImage={setImage} />
			<div className="p-8 flex flex-col items-center gap-8">
				<div className="flex w-full gap-4">
					<InputBox
						moreVisible={true}
						name="userName"
						type="string"
						label="Name"
						placeholder={"___________"}
						value={admin?.userName}
						onChange={(e) => handleChange?.(e)}
					/>
				</div>
				<div className="flex w-full gap-4">
					<div className="w-1/2">
						<InputBox
							moreVisible={true}
							name={"email"}
							type="string"
							label="Email"
							placeholder={"example@domain"}
							value={admin?.email}
							onChange={(e) => handleChange?.(e)}
						/>
					</div>
					<MuiTelInput
						style={{ borderRadius: "1rem" }}
						label={"Phone"}
						name={"phone"}
						defaultCountry="IN"
						onlyCountries={["FR", "IN", "BE", "SA"]}
						InputProps={{ inputProps: { maxLength: 15 } }}
						placeholder={"XXXXXXX"}
						onChange={(value) => setAdmin({ ...admin, ["mobile"]: value })}
						value={admin.mobile}
					/>
				</div>
				<div className="flex w-full gap-4">
					<InputBox
						moreVisible={true}
						name={"password"}
						type="password"
						label="Password"
						placeholder={"******"}
						value={admin?.password}
						onChange={(e) => handleChange?.(e)}
					/>
					<InputBox
						moreVisible={true}
						name={"confirmPassword"}
						type="password"
						label="Confirm Password"
						placeholder={"******"}
						value={admin?.confirmPassword}
						onChange={(e) => handleChange?.(e)}
					/>
				</div>
			</div>
		</div>
	);

	return (
		<SetupTemplate
			heading="Create a [Root] User."
			main={main}
			navigation="both"
			setPage={setPage}
		/>
	);
});

AdminSetup.displayName = "AdminSetup";

/*-----------WAREHOUSE----------*/

interface Warehouse extends Props {
	locationFormData: Location;
	setLocationFormData: React.Dispatch<React.SetStateAction<Location>>;
	finish: () => void;
}

const WarehouseSetup = memo(
	({ setPage, locationFormData, setLocationFormData, finish }: Warehouse) => {
		const handleLocationChange =
			(type: string, name: string, value?: string) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				if (type === "autocomplete") {
					setLocationFormData((prevState: Location) => ({
						...prevState,
						[name]: value,
					}));
				} else {
					setLocationFormData((prevState: Location) => ({
						...prevState,
						[name]: e.target.value,
					}));
				}
			};

		const main = (
			<div className="grid grid-cols-2 gap-8 p-6">
				{LocationMetadata.map((location) => {
					if (location.toAdd) {
						if (location.autocomplete) {
							return (
								<div key={location.name}>
                                    <DropdownStream moreVisible={true} field={location} options={getOption("state")} required={true} handleChange={
                                        handleLocationChange as unknown as (
                                            type: string,
                                            target: string
                                        ) => (
                                            e: React.ChangeEvent<
                                                HTMLInputElement | HTMLTextAreaElement
                                            >
                                        ) => void
                                    }/>
								</div>
							);
						} else {
							return (
								<div key={location.name} className={"idms-transparent-bg"}>
									<InputBoxStream
										moreVisible={true}
										field={location}
										value={locationFormData[location.name as keyof Location]}
										handleChange={
											handleLocationChange as unknown as (
												type: string,
												target: string
											) => (
												e: React.ChangeEvent<
													HTMLInputElement | HTMLTextAreaElement
												>
											) => void
										}
									/>
								</div>
							);
						}
					}
				})}
			</div>
		);

		return (
			<SetupTemplate
				heading="Add a [Warehouse]."
				main={main}
				navigation="final"
				setPage={setPage}
				finish={finish}
			/>
		);
	}
);

WarehouseSetup.displayName = "WarehouseSetup";
