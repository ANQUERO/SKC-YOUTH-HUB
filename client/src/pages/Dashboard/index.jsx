import React, { useEffect } from 'react';
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
import useDashboard from '@hooks/useDashboard'

const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#fbbf24', '#a78bfa', '#f472b6'];

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
    const {
        dashboardData,
        fetchTotalVoters,
        fetchTotalGender,
        fetchResidentsPerPurok,
        loading,
        error
    } = useDashboard();

    useEffect(() => {
        fetchTotalVoters();
        fetchTotalGender();
        fetchResidentsPerPurok();
    }, []);




    const voterRegistrationData = [
        {
            name: 'Registered',
            value: Number(dashboardData.registered_voters) || 0
        },
        {
            name: 'Unregistered',
            value: Number(dashboardData.unregistered_voters) || 0
        },
    ];

    const totalYouths = [
        {
            name: 'Youths',
            value: Number(dashboardData.total_youths) || 0

        }
    ]

    const totalGender = (dashboardData.gender_stats || []).map(g => ({
        name: g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
        value: Number(g.total) || 0
    }));

    const residentsPerPurok = (dashboardData.purok_stats || []).map(p => ({
        name: p.purok,
        value: Number(p.total_residents) || 0
    }));

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
                                    <Cell key={`cell-voter-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className={style.chart_card}>
                    <h2>Gender</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={totalGender}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {totalGender.map((entry, index) => (
                                    <Cell key={`cell-gender-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className={style.chart_card}>
                    <h2>Residents per Purok</h2>
                    <ResponsiveContainer width="100%" height={310}>
                        <PieChart>
                            <Pie
                                data={residentsPerPurok}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {residentsPerPurok.map((entry, index) => (
                                    <Cell key={`cell-purok-${index}`} fill={COLORS[index % COLORS.length]} />
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
            {loading && <p>Loading..</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default DashBoard;
