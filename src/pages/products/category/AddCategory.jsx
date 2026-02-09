import { FiArrowLeft, FiTag, FiFileText } from 'react-icons/fi';
import React, { useState, useCallback, useEffect } from "react";
import MultiPageAnimate from "../../../components/Animate/MultiPageAnimate";
import AddForm from "../../../components/FormComponent/AddForm";
import { createCategory, getCategories } from "../../../network/api/Category";
import { useStore } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import styles from "./styles/AddCategory.module.css";

const AddCategory = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();
  const [parentCategories, setParentCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    // parent_id: "", // TODO: Enable for hierarchical categories
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: Fetch parent categories on mount - Enable for hierarchical categories
  // useEffect(() => {
  //   const loadParentCategories = async () => {
  //     const categories = await getCategories();
  //     if (Array.isArray(categories)) {
  //       setParentCategories(categories);
  //     }
  //   };
  //   loadParentCategories();
  // }, []);

  const validateCurrentStep = useCallback((pageNum) => {
    const newErrors = {};

    if (pageNum === 1) {
      // Step 1: Basic Information
      if (!formData.name?.trim()) {
        newErrors.name = "Category name is required";
      }
      if (formData.name && formData.name.length > 255) {
        newErrors.name = "Category name must be under 255 characters";
      }
      if (formData.code && formData.code.length > 50) {
        newErrors.code = "Category code must be under 50 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const submit = async () => {
    if (!validateCurrentStep(1)) {
      errorPopup("Please fix validation errors!");
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        code: formData.code?.trim() || null,
        // parent_id: formData.parent_id ? parseInt(formData.parent_id) : null, // TODO: Enable for hierarchical categories
      };

      const response = await createCategory(categoryData);

      if (response.status === 201 || response.status === 200) {
        successPopup("Category created successfully!");
        setTimeout(() => navigate("/products"), 500);
      } else {
        errorPopup(response.data?.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      errorPopup("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ["Basic Info", "Additional Details"];

  const pages = [
    <BasicPage
      key="basic"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
      // parentCategories={parentCategories} // TODO: Enable for hierarchical categories
    />,
    <DetailsPage
      key="details"
      formData={formData}
      handleChange={handleChange}
      errors={errors}
    />,
  ];

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ padding: "0.4rem 1.5rem 0rem 1.5rem" }}>
        <button
          className={styles.backButton}
          onClick={() => navigate(-1)}
          title="Go back"
        >
          <FiArrowLeft />
        </button>
      </div>
      <AddForm
        title="Create New Category"
        steps={steps}
        pages={pages}
        formData={formData}
        handleChange={handleChange}
        errors={errors}
        onSubmit={submit}
        validatePage={validateCurrentStep}
        isSubmitting={isSubmitting}
        onError={errorPopup}
      />
    </div>
  );
};

export default AddCategory;

const BasicPage = React.memo(
  ({ formData, handleChange, errors }) => {
    // parentCategories // TODO: Enable for hierarchical categories
    return (
      <MultiPageAnimate>
        <div className={styles.formContent}>
          <div className={styles.pageHeader}>
            <FiTag className={styles.pageIcon} />
            <h1>Category Information</h1>
            <p>Create a new product category</p>
          </div>

          <div className={styles.fieldGrid}>
            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label className={styles.fieldLabel}>Category Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Electronics, Clothing, Home Decor"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.fieldInput} ${
                  errors.name ? styles.error : ""
                }`}
              />
              {errors.name && (
                <span className={styles.errorMsg}>{errors.name}</span>
              )}
            </div>

            <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
              <label className={styles.fieldLabel}>Description</label>
              <textarea
                name="description"
                placeholder="Provide a brief description of this category..."
                value={formData.description}
                onChange={handleChange}
                className={`${styles.fieldInput} ${styles.textArea}`}
                rows="4"
              />
              <small className={styles.fieldHint}>
                Optional: Help your team understand what belongs in this category
              </small>
            </div>

            {/* TODO: Parent Category - Enable hierarchical categories in future
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Parent Category</label>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className={`${styles.fieldInput} ${styles.selectInput}`}
              >
                <option value="">None (Top-level category)</option>
                {parentCategories && parentCategories.length > 0 ? (
                  parentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No parent categories available</option>
                )}
              </select>
              <small className={styles.fieldHint}>
                Optional: Create sub-categories under existing ones
              </small>
            </div>
            */}
          </div>
        </div>
      </MultiPageAnimate>
    );
  }
);

BasicPage.displayName = "BasicPage";

const DetailsPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className={styles.formContent}>
        <div className={styles.pageHeader}>
          <FiFileText className={styles.pageIcon} />
          <h1>Additional Details</h1>
          <p>Optional information for organization and integration</p>
        </div>

        <div className={styles.fieldGrid}>
          <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
            <label className={styles.fieldLabel}>Category Code</label>
            <input
              type="text"
              name="code"
              placeholder="e.g., ELEC, CLTH, HOME"
              value={formData.code}
              onChange={handleChange}
              className={`${styles.fieldInput} ${
                errors.code ? styles.error : ""
              }`}
              maxLength="50"
            />
            {errors.code && (
              <span className={styles.errorMsg}>{errors.code}</span>
            )}
            <small className={styles.fieldHint}>
              Optional: A short code for internal use or system integration
            </small>
          </div>


        </div>
      </div>
    </MultiPageAnimate>
  );
});

DetailsPage.displayName = "DetailsPage";
