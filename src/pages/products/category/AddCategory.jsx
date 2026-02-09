import React from "react";
import { useForm } from "react-hook-form";
import styles from "./styles/AddCategory.module.css";

function AddCategory() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const image = watch("image");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    console.log("Category Data:", data);
    // 👉 API call here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Category Name */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Category Name *</label>
        <input
          type="text"
          placeholder="e.g. Footwear"
          className={`${styles.fieldInput} ${
            errors.name ? styles.error : ""
          }`}
          {...register("name", {
            required: "Category name is required",
          })}
        />
        {errors.name && (
          <span className={styles.errorMsg}>{errors.name.message}</span>
        )}
      </div>

      {/* Description */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Description</label>
        <textarea
          placeholder="Describe this category..."
          className={`${styles.fieldInput} ${styles.textArea}`}
          {...register("description")}
        />
      </div>

      {/* Image Upload */}
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Category Image</label>
        <input
          type="file"
          accept="image/*"
          className={styles.fieldInput}
          {...register("image")}
        />

        {image && image.length > 0 && (
          <span className={styles.helperText}>
            Selected: {image[0].name}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: "1.5rem" }}>
        <button type="submit" className={styles.primaryButton}>
          Create Category
        </button>
      </div>
    </form>
  );
}

export default AddCategory;
