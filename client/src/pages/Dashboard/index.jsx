import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import style from '@styles/dashboard.module.scss'


const voterRegistrationData = [
    { name: 'Registered', value: 650 },
    { name: 'Unregistered', value: 350 },
];

const genderData = [
    { name: 'Male', value: 500 },
    { name: 'Female', value: 500 },
];


const purokPopulationData = [
    { name: 'Purok 1', value: 120 },
    { name: 'Purok 2', value: 180 },
    { name: 'Purok 3', value: 95 },
    { name: 'Purok 4', value: 130 },
    { name: 'Purok 5', value: 110 },
    { name: 'Purok 6', value: 165 },
];

const COLORS = ['#4ade80', '#f87171'];

const DashBoard = () => {
    return (
        <div className={style.dashboard}>
            <h1>Hello Leester</h1>
            <p>Keep voters engaged, post updates, and manage data with ease.</p>

            <div className={style.charts}>
                <div className={style.chart_card}>
                    <h2>Voter Registration</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={voterRegistrationData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {voterRegistrationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className={style.chart_card}>
                    <h2>Gender Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={genderData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h2>Population by Purok</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={purokPopulationData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {purokPopulationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div >
    );
};

export default DashBoard;
