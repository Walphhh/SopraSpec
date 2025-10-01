"use client";

import { useEffect, useState } from "react";
import { Pencil, Upload } from "lucide-react";

export default function MyAccountPage() {
  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    profilePicture: "",
  });
  const [isModified, setIsModified] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    // TODO: Mock loading user profile (replace with API call later)
    const userData = {
      firstName: "Test",
      lastName: "User",
      email: "yest.user@email.com",
    };
    setForm(userData);
  }, []);

  const fields = [
    { key: "firstName", label: "First Name", required: true },
    { key: "lastName", label: "Last Name", required: true },
    { key: "email", label: "Email", required: true },
  ];

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setIsModified(true);
    setError("");
    setMissingFields((prev) => prev.filter((f) => f !== key));
  };

  const handleSave = () => {
    const missing: string[] = [];
    for (const f of fields) {
      if (f.required && !form[f.key]?.trim()) {
        missing.push(f.key);
      }
    }

    if (missing.length > 0) {
      setError("Please fill in all required fields");
      setMissingFields(missing);
      return;
    }

    alert("Profile updated!");
    setIsModified(false);
    setError("");
    setMissingFields([]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-2">My Account</h2>
      <h5 className="text-left mb-6 -ml-30">Profile Information</h5>

      <div className="space-y-4">
        {fields.map((f) => {
          const isError = missingFields.includes(f.key);
          return (
            <div key={f.key} className="flex items-center space-x-4">
              <label className="w-40 font-semibold text-[#0072CE] text-left">
                {f.label}{" "}
                {f.required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  "(optional)"
                )}
                :
              </label>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={form[f.key] || ""}
                  placeholder={`Enter ${f.label}`}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  onFocus={() => setFocusedField(f.key)}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full border-2 rounded p-2 pr-10 outline-none bg-transparent transition-colors ${
                    isError
                      ? "border-red-500 text-red-500"
                      : "border-[#7C878E] text-[#7C878E] focus:border-[#0072CE] focus:text-[#0072CE]"
                  }`}
                />
                <Pencil
                  size={18}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    focusedField === f.key
                      ? "text-[#0072CE]"
                      : isError
                      ? "text-red-500"
                      : "text-[#7C878E]"
                  }`}
                />
              </div>
            </div>
          );
        })}

        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <label className="w-40 font-semibold text-[#0072CE] text-left">
            Profile Picture (optional):
          </label>

          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const imageUrl = URL.createObjectURL(file);
                handleChange("profilePicture", imageUrl);
              }
            }}
          />

          <label
            htmlFor="profile-upload"
            className="flex items-center justify-center w-48 px-4 py-2 bg-[#E2E2E2] text-[#7C878E] rounded cursor-pointer hover:bg-[#0072CE] hover:text-white transition"
          >
            <Upload className="mr-2" size={18} /> Upload Image
          </label>

          {form.profilePicture && (
            <img
              src={form.profilePicture}
              alt="Profile preview"
              className="ml-2 w-20 h-20 object-cover rounded-full border"
            />
          )}
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {/* Save button */}
        <button
          className={`px-6 py-3 font-bold rounded text-white ${
            isModified
              ? "bg-[#0072CE] hover:bg-[#005fa3]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!isModified}
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
