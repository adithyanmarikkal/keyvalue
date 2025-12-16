import express from 'express';
import db from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all complaints (admin only)
router.get('/', requireAuth, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT c.*, t.name as tenant_name 
       FROM complaints c 
       JOIN tenants t ON c.tenant_id = t.tenant_id 
       ORDER BY c.created_at DESC`
        );
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaints'
        });
    }
});

// Get complaints for specific tenant
router.get('/tenant/:tenantId', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM complaints WHERE tenant_id = ? ORDER BY created_at DESC',
            [req.params.tenantId]
        );
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching tenant complaints:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching complaints'
        });
    }
});

// Register new complaint
router.post('/', async (req, res) => {
    try {
        const { tenant_id, room_number, issue_description } = req.body;

        if (!tenant_id || !room_number || !issue_description) {
            return res.status(400).json({
                success: false,
                message: 'Tenant ID, room number, and issue description are required'
            });
        }

        const [result] = await db.query(
            'INSERT INTO complaints (tenant_id, room_number, issue_description) VALUES (?, ?, ?)',
            [tenant_id, room_number, issue_description]
        );

        const [newComplaint] = await db.query(
            'SELECT * FROM complaints WHERE complaint_id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Complaint registered successfully',
            data: newComplaint[0]
        });
    } catch (error) {
        console.error('Error registering complaint:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering complaint'
        });
    }
});

// Update complaint status (admin only)
router.put('/:id/status', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const complaintId = req.params.id;

        if (!status || !['Pending', 'Fixed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status (Pending/Fixed) is required'
            });
        }

        const [existing] = await db.query(
            'SELECT * FROM complaints WHERE complaint_id = ?',
            [complaintId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        await db.query(
            'UPDATE complaints SET status = ? WHERE complaint_id = ?',
            [status, complaintId]
        );

        const [updated] = await db.query(
            'SELECT * FROM complaints WHERE complaint_id = ?',
            [complaintId]
        );

        res.json({
            success: true,
            message: 'Complaint status updated successfully',
            data: updated[0]
        });
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating complaint status'
        });
    }
});

export default router;
