import React from 'react';
import {
    PieChart,
    BarChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    CartesianGrid,
    YAxis,
    XAxis,
    Bar
} from 'recharts';
import style from '@styles/dashboard.module.scss';

// Data
const voterRegistrationData = [
    { name: 'Registered', value: 250 },
    { name: 'Unregistered', value: 200 },
];

const purokPopulationData = [
    { name: 'Purok 1', value: 120 },
    { name: 'Purok 2', value: 180 },
    { name: 'Purok 3', value: 95 },
    { name: 'Purok 4', value: 130 },
    { name: 'Purok 5', value: 110 },
    { name: 'Purok 6', value: 165 },
];

const totalYouths = [
    { name: 'Youths', value: 450 }
];

const COLORS = ['#4ade80', '#f87171'];

// Custom Tooltip for Bar Chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className={style.customTooltip}>
                <p>{`${label}: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const DashBoard = () => {
    return (
        <div className={style.dashboard}>
            <h1>Hello Leester</h1>
            <p>Keep voters engaged, post updates, and manage data with ease.</p>

            <div className={style.charts}>
                {/* Voter Registration */}
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

                {/* Population by Purok */}
                <div className={style.chart_card}>
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

                {/* Total Youths */}
                <div className={style.chart_card}>
                    <h2>Total Youths</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={totalYouths}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="value" barSize={40} fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
