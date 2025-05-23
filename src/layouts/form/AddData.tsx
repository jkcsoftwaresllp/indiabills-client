import PageAnimate from "../../components/Animate/PageAnimate";
import AddForm from "../../components/FormComponent/AddForm";
import { Field, Services } from "../../definitions/Types";

interface Props<T extends Services> {
    title: string,
    metadata: Field<T>[];
}

const AddData = <T extends Services,>({ title, metadata }: Props<T>) => {
    return (
        <PageAnimate>
            <div className="w-full flex justify-center items-center gap-5">
                <div className="p-4 h-fit items-center justify-center flex-col flex gap-5">
                    <h1 className="text-2xl transition shadow-sm hover:shadow-lg p-4 text-center w-full idms-control font-extrabold"> add to <span className={"capitalize text-rose-400"}> {title} </span> table </h1>

                    <AddForm
                        title={title}
                        metadata={metadata}
                    />
                </div>
            </div>
        </PageAnimate>
    );
};

export default AddData;