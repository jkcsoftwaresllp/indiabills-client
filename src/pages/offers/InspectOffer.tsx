import PageAnimate from "../../components/Animate/PageAnimate";
import { useParams } from "react-router-dom";
import UpdateForm from "../../components/FormComponent/UpdateForm";
import { OfferMetadata } from "../../definitions/Metadata";

const InspectOffer = () => {
	const { offerId } = useParams();

	if (!offerId) {
		return <h1>Offer ID not found</h1>;
	}

	return (
		<PageAnimate>
			<UpdateForm
				title={"offers"}
				id={offerId}
				metadata={OfferMetadata}
			/>
		</PageAnimate>
	);
};

export default InspectOffer;
