const express = require('express');
const { validateContact } = require('../middleware/validation');
const { appendToJsonFile, readJsonFile } = require('../middleware/fileManager');

const router = express.Router();
const CONTACTS_FILE = 'contacts.json';
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

router.post('/', validateContact, async (req, res) => {
    try {
        const newContact = {
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message,
            phone: req.body.phone || null,
            company: req.body.company || null
        };

        const savedContact = await appendToJsonFile(CONTACTS_FILE, newContact);
        if (!savedContact) {
            return res.status(500).json({
                success: false,
                message: 'ไม่สามารถบันทึกข้อมูลติดต่อได้'
            });
        }

        res.status(201).json({
            success: true,
            message: 'บันทึกข้อมูลติดต่อเรียบร้อย',
            data: savedContact
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลติดต่อ'
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const { page = '1', limit = String(DEFAULT_LIMIT) } = req.query;
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(1, Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT));

        const contacts = await readJsonFile(CONTACTS_FILE);
        const totalItems = contacts.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / limitNumber));
        const currentPage = Math.min(pageNumber, totalPages);
        const startIndex = (currentPage - 1) * limitNumber;
        const paginatedData = contacts.slice(startIndex, startIndex + limitNumber);

        res.json({
            success: true,
            data: paginatedData,
            pagination: {
                page: currentPage,
                limit: limitNumber,
                totalItems,
                totalPages
            }
        });
    } catch (error) {
        console.error('Error loading contacts:', error);
        res.status(500).json({
            success: false,
            message: 'ไม่สามารถดึงข้อมูลติดต่อได้'
        });
    }
});

module.exports = router;
