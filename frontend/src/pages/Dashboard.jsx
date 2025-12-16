import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tenantsAPI } from '../services/api';
import TenantCard from '../components/TenantCard';
import TenantForm from '../components/TenantForm';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState(null); // For delete confirmation

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const response = await tenantsAPI.getAll();
            setTenants(response.data.data);
        } catch (err) {
            setError('Failed to fetch tenants');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTenant = async (formData) => {
        try {
            await tenantsAPI.create(formData);
            await fetchTenants();
            setShowModal(false);
            setEditingTenant(null);
        } catch (err) {
            setError('Failed to add tenant');
            console.error(err);
        }
    };

    const handleUpdateTenant = async (formData) => {
        try {
            await tenantsAPI.update(editingTenant.tenant_id, formData);
            await fetchTenants();
            setShowModal(false);
            setEditingTenant(null);
        } catch (err) {
            setError('Failed to update tenant');
            console.error(err);
        }
    };

    const handleDeleteTenant = async (tenant) => {
        setDeleteConfirmation(tenant);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmation) return;

        try {
            await tenantsAPI.delete(deleteConfirmation.tenant_id);
            await fetchTenants();
            setDeleteConfirmation(null);
        } catch (err) {
            setError('Failed to delete tenant');
            console.error(err);
            setDeleteConfirmation(null);
        }
    };
    const handleEdit = (tenant) => {
        setEditingTenant(tenant);
        setShowModal(true);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const filteredTenants = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.contact.includes(searchTerm)
    );

    const totalDeposit = tenants.reduce((sum, tenant) => sum + parseFloat(tenant.deposit || 0), 0);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            {/* Header */}
            <header style={{
                background: 'var(--gradient-primary)',
                padding: '1.5rem 2rem',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div className="container" style={{ maxWidth: '1400px' }}>
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 style={{ margin: 0, color: 'white' }}>PG Maintenance Dashboard</h1>
                            <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
                                Welcome, {user?.name || 'Admin'}
                            </p>
                        </div>
                        <button className="btn btn-secondary" onClick={handleLogout}>
                            🚪 Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="container" style={{ maxWidth: '1400px', paddingTop: '2rem' }}>
                {/* Statistics */}
                <div className="grid grid-cols-3 mb-3">
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, hsl(250, 85%, 60%) 0%, hsl(250, 85%, 50%) 100%)',
                        border: 'none'
                    }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '2.5rem' }}>{tenants.length}</h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.9)' }}>Total Tenants</p>
                    </div>
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, hsl(142, 76%, 45%) 0%, hsl(142, 76%, 35%) 100%)',
                        border: 'none'
                    }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '2.5rem' }}>
                            ₹{totalDeposit.toLocaleString('en-IN')}
                        </h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.9)' }}>Total Deposits</p>
                    </div>
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, hsl(280, 70%, 55%) 0%, hsl(280, 70%, 45%) 100%)',
                        border: 'none'
                    }}>
                        <h3 style={{ margin: 0, color: 'white', fontSize: '2.5rem' }}>
                            {new Set(tenants.map(t => t.room_number)).size}
                        </h3>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.9)' }}>Occupied Rooms</p>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="card mb-3">
                    <div className="flex justify-between items-center gap-2">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="🔍 Search by name, room, or contact..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ flex: 1, margin: 0 }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingTenant(null);
                                setShowModal(true);
                            }}
                        >
                            ➕ Add New Tenant
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

                {/* Tenants Grid */}
                {loading ? (
                    <div className="flex items-center" style={{ justifyContent: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                    </div>
                ) : filteredTenants.length === 0 ? (
                    <div className="card text-center" style={{ padding: '4rem' }}>
                        <h3 className="text-muted">
                            {searchTerm ? 'No tenants found matching your search' : 'No tenants yet'}
                        </h3>
                        {!searchTerm && (
                            <button
                                className="btn btn-primary mt-2"
                                onClick={() => setShowModal(true)}
                            >
                                Add Your First Tenant
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-3">
                        {filteredTenants.map(tenant => (
                            <TenantCard
                                key={tenant.tenant_id}
                                tenant={tenant}
                                onEdit={handleEdit}
                                onDelete={handleDeleteTenant}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <TenantForm
                            tenant={editingTenant}
                            onSubmit={editingTenant ? handleUpdateTenant : handleAddTenant}
                            onCancel={() => {
                                setShowModal(false);
                                setEditingTenant(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="modal-overlay" onClick={() => setDeleteConfirmation(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <h2 style={{ marginBottom: '1rem', color: 'var(--error)' }}>⚠️ Confirm Delete</h2>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            Are you sure you want to delete <strong>{deleteConfirmation.name}</strong> from Room {deleteConfirmation.room_number}?
                        </p>
                        <p style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <button
                                className="btn btn-danger"
                                onClick={confirmDelete}
                                style={{ flex: 1 }}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteConfirmation(null)}
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
