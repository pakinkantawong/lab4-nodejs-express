const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{9,10}$/;

// Contact form validation
const validateContact = (req, res, next) => {
    const { name, email, subject, message, phone, company } = req.body;
    const errors = [];
    
    if (typeof name !== 'string' || !name.trim()) {
        errors.push('ชื่อจำเป็นต้องระบุและต้องเป็นข้อความ');
    } else {
        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
            errors.push('ชื่อต้องมีอย่างน้อย 2 ตัวอักษร');
        }
        if (trimmedName.length > 100) {
            errors.push('ชื่อต้องไม่เกิน 100 ตัวอักษร');
        }
    }
    
    if (typeof email !== 'string' || !email.trim()) {
        errors.push('อีเมลจำเป็นต้องระบุ');
    } else if (!emailRegex.test(email.trim().toLowerCase())) {
        errors.push('รูปแบบอีเมลไม่ถูกต้อง');
    }
    
    if (typeof subject !== 'string' || !subject.trim()) {
        errors.push('หัวข้อจำเป็นต้องระบุ');
    } else {
        const trimmedSubject = subject.trim();
        if (trimmedSubject.length < 5) {
            errors.push('หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร');
        }
        if (trimmedSubject.length > 200) {
            errors.push('หัวข้อต้องไม่เกิน 200 ตัวอักษร');
        }
    }
    
    if (typeof message !== 'string' || !message.trim()) {
        errors.push('ข้อความจำเป็นต้องระบุ');
    } else {
        const trimmedMessage = message.trim();
        if (trimmedMessage.length < 10) {
            errors.push('ข้อความต้องมีอย่างน้อย 10 ตัวอักษร');
        }
        if (trimmedMessage.length > 1000) {
            errors.push('ข้อความต้องไม่เกิน 1000 ตัวอักษร');
        }
    }
    
    if (phone !== undefined && phone !== null && phone !== '') {
        const phoneValue = typeof phone === 'string' ? phone.trim() : String(phone);
        if (!phoneRegex.test(phoneValue)) {
            errors.push('เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก');
        }
        req.body.phone = phoneValue;
    }
    
    if (company !== undefined && company !== null && company !== '') {
        if (typeof company !== 'string') {
            errors.push('บริษัทต้องเป็นข้อความ');
        } else if (company.trim().length > 100) {
            errors.push('ชื่อบริษัทต้องไม่เกิน 100 ตัวอักษร');
        } else {
            req.body.company = company.trim();
        }
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    
    // Sanitize data
    req.body.name = req.body.name.trim();
    req.body.email = req.body.email.trim().toLowerCase();
    req.body.subject = req.body.subject.trim();
    req.body.message = req.body.message.trim();
    
    next();
};

// Feedback validation
const validateFeedback = (req, res, next) => {
    const { rating, comment, email } = req.body;
    const errors = [];
    
    const numericRating = Number(rating);
    if (Number.isNaN(numericRating)) {
        errors.push('คะแนนต้องเป็นตัวเลขระหว่าง 1 ถึง 5');
    } else if (numericRating < 1 || numericRating > 5) {
        errors.push('คะแนนต้องอยู่ระหว่าง 1 ถึง 5');
    } else {
        req.body.rating = numericRating;
    }
    
    if (typeof comment !== 'string' || !comment.trim()) {
        errors.push('ความคิดเห็นจำเป็นต้องระบุ');
    } else {
        const trimmedComment = comment.trim();
        if (trimmedComment.length < 5) {
            errors.push('ความคิดเห็นต้องมีอย่างน้อย 5 ตัวอักษร');
        }
        if (trimmedComment.length > 500) {
            errors.push('ความคิดเห็นต้องไม่เกิน 500 ตัวอักษร');
        }
        req.body.comment = trimmedComment;
    }
    
    if (email !== undefined && email !== null && email !== '') {
        if (typeof email !== 'string') {
            errors.push('อีเมลต้องเป็นข้อความ');
        } else if (!emailRegex.test(email.trim().toLowerCase())) {
            errors.push('รูปแบบอีเมลไม่ถูกต้อง');
        } else {
            req.body.email = email.trim().toLowerCase();
        }
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    
    next();
};

module.exports = {
    validateContact,
    validateFeedback
};
