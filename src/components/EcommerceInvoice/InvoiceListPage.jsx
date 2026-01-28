import { useMemo, useState } from "react";
import InvoiceOrderCard from "./InvoiceOrderCard";
import styles from "./styles/InvoiceListPage.module.css";

const ORDERS = [
    {
        id: "INV-2026-0042",
        date: "25 Jan 2026",
        itemsCount: 3,
        total: 394997,
        status: "PAID",
        paymentMethod: "UPI",
    },
    {
        id: "INV-2026-0041",
        date: "20 Jan 2026",
        itemsCount: 1,
        total: 29999,
        status: "PAID",
        paymentMethod: "Credit Card",
    },
    {
        id: "INV-2026-0039",
        date: "18 Jan 2026",
        itemsCount: 2,
        total: 159998,
        status: "PENDING",
        paymentMethod: "Cash on Delivery",
    },
];

export default function InvoiceListPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    /* 🔥 FILTER LOGIC */
    const filteredOrders = useMemo(() => {
        return ORDERS.filter((order) => {
            const matchSearch = order.id
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchStatus =
                statusFilter === "ALL" || order.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const totalAmount = filteredOrders.reduce(
        (sum, o) => sum + o.total,
        0
    );

    return (
        <div className={styles.page}>
            {/* 🔥 HEADER */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div>
                        <h2>My Orders & Invoices</h2>
                        <p>Track, view & download your invoices</p>
                    </div>

                    <input
                        className={styles.search}
                        placeholder="Search by Invoice ID"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className={styles.headerBottom}>
                    {/* FILTERS */}
                    <div className={styles.filters}>
                        {["ALL", "PAID", "PENDING"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`${styles.chip} ${statusFilter === s ? styles.active : ""
                                    }`}
                            >
                                {s === "ALL" ? "All" : s}
                            </button>
                        ))}
                    </div>

                    {/* STATS */}
                    <div className={styles.stats}>
                        <div>
                            <span>Total Orders</span>
                            <strong>{filteredOrders.length}</strong>
                        </div>
                        <div>
                            <span>Total Amount</span>
                            <strong>₹{totalAmount.toLocaleString()}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div className={styles.list}>
                {filteredOrders.length === 0 ? (
                    <div className={styles.empty}>
                        No invoices found
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <InvoiceOrderCard key={order.id} order={order} />
                    ))
                )}
            </div>
        </div>
    );
}
