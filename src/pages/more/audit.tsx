import React, { useEffect, useState } from "react";
import { getData } from "../../network/api";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { Audit } from "../../definitions/Types";
import { formatDistanceToNow, parseISO } from 'date-fns';
import AuditModal from "../../components/core/AuditModal";
import { getBaseURL } from "../../network/api/api-config";

const AuditQuickView: React.FC = () => {
    const [logs, setLogs] = useState<Audit[]>([]);
    const navigate = useNavigate();

    const { user } = useAuth();

    useEffect(() => {
        const fetchLogs = async () => {
            if (user.role !== "admin") {
                return ;
            }

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
                return `${log.addedBy} added a ${log.objectOfInterest} to ${log.target}`;
            case "update":
                return `${log.addedBy} edited a ${log.objectOfInterest} in ${log.target}`;
            case "delete":
                return `${log.addedBy} deleted a ${log.objectOfInterest} from ${log.target}`;
            case "shop":
                return `${log.addedBy} shopped for ${log.objectOfInterest}`;
            case "transfer":
                return `${log.addedBy} transferred ${log.objectOfInterest}`;
            case "cancelled":
                return `${log.addedBy} cancelled ${log.objectOfInterest}`;
            case "delivered":
                return `${log.addedBy} delivered ${log.objectOfInterest}`;
            case "failed":
                return `${log.addedBy} failed to deliver ${log.objectOfInterest}`;
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

    return (
        <AuditModal>
            <div className={"flex flex-col gap-2"} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {logs.slice(0, 6).map((log) => (
                    <div className={"p-4 border-2 flex items-center gap-4"} key={log.auditId}>
                        <Avatar src={log.avatar ? `${getBaseURL()}/${log.avatar}` : `${process.env.REACT_APP_SERVER_URL}/default.webp`} alt={log.addedBy} />
                        <span className={"flex flex-col justify-center gap-2"}>
                            <p className="font-medium">
                                <HighlightedText
                                    text={returnLog(log)}
                                    highlights={[log.addedBy, log.objectOfInterest, log.target]}
                                />
                            </p>
                            <p className={"text-slate-400"}>{formatDate(log.date)}</p>
                        </span>
                    </div>
                ))}
            </div>
        </AuditModal>
    )
};

export default AuditQuickView;

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
