import PageAnimate from "../../../components/Animate/PageAnimate";
import {getSession} from "../../../utils/cacheHelper";
import styles from './DashboardAdmin.module.css';

const DashboardAdmin = () => {

    const session = getSession();

    if (session) {
        return (
  <PageAnimate>
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>Dashboard Operators</h1>
        <p className={styles.description}>Lorem Ipsum</p>
      </div>
    </div>
  </PageAnimate>
);
    } else (<></>);

}

export default DashboardAdmin;
