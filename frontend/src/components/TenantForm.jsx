import { useState } from 'react';

function TenantForm({ tenant, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: tenant?.name || '',
        room_number: tenant?.room_number || '',
        contact: tenant?.contact || '',
        deposit: tenant?.deposit || '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.room_number.trim()) newErrors.room_number = 'Room number is required';
        if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
        if (formData.contact && !/^\d{10}$/.test(formData.contact.replace(/\s/g, ''))) {
            newErrors.contact = 'Contact must be a valid 10-digit number';
        }
        if (formData.deposit && isNaN(formData.deposit)) {
            newErrors.deposit = 'Deposit must be a number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="mb-3">{tenant ? 'Edit Tenant' : 'Add New Tenant'}</h2>

            <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Enter tenant name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-error mt-1">{errors.name}</p>}
            </div>

            <div className="form-group">
                <label className="form-label">Room Number *</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., 101, A-12"
                    value={formData.room_number}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                />
                {errors.room_number && <p className="text-error mt-1">{errors.room_number}</p>}
            </div>

            <div className="form-group">
                <label className="form-label">Contact *</label>
                <input
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile number"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
                {errors.contact && <p className="text-error mt-1">{errors.contact}</p>}
            </div>

            <div className="form-group">
                <label className="form-label">Deposit Amount (₹)</label>
                <input
                    type="number"
                    className="form-input"
                    placeholder="Enter deposit amount"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                />
                {errors.deposit && <p className="text-error mt-1">{errors.deposit}</p>}
            </div>

            <div className="flex gap-2" style={{ marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    {tenant ? 'Update Tenant' : 'Add Tenant'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default TenantForm;
