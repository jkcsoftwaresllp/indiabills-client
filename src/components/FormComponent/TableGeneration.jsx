import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
                            {labels.map(
                                (label, index) =>
                                    columnVisibility[index] && (
                                        <TableCell align="center" key={index}>
                                            <h1 className={"capitalize font-semibold text-slate-800 hover:text-sky-700"}>{label}</h1>
                                        </TableCell>
                                    )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => {
                            return (
                                <TableRow
                                    className={"cursor-pointer hover:bg-slate-50"}
                                    onClick={() =>
                                        navigate(`/${title}/${row[titleID]}`)
                                    }
                                    key={index}
                                >
                                    {Object.entries(row)
                                        .filter((_, colIndex) => columnVisibility[colIndex])
                                        .map(([key, value], index) => {
                                            if (key === 'currentPrice' || key === 'unitMRP') {
                                                return (
                                                    <TableCell align="center" key={index}>
                                                        <h1 className={"text-green-700"}>₹{value}</h1>
                                                    </TableCell>
                                                );
                                            }
                                            if (key === "warehouseId" && !value) {
                                                return (
                                                    <TableCell align="center" key={index}>
                                                        <h1 className={"text-red-700"}>Not Set </h1>
                                                    </TableCell>
                                                );
                                            }
                                            if (value === 0 || value === '0') {
                                                return (
                                                    <TableCell align="center" key={index}>
                                                        <h1 className={"text-red-700"}>{value}</h1>
                                                    </TableCell>
                                                );
                                            } else if (!value && value !== 0 || value === "+91") {
                                                return (
                                                    <TableCell align="center" key={index}>
                                                        <h1 className={"text-red-700"}>-</h1>
                                                    </TableCell>
                                                );
                                            } else {
                                                if (key.toLowerCase().includes("date")) {
                                                    if (key.toLowerCase().includes("manufacture") || key.toLowerCase().includes("expiry")) {
                                                        return (
                                                            <TableCell align="center" key={index}>
                                                                <h1 className={"hover:text-sky-700"}>{new Date(value).toLocaleDateString()}</h1>
                                                            </TableCell>
                                                        );
                                                    } else {
                                                        return (
                                                            <TableCell align="center" key={index}>
                                                                <h1 className={"hover:text-sky-700"}>{new Date(value).toLocaleString()}</h1>
                                                            </TableCell>
                                                        );
                                                    }
                                                } else if (value.toString().includes("_")) {
                                                    return (
                                                        <TableCell align="center" key={index}>
                                                            <h1 className={"text-emerald-700 capitalize bg-emerald-200 p-px border border-emerald-500 rounded-xl"}> {value.toString().replace(/_/g, " ")}</h1>
                                                        </TableCell>
                                                    );
                                                } else if (key.toLowerCase().includes("name")) {
                                                    return (
                                                        <TableCell align="center" key={index}>
                                                            <h1 className={"hover:text-amber-700"}>{value}</h1>
                                                        </TableCell>
                                                    );
                                                } else {
                                                    return (
                                                        <TableCell align="center" key={index}>
                                                            <h1 className={"text-slate-700"}>{value.toString()}</h1>
                                                        </TableCell>
                                                    );
                                                }
                                            }
                                        })}
                                </TableRow>
                            );
                        })}
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