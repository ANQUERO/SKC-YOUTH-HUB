import { useState } from "react";
import Step1 from "./personalDetails.jsx";
import Step3 from "./credentials.jsx";

const data = [];

const StepWrapper = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  switch (step) {
    case 1:
      return <Step1 next={nextStep} handleChange={handleChange} data={data} />;
    case 2:
      return <Step3 prev={prevStep} handleChange={handleChange} data={data} />;
    default:
      return <div>Completed!</div>;
  }
};

export default StepWrapper;
