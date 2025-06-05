import { useState, useEffect } from "react";
import DivAnimate from "../../../components/Animate/DivAnimate";
import { getData, updateStuff } from "../../../network/api";
import { useStore } from "../../../store/store";
import Switch from "@mui/material/Switch";
import styles from "./Settings.module.css";

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("general");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceTemplate, setInvoiceTemplate] = useState("Short");

  const [primaryColor, setPrimaryColor] = useState("#1e2938");
  const [accentColor, setAccentColor] = useState("#c42032");

  useEffect(() => {
    const fetchThemeColors = async () => {
      try {
        const data = await getData("/settings/theme/colors");
        setPrimaryColor(data.primary);
        setAccentColor(data.accent);

        document.documentElement.style.setProperty("--color-primary", data.primary);
        document.documentElement.style.setProperty("--color-accent", data.accent);
      } catch (err) {
        console.error("Error fetching theme colors:", err);
        errorPopup("Failed to load theme colors");
      }
    };

    fetchThemeColors();
  }, []);

  const handleColorChange = async () => {
    try {
      const res = await updateStuff("/settings/theme/colors", {
        primaryColor,
        accentColor,
      });

      if (res === 200) {
        document.documentElement.style.setProperty("--color-primary", primaryColor);
        document.documentElement.style.setProperty("--color-accent", accentColor);

        successPopup("Theme colors updated successfully");
      } else {
        errorPopup("Error updating theme colors");
      }
    } catch (err) {
      console.error("Error updating theme colors:", err);
      errorPopup("Error updating theme colors");
    }
  };

  const { successPopup, errorPopup } = useStore();

  const availablePaymentMethods = ["cash", "upi", "card", "credit"];

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    const saved = localStorage.getItem("animationsEnabled");
    return saved ? JSON.parse(saved) : true;
  });

  const handleAnimationToggle = () => {
    setAnimationsEnabled((prev) => {
      localStorage.setItem("animationsEnabled", JSON.stringify(!prev));
      return !prev;
    });
  };

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const data = await getData("/settings/payment/methods");
        setPaymentMethods(data);
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      }
    };

    fetchPaymentMethods();

    const savedTemplate = localStorage.getItem("invoiceTemplate");
    if (savedTemplate) {
      setInvoiceTemplate(savedTemplate);
    }
  }, []);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethods((prevMethods) =>
      prevMethods.includes(method)
        ? prevMethods.filter((m) => m !== method)
        : [...prevMethods, method]
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (paymentMethods.length === 0) {
      errorPopup("Please select at least one payment method");
      return;
    }

    const res = await updateStuff("/settings/payment/methods", {
      paymentMethods,
    });

    if (res === 200) {
      successPopup("Payment methods updated successfully");
      setIsEditing(false);
    } else {
      errorPopup("Error updating payment methods");
    }
  };

  const handleInvoiceTemplateChange = (template) => {
    setInvoiceTemplate(template);
    localStorage.setItem("invoiceTemplate", template);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "general":
        return (
        <div className={styles.sectionWrapper}>
          <h2 className={styles.sectionTitle}>General Settings</h2>
          <div>
            <label className={styles.label}>Language</label>
            <select className={styles.select}>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>Timezone</label>
            <select className={styles.select}>
              <option>GMT</option>
              <option>PST</option>
              <option>EST</option>
            </select>
          </div>
        </div>
      );
      case "account":
        return (
        <div className={styles.sectionWrapper}>
          <h2 className={styles.sectionTitle}>Account Settings</h2>
          <div>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              className={styles.input}
              placeholder="********"
            />
          </div>
        </div>
      );
      case "preferences":
          return (
        <div className={styles.sectionWrapper}>
          <h2 className={styles.sectionTitle}>Preferences</h2>
          <div>
            <label className={styles.label}>Theme</label>
            <select className={styles.select}>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
          <div>
            <label className={styles.label}>Notifications</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.checkboxText}>Email Notifications</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.checkboxText}>SMS Notifications</span>
              </label>
            </div>
          </div>
          <div>
            <label className={styles.label}>Payment Methods</label>
            <div className={styles.checkboxGroup}>
              {availablePaymentMethods.map((method) => (
                <label key={method} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={paymentMethods.includes(method)}
                    onChange={() => handlePaymentMethodChange(method)}
                    disabled={!isEditing}
                  />
                  <span className={styles.checkboxText}>{method}</span>
                </label>
              ))}
            </div>
            <div>
              <label className={styles.labelRow}>
                <span>Enable Page Animations</span>
                <Switch
                  checked={animationsEnabled}
                  onChange={handleAnimationToggle}
                  color="emerald"
                  className={styles.switch}
                />
              </label>
            </div>
            <div className={styles.buttonWrapper}>
              {isEditing ? (
                <button className={styles.primaryButton} onClick={handleSave}>
                  Save
                </button>
              ) : (
                <button className={styles.primaryButton} onClick={handleEdit}>
                  Edit
                </button>
              )}
            </div>
          </div>
          <div>
            <label className={styles.label}>Invoice Template</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  className={styles.radio}
                  name="invoiceTemplate"
                  value="Short"
                  checked={invoiceTemplate === "Short"}
                  onChange={() => handleInvoiceTemplateChange("Short")}
                />
                <span className={styles.radioText}>Short</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  className={styles.radio}
                  name="invoiceTemplate"
                  value="Comprehensive"
                  checked={invoiceTemplate === "Comprehensive"}
                  onChange={() => handleInvoiceTemplateChange("Comprehensive")}
                />
                <span className={styles.radioText}>Comprehensive</span>
              </label>
            </div>
          </div>
          <div>
            <label className={styles.label}>Primary Color</label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className={styles.colorPicker}
            />
          </div>
          <div>
            <label className={styles.label}>Accent Color</label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className={styles.colorPicker}
            />
          </div>
          <button onClick={handleColorChange} className={styles.primaryButton}>
            Save Colors
          </button>
        </div>
      );
    default:
      return null;
  }
};

return (
  <DivAnimate className={styles.pageWrapper}>
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h1 className={styles.sidebarTitle}>Settings</h1>
        <ul className={styles.navList}>
          <li>
            <button
              className={`${styles.navButton} ${selectedSection === "general" ? styles.active : styles.inactive}`}
              onClick={() => setSelectedSection("general")}
            >
              General
            </button>
          </li>
          <li>
            <button
              className={`${styles.navButton} ${selectedSection === "account" ? styles.active : styles.inactive}`}
              onClick={() => setSelectedSection("account")}
            >
              Account
            </button>
          </li>
          <li>
            <button
              className={`${styles.navButton} ${selectedSection === "preferences" ? styles.active : styles.inactive}`}
              onClick={() => setSelectedSection("preferences")}
            >
              Preferences
            </button>
          </li>
        </ul>
      </div>
      <div className={styles.content}>{renderSection()}</div>
    </div>
  </DivAnimate>
);

};

export default Settings;

