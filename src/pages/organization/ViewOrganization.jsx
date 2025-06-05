import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../../network/api';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import PageAnimate from '../../components/Animate/PageAnimate';
import { getBaseURL } from '../../network/api/api-config';
import styles from './styles/ViewOrganization.module.css';

const ViewOrganization = () => {
  const [organization, setOrganization] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganization = async () => {
      const response = await getData('/organization'); // Replace with actual API endpoint
      setOrganization(response);
    };

    fetchOrganization();
  }, []);

  if (!organization) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const dateAdded = new Date(organization.dateAdded);
  const now = new Date();
  const years = differenceInYears(now, dateAdded);
  const months = differenceInMonths(now, dateAdded) % 12;
  const days = differenceInDays(now, dateAdded) % 30;

  const getThankYouMessage = () => {
    if (years > 0) {
      return `Thank you for being with us for ${years} years, ${months} months, and ${days} days!`;
    } else if (months > 0) {
      return `Thank you for being with us for ${months} months!`;
    } else {
      return "This is just the beginning of our partnership!";
    }
  };

  return (
  <PageAnimate nostyle={true}>
    <div className={styles.centerButtonContainer}>
      <button
        className={styles.editButton}
        onClick={() => navigate('/organization/edit')}
      >
        Edit Organization
      </button>
    </div>

    <div className={styles.container}>
      <div className={styles.centeredColumn}>
        {organization.logo && (
          <img
            src={`${getBaseURL()}/${organization.logo}`}
            alt={`${organization.organizationName} logo`}
            className={styles.logo}
          />
        )}
        <h1 className={styles.title}>{organization.organizationName}</h1>
        <p className={styles.subtitle}>{getThankYouMessage()}</p>
      </div>

      <div className={styles.centeredColumn}>
        <div className={styles.detailContainer}>
          <p className={styles.detailItem}>
            <strong>Type:</strong> {organization.organizationType}
          </p>
          <p className={styles.detailItem}>
            <strong>Industry:</strong> {organization.industry}
          </p>
          <p className={styles.detailItem}>
            <strong>Phone:</strong> {organization.phone}
          </p>
          <p className={styles.detailItem}>
            <strong>Email:</strong> {organization.email}
          </p>
          <p className={styles.detailItem}>
            <strong>Website:</strong>{' '}
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.websiteLink}
            >
              {organization.website}
            </a>
          </p>
          <p className={styles.detailItem}>
            <strong>Address:</strong> {organization.addressLine}
          </p>
        </div>
      </div>
    </div>
  </PageAnimate>
);
};

export default ViewOrganization;