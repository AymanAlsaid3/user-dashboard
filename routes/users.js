import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Validation helper
const validateUserPayload = (data) => {
    const error = [];
    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
        error.push('Name is required and must be a valid non-empty string.');
    }
    if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
        error.push('A valid email address is required.');
    }
    return error;
};

// GET all users (with optional name search query)
router.get('/', async (req, res) => {
    try {
        let users = await User.find();
        const searchName = req.query.name;

        if (searchName) {
            users = users.filter(user =>
                user.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST a new user
router.post('/', async (req, res) => {
    const validationErrors = validateUserPayload(req.body);
    if (validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            error: validationErrors
        });
    }

    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User created and saved to MongoDB successfully',
            data: savedUser
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a user by MongoDB _id
router.put('/:id', async (req, res) => {
    const validationErrors = validateUserPayload(req.body);
    if (validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            error: validationErrors
        });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        res.json({
            success: true,
            message: `User updated successfully.`,
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE a user by MongoDB _id
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        res.json({
            success: true,
            message: `User deleted successfully.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;