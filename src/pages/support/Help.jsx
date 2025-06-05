import DivAnimate from "../../components/Animate/DivAnimate";
import styles from './styles/Help.module.css';

const Help = () => {
    return (
        <DivAnimate className={styles.wrapper}>
    <div className={styles.centered}>
      <h1 className={styles.heading}>Help running!</h1>
    </div>
  </DivAnimate>
    );
  }
  
  export default Help
  