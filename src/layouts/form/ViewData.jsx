import React, { useEffect, useState } from "react";
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AddIcon from '@mui/icons-material/Add';
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DeleteIcon from "@mui/icons-material/Delete";
import PageAnimate from "../../components/Animate/PageAnimate";
import { useNavigate } from "react-router-dom";
import DataGrid from "../../components/FormComponent/DataGrid";
import ColumnSelector from "../../components/FormComponent/ColumnSelector";
import { IconButton, InputBase } from '@mui/material';
import "ag-grid-community/styles/ag-theme-material.css";
import Modal from "../../components/core/ModalMaker";
import { updateStuff, deleteStuff, getData, getReport } from "../../network/api";
import { cutShort, cutToName } from "../../utils/FormHelper";
import { CircularProgress, Container, Grid, Button, Typography } from "@mui/material";
import MouseHoverPopover from "../../components/core/Explain";
import { useStore } from "../../store/store";
import styles from './styles/ViewData.module.css';

const ViewData = ({ title, url, initialColDefs, disableControls, menuOptions, dateRange }) => {
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

  useEffect(() => {
    getData(url).then((response) => {
      setRowData(response);
      setLoading(false);
    });
  }, [url]);

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

  const filteredColDefs = colDefs.filter((col) =>
    selectedColumns.includes(col.field)
  );

  const filteredRowData = rowData.filter((row) =>
    Object.values(row).some((value) =>
      value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const onCellValueChanged = (event) => {
    updateStuff(`${url}/update/${event.data[id_field]}`, { value: event.data }).then();
    return;
  };

  const add = () => {
    if (title === "Batches") {
      navigate("/inventory/add");
    } else {
      navigate(`${url}/add`);
    }
  };

  useEffect(() => {
    if (!refreshTableId) return;
    setRowData((prev) => prev.filter((row) => row[id_field] !== refreshTableId));
  }, [refreshTableId, menuOptions, id_field]);

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
      <header className={styles.header}>
        <div>
          <h4 className={styles.title}>{title}</h4>
        </div>

        <div className={styles.searchGroup}>
          <IconButton type="button" aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            placeholder={`Search by ${title} name`}
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        {dateRange && (
          <section className={styles.dateRange}>
            <div className={styles.dateInputContainer}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.dateInputContainer}>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <button className={styles.filterButton} onClick={handleFilter}>
              <CheckCircleOutlineIcon fontSize="small" />
            </button>
          </section>
        )}

        <section className={styles.controls}>
          {!disableControls && (
            <MouseHoverPopover
              triggerElement={
                <button
                  onClick={() => setEditable(!editable)}
                  className={`${styles.controlButton} ${editable ? styles.editable : styles.notEditable}`}
                >
                  <ElectricBoltIcon />
                </button>
              }
              popoverContent={<span className={styles.popoverText}>Quick Edit</span>}
            />
          )}

          <MouseHoverPopover
            triggerElement={
              <button onClick={() => setIsModalOpen(true)} className={styles.columnButton}>
                <ViewColumnIcon />
              </button>
            }
            popoverContent={<span className={styles.popoverText}>Select Columns</span>}
          />

          {!disableControls && (
            <MouseHoverPopover
              triggerElement={
                <button onClick={add} className={styles.addButton}>
                  <AddIcon />
                </button>
              }
              popoverContent={<span className={styles.popoverText}>New {title}</span>}
            />
          )}
        </section>
      </header>

      <div className="ag-theme-quartz" style={{ height: 500, width: "100%", marginBottom: '2rem' }}>
        {filteredRowData.length > 0 ? (
          <DataGrid
            rowData={filteredRowData}
            colDefs={filteredColDefs}
            onCellValueChanged={onCellValueChanged}
            menuOptions={menuOptions}
          />
        ) : (
          <div className={styles.noDataContainer}>
            <div className={styles.noDataMessage}>
              <h1 className={styles.noDataText}>
                No data found <span className={styles.bear}>ʕ•́ᴥ•̀ʔっ</span>
              </h1>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ColumnSelector
          columns={colDefs.map((col) => ({
            field: col.field,
            headerName: col.headerName,
            editable: col.editable
          }))}
          selectedColumns={selectedColumns}
          onColumnChange={handleColumnChange}
        />
      </Modal>
    </PageAnimate>
  );
};

export default ViewData;
