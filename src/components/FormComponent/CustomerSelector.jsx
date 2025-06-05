import React, { useEffect, useState, useRef } from "react";
import { getBaseURL } from "../../network/api/api-config";
import { getData } from "../../network/api";
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import styles from './styles/CustomerSelector.module.css';

export const CustomerSelector = ({ data, setData }) => {
    const [customers, setCustomers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const customerData = await getData('/customers/options/list');
                setCustomers(customerData);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const selectedCustomer = customers.find((customer) => customer.id === data);

    return (
  <div className={styles.wrapper} ref={dropdownRef}>
    <button
      type="button"
      className={styles.button}
      onClick={() => setIsOpen(!isOpen)}
    >
      {selectedCustomer ? (
        <div className={styles.selected}>
          <img
            src={
              selectedCustomer.avatar
                ? `${getBaseURL()}/${selectedCustomer.avatar}`
                : `${getBaseURL()}/default.webp`
            }
            alt={selectedCustomer.name}
            className={styles.avatar}
          />
          <span className={styles.selectedName}>
            {selectedCustomer.name} #{selectedCustomer.id}
          </span>
        </div>
      ) : (
        <span className={styles.placeholder}>Select a customer</span>
      )}
      <UnfoldMoreIcon fontSize="small" className={styles.dropdownIcon} />
    </button>

    {isOpen && (
      <ul className={styles.dropdownList}>
        {customers.map((customer) => (
          <li
            key={customer.id}
            className={`${styles.dropdownItem} ${data === customer.id ? styles.selectedItem : ''}`}
            onClick={() => {
              setData(customer.id);
              setIsOpen(false);
            }}
          >
            <div className={styles.customerInfo}>
              <img
                src={
                  customer.avatar
                    ? `${getBaseURL()}/${customer.avatar}`
                    : `${getBaseURL()}/default.webp`
                }
                alt={customer.name}
                className={styles.avatar}
              />
              <span className={styles.customerName}>{customer.name}</span>
              <span className={styles.customerId}>#{customer.id}</span>
            </div>
            {data === customer.id && (
              <span className={styles.checkIcon}>
                <svg
                  className={styles.checkSvg}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414L8.414 15 4.293 10.879a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);
};
