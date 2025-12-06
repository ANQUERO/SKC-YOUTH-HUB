import { useState } from "react";
import PersonalDetails from "./personalDetails.jsx";
import Credentials from "./credentials.jsx";
import useSignupAdmin from "@hooks/useSignupAdmin.jsx";

const StepWrapper = () => {
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    organization: "",
    position: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "admin",
  });

  const { signupAdmin, loading, errors } = useSignupAdmin();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError(""); // Clear error when user makes changes
  };

  const handleSubmit = async () => {
    const { confirmPassword, role, ...rest } = formData;

    const submitData = {
      ...rest,
      role: [role],
    };

    try {
      const success = await signupAdmin(submitData);
      return success;
    } catch (error) {
      setSubmitError(error.message || "Signup failed. Please try again.");
      return false;
    }
  };

  switch (step) {
    case 1:
      return (
        <PersonalDetails
          next={nextStep}
          handleChange={handleChange}
          data={formData}
          errors={errors}
        />
      );
    case 2:
      return (
        <Credentials
          prev={prevStep}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          data={formData}
          loading={loading}
          errors={{ ...errors, submit: submitError }}
        />
      );
    default:
      return <div>Registration complete!</div>;
  }
};

export default StepWrapper;