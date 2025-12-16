-- Create database if not exists
CREATE DATABASE IF NOT EXISTS pg_maintenance;
USE pg_maintenance;

-- Owners table for authentication
CREATE TABLE IF NOT EXISTS owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    deposit DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    monthly_rent DECIMAL(10, 2) DEFAULT 0.00,
    rent_status ENUM('Paid', 'Pending') DEFAULT 'Pending',
    last_payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
    complaint_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    issue_description TEXT NOT NULL,
    status ENUM('Pending', 'Fixed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
-- Password hash generated using bcrypt with salt rounds 10
INSERT INTO owners (username, password_hash, name, email) 
VALUES (
    'admin', 
    '$2b$10$5BPRiJL1PY34yJ9tZV122.NDyQ0bf0kSRuJIm9Po6.rJiqOU26tj2',
    'Admin User',
    'admin@pgmaintenance.com'
) ON DUPLICATE KEY UPDATE username=username;
