import express from 'express';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Query database for user
        const [rows] = await db.query(
            'SELECT * FROM owners WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const owner = rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, owner.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Set session
        req.session.userId = owner.id;
        req.session.username = owner.username;
        req.session.name = owner.name;

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: owner.id,
                username: owner.username,
                name: owner.name,
                email: owner.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error logging out'
            });
        }
        res.json({
            success: true,
            message: 'Logout successful'
        });
    });
});

// Check authentication status
router.get('/check', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({
            success: true,
            authenticated: true,
            user: {
                id: req.session.userId,
                username: req.session.username,
                name: req.session.name
            }
        });
    } else {
        res.json({
            success: true,
            authenticated: false
        });
    }
});

// Tenant login endpoint
router.post('/tenant-login', async (req, res) => {
    try {
        const { contact } = req.body;

        if (!contact) {
            return res.status(400).json({
                success: false,
                message: 'Contact number is required'
            });
        }

        // Query database for tenant by contact
        const [rows] = await db.query(
            'SELECT * FROM tenants WHERE contact = ?',
            [contact]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'No tenant found with this contact number'
            });
        }

        const tenant = rows[0];

        // Set session for tenant
        req.session.tenantId = tenant.tenant_id;
        req.session.tenantName = tenant.name;
        req.session.roomNumber = tenant.room_number;
        req.session.userType = 'tenant';

        res.json({
            success: true,
            message: 'Login successful',
            tenant: {
                tenant_id: tenant.tenant_id,
                name: tenant.name,
                room_number: tenant.room_number,
                contact: tenant.contact,
                monthly_rent: tenant.monthly_rent,
                rent_status: tenant.rent_status,
                last_payment_date: tenant.last_payment_date
            }
        });
    } catch (error) {
        console.error('Tenant login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

export default router;
