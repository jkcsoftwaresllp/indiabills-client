import { ArrowLeft } from 'lucide-react';
import styles from './styles/CheckoutHeader.module.css';

export default function CheckoutHeader({ currentStep = 'address', onBack }) {
  const steps = [
    { id: 'address', label: 'Address', order: 1 },
    { id: 'payment', label: 'Payment', order: 2 },
  ];

  return (
    <div className={styles.header}>
      <div className={styles.top}>
        <button className={styles.backBtn} onClick={onBack} title="Back to Cart">
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.spacer} />
      </div>

      <div className={styles.stepIndicator}>
        {steps.map((step, idx) => (
          <div key={step.id} className={styles.stepWrapper}>
            <div className={`${styles.step} ${currentStep === step.id ? styles.active : ''} ${steps.findIndex(s => s.id === currentStep) > idx ? styles.completed : ''}`}>
              {steps.findIndex(s => s.id === currentStep) > idx ? '✓' : step.order}
            </div>
            <span className={styles.stepLabel}>{step.label}</span>
            {idx < steps.length - 1 && <div className={styles.divider} />}
          </div>
        ))}
      </div>
    </div>
  );
}
