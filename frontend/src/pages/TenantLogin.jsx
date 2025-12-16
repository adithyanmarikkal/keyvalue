import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function TenantLogin() {
    const [contact, setContact] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.tenantLogin({ contact });
            if (response.data.success) {
                // Store tenant info in localStorage
                localStorage.setItem('tenant', JSON.stringify(response.data.tenant));
                localStorage.setItem('userType', 'tenant');
                navigate('/tenant-dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'No tenant found with this contact number');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, hsl(142, 76%, 45%) 0%, hsl(170, 70%, 50%) 100%)',
            padding: '2rem'
        }}>
            <div className="card fade-in" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="text-center mb-3">
                    <h1 style={{
                        background: 'linear-gradient(135deg, hsl(142, 76%, 45%) 0%, hsl(170, 70%, 50%) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '0.5rem'
                    }}>
                        Tenant Portal
                    </h1>
                    <p className="text-muted">Login to view your dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Contact Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            placeholder="Enter your registered contact number"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            required
                            autoFocus
                            pattern="[0-9]{10}"
                            title="Please enter a 10-digit contact number"
                        />
                        <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                            Enter the 10-digit contact number registered with the PG
                        </p>
                    </div>

                    {error && (
                        <div className="text-error mb-2" style={{
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid var(--error)'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-success"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="mt-3 text-center">
                        <a
                            href="/"
                            style={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.875rem'
                            }}
                        >
                            ← Back to Owner Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TenantLogin;
