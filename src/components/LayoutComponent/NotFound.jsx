import {FC} from "react";
import {AddCircleRounded, SearchOff} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import styles from './styles/NotFound.module.css';

const NotFound = ({title}) => {
   return (
  <div className={styles.container}>
    <div className={styles.centerWrapper}>
      <SearchOff sx={{ fontSize: 150 }} />
      <div className={styles.messageWrapper}>
        <h1 className={styles.titleText}>
          Nothing found in <span className={styles.titleHighlight}> {title}</span>
        </h1>
        <NavLink to={`/${title}/add`}>
          <button className={styles.button}>
            <AddCircleRounded /> {title}
          </button>
        </NavLink>
      </div>
    </div>
  </div>
);
}

export default NotFound;