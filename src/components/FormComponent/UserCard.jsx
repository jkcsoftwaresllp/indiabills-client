import React from "react";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { getBaseURL } from "../../network/api/api-config";
import styles from './styles/UserCard.module.css';

const UserCard = ({ id, avatar, email, name }) => {

    const navigate = useNavigate();

   return (
  <div className={styles.container}>
    <Avatar 
      sizes="big" 
      sx={{ width: 56, height: 56 }} 
      alt={name} 
      src={`${getBaseURL()}/${avatar}`} 
    />

    <div className={styles.userInfo}>
      <h1 className={styles.name}>{name}</h1>
      <h2 className={styles.email}>{email}</h2>
    </div>

    <button onClick={() => navigate(`/users/${id}`)} className={styles.button}>
      <ReadMoreIcon />
    </button>
  </div>
);

}

export default UserCard;
