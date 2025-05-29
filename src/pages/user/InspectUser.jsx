import PageAnimate from "../../components/Animate/PageAnimate";
import { useParams } from "react-router-dom";
import UpdateForm from "../../components/FormComponent/UpdateForm";
import {UserMetadata} from "../../definitions/Metadata";

const InspectProduct = () => {
    const { userID } = useParams();

    if (!userID) {
        return <h1>User ID not found</h1>;
    }

    return (
        <PageAnimate>
            <UpdateForm
                title={"users"}
                id={userID}
                metadata={UserMetadata}
            />
        </PageAnimate>
    );
};

export default InspectProduct;