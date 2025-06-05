import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    Paper,
} from "@mui/material";
import { cutShort } from "../../utils/FormHelper";
import CircularProgress from "@mui/material/CircularProgress";
import styles from './styles/TableGenerator.module.css';

const TableGenerator = ({ title, labels, data, columnVisibility }) => {
    const titleID = cutShort(title);

    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(30);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    if (!labels) {
        return (
            <div className="w-full grid place-items-center">
                <CircularProgress />
            </div>
        );
    }

    return (
  <main className="p-4">
    <TableContainer sx={{ maxWidth: "100%" }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {labels.map((label, index) =>
              columnVisibility[index] ? (
                <TableCell align="center" key={index}>
                  <h1 className={styles.tableHeadCell}>{label}</h1>
                </TableCell>
              ) : null
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              className={styles.tableRow}
              onClick={() => navigate(`/${title}/${row[titleID]}`)}
              key={index}
            >
              {Object.entries(row)
                .filter((_, colIndex) => columnVisibility[colIndex])
                .map(([key, value], index) => {
                  if (key === 'currentPrice' || key === 'unitMRP') {
                    return (
                      <TableCell align="center" key={index}>
                        <h1 className={styles.greenText}>₹{value}</h1>
                      </TableCell>
                    );
                  }

                  if (key === "warehouseId" && !value) {
                    return (
                      <TableCell align="center" key={index}>
                        <h1 className={styles.redText}>Not Set</h1>
                      </TableCell>
                    );
                  }

                  if (value === 0 || value === '0') {
                    return (
                      <TableCell align="center" key={index}>
                        <h1 className={styles.redText}>{value}</h1>
                      </TableCell>
                    );
                  }

                  if ((!value && value !== 0) || value === "+91") {
                    return (
                      <TableCell align="center" key={index}>
                        <h1 className={styles.redText}>-</h1>
                      </TableCell>
                    );
                  }

                  if (key.toLowerCase().includes("date")) {
                    return (
                      <TableCell align="center" key={index}>
                        <h1 className={styles.hoverBlueText}>
                          {key.toLowerCase().includes("manufacture") || key.toLowerCase().includes("expiry")
                            ? new Date(value).toLocaleDateString()
                            : new Date(value).toLocaleString()}
                        </h1>
                      </TableCell>
                    );
                  }

                  if (value.toString().includes("_")) {
                    return (
                      <TableCell align="center" key={index}>
                        <h1 className={styles.statusText}>
                          {value.toString().replace(/_/g, " ")}
                        </h1>
                      </TableCell>
                    );
                  }

                  if (key.toLowerCase().includes("name")) {
                    return (
                      <TableCell align="center" key={index}>
                        <h1 className={styles.hoverAmberText}>{value}</h1>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell align="center" key={index}>
                      <h1 className={styles.defaultText}>{value.toString()}</h1>
                    </TableCell>
                  );
                })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[30]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </TableContainer>
  </main>
);
};

export default TableGenerator;