function TenantCard({ tenant, onEdit, onDelete }) {
    return (
        <div className="card slide-in" style={{ position: 'relative' }}>
            <div className="flex justify-between items-center mb-2">
                <h3 style={{ margin: 0, color: 'var(--primary-light)' }}>{tenant.name}</h3>
                <span style={{
                    background: 'var(--gradient-primary)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                }}>
                    Room {tenant.room_number}
                </span>
            </div>

            <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                <div className="flex gap-2" style={{ marginBottom: '0.5rem' }}>
                    <span className="text-muted" style={{ minWidth: '80px' }}>Contact:</span>
                    <span>{tenant.contact}</span>
                </div>
                <div className="flex gap-2" style={{ marginBottom: '0.5rem' }}>
                    <span className="text-muted" style={{ minWidth: '80px' }}>Deposit:</span>
                    <span style={{ color: 'var(--success)', fontWeight: '600' }}>
                        ₹{parseFloat(tenant.deposit).toLocaleString('en-IN')}
                    </span>
                </div>
                <div className="flex gap-2">
                    <span className="text-muted" style={{ minWidth: '80px' }}>Tenant ID:</span>
                    <span className="text-muted" style={{ fontSize: '0.875rem' }}>#{tenant.tenant_id}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    className="btn btn-secondary"
                    onClick={() => onEdit(tenant)}
                    style={{ flex: 1 }}
                >
                    ✏️ Edit
                </button>
                <button
                    className="btn btn-danger"
                    onClick={() => onDelete(tenant)}
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
}

export default TenantCard;
