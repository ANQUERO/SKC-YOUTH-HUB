import React from 'react';
import style from '@styles/landingpage.module.scss';
import { MapPin, Phone, Clock } from 'lucide-react';

const Location = () => {
    return (
        <section className={style.location}>
            <div className={style.container}>

                <div className={style.textContent}>
                    <h2 className={style.heading}>Find Us Here</h2>
                    <p className={style.subheading}>
                        We’re located right at the heart of Catarman. Drop by or reach out!
                    </p>

                    <div className={style.info}>
                        <div className={style.infoItem}>
                            <MapPin size={20} className={style.icon} />
                            <span>Catarman Barangay Hall, Cordova, Cebu , Philippines</span>
                        </div>
                        <div className={style.infoItem}>
                            <Phone size={20} className={style.icon} />
                            <span>+63 912 345 6789</span>
                        </div>
                        <div className={style.infoItem}>
                            <Clock size={20} className={style.icon} />
                            <span>Mon–Fri: 8:00 AM – 5:00 PM</span>
                        </div>
                    </div>

                </div>

                <div className={style.mapWrapper}>
                    <div className={style.mapResponsive}>
                        <div className={style.mapContainer}>
                            <iframe
                                title="Google Map - Catarman Barangay Hall"
                                className={style.mapFrame}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Catarman%20Barangay%20Hall&t=p&z=5&ie=UTF8&iwloc=B&output=embed"
                            ></iframe>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Location;
