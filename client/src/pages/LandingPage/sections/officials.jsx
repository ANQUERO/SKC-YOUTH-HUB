import React, { useState, useEffect } from 'react'
import axiosInstance from '@lib/axios'
import style from '@styles/landingpage.module.scss'

const Officials = () => {
    const [officials, setOfficials] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchOfficials()
    }, [])

    const fetchOfficials = async () => {
        try {
            setLoading(true)
            setError(null)
            const { data } = await axiosInstance.get('/api/public/officials')
            if (data.status === 'Success') {
                setOfficials(data.data || [])
            } else {
                setError('Failed to load officials')
            }
        } catch (err) {
            console.error('Error fetching officials:', err)
            setError('Failed to load officials')
            // Fallback to empty array on error
            setOfficials([])
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id='officials' className={style.officials}>
            <div className={style.container}>
                <div className={style.contents}>
                    <h1 className={style.title}>
                        Meet the Catarman SK Officials
                    </h1>
                    <p className={style.description}>
                        Our philosophy is simple — We use technology to track voters,
                        ensure transparency, and engage the youth. Our core values:
                        transparency, engagement, accountability.
                    </p>
                </div>

                {loading ? (
                    <div className={style.loading}>
                        <p>Loading officials...</p>
                    </div>
                ) : error ? (
                    <div className={style.error}>
                        <p>{error}</p>
                    </div>
                ) : officials.length === 0 ? (
                    <div className={style.noOfficials}>
                        <p>No officials available at this time.</p>
                    </div>
                ) : (
                    <div className={style.officials_grid}>
                        {officials.map((person) => (
                            <div className={style.profile} key={person.id}>
                                <img
                                    src={person.img || '/default-profile.png'}
                                    alt={`${person.name}'s profile`}
                                    onError={(e) => {
                                        e.target.src = '/default-profile.png'
                                    }}
                                />
                                <h3>{person.name}</h3>
                                <h5>{person.title}</h5>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Officials
