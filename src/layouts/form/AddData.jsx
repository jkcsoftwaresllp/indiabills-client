import PageAnimate from "../../components/Animate/PageAnimate";
import AddForm from "../../components/FormComponent/AddForm";
import styles from './styles/AddData.module.css';

const AddData = ({ title, metadata }) => {
    return (
    <PageAnimate>
      <div className={styles.wrapper}>
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>
            add to <span className={styles.titleSpan}>{title}</span> table
          </h1>

          <AddForm title={title} metadata={metadata} />
        </div>
      </div>
    </PageAnimate>
  );
};

export default AddData;