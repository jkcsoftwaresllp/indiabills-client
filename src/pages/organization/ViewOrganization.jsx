import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData } from '../../network/api';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import PageAnimate from '../../components/Animate/PageAnimate';
import { getBaseURL } from '../../network/api/api-config';

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
      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate('/organization/edit')}
        >
          Edit Organization
        </button>
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col items-center">
          {organization.logo && (
            <img
              src={`${getBaseURL()}/${organization.logo}`}
              alt={`${organization.organizationName} logo`}
              className="w-32 h-32 mb-4"
            />
          )}
          <h1 className="text-3xl font-bold mb-2 text-center">{organization.organizationName}</h1>
          <p className="text-center text-gray-600 mb-6">{getThankYouMessage()}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full">
            <p className="mb-4">
              <strong>Type:</strong> {organization.organizationType}
            </p>
            <p className="mb-4">
              <strong>Industry:</strong> {organization.industry}
            </p>
            <p className="mb-4">
              <strong>Phone:</strong> {organization.phone}
            </p>
            <p className="mb-4">
              <strong>Email:</strong> {organization.email}
            </p>
            <p className="mb-4">
              <strong>Website:</strong>{' '}
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {organization.website}
              </a>
            </p>
            <p className="mb-4">
              <strong>Address:</strong> {organization.addressLine}
            </p>
          </div>
        </div>
      </div>
    </PageAnimate>
  );
};

export default ViewOrganization;