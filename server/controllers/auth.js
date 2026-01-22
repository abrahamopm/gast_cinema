const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user: { name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!await bcrypt.compare(currentPassword, user.password)) {
            return res.status(400).json({ error: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
