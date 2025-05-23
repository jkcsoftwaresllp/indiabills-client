import React, { useEffect, useState } from "react";
import { getData } from "../../network/api";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { Audit } from "../../definitions/Types";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { getBaseURL } from "../../network/api/api-config";
import PageAnimate from "../../components/Animate/PageAnimate";

const ViewAudit: React.FC = () => {
    const [logs, setLogs] = useState<Audit[]>([]);
    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await getData("/audit/logs");
                const sortedLogs = (response as unknown as Audit[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setLogs(sortedLogs);
            } catch (error) {
                console.error("Error fetching audit logs:", error);
            }
        };

        if (user) {
            fetchLogs();
        }
    }, [user]);

    const routeToUser = (userId: string) => {
        navigate(`/users/${userId}`);
    }

    function returnLog(log: Audit): string {
        switch (log.action) {
            case "add":
                return `Added ${log.objectOfInterest} to ${log.target}`;
            case "update":
                return `Edited ${log.objectOfInterest} in ${log.target}`;
            case "delete":
                return `Deleted ${log.objectOfInterest} from ${log.target}`;
            case "shop":
                return `Shopped for ${log.objectOfInterest}`;
            case "transfer":
                return `Transferred ${log.objectOfInterest}`;
            case "cancelled":
                return `Cancelled ${log.objectOfInterest}`;
            case "delivered":
                return `Delivered ${log.objectOfInterest}`;
            case "failed":
                return `Failed to deliver ${log.objectOfInterest}`;
            default:
                return `Unknown action by ${log.addedBy}`;
        }
    }

    function formatDate(date: string): string {
        const parsedDate = parseISO(date);
        const now = new Date();
        const diffInHours = (now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return formatDistanceToNow(parsedDate, { addSuffix: true });
        } else {
            return new Date(date).toLocaleString();
        }
    }

    const columnDefs = [
        {
            headerName: "User",
            field: "user",
            filter: true,
            cellRenderer: (params: any) => (
                <div className="flex items-center">
                    <Avatar src={params.data.avatar ? `${getBaseURL()}/${params.data.avatar}` : `${process.env.REACT_APP_SERVER_URL}/default.webp`} alt={params.data.addedBy}  sx={{ width: 28, height: 28 }}  />
                    <span style={{ marginLeft: 8 }}>{params.data.addedBy}</span>
                </div>
            ),
            width: 200
        },
        {
            headerName: "Log",
            field: "log",
            cellRenderer: (params: any) => (
                <HighlightedText
                    text={returnLog(params.data)}
                    highlights={[params.data.addedBy, params.data.objectOfInterest, params.data.target]}
                />
            ),
            flex: 1
        },
        {
            headerName: "Date",
            field: "date",
            valueFormatter: (params: any) => formatDate(params.value),
            width: 200
        },
        {
            headerName: "Remarks",
            field: "remarks",
            cellRenderer: (params: any) => (
                <span className="cap    italize">{params.value}</span>
            ),
            flex: 1
        }
    ];

    return (
        <PageAnimate>
        <div className="ag-theme-quartz p-4" style={{ height: 600, width: '100%' }}>
          <AgGridReact
               rowData={logs}
               columnDefs={columnDefs}
               pagination={true}
               paginationPageSize={20}
               />
        </div>
        </PageAnimate>
    )
};

export default ViewAudit;

interface HighlightedTextProps {
    text: string;
    highlights: string[];
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlights }) => {
    const regex = new RegExp(`(${highlights.join("|")})`, "gi");
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) =>
                highlights.includes(part.toLowerCase()) ? (
                    <span key={index} className="capitalize text-accent">
                        {part}
                    </span>
                ) : (
                    part
                )
            )}
        </>
    );
};
