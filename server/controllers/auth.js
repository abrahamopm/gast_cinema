const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendJSON, sendError } = require('../utils/httpHelpers');

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        sendJSON(res, 201, { message: 'User created' });
    } catch (err) {
        sendError(res, 400, err.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return sendError(res, 400, 'Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        sendJSON(res, 200, { token, user: { name: user.name, role: user.role } });
    } catch (err) {
        sendError(res, 500, err.message);
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!await bcrypt.compare(currentPassword, user.password)) {
            return sendError(res, 400, 'Invalid current password');
        }

        user.password = newPassword;
        await user.save();
        sendJSON(res, 200, { message: 'Password updated successfully' });
    } catch (err) {
        sendError(res, 500, err.message);
    }
};
