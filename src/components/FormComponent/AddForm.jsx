import React, { useState, useCallback } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiCheck } from 'react-icons/fi';
import PageAnimate from "../Animate/PageAnimate";
import MultiPageAnimate from "../Animate/MultiPageAnimate";
import styles from './AddForm.module.css';

/**
 * Reusable AddForm Component
 * 
 * Props:
 * - title: Title to display (e.g., "New Customer", "New User Setup")
 * - steps: Array of step names
 * - pages: Array of page components to render
 * - formData: Current form data object
 * - handleChange: Function to handle input changes
 * - errors: Object with field errors
 * - onSubmit: Function to call on final submission
 * - onNavigate: (optional) Custom navigation handler
 * - validatePage: Function to validate current page, returns boolean
 * - successMessage: Success message to show after submission
 * - isSubmitting: Boolean to disable submit button during submission
 */
const AddForm = React.memo(({
  title,
  steps,
  pages,
  formData,
  handleChange,
  errors,
  onSubmit,
  validatePage,
  isSubmitting = false,
  onError,
  successMessage = "Registered successfully!"
}) => {
  const [page, setPage] = useState(1);
  const totalPages = pages.length;

  const backPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      if (validatePage(page)) {
        setPage(page + 1);
      } else {
        onError?.("Please fix the errors before proceeding");
      }
    }
  }, [page, totalPages, validatePage, onError]);

  const handleSubmit = async () => {
    if (!validatePage(page)) {
      onError?.("Please fix the validation errors!");
      return;
    }
    await onSubmit?.();
  };

  return (
    <PageAnimate>
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            {/* Left Side - Progress & Info */}
            <div className={styles.leftSide}>
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <h2>{title}</h2>
                  <span className={styles.stepCounter}>{page}/{totalPages}</span>
                </div>

                <div className={styles.stepsVertical}>
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`${styles.stepItem} ${page === idx + 1 ? styles.active : ''} ${page > idx + 1 ? styles.completed : ''}`}
                    >
                      <div className={styles.stepCircle}>
                        {page > idx + 1 ? <FiCheck /> : idx + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className={styles.rightSide}>
              <div className={styles.formCard}>
                {pages[page - 1]}

                <div className={styles.formFooter}>
                  {page > 1 && (
                    <button className={styles.prevBtn} onClick={backPage}>
                      <FiArrowLeft />
                      <span>Back</span>
                    </button>
                  )}
                  {page === totalPages ? (
                    <button
                      className={styles.submitBtn}
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      <FiCheckCircle />
                      <span>{isSubmitting ? 'Processing...' : 'Complete Registration'}</span>
                    </button>
                  ) : (
                    <button className={styles.nextBtn} onClick={nextPage}>
                      <span>Continue</span>
                      <FiArrowRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageAnimate>
  );
});

AddForm.displayName = "AddForm";

export default AddForm;
