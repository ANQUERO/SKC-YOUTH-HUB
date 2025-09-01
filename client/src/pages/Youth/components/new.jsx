import React, { useEffect, useState } from 'react'
import useYouth from '@hooks/useYouth'
import usePurok from '@hooks/usePurok';

const AddYouth = () => {
    const {
        storeYouth,
        loading,
        error,
        success
    } = useYouth();
    const { fetcPuroks } = usePurok();
    const [puroks, setPuroks] = useState([]);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: {
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: ''
        },
        location: {
            region: '',
            province: '',
            municipality: '',
            barangay: '',
            purok_id: ''
        },
        gender: {
            gender: ''
        },
        info: {
            age: '',
            contact: '',
            birthday: '',
        },
        demographics: {
            civil_status: '',
            youth_age_gap: '',
            youth_classification: '',
            educational_background: '',
            work_status: ''
        },
        survey: {
            registered_voter: false,
            registered_national_voter: false,
            vote_last_election: false
        },
        meetingSurvey: {
            attended: false,
            times_attended: '',
            reason_not_attend: ''
        },
        attachments: [],
        household: null
    });

    useEffect(() => {
        const getPuroks = async () => {
            try {
                const data = await fetcPuroks();
                setPuroks(data);
            } catch (error) {
                console.error('Error fetching Puroks', error);
            }
        };
        getPuroks();
    }, []);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target

        const getUpdate = (groupKey, subKey, updateValue) => ({
            [groupKey]: prev => ({
                ...prev,
                [groupKey]: {
                    ...prev[groupKey],
                    [subKey]: updateValue
                }
            })
        });

        const updateFormData = (updater) => {
            setFormData(prev => {
                const updates = typeof updater === 'function' ? updater(prev) : updater;
                return {
                    ...prev,
                    ...Object.entries(updates).reduce((acc, [key, update]) => {
                        acc[key] = typeof update === 'function' ? update(prev) : update;
                        return acc;
                    }, {})
                };
            });
        };

        if (name.includes('.')) {
            const [group, subKey] = name.split('.');

            if (group === 'gender') {
                updateFormData({
                    gender: {
                        gender: value
                    }
                });
            } else {
                const finalValue = subKey === 'purok_id'
                    ? (value ? parseInt(value, 10) : null)
                    : getValue();
                updateFormData(getUpdate(group, subKey, finalValue));
            }
        } else {
            updateFormData({
                [name]: getValue()
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await storeYouth(formData)
    }


    return (
        <section>
            <h2>Add youth</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>First Name</label>
                    <input
                        name="name.first_name"
                        value={formData.name.first_name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Last Name</label>
                    <input
                        name="name.last_name"
                        value={formData.name.last_name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Suffix</label>
                    <input
                        name="name.suffix"
                        value={formData.name.suffix}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Gender</label>
                    <input
                        name="gender.gender"
                        value={formData.gender.gender}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Age</label>
                    <input
                        name="info.age"
                        value={formData.info.age}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Contact</label>
                    <input
                        name="info.contact"
                        value={formData.info.contact}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Birthday</label>
                    <input
                        name="info.birthday"
                        value={formData.info.birthday}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Region</label>
                    <input
                        name="location.region"
                        value={formData.location.region}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Province</label>
                    <input
                        name="location.province"
                        value={formData.location.province}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Barangay</label>
                    <input
                        name="location.barangay"
                        value={formData.location.barangay}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Purok</label>
                    <select
                        name="location.purok_id"
                        value={formData.location.purok_id || ''}
                        onChange={handleChange}
                    >
                        <option value="">Select Purok</option>
                        {puroks.map(purok => (
                            <option
                                key={purok.purok_id}
                                value={purok.purok_id}
                            >
                                {purok.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Civil Status</label>
                    {[
                        "Single", "Married", "Widowed", "Divorced",
                        "Separated", "Annulled", "Live-in", "Unkown"
                    ].map((status) => (
                        <div
                            key={status}
                        >
                            <label>
                                <input
                                    type='checkbox'
                                    name="demographics.civil_status"
                                    value={formData.demographics.civil_status}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    ))}

                </div>

                <div>
                    <label>Youth Age Gap</label>
                    {[
                        "Child Youth (16-17 years old)",
                        "Core Youth (18-24 years old)",
                        "Young Adult (25-30 years old)",
                    ].map((group) => (
                        <div key={group}>
                            <label>
                                <input
                                    type='checkbox'
                                    name="demographics.youth_age_gap"
                                    value={formData.demographics.youth_age_gap}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    ))
                    }

                </div>

                <div>
                    <label>Youth Classification</label>
                    {[
                        "In school youth",
                        "Out of school youth",
                        "Working school youth",
                        "Youth w/ Specific needs",
                        "Person w/ Disability",
                        "Children in Conflict w/ Law",
                        "Indigenous people"
                    ].map((classification) => (
                        <label>
                            <input
                                type='checkbox'
                                name="demographics.youth_classification"
                                value={formData.demographics.youth_classification}
                                onChange={handleChange}
                            />
                        </label>
                    ))
                    }

                </div>

                <div>
                    <label>Educational Background</label>
                    {[
                        "Elementary Level",
                        "Elementary Graduate",
                        "High School Level",
                        "High School Graduate",
                        "Vocational Graduate",
                        "College Level",
                        "College Graduate",
                        "Master's Level",
                        "Master's Graduate",
                        "Doctorate Level",
                        "Doctorate Graduate"
                    ].map((education) => (
                        <div key={education}>
                            <label>
                                <input
                                    type='checkbox'
                                    name="demographics.educational_background"
                                    value={formData.demographics.educational_background}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    ))}
                </div>

                <div>
                    <label>Work status</label>
                    {[
                        "Employed",
                        "Unemployed",
                        "Self-Employed",
                        "Currently looking for a job",
                        "Not interested looking for a job"
                    ].map((workspace) => (
                        <div key={workspace}>
                            <label>
                                <input
                                    type='checkbox'
                                    name="demographics.youth_classification"
                                    value={formData.demographics.youth_classification}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                    ))
                    }
                </div>

                <div>
                    <label htmlFor="">Registered Voter</label>
                    {[
                        "Yes",
                        "No",
                    ].map((voter) => (
                        <div key={voter}>
                            <label>
                                <input
                                    type='radio'
                                    name="survey.registered_voter"
                                    value={voter}
                                    checked={formData.survey.registered_voter === voter}
                                    onChange={handleChange}
                                />
                                {voter}
                            </label>
                        </div>
                    ))
                    }
                </div>

                <div>
                    <label htmlFor="">Registered National Voter</label>
                    {[
                        "Yes",
                        "No",
                    ].map((national) => (
                        <div key={national}>
                            <label>
                                <input
                                    type='radio'
                                    name="survey.registered_national_voter"
                                    value={national}
                                    checked={formData.survey.registered_national_voter === national}
                                    onChange={handleChange}
                                />
                                {national}
                            </label>
                        </div>
                    ))
                    }
                </div>

                <div>
                    <label htmlFor="">Vote last election</label>
                    {[
                        "Yes",
                        "No",
                    ].map((last) => (
                        <div key={last}>
                            <label>
                                <input
                                    type='radio'
                                    name="survey.vote_last_election"
                                    value={last}
                                    checked={formData.survey.vote_last_election === last}
                                    onChange={handleChange}
                                />
                                {last}
                            </label>
                        </div>
                    ))
                    }
                </div>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
</svg>



            </form>


        </section >
    )
}

export default AddYouth