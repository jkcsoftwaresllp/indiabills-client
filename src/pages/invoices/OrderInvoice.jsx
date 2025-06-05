import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { useEffect, useState } from "react";
import ShortInvoiceTemplate from "./templates/Short";
import ComprehensiveInvoiceTemplate from "./templates/Comprehensive";
import { useNavigate, useParams } from "react-router-dom";
import { getData, getRequest } from "../../network/api";
import styles from './OrderInvoice.module.css';

const OrderInvoice = () => {
    const { orderId } = useParams();
    const [invoiceInfo, setInvoiceInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [initials, setInitials] = useState("");
    const [organization, setOrganization] = useState({});

    useEffect(() => {
        const fetchFormDetails = async () => {
            const ini = await getData("/settings/initials");
            setInitials(ini);
        };
        fetchFormDetails();
    }, []);

    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const data = await getRequest(`/organization`);
                setOrganization(data);
            } catch (error) {
                console.error("Error fetching organization details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganization();
    }, []);

    const TemplateType = localStorage.getItem('invoiceTemplate') || 'short';

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await getRequest(`/invoices/order/${orderId}`);
                setInvoiceInfo(data);
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Invoice',
                text: `Invoice for Order ID: ${invoiceInfo?.orderId}`,
                url: window.location.href,
            }).catch((error) => console.error('Error sharing:', error));
        } else {
            alert('Share feature is not supported in your browser.');
        }
    };

    
if (loading) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}>Loading...</div>
    </div>
  );
}

if (!invoiceInfo) {
  return (
    <div className={styles.container}>
      <h6 className={styles.heading}>Order not found</h6>
    </div>
  );
}

return (
  <main className={styles.main}>
    <section id="controls" className={styles.controls}>
      <button onClick={() => navigate(-1)} className={styles.btnPrimary}>
        Go Back
      </button>
      <button onClick={handlePrint} className={styles.btnPrimary}>
        <PrintIcon />
      </button>
      <button onClick={handleShare} className={styles.btnPrimaryGreen}>
        <ShareIcon />
      </button>
    </section>

    <section id="invoice">
      {TemplateType === 'short' ? (
        <ShortInvoiceTemplate invoice={invoiceInfo} Organization={organization} />
      ) : (
        <ComprehensiveInvoiceTemplate initials={initials} invoice={invoiceInfo} organization={organization} />
      )}
    </section>
  </main>
);
};

export default OrderInvoice;
