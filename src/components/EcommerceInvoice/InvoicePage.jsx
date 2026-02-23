import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceItemCard from "./InvoiceItemCard";
import InvoicePriceDetails from "./InvoicePriceDetails";
import styles from "./styles/InvoicePage.module.css";
import { getInvoice } from "../../network/api";

export default function InvoicePage() {
  const { id } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!id) {
          setError('Invoice ID is required');
          return;
        }

        const response = await getInvoice(id);
        
        if (response.status === 200 && response.data?.data) {
          setInvoiceData(response.data.data);
        } else {
          setError('Failed to load invoice details');
        }
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError(err.message || 'Failed to load invoice');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p>Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#d32f2f' }}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p>No invoice data available</p>
        </div>
      </div>
    );
  }

  const { invoice, order, payment } = invoiceData;

  // Transform items for display
  const items = order?.items?.map((item, index) => {
    // Use total_without_tax if available (already multiplied by qty), otherwise calculate
    const totalPrice = item.total_without_tax || (item.sale_price * item.quantity);
    return {
      id: item.order_item_id || index,
      brand: "Unknown",
      name: item.product_name || "Product",
      variant: item.variant || "N/A",
      sku: item.sku || "N/A",
      category: "Product",
      price: item.sale_price || 0,
      qty: item.quantity || 1,
      discount: item.discount || 0,
      cgst: item.cgst || 0,
      sgst: item.sgst || 0,
      cess: item.cess || 0,
      returnEligible: true,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E",
    };
  }) || [];

  // Calculate total amount same as price details: subtotal - discount + shipping
  const subtotalAmount = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = items.reduce((s, i) => s + (i.discount || 0), 0);
  const shippingAmount = 0;
  const totalAmount = subtotalAmount - discountAmount + shippingAmount;

  const invoiceStatus = payment?.payment_status === 'completed' || payment?.payment_status === 'paid' 
    ? 'PAID' 
    : 'PENDING';

  const invoiceDate = invoice?.invoice_date 
    ? new Date(invoice.invoice_date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'N/A';

  return (
    <div className={styles.page}>
      <InvoiceHeader
        invoiceId={invoice?.invoice_number || id}
        date={invoiceDate}
        status={invoiceStatus}
        totalAmount={totalAmount}
      />

      <div className={styles.body}>
        <div className={styles.items}>
          {items.length > 0 ? (
            items.map((item) => (
              <InvoiceItemCard key={item.id} item={item} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              No items in this invoice
            </div>
          )}
        </div>

        <InvoicePriceDetails items={items} invoiceData={invoiceData} />
      </div>
    </div>
  );
}
