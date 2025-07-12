import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useNavigate } from 'react-router-dom';
import styles from './SetupCompletion.module.css';

const SetupCompletion = () => {
  const navigate = useNavigate();

  const nextSteps = [
    {
      icon: <DashboardIcon />,
      title: 'Explore Dashboard',
      description: 'Get an overview of your business metrics and key performance indicators',
      action: () => navigate('/')
    },
    {
      icon: <InventoryIcon />,
      title: 'Add Products',
      description: 'Start adding your products and inventory to begin managing your stock',
      action: () => navigate('/products/add')
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.celebration}>
        <div className={styles.iconContainer}>
          <CheckCircleIcon className={styles.successIcon} />
          <RocketLaunchIcon className={styles.rocketIcon} />
        </div>
        <h2 className={styles.title}>🎉 Setup Complete!</h2>
        <p className={styles.subtitle}>
          Congratulations! Your organization and warehouse are now configured and ready to use.
        </p>
      </div>

      <div className={styles.achievements}>
        <h3 className={styles.achievementsTitle}>What You've Accomplished:</h3>
        <div className={styles.achievementsList}>
          <div className={styles.achievement}>
            <CheckCircleIcon className={styles.achievementIcon} />
            <span>Organization profile and branding configured</span>
          </div>
          <div className={styles.achievement}>
            <CheckCircleIcon className={styles.achievementIcon} />
            <span>Warehouse location and inventory system set up</span>
          </div>
          <div className={styles.achievement}>
            <CheckCircleIcon className={styles.achievementIcon} />
            <span>Admin user account created and configured</span>
          </div>
          <div className={styles.achievement}>
            <CheckCircleIcon className={styles.achievementIcon} />
            <span>System ready for business operations</span>
          </div>
        </div>
      </div>

      <div className={styles.nextSteps}>
        <h3 className={styles.nextStepsTitle}>Recommended Next Steps:</h3>
        <div className={styles.stepsList}>
          {nextSteps.map((step, index) => (
            <div key={index} className={styles.step}>
              <div className={styles.stepIcon}>
                {step.icon}
              </div>
              <div className={styles.stepContent}>
                <h4 className={styles.stepTitle}>{step.title}</h4>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              <button 
                className={styles.stepButton}
                onClick={step.action}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.support}>
        <h4 className={styles.supportTitle}>Need Help?</h4>
        <p className={styles.supportText}>
          Our support team is here to help you get the most out of your system.
        </p>
        <button 
          className={styles.supportButton}
          onClick={() => navigate('/help')}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default SetupCompletion;