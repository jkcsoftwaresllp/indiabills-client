import React from "react";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { getBaseURL } from "../../network/api/api-config";

interface Props {
    id: string | number,
    avatar: string,
    name: string,
    email: string
}


const UserCard: React.FC<Props> = ({ id, avatar, email, name }) => {

    const navigate = useNavigate();

    return (
        <div className={"p-4 w-[10rem] flex flex-col gap-4 items-center shadow-md bg-white rounded-lg bg-opacity-80"}>
            <Avatar sizes="big" sx={{ width: 56, height: 56 }} alt={name} src={`${getBaseURL()}/${avatar}`}/>

            <div className={"flex flex-col items-center"}>
                <h1 className={"capitalize font-semibold text-center"}>{name}</h1>
                <h2 className={"lowercase text-sm text-gray-500"}>{email}</h2>
            </div>

            <button onClick={() => navigate(`/users/${id}`)} className={"p-2 bg-primary text-slate-300 rounded-xl w-full hover:bg-accent hover:brightness-150 transition-all duration-300 ease-out"}>
                <ReadMoreIcon />
            </button>

        </div>
    )

}

export default UserCard;
