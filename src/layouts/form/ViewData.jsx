import { FiPlus } from 'react-icons/fi';
import React, { useEffect, useState, useMemo } from "react";
import PageAnimate from "../../components/Animate/PageAnimate";
import { useNavigate } from "react-router-dom";
import DataGrid from "../../components/FormComponent/DataGrid";
import ColumnSelector from "../../components/FormComponent/ColumnSelector";
import QuickEditModal from "../../components/core/QuickEditModal";
import { IconButton, InputBase } from '@mui/material';
import "ag-grid-community/styles/ag-theme-material.css";
import Modal from "../../components/core/ModalMaker";
import { updateStuff, deleteStuff, getData, getReport } from "../../network/api";
import { cutShort } from "../../utils/FormHelper";
import { CircularProgress, Container, Grid } from "@mui/material";
import MouseHoverPopover from "../../components/core/Explain";
import { useStore } from "../../store/store";

const ViewData = ({
  title,
  url,
  initialColDefs,
  disableControls,
  dateRange,
  customDataFetcher,
  mockData,
  menuOptions
}) => {
  const navigate = useNavigate();
  const { refreshTableId, Organization } = useStore();

  const id_field = cutShort(title);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useState(false);
  const [colDefs, setColDefs] = useState(initialColDefs);
  const [startDate, setStartDate] = useState(Organization.fiscalStart);
  const [endDate, setEndDate] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [quickEditOpen, setQuickEditOpen] = useState(false);

  useEffect(() => {
    if (!Organization.fiscalStart) return;
    const date = new Date(Organization.fiscalStart);
    date.setFullYear(date.getFullYear() + 1);
    date.setDate(date.getDate() - 1);
    setEndDate(date.toISOString().split('T')[0]);
  }, [Organization.fiscalStart]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // ✅ Updated data fetching logic to include mockData
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (mockData && Array.isArray(mockData)) {
          setRowData(mockData);
        } else {
          const data = customDataFetcher
            ? await customDataFetcher()
            : await getData(url);
          setRowData(data || []);
        }
      } catch (error) {
        console.error('Data fetch failed:', error);
        setRowData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, customDataFetcher, mockData]);

  const handleFilter = () => {
    setLoading(true);
    getReport(`${url}/range`, { startDate, endDate }).then((response) => {
      setRowData(response);
      setLoading(false);
    });
  };

  let initialSelectedColumns = JSON.parse(
    localStorage.getItem(`${title}_selectedColumns`) || "[]"
  );

  initialSelectedColumns = initialSelectedColumns.filter((col) =>
    initialColDefs.map((col) => col.field).includes(col)
  );

  const [selectedColumns, setSelectedColumns] = useState(
    initialSelectedColumns.length > 0
      ? initialSelectedColumns
      : colDefs.slice(0, 7).map((col) => col.field)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(`${title}_selectedColumns`, JSON.stringify(selectedColumns));
  }, [selectedColumns, title]);

  useEffect(() => {
    setColDefs(
      initialColDefs.map((col) => ({
        ...col,
        editable: editable ? col.editable : false,
      }))
    );
  }, [editable, initialColDefs]);

  const handleColumnChange = (field) => {
    setSelectedColumns((prevSelected) => {
      if (prevSelected.includes(field)) {
        return prevSelected.filter((col) => col !== field);
      } else if (prevSelected.length < 7) {
        return [...prevSelected, field];
      } else {
        alert("You can only select up to 7 columns.");
        return prevSelected;
      }
    });
  };

  const filteredColDefs = useMemo(() => 
    colDefs.filter((col) =>
      selectedColumns.includes(col.field)
    ), 
    [colDefs, selectedColumns]
  );

  const filteredRowData = useMemo(() => 
    Array.isArray(rowData)
      ? rowData.filter((row) =>
          Object.values(row).some((value) => {
            // Skip null, undefined, and non-primitive values
            if (value === null || value === undefined) return false;
            
            // Handle objects and arrays
            if (typeof value === 'object') return false;
            
            // Convert to string and search
            return String(value).toLowerCase().includes(searchTerm.toLowerCase());
          })
        )
      : [],
    [rowData, searchTerm]
  );

  const onCellValueChanged = (event) => {
    updateStuff(`${url}/update/${event.data[id_field]}`, { value: event.data }).then();
  };

  const handleQuickEdit = () => {
    console.log('Quick FiEdit clicked, selected rows:', selectedRows);
    if (selectedRows.length === 0) {
      alert('Please select a row to edit');
      return;
    }
    if (selectedRows.length > 1) {
      alert('Please select only one row to edit');
      return;
    }
    setQuickEditOpen(true);
  };

  const handleQuickEditSave = async (updatedData) => {
    try {
      const response = await updateStuff(`${url}/update/${updatedData[id_field]}`, { value: updatedData });
      if (response) {
        setRowData(prev => prev.map(row => 
          row[id_field] === updatedData[id_field] ? updatedData : row
        ));
        setQuickEditOpen(false);
        setSelectedRows([]);
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleQuickEditDelete = async (data) => {
    try {
      const response = await deleteStuff(`${url}/delete/${data[id_field]}`);
      if (response) {
        setRowData(prev => prev.filter(row => row[id_field] !== data[id_field]));
        setQuickEditOpen(false);
        setSelectedRows([]);
      }
    } catch (error) {
      console.error('FiTrash2 failed:', error);
    }
  };

  const onSelectionChanged = (event) => {
    const selected = event.api.getSelectedRows();
    console.log('Selection changed:', selected);
    setSelectedRows(selected);
  };

  const add = () => {
  if (title === "Batches") {
  navigate("/inventory/add");
  } else {
  const currentPath = window.location.pathname;
  console.log('Current Path:', currentPath);
  if (currentPath.startsWith('/operator/')) {
  navigate(`${currentPath}/add`);
  }
  else if (currentPath.startsWith('/products')) {
  navigate(`${currentPath}/add`);
  }
  else if (currentPath.startsWith('/transport')) {
  navigate(`${currentPath}/add`);
  }
    else {
        navigate(`/${title.toLowerCase()}/add`);
      }
    }
  };

  useEffect(() => {
    if (!refreshTableId) return;
    setRowData((prev) => prev.filter((row) => row[id_field] !== refreshTableId));
  }, [refreshTableId, id_field]);

  if (loading) {
    return (
      <Container>
        <Grid
          container
          style={{ minHeight: "80vh" }}
          alignItems="center"
          justifyContent="center">
          <CircularProgress />
        </Grid>
      </Container>
    );
  }

  return (
    <PageAnimate>
      <header className={"flex items-center justify-between px-4 py-1"}>
        <div><h4 className={"text-3xl transition font-bold hover:text-rose-500"}>{title}</h4></div>

        <div className="flex items-center mb-4 md:mb-0">
          <IconButton type="button" aria-label="search"><FiSearch /></IconButton>
          <InputBase
            placeholder={`Search by ${title} name`}
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
            className="ml-2"
          />
        </div>

        {dateRange && (
          <section className="flex gap-2 w-fit justify-between items-center border-2 transition p-2 hover:shadow-lg rounded-xl">
            <div className="flex flex-col items-end">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 bg-light rounded-xl border text-sm"/>
            </div>
            <div className="flex flex-col">
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 bg-light rounded-xl border text-sm"/>
            </div>
            <button className="bg-primary flex items-center justify-center transition rounded-full hover:bg-accent text-light font-medium p-2 hover:brightness-125 shadow-2xl" onClick={handleFilter}>
              <FiCheckCircle fontSize='small' />
            </button>
          </section>
        )}

        <section className={"flex items-center justify-between gap-2"}>
          {!disableControls && (
            <MouseHoverPopover
              triggerElement={
                <button 
                  onClick={handleQuickEdit} 
                  className={`transition ease-in-out p-2 w-fit bg-primary rounded-full ${selectedRows.length === 0 ? 'text-slate-200' : 'text-amber-500 -translate-y-1 shadow-lg'}`}
                  disabled={selectedRows.length === 0}
                >
                  <FiZap />
                </button>
              }
              popoverContent={<span className="text-xs"> Quick FiEdit {selectedRows.length > 0 ? `(${selectedRows.length} selected)` : ''} </span>}
            />
          )}
          <MouseHoverPopover
            triggerElement={
              <button onClick={() => setIsModalOpen(true)} className="p-2 min-w-20 bg-primary text-slate-200 rounded-full">
                <FiColumns />
              </button>
            }
            popoverContent={<span className="text-xs"> Select Columns </span>}
          />
          {!disableControls && (
            <MouseHoverPopover
              triggerElement={
                <button onClick={add} className="p-2 w-fit bg-primary text-slate-200 rounded-full hover:bg-accent hover:brightness-200">
                  <FiPlus />
                </button>
              }
              popoverContent={<span className="text-xs"> New {title} </span>}
            />
          )}
        </section>
      </header>

      <div className="ag-theme-quartz" style={{ height: 500, width: "100%", marginBottom: '2rem' }}>
        {filteredRowData.length > 0 ? (
          <DataGrid
            rowData={filteredRowData}
            colDefs={filteredColDefs}
            menuOptions={menuOptions}
            onCellValueChanged={onCellValueChanged}
            onSelectionChanged={onSelectionChanged}
          />
        ) : (
          <div className="h-full grid place-items-center">
            <div className="flex gap-4 items-center">
              <h1 className="text-2xl">No data found <span className="ml-4">ʕ•́ᴥ•̀ʔっ</span></h1>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ColumnSelector
          columns={colDefs.map((col) => ({ field: col.field, headerName: col.headerName, editable: col.editable }))}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
        />
      </Modal>

      <QuickEditModal
        open={quickEditOpen}
        onClose={() => {
          setQuickEditOpen(false);
          setSelectedRows([]);
        }}
        data={selectedRows[0]}
        columns={initialColDefs}
        onSave={handleQuickEditSave}
        onDelete={handleQuickEditDelete}
        title={title}
      />
    </PageAnimate>
  );
};

export default ViewData;
