import PageAnimate from "../../../components/Animate/PageAnimate";
import {getSession} from "../../../utils/cacheHelper";

const DashboardAdmin = () => {

    const session = getSession();

    if (session) {
        return (
            <PageAnimate>
                {/* <div className={"flex h-screen justify-center p-8 idms-accent-transparent-bg"}> */}
                <div className={"flex max-h-screen justify-center p-8"}>
                    <div className={"flex flex-col gap-4 p-2 w-full h-full text-center"}>
                        <h1 className={"p-4 h-full idms-control"}> Dashboard Delivery </h1>
                        <p className={"p-4 h-full idms-transparent-bg transition rounded-md hover:shadow-lg"}> Lorem
                            Ipsum </p>
                    </div>
                </div>
            </PageAnimate>
        );
    } else (<></>);

}

export default DashboardAdmin;
