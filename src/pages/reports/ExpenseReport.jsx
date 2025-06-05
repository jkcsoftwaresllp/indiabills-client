// client/src/pages/reports/ExpenseReport.tsx
import { useEffect, useState } from 'react';
import { getData } from '../../network/api';
import { AgGridReact } from 'ag-grid-react';
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import AddExpenseModal from './ExpenseModal';
import styles from './styles/ExpenseReport.module.css';

const ExpenseReport = () => {
    const [expenseData, setExpenseData] = useState([]);
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

    useEffect(() => {
        fetchExpenseData();
    }, []);

    const fetchExpenseData = async () => {
        try {
            const response = await getData('/reports/expenses');
            setExpenseData(response);
        } catch (error) {
            console.error('Error fetching expenses api:', error);
        }
    };

    const columnDefs = [
        { headerName: 'Expense ID', field: 'expenseId' },
        { headerName: 'Reason', field: 'reason' },
        { headerName: 'Amount', field: 'amount' },
        { headerName: 'Remarks', field: 'remarks' },
        { headerName: 'Date Added', field: 'dateAdded' },
        { headerName: 'Added By', field: 'addedBy' },
        { headerName: 'Last Edited Date', field: 'lastEditedDate' },
        { headerName: 'Last Edited By', field: 'lastEditedBy' },
    ];

   return (
  <div className={styles.container}>
    <h1 className={styles.heading}>Expense Report</h1>
    <button className={styles.addButton} onClick={() => setIsAddExpenseModalOpen(true)}>
      Add Expense
    </button>
    <AddExpenseModal
      isOpen={isAddExpenseModalOpen}
      onClose={() => setIsAddExpenseModalOpen(false)}
      onExpenseAdded={fetchExpenseData}
    />
    <div className={`ag-theme-quartz ${styles.gridWrapper}`}>
      <AgGridReact
        rowData={expenseData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={20}
      />
    </div>
  </div>
);
};

export default ExpenseReport;