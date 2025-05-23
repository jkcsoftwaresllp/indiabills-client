import { useState, useEffect } from "react";
import DivAnimate from "../../../components/Animate/DivAnimate";
import { getData, updateStuff } from "../../../network/api";
import { useStore } from "../../../store/store";
import Switch from "@mui/material/Switch";

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("general");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceTemplate, setInvoiceTemplate] = useState<string>("Short");

  const [primaryColor, setPrimaryColor] = useState("#1e2938");
  const [accentColor, setAccentColor] = useState("#c42032");

  useEffect(() => {
    // Fetch the theme colors from the backend
    const fetchThemeColors = async () => {
      try {
        const data = await getData("/settings/theme/colors");
        setPrimaryColor(data.primary);
        setAccentColor(data.accent);

        // Apply colors to CSS variables
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
      // Update colors in the backend
      const res = await updateStuff("/settings/theme/colors", {
        primaryColor,
        accentColor,
      });

      if (res === 200) {
        // Apply colors to CSS variables
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

  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(() => {
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
        setPaymentMethods(data as string[]);
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      }
    };

    fetchPaymentMethods();

    // Retrieve invoice template from localStorage
    const savedTemplate = localStorage.getItem("invoiceTemplate");
    if (savedTemplate) {
      setInvoiceTemplate(savedTemplate);
    }
  }, []);

  const handlePaymentMethodChange = (method: string) => {
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

  const handleInvoiceTemplateChange = (template: string) => {
    setInvoiceTemplate(template);
    localStorage.setItem("invoiceTemplate", template);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "general":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">General Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                <option>GMT</option>
                <option>PST</option>
                <option>EST</option>
              </select>
            </div>
          </div>
        );
      case "account":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="********"
              />
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Theme
              </label>
              <select className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notifications
              </label>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-emerald-600"
                  />
                  <span className="ml-2 text-gray-700">Email Notifications</span>
                </label>
              </div>
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-emerald-600"
                  />
                  <span className="ml-2 text-gray-700">SMS Notifications</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Methods
              </label>
              <div className="mt-1 space-y-2">
                {availablePaymentMethods.map((method) => (
                  <label key={method} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-emerald-600"
                      checked={paymentMethods.includes(method)}
                      onChange={() => handlePaymentMethodChange(method)}
                      disabled={!isEditing}
                    />
                    <span className="ml-2 text-gray-700 capitalize">
                      {method}
                    </span>
                  </label>
                ))}
              </div>
              <div>
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <span>Enable Page Animations</span>
                <Switch
                  checked={animationsEnabled}
                  onChange={handleAnimationToggle}
                  color="emerald"
                  className="ml-2"
                />
              </label>
            </div>
              <div className="mt-4">
                {isEditing ? (
                  <button
                    className="bg-emerald-500 text-white py-2 px-4 rounded-md"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="bg-emerald-500 text-white py-2 px-4 rounded-md"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            {/* Invoice Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Template
              </label>
              <div className="mt-1 space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-emerald-600"
                    name="invoiceTemplate"
                    value="Short"
                    checked={invoiceTemplate === "Short"}
                    onChange={() => handleInvoiceTemplateChange("Short")}
                  />
                  <span className="ml-2 text-gray-700">Short</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-5 w-5 text-emerald-600"
                    name="invoiceTemplate"
                    value="Comprehensive"
                    checked={invoiceTemplate === "Comprehensive"}
                    onChange={() => handleInvoiceTemplateChange("Comprehensive")}
                  />
                  <span className="ml-2 text-gray-700">Comprehensive</span>
                </label>
              </div>
            </div>

            {/* Theme Color Customization */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="mt-1 w-16 h-10 p-0 border-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Accent Color
            </label>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="mt-1 w-16 h-10 p-0 border-none"
            />
          </div>
          <button onClick={handleColorChange} className="bg-emerald-500 text-white py-2 px-4 rounded-md mt-4">
            Save Colors
          </button>

          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DivAnimate className="w-full p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 flex">
        {/* Sidebar */}
        <div className="w-1/4 border-r border-gray-200 pr-4">
          <h1 className="text-3xl text-emerald-500 mb-6">Settings</h1>
          <ul className="space-y-4">
            <li>
              <button
                className={`w-full text-left py-2 px-4 rounded-md ${
                  selectedSection === "general"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedSection("general")}
              >
                General
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left py-2 px-4 rounded-md ${
                  selectedSection === "account"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedSection("account")}
              >
                Account
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left py-2 px-4 rounded-md ${
                  selectedSection === "preferences"
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedSection("preferences")}
              >
                Preferences
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="w-3/4 pl-6">{renderSection()}</div>
      </div>
    </DivAnimate>
  );
};

export default Settings;