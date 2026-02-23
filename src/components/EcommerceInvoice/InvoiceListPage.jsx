import { useMemo, useState, useEffect } from "react";
import InvoiceOrderCard from "./InvoiceOrderCard";
import styles from "./styles/InvoiceListPage.module.css";
import { getCustomerOrders } from "../../network/api";

export default function InvoiceListPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    // Fetch customer orders from backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await getCustomerOrders();
                
                // Handle response structure - data.data.data for orders array
                const ordersList = response.data?.data?.data || response.data?.data || [];
                
                if (response.status === 200 && Array.isArray(ordersList)) {
                    // Transform backend orders to card format
                    const transformedOrders = ordersList.map((order) => ({
                        id: order.id,
                        invoiceId: order.invoice_id,
                        paymentId: order.payment_id,
                        date: order.order_date ? new Date(order.order_date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        }) : 'N/A',
                        itemsCount: order.order_items_count || 0,
                        total: parseFloat(order.total_amount) || 0,
                        status: order.payment_status === 'paid' ? 'PAID' : 'PENDING',
                        paymentMethod: order.payment_method || 'N/A',
                        orderStatus: order.order_status,
                    }));
                    
                    setOrders(transformedOrders);
                } else {
                    setError('Failed to load orders');
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.message || 'Failed to load orders');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    /* 🔥 FILTER LOGIC */
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchSearch = (order.id?.toString() || '')
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchStatus =
                statusFilter === "ALL" || order.status === statusFilter;

            return matchSearch && matchStatus;
        });
    }, [orders, search, statusFilter]);

    const totalAmount = filteredOrders.reduce(
        (sum, o) => sum + o.total,
        0
    );

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            <h2>My Orders & Invoices</h2>
                            <p>Track, view & download your invoices</p>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p>Loading your invoices...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            <h2>My Orders & Invoices</h2>
                            <p>Track, view & download your invoices</p>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#d32f2f' }}>
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

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
                        {orders.length === 0 ? 'No invoices yet' : 'No invoices found'}
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <InvoiceOrderCard 
                            key={order.id} 
                            order={order}
                            invoiceId={order.invoiceId}
                            paymentId={order.paymentId}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
