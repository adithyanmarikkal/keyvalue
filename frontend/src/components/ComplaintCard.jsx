import { useState } from 'react';

function ComplaintCard({ complaint, isAdmin, onStatusUpdate }) {
    const [updating, setUpdating] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        await onStatusUpdate(complaint.complaint_id, newStatus);
        setUpdating(false);
    };

    return (
        <div className="card slide-in">
            <div className="flex justify-between items-center mb-2">
                <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
                    Complaint #{complaint.complaint_id}
                </h4>
                <span style={{
                    background: complaint.status === 'Fixed'
                        ? 'var(--success)'
                        : 'var(--warning)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'white'
                }}>
                    {complaint.status}
                </span>
            </div>

            {isAdmin && complaint.tenant_name && (
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <strong>Tenant:</strong> {complaint.tenant_name} | <strong>Room:</strong> {complaint.room_number}
                </p>
            )}

            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    Issue Description:
                </p>
                <p style={{ color: 'var(--text-primary)' }}>
                    {complaint.issue_description}
                </p>
            </div>

            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                Registered: {new Date(complaint.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </p>

            {isAdmin && complaint.status === 'Pending' && (
                <button
                    className="btn btn-success mt-2"
                    onClick={() => handleStatusChange('Fixed')}
                    disabled={updating}
                    style={{ width: '100%' }}
                >
                    {updating ? 'Updating...' : '✓ Mark as Fixed'}
                </button>
            )}
        </div>
    );
}

export default ComplaintCard;
