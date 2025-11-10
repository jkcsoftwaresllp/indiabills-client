import { FiMoreVertical } from 'react-icons/fi';
import React, { useEffect, useState, useRef } from "react";
import { getBaseURL } from "../../network/api/api-config";
import { getData } from "../../network/api";

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
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedCustomer ? (
                    <div className="flex items-center">
                        <img
                            src={
                                selectedCustomer.avatar
                                    ? `${getBaseURL()}/${selectedCustomer.avatar}`
                                    : `${getBaseURL()}/default.webp`
                            }
                            alt={selectedCustomer.name}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="ml-3 block truncate">
                            {selectedCustomer.name} #{selectedCustomer.id}
                        </span>
                    </div>
                ) : (
                    <span className="text-gray-500">Select a customer</span>
                )}
                <FiMoreVertical fontSize="small" className="text-gray-500" />
            </button>

            {isOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {customers.map((customer) => (
                        <li
                            key={customer.id}
                            className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-accent hover:brightness-75 hover:text-white ${
                                data === customer.id ? "bg-accent backdrop-opacity-30 text-white" : ""
                            }`}
                            onClick={() => {
                                setData(customer.id);
                                setIsOpen(false);
                            }}
                        >
                            <div className="flex items-center">
                                <img
                                    src={
                                        customer.avatar
                                            ? `${getBaseURL()}/${customer.avatar}`
                                            : `${getBaseURL()}/default.webp`
                                    }
                                    alt={customer.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="ml-3 block truncate">
                                    {customer.name}
                                </span>
                                <span className="ml-3 text-sm text-light">
                                    #{customer.id}
                                </span>
                            </div>

                            {data === customer.id && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                                    <svg
                                        className="h-5 w-5"
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
