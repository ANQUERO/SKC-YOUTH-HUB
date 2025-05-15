// components/AuthSteps/StepWrapper.jsx
import { useState } from "react";
import Step1 from "./personalDetails.jsx";
import Step2 from "./email.jsx";
import Step3 from "./credentials.jsx";

const StepWrapper = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    organization: "",
    position: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  switch (step) {
    case 1:
      return <Step1 next={nextStep} handleChange={handleChange} data={formData} />;
    case 2:
      return <Step2 next={nextStep} prev={prevStep} handleChange={handleChange} data={formData} />;
    case 3:
      return <Step3 prev={prevStep} handleChange={handleChange} data={formData} />;
    default:
      return <div>Completed!</div>;
  }
};

export default StepWrapper;
