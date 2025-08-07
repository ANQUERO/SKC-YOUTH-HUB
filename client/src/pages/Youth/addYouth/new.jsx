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
                    <input
                        name="demographics.youth_age_gap"
                        value={formData.demographics.youth_age_gap}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Youth Classification</label>
                    <input
                        name="demographics.youth_classification"
                        value={formData.demographics.youth_classification}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Educational Background</label>
                    <input
                        name="demographics.educational_background"
                        value={formData.demographics.educational_background}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Work status</label>
                    <input
                        name="demographics.youth_classification"
                        value={formData.demographics.youth_classification}
                        onChange={handleChange}
                    />
                </div>



            </form>


        </section >
    )
}

export default AddYouth