import { useState } from 'react'
import Step1 from './index'

const StepWrapper = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(
        prev => prev + 1
    );
    const prevStep = () => setStep(
        prev => prev - 1
    );


    const handleChange = (field, value) => {
        setFormDate(prev => ({
            ...prev, [field]: value
        }));
    }

    switch (step) {
        case 1:
            return <Step1 next={nextStep} handleChange={handleChange} />
        case 2:
            return
        case 3:
            return
        default:
            break;
    }
    return <div>Completed!</div>

}

export default StepWrapper