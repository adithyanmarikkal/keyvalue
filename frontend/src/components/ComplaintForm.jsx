import { useState } from 'react';

function ComplaintForm({ tenantId, roomNumber, onSubmit, onCancel }) {
    const [issueDescription, setIssueDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!issueDescription.trim()) {
            setError('Please describe the issue');
            return;
        }

        if (issueDescription.trim().length < 10) {
            setError('Please provide more details (at least 10 characters)');
            return;
        }

        onSubmit({
            tenant_id: tenantId,
            room_number: roomNumber,
            issue_description: issueDescription.trim()
        });

        setIssueDescription('');
        setError('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="mb-3">Register New Complaint</h2>

            <div className="form-group">
                <label className="form-label">Issue Description *</label>
                <textarea
                    className="form-input"
                    placeholder="Describe the issue in detail..."
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    rows="5"
                    style={{ resize: 'vertical', minHeight: '120px' }}
                />
                {error && <p className="text-error mt-1">{error}</p>}
                <p className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                    Please provide detailed information about the issue
                </p>
            </div>

            <div className="flex gap-2" style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Submit Complaint
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ComplaintForm;
