const Admin = require('../../models/admins');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        // validations
        if (!username ||!password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        if (username.length < 4) {
            return res.status(400).json({ message: 'Username must be at least 4 characters long' });
        }
        if (password.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters long' });
        }

        const admin = await Admin.findOne({ username });
        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (isMatch) {

                const token = jwt.sign({ username: username, role: 'admin' }, process.env.JWT_SECRET);
                res.cookie('token', token , { maxAge: 900000, httpOnly: true });


                return res.redirect('/admin');
            } else {
                return res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            return res.status(401).json({ message: 'No such admin exists' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }

}

module.exports = adminLogin;