import { useState, useEffect } from 'react';
import { getData } from '../../network/api';
import { useStore } from '../../store/store';
import SubscriptionSection from '../setup/components/SubscriptionSection';
import styles from './SubscriptionPage.module.css';

const SubscriptionPage = () => {
  const { errorPopup } = useStore();
  
  const [subscriptionData, setSubscriptionData] = useState({
    currentPlan: '',
    planValidTill: '',
    totalOrganizations: 0,
    organizations: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const subscription = await getData('/subscription/details');
      setSubscriptionData(subscription);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      errorPopup('Failed to fetch subscription data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Subscription</h1>
        <p className={styles.subtitle}>
          Manage your subscription and view organization details
        </p>
      </div>

      <div className={styles.content}>
        <SubscriptionSection 
          subscriptionData={subscriptionData}
          onRefresh={fetchSubscriptionData}
        />
      </div>
    </div>
  );
};

export default SubscriptionPage;