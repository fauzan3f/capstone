const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const register = async (req, res) => {
    try {
        const { username, password, role } = req.body; // Hapus email dari sini

        // Periksa apakah semua parameter yang diperlukan ada
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user already exists
        const [existingUser] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).send('Nama pengguna sudah ada' );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await db.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)', // Hapus email dari query
            [username, hashedPassword, role || 'user'] // Hapus email dari parameter
        );

        res.status(201).send('User telah dibuat');
    } catch (error) {
        console.error('Registration error details:', error); // Tambahkan log untuk debugging
        res.status(500).send('Error mendaftarkan user');
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).send('Invalid credentials');
        }

        const user = users[0];
        console.log('User from database:', user); // Log untuk memeriksa data user
        console.log('User role:', user.role); // Log khusus untuk role

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).send('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Generated token payload:', { id: user.id, username: user.username, role: user.role }); // Log payload token

        res.status(200).send({
            token: token
        }); 
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Error logging in');
    }
};

module.exports = {
    register,
    login
};
