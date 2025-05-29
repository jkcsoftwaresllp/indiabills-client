import {FC} from "react";
import {AddCircleRounded, SearchOff} from "@mui/icons-material";
import {NavLink} from "react-router-dom";

const NotFound = ({title}) => {
    return (
        <div className="h-full w-full flex flex-col justify-start py-48">
            <div className="flex flex-col justify-center items-center gap-10">
                <SearchOff sx={{fontSize: 150}}/>
                <div className="flex flex-col justify-center items-center gap-6">
                    <h1 className="text-2xl">Nothing found in <span className={"capitalize text-rose-400"}> {title}</span></h1>
                    <NavLink to={`/${title}/add`}>
                        <button className={"idms-button flex gap-2 items-center capitalize"}>
                            <AddCircleRounded/> {title}
                        </button>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default NotFound;