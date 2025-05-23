// client/src/pages/reports/ExpenseReport.tsx
import { useEffect, useState } from 'react';
import { getData } from '../../network/api';
import { AgGridReact } from 'ag-grid-react';
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import AddExpenseModal from './ExpenseModal';

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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Expense Report</h1>
            <button className="mb-4" onClick={() => setIsAddExpenseModalOpen(true)}>Add Expense</button>
            <AddExpenseModal
                isOpen={isAddExpenseModalOpen}
                onClose={() => setIsAddExpenseModalOpen(false)}
                onExpenseAdded={fetchExpenseData}
            />
            <div className="ag-theme-quartz" style={{ height: 400, width: '100%' }}>
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