import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../../network/api';
import { useStore } from '../../store/store';
import { getSession } from '../../utils/cacheHelper';
import SetupProgress from './components/SetupProgress';
import OrganizationImportance from './components/OrganizationImportance';
import WarehouseImportance from './components/WarehouseImportance';
import SetupCompletion from './components/SetupCompletion';
import styles from './SetupPage.module.css';

const SetupPage = () => {
  const navigate = useNavigate();
  const { errorPopup } = useStore();
  const session = getSession();
  
  const [setupData, setSetupData] = useState({
    organizationComplete: false,
    warehouseComplete: false,
    totalSteps: 2,
    completedSteps: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSetupStatus();
  }, []);

  const fetchSetupStatus = async () => {
    try {
      const orgStatus = await getData('/organization/setup-status');
      const warehouseStatus = await getData('/inventory/warehouses/setup-status');
      
      const completedSteps = (orgStatus.complete ? 1 : 0) + (warehouseStatus.complete ? 1 : 0);
      
      setSetupData({
        organizationComplete: orgStatus.complete,
        warehouseComplete: warehouseStatus.complete,
        totalSteps: 2,
        completedSteps
      });
    } catch (error) {
      console.error('Error fetching setup status:', error);
      errorPopup('Failed to fetch setup status');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSetup = () => {
    navigate('/setup');
  };

  const handleContinueSetup = () => {
    if (!setupData.organizationComplete) {
      navigate('/setup?step=organization');
    } else if (!setupData.warehouseComplete) {
      navigate('/setup?step=warehouse');
    }
  };

  const isSetupComplete = setupData.completedSteps === setupData.totalSteps;
  const setupProgress = (setupData.completedSteps / setupData.totalSteps) * 100;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading setup information...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Setup</h1>
        <p className={styles.subtitle}>
          Configure your organization and warehouse to get started
        </p>
      </div>

      <div className={styles.content}>
        {/* Setup Progress Section */}
        <div className={styles.section}>
          <SetupProgress 
            progress={setupProgress}
            completedSteps={setupData.completedSteps}
            totalSteps={setupData.totalSteps}
            isComplete={isSetupComplete}
          />
        </div>

        {/* Setup Steps */}
        {!isSetupComplete && (
          <div className={styles.section}>
            <div className={styles.setupSteps}>
              {!setupData.organizationComplete && (
                <OrganizationImportance onStartSetup={handleStartSetup} />
              )}
              
              {setupData.organizationComplete && !setupData.warehouseComplete && (
                <WarehouseImportance onContinueSetup={handleContinueSetup} />
              )}
            </div>
          </div>
        )}

        {/* Setup Completion */}
        {isSetupComplete && (
          <div className={styles.section}>
            <SetupCompletion />
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupPage;