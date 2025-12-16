import express from 'express';
import db from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all tenants
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM tenants ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching tenants:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tenants'
        });
    }
});

// Get single tenant
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM tenants WHERE tenant_id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tenant not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching tenant:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tenant'
        });
    }
});

// Add new tenant
router.post('/', async (req, res) => {
    try {
        const { name, room_number, contact, deposit } = req.body;

        // Validation
        if (!name || !room_number || !contact) {
            return res.status(400).json({
                success: false,
                message: 'Name, room number, and contact are required'
            });
        }

        const [result] = await db.query(
            'INSERT INTO tenants (name, room_number, contact, deposit) VALUES (?, ?, ?, ?)',
            [name, room_number, contact, deposit || 0]
        );

        // Fetch the newly created tenant
        const [newTenant] = await db.query(
            'SELECT * FROM tenants WHERE tenant_id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Tenant added successfully',
            data: newTenant[0]
        });
    } catch (error) {
        console.error('Error adding tenant:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding tenant'
        });
    }
});

// Update tenant
router.put('/:id', async (req, res) => {
    try {
        const { name, room_number, contact, deposit } = req.body;
        const tenantId = req.params.id;

        // Check if tenant exists
        const [existing] = await db.query(
            'SELECT * FROM tenants WHERE tenant_id = ?',
            [tenantId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tenant not found'
            });
        }

        // Update tenant
        await db.query(
            'UPDATE tenants SET name = ?, room_number = ?, contact = ?, deposit = ? WHERE tenant_id = ?',
            [name, room_number, contact, deposit, tenantId]
        );

        // Fetch updated tenant
        const [updated] = await db.query(
            'SELECT * FROM tenants WHERE tenant_id = ?',
            [tenantId]
        );

        res.json({
            success: true,
            message: 'Tenant updated successfully',
            data: updated[0]
        });
    } catch (error) {
        console.error('Error updating tenant:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating tenant'
        });
    }
});

// Delete tenant
router.delete('/:id', async (req, res) => {
    try {
        const tenantId = req.params.id;

        // Check if tenant exists
        const [existing] = await db.query(
            'SELECT * FROM tenants WHERE tenant_id = ?',
            [tenantId]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tenant not found'
            });
        }

        // Delete tenant
        await db.query(
            'DELETE FROM tenants WHERE tenant_id = ?',
            [tenantId]
        );

        res.json({
            success: true,
            message: 'Tenant deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting tenant:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting tenant'
        });
    }
});

export default router;
