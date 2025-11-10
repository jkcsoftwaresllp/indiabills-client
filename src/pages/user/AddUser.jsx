import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiUploadCloud } from 'react-icons/fi';
import React, { useState, useCallback } from "react";
import MultiPageAnimate from "../../components/Animate/MultiPageAnimate";
import InputBox from "../../components/FormComponent/InputBox";
import Dropdown from "../../components/FormComponent/Dropdown";
import PageAnimate from "../../components/Animate/PageAnimate";
import { createUser, uploadUserImage } from "../../network/api";
import { useStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Timeline from "../../components/FormComponent/Timeline";
import { Button, Input, CircularProgress } from "@mui/material";

const AddUser = () => {
  const { successPopup, errorPopup } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    re_enter_password: '',
    username: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    phone: '',
    job_title: '',
    department: '',
    avatar_url: '',
    role: 'customer'
  });
  const [page, setPage] = useState(1);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const backPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const nextPage = useCallback(() => {
    if (page < 3) {
      setPage(page + 1);
    }
  }, [page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.re_enter_password) newErrors.re_enter_password = 'Please confirm password';
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.role) newErrors.role = 'Role is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Must be a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Must be at least 8 characters long';
    }

    // Password confirmation
    if (formData.password !== formData.re_enter_password) {
      newErrors.re_enter_password = 'Passwords do not match';
    }

    // Username validation (optional but if provided)
    if (formData.username && formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Phone validation (optional but if provided)
    if (formData.phone && !/^(\+)?[1-9]\d{6,14}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Invalid phone number (7-15 digits)';
    }

    // Avatar URL validation (optional but if provided)
    if (formData.avatar_url && !/^https?:\/\/.+/.test(formData.avatar_url)) {
      newErrors.avatar_url = 'Invalid avatar URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      errorPopup('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorPopup('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadUserImage(file);
      
      if (response.status === 200) {
        const imageUrl = response.data.imageUrl || response.data.url;
        setFormData(prev => ({
          ...prev,
          avatar_url: imageUrl
        }));
        successPopup('Image uploaded successfully');
      } else {
        errorPopup(response.data?.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      errorPopup('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!validateForm()) {
      errorPopup("Please fix the validation errors!");
      return;
    }

    try {
      const response = await createUser(formData);
      
      if (response.status === 201 || response.status === 200) {
        successPopup("User registered successfully!");
        navigate('/users');
      } else {
        const errorMessage = response.data?.message || "Failed to register the user";
        errorPopup(errorMessage);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      errorPopup("Failed to register the user");
    }
  };

  const steps = ["Basic Info", "Contact Details", "Role & Department"];

  return (
    <PageAnimate>
      <div className={"h-full flex flex-col gap-12 justify-center items-center"}>
        <button className={"self-start flex items-center"} onClick={() => navigate(-1)}>
          <FiArrowLeft /> Go back
        </button>

        <h1 className="text-2xl rounded-lg lowercase transition hover:shadow-lg p-4 text-center w-3/4 idms-transparent-bg font-extrabold">
          register a new<span className={"text-rose-400"}> user</span> :)
        </h1>

        <Timeline steps={steps} currentStep={page} />

        <div>
          <div className={"h-full w-full flex justify-center"}>
            <main>
              {page === 1 && <BasicPage formData={formData} handleChange={handleChange} errors={errors} />}
              {page === 2 && <ContactPage formData={formData} handleChange={handleChange} errors={errors} handleImageUpload={handleImageUpload} uploading={uploading} />}
              {page === 3 && <RolePage formData={formData} setFormData={setFormData} handleChange={handleChange} errors={errors} />}
            </main>

            <div className={"p-2 flex flex-col gap-4"}>
              {page === 3 && <button className="p-3 flex-grow shadow-xl form-button-submit" onClick={submit}> <FiCheckCircle /></button>}
              {page < 3 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={nextPage}> <FiArrowRight /></button>}
              {page >= 2 && <button className="p-3 flex-grow shadow-xl form-button-nav" onClick={backPage}> <FiArrowLeft /></button>}
            </div>
          </div>
        </div>
      </div>
    </PageAnimate>
  );
};

export default AddUser;

const BasicPage = React.memo(({ formData, handleChange, errors }) => {
  return (
    <MultiPageAnimate>
      <div className="p-8 flex flex-col items-center gap-8 idms-bg">
        <main className="grid grid-cols-2 gap-6">
          <div>
            <InputBox 
              name="first_name" 
              type="string" 
              label="First Name" 
              placeholder="John" 
              value={formData.first_name} 
              onChange={handleChange} 
              required 
            />
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
          </div>
          <div>
            <InputBox 
              name="last_name" 
              type="string" 
              label="Last Name" 
              placeholder="Doe" 
              value={formData.last_name} 
              onChange={handleChange} 
              required 
            />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          </div>
          <div>
            <InputBox 
              name="middle_name" 
              type="string" 
              label="Middle Name" 
              placeholder="Michael" 
              value={formData.middle_name} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <InputBox 
              name="username" 
              type="string" 
              label="Username" 
              placeholder="johndoe123" 
              value={formData.username} 
              onChange={handleChange} 
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div>
            <InputBox 
              name="password" 
              type="password" 
              label="Password" 
              placeholder="*********" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <InputBox 
              name="re_enter_password" 
              type="password" 
              label="Confirm Password" 
              placeholder="*********" 
              value={formData.re_enter_password} 
              onChange={handleChange} 
              required 
            />
            {errors.re_enter_password && <p className="text-red-500 text-sm mt-1">{errors.re_enter_password}</p>}
          </div>
        </main>
      </div>
    </MultiPageAnimate>
  );
});

BasicPage.displayName = 'BasicPage';

const ContactPage = React.memo(({ formData, handleChange, errors, handleImageUpload, uploading }) => {
  return (
    <MultiPageAnimate>
      <div className="p-8 flex flex-col items-center gap-8 idms-bg">
        <main className="grid grid-cols-2 gap-6">
          <div>
            <InputBox 
              name="email" 
              type="email" 
              label="Email" 
              placeholder="john.doe@example.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <InputBox 
              name="phone" 
              type="string" 
              label="Phone Number" 
              placeholder="+1-555-123-4567" 
              value={formData.phone} 
              onChange={handleChange} 
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <InputBox 
              name="avatar_url" 
              type="url" 
              label="Avatar URL" 
              placeholder="https://example.com/avatar.png" 
              value={formData.avatar_url} 
              onChange={handleChange} 
            />
            {errors.avatar_url && <p className="text-red-500 text-sm mt-1">{errors.avatar_url}</p>}
          </div>
          <div className="col-span-2">
            <label className="label-custom">Upload Avatar</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              sx={{ display: 'none' }}
              id="avatar-upload-add"
            />
            <label htmlFor="avatar-upload-add">
              <Button
                variant="outlined"
                component="span"
                startIcon={uploading ? <CircularProgress size={20} /> : <FiUploadCloud />}
                disabled={uploading}
                fullWidth
              >
                {uploading ? 'Uploading...' : 'Upload Avatar Image'}
              </Button>
            </label>
          </div>
        </main>
      </div>
    </MultiPageAnimate>
  );
});

ContactPage.displayName = 'ContactPage';

const RolePage = React.memo(({ formData, setFormData, handleChange, errors }) => {
  const roleOptions = ["admin", "manager", "operator", "customer"];
  
  return (
    <MultiPageAnimate>
      <div className="p-8 flex flex-col items-center gap-8 idms-bg">
        <main className="grid grid-cols-2 gap-6">
          <div>
            <Dropdown 
              name="role" 
              label="Role" 
              options={roleOptions} 
              selectedData={formData} 
              setValue={setFormData} 
            />
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>
          <div>
            <InputBox 
              name="job_title" 
              type="string" 
              label="Job Title" 
              placeholder="Software Engineer" 
              value={formData.job_title} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <InputBox 
              name="department" 
              type="string" 
              label="Department" 
              placeholder="Engineering" 
              value={formData.department} 
              onChange={handleChange} 
            />
          </div>
        </main>
      </div>
    </MultiPageAnimate>
  );
});

RolePage.displayName = 'RolePage';