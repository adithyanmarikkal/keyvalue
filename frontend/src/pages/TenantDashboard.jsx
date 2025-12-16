import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintForm from '../components/ComplaintForm';

function TenantDashboard() {
    const navigate = useNavigate();
    const [tenant, setTenant] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if tenant is logged in
        const tenantData = localStorage.getItem('tenant');
        const userType = localStorage.getItem('userType');

        if (!tenantData || userType !== 'tenant') {
            navigate('/tenant-login');
            return;
        }

        const parsedTenant = JSON.parse(tenantData);
        setTenant(parsedTenant);
        fetchComplaints(parsedTenant.tenant_id);
    }, [navigate]);

    const fetchComplaints = async (tenantId) => {
        try {
            setLoading(true);
            const response = await complaintsAPI.getByTenant(tenantId);
            setComplaints(response.data.data);
        } catch (err) {
            setError('Failed to fetch complaints');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterComplaint = async (complaintData) => {
        try {
            await complaintsAPI.create(complaintData);
            await fetchComplaints(tenant.tenant_id);
            setShowComplaintForm(false);
        } catch (err) {
            setError('Failed to register complaint');
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('tenant');
        localStorage.removeItem('userType');
        navigate('/tenant-login');
    };

    if (!tenant) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const rentStatusColor = tenant.rent_status === 'Paid' ? 'var(--success)' : 'var(--error)';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            {/* Header */}
            <header style={{
                background: 'linear-gradient(135deg, hsl(142, 76%, 45%) 0%, hsl(170, 70%, 50%) 100%)',
                padding: '1.5rem 2rem',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div className="container" style={{ maxWidth: '1400px' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 style={{ margin: 0, color: 'white' }}>Tenant Dashboard</h1>
                            <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                                Welcome, {tenant.name}
                            </p>
                        </div>
                        <button className="btn btn-secondary" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="container" style={{ maxWidth: '1400px', paddingTop: '2rem' }}>
                {/* Info Cards */}
                <div className="grid grid-cols-3 mb-3">
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, hsl(250, 85%, 60%) 0%, hsl(250, 85%, 50%) 100%)',
                        border: 'none'
                    }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '2rem' }}>Room {tenant.room_number}</h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.9)' }}>Your Room</p>
                    </div>

                    <div className="card" style={{
                        background: `linear-gradient(135deg, ${rentStatusColor} 0%, ${rentStatusColor} 100%)`,
                        border: 'none'
                    }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '2rem' }}>
                            ₹{parseFloat(tenant.monthly_rent || 0).toLocaleString('en-IN')}
                        </h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.9)' }}>
                            Monthly Rent - {tenant.rent_status}
                        </p>
                        {tenant.last_payment_date && (
                            <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                                Last paid: {new Date(tenant.last_payment_date).toLocaleDateString('en-IN')}
                            </p>
                        )}
                    </div>

                    <div className="card" style={{
                        background: 'linear-gradient(135deg, hsl(280, 70%, 55%) 0%, hsl(280, 70%, 45%) 100%)',
                        border: 'none'
                    }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '2rem' }}>
                            {complaints.filter(c => c.status === 'Pending').length}
                        </h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.9)' }}>Pending Complaints</p>
                    </div>
                </div>

                {/* Rent Status Alert */}
                {tenant.rent_status === 'Pending' && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--error)',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}>
                        <p style={{ color: 'var(--error)', margin: 0, fontWeight: '600' }}>
                            ⚠️ Your rent payment is pending. Please contact the owner.
                        </p>
                    </div>
                )}

                {/* Complaints Section */}
                <div className="card mb-3">
                    <div className="flex justify-between items-center">
                        <h2 style={{ margin: 0 }}>My Complaints</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowComplaintForm(true)}
                        >
                            ➕ Register Complaint
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="text-error mb-2" style={{
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        border: '1px solid var(--error)'
                    }}>
                        {error}
                    </div>
                )}

                {/* Complaints List */}
                {loading ? (
                    <div className="flex items-center" style={{ justifyContent: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="card text-center" style={{ padding: '4rem' }}>
                        <h3 className="text-muted">No complaints registered yet</h3>
                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => setShowComplaintForm(true)}
                        >
                            Register Your First Complaint
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2">
                        {complaints.map(complaint => (
                            <ComplaintCard
                                key={complaint.complaint_id}
                                complaint={complaint}
                                isAdmin={false}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Complaint Form Modal */}
            {showComplaintForm && (
                <div className="modal-overlay" onClick={() => setShowComplaintForm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <ComplaintForm
                            tenantId={tenant.tenant_id}
                            roomNumber={tenant.room_number}
                            onSubmit={handleRegisterComplaint}
                            onCancel={() => setShowComplaintForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default TenantDashboard;
