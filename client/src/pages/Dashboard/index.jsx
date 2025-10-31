// Dashboard.jsx
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
  Bar,
  LineChart,
  Line
} from 'recharts';
import {
  Users,
  UserCheck,
  BarChart3,
  MapPin,
  Download,
  Filter,
  MoreVertical,
  TrendingUp,
  UserPlus,
  FileText,
  Shield
} from 'lucide-react';
import style from '@styles/dashboard.module.scss';
import useDashboard from '@hooks/useDashboard';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={style.customTooltip}>
        <p>{`${label}: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
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

  // Calculate totals for stats cards
  const totalResidents = (dashboardData.purok_stats || []).reduce((sum, purok) => 
    sum + (Number(purok.total_residents) || 0), 0
  );

  const totalVoters = Number(dashboardData.registered_voters) || 0;
  const totalYouths = Number(dashboardData.total_youths) || 0;
  const maleCount = (dashboardData.gender_stats || []).find(g => g.gender === 'male')?.total || 0;
  const femaleCount = (dashboardData.gender_stats || []).find(g => g.gender === 'female')?.total || 0;

  // Chart data
  const voterRegistrationData = [
    { name: 'Registered', value: Number(dashboardData.registered_voters) || 0 },
    { name: 'Unregistered', value: Number(dashboardData.unregistered_voters) || 0 },
  ];

  const genderData = (dashboardData.gender_stats || []).map(g => ({
    name: g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
    value: Number(g.total) || 0
  }));

  const purokData = (dashboardData.purok_stats || []).map(p => ({
    name: p.purok,
    residents: Number(p.total_residents) || 0,
    voters: Number(p.registered_voters) || 0
  }));

  const ageDistributionData = [
    { age: '15-20', count: 45 },
    { age: '21-25', count: 68 },
    { age: '26-30', count: 52 },
    { age: '31-35', count: 38 },
    { age: '36-40', count: 25 }
  ];

  // Mock recent activity data
  const recentActivities = [
    {
      id: 1,
      title: 'New youth registration',
      description: 'Juan Dela Cruz registered as a new youth member',
      time: '2 minutes ago',
      type: 'success',
      icon: <UserPlus size={16} />
    },
    {
      id: 2,
      title: 'Voter status updated',
      description: 'Maria Santos voter status changed to registered',
      time: '1 hour ago',
      type: 'info',
      icon: <UserCheck size={16} />
    },
    {
      id: 3,
      title: 'Monthly report generated',
      description: 'August 2024 youth demographic report',
      time: '3 hours ago',
      type: 'warning',
      icon: <FileText size={16} />
    },
    {
      id: 4,
      title: 'System maintenance',
      description: 'Regular system update completed',
      time: '5 hours ago',
      type: 'info',
      icon: <Shield size={16} />
    }
  ];

  // Check if chart data is available
  const hasVoterData = voterRegistrationData.length > 0 && voterRegistrationData.some(item => item.value > 0);
  const hasGenderData = genderData.length > 0 && genderData.some(item => item.value > 0);
  const hasPurokData = purokData.length > 0 && purokData.some(item => item.residents > 0 || item.voters > 0);

  if (loading) {
    return (
      <div className={style.dashboard}>
        <div className={style.loadingState}>
          <div>Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.dashboard}>
      {/* Header */}
      <div className={style.dashboardHeader}>
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your community today.</p>
      </div>

      {error && (
        <div className={style.errorState}>
          Error loading dashboard data: {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className={style.statsGrid}>
        <div className={`${style.statCard} ${style.voters}`}>
          <div className={`${style.statIcon} ${style.voters}`}>
            <UserCheck size={24} />
          </div>
          <div className={style.statValue}>{totalVoters.toLocaleString()}</div>
          <div className={style.statLabel}>Registered Voters</div>
          <div className={`${style.statTrend} ${style.positive}`}>
            <TrendingUp size={14} />
            <span>12% increase</span>
          </div>
        </div>

        <div className={`${style.statCard} ${style.youths}`}>
          <div className={`${style.statIcon} ${style.youths}`}>
            <Users size={24} />
          </div>
          <div className={style.statValue}>{totalYouths.toLocaleString()}</div>
          <div className={style.statLabel}>Total Youths</div>
          <div className={`${style.statTrend} ${style.positive}`}>
            <TrendingUp size={14} />
            <span>8% increase</span>
          </div>
        </div>

        <div className={`${style.statCard} ${style.gender}`}>
          <div className={`${style.statIcon} ${style.gender}`}>
            <BarChart3 size={24} />
          </div>
          <div className={style.statValue}>
            {((maleCount / (maleCount + femaleCount)) * 100 || 0).toFixed(1)}% M
          </div>
          <div className={style.statLabel}>Gender Distribution</div>
          <div className={`${style.statTrend} ${style.positive}`}>
            <TrendingUp size={14} />
            <span>Balanced</span>
          </div>
        </div>

        <div className={`${style.statCard} ${style.purok}`}>
          <div className={`${style.statIcon} ${style.purok}`}>
            <MapPin size={24} />
          </div>
          <div className={style.statValue}>{totalResidents.toLocaleString()}</div>
          <div className={style.statLabel}>Total Residents</div>
          <div className={`${style.statTrend} ${style.positive}`}>
            <TrendingUp size={14} />
            <span>5% increase</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={style.chartsSection}>
        <div className={style.mainCharts}>
          {/* Voter Registration */}
          <div className={style.chartCard}>
            <div className={style.chartHeader}>
              <h3>Voter Registration Status</h3>
              <div className={style.chartActions}>
                <button title="Download">
                  <Download size={16} />
                </button>
                <button title="Filter">
                  <Filter size={16} />
                </button>
              </div>
            </div>
            <div className={style.chartContainer}>
              {hasVoterData ? (
                <ResponsiveContainer width="100%" height={250} minWidth={0}>
                  <PieChart>
                    <Pie
                      data={voterRegistrationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {voterRegistrationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className={style.chartLoading}>No voter data available</div>
              )}
            </div>
          </div>

          {/* Gender Distribution */}
          <div className={style.chartCard}>
            <div className={style.chartHeader}>
              <h3>Gender Distribution</h3>
              <div className={style.chartActions}>
                <button title="Download">
                  <Download size={16} />
                </button>
              </div>
            </div>
            <div className={style.chartContainer}>
              {hasGenderData ? (
                <ResponsiveContainer width="100%" height={250} minWidth={0}>
                  <BarChart data={genderData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className={style.chartLoading}>No gender data available</div>
              )}
            </div>
          </div>

          {/* Residents per Purok */}
          <div className={`${style.chartCard} ${style.large}`}>
            <div className={style.chartHeader}>
              <h3>Residents & Voters by Purok</h3>
              <div className={style.chartActions}>
                <button title="Download">
                  <Download size={16} />
                </button>
                <button title="Filter">
                  <Filter size={16} />
                </button>
              </div>
            </div>
            <div className={style.chartContainer}>
              {hasPurokData ? (
                <ResponsiveContainer width="100%" height={300} minWidth={0}>
                  <BarChart data={purokData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
                    <Legend />
                    <Bar dataKey="residents" name="Total Residents" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="voters" name="Registered Voters" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className={style.chartLoading}>No purok data available</div>
              )}
            </div>
          </div>
        </div>

        <div className={style.sideCharts}>
          {/* Age Distribution */}
          <div className={style.chartCard}>
            <div className={style.chartHeader}>
              <h3>Youth Age Distribution</h3>
              <div className={style.chartActions}>
                <button title="More options">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
            <div className={style.chartContainer}>
              <ResponsiveContainer width="100%" height={250} minWidth={0}>
                <LineChart data={ageDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Count']} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={style.recentActivity}>
            <div className={style.activityHeader}>
              <h3>Recent Activity</h3>
            </div>
            <div className={style.activityList}>
              {recentActivities.map(activity => (
                <div key={activity.id} className={style.activityItem}>
                  <div className={style.activityIcon}>
                    {activity.icon}
                  </div>
                  <div className={style.activityContent}>
                    <div className={style.activityTitle}>{activity.title}</div>
                    <div className={style.activityDescription}>{activity.description}</div>
                    <div className={style.activityTime}>{activity.time}</div>
                  </div>
                  <div className={`${style.activityBadge} ${style[activity.type]}`}>
                    {activity.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;