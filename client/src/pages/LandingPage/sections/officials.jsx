import React from 'react'
import style from '@styles/landingpage.module.scss'

const officials = [
    {
        name: "Leester Q. Cruspero",
        title: "Chairman",
        img: '/'
    },
    {
        name: "Clifford A. Casquejo",
        title: "Chairman",
        img: ''
    },
    {
        name: "Lelanie Andales",
        title: "Chairman",
        img: ''
    },
    {
        name: "Demi Wilkinson",
        title: "Chairman",
        img: ''
    },
    {
        name: "Gon Killue",
        title: "Chairman",
        img: ''
    },
    {
        name: "Natalie Yuz",
        title: "Chairman",
        img: ''
    },
    {
        name: "Natalie Yuz",
        title: "Chairman",
        img: ''
    },
    {
        name: "Natalie Yuz",
        title: "Chairman",
        img: ''
    },
]

const Officials = () => {
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

                <div className={style.officials_grid}>
                    {officials.map((person, index) => (
                        <div className={style.profile} key={index}>
                            <img
                                src={person.img || '/default-profile.png'}
                                alt={`${person.name}'s profile`}
                            />
                            <h3>{person.name}</h3>
                            <h5>{person.title}</h5>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Officials
