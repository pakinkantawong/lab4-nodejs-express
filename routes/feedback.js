const express = require('express');
const { validateFeedback } = require('../middleware/validation');
const { appendToJsonFile, readJsonFile } = require('../middleware/fileManager');

const router = express.Router();
const FEEDBACK_FILE = 'feedback.json';

const getFeedbackStats = (feedbackList) => {
    const total = feedbackList.length;
    if (total === 0) {
        return {
            totalFeedback: 0,
            averageRating: 0,
            ratingCounts: {}
        };
    }

    const ratingCounts = feedbackList.reduce((acc, item) => {
        const rating = typeof item.rating === 'number' ? item.rating : Number(item.rating);
        if (!Number.isNaN(rating)) {
            acc[rating] = (acc[rating] || 0) + 1;
        }
        return acc;
    }, {});

    const sumRating = Object.entries(ratingCounts).reduce((sum, [rating, count]) => {
        return sum + Number(rating) * count;
    }, 0);

    return {
        totalFeedback: total,
        averageRating: Number((sumRating / total).toFixed(2)),
        ratingCounts
    };
};

router.post('/', validateFeedback, async (req, res) => {
    try {
        const newFeedback = {
            rating: req.body.rating,
            comment: req.body.comment,
            email: req.body.email || null
        };

        const savedFeedback = await appendToJsonFile(FEEDBACK_FILE, newFeedback);
        if (!savedFeedback) {
            return res.status(500).json({
                success: false,
                message: 'ไม่สามารถบันทึกความคิดเห็นได้'
            });
        }

        res.status(201).json({
            success: true,
            message: 'บันทึกความคิดเห็นเรียบร้อย',
            data: savedFeedback
        });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดในการบันทึกความคิดเห็น'
        });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const feedbackList = await readJsonFile(FEEDBACK_FILE);
        const stats = getFeedbackStats(feedbackList);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error loading feedback stats:', error);
        res.status(500).json({
            success: false,
            message: 'ไม่สามารถดึงสถิติความคิดเห็นได้'
        });
    }
});

module.exports = router;
