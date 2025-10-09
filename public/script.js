// Global variables
let isSubmitting = false;

// DOM Elements
const contactForm = document.getElementById('contactForm');
const feedbackForm = document.getElementById('feedbackForm');
const statusMessages = document.getElementById('statusMessages');
const apiResults = document.getElementById('apiResults');
const ratingSlider = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{9,10}$/;

const contactValidationFields = [
    { field: 'name', elementId: 'name', errorId: 'nameError' },
    { field: 'email', elementId: 'email', errorId: 'emailError' },
    { field: 'phone', elementId: 'phone', errorId: 'phoneError' },
    { field: 'subject', elementId: 'subject', errorId: 'subjectError' },
    { field: 'message', elementId: 'message', errorId: 'messageError' }
];

const feedbackValidationFields = [
    { field: 'rating', elementId: 'rating' },
    { field: 'comment', elementId: 'comment', errorId: 'commentError' },
    { field: 'feedbackEmail', elementId: 'feedbackEmail' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeForms();
    setupEventListeners();
});

function initializeForms() {
    // Update rating display
    ratingSlider.addEventListener('input', () => {
        ratingValue.textContent = ratingSlider.value;
        handleFieldValidation('rating', ratingSlider.value, undefined, 'rating');
    });
    ratingValue.textContent = ratingSlider.value;
}

function setupEventListeners() {
    // Contact form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitContactForm();
    });

    // Feedback form submission
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitFeedbackForm();
    });

    const validationConfigs = [...contactValidationFields, ...feedbackValidationFields];
    validationConfigs.forEach(({ field, elementId, errorId }) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        element.addEventListener('input', () => {
            handleFieldValidation(field, element.value, errorId, elementId);
        });
    });
}

function handleFieldValidation(fieldName, value, errorElementId, elementId) {
    const { isValid, message } = validateField(fieldName, value);
    if (errorElementId) {
        const errorElement = document.getElementById(errorElementId);
        if (errorElement) {
            errorElement.textContent = isValid ? '' : message;
        }
    }
    if (elementId) {
        const element = document.getElementById(elementId);
        if (element && typeof element.setCustomValidity === 'function') {
            element.setCustomValidity(isValid ? '' : message);
        }
    }
    return isValid;
}

function validateForm(fields) {
    return fields.every(({ field, elementId, errorId }) => {
        const element = document.getElementById(elementId);
        if (!element) return true;
        return handleFieldValidation(field, element.value, errorId, elementId);
    });
}

function getTrimmedValue(value) {
    return typeof value === 'string' ? value.trim() : String(value || '').trim();
}

// Client-side validation rules
function validateField(fieldName, value) {
    const trimmedValue = getTrimmedValue(value);
    switch (fieldName) {
        case 'name':
            if (!trimmedValue) return { isValid: false, message: 'กรุณาระบุชื่อ' };
            if (trimmedValue.length < 2) return { isValid: false, message: 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร' };
            if (trimmedValue.length > 100) return { isValid: false, message: 'ชื่อต้องไม่เกิน 100 ตัวอักษร' };
            return { isValid: true, message: '' };
        case 'email':
            if (!trimmedValue) return { isValid: false, message: 'กรุณาระบุอีเมล' };
            if (!emailRegex.test(trimmedValue.toLowerCase())) return { isValid: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
            return { isValid: true, message: '' };
        case 'phone':
            if (!trimmedValue) return { isValid: true, message: '' };
            if (!phoneRegex.test(trimmedValue)) return { isValid: false, message: 'เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก' };
            return { isValid: true, message: '' };
        case 'subject':
            if (!trimmedValue) return { isValid: false, message: 'กรุณาระบุหัวเรื่อง' };
            if (trimmedValue.length < 5) return { isValid: false, message: 'หัวเรื่องต้องมีอย่างน้อย 5 ตัวอักษร' };
            if (trimmedValue.length > 200) return { isValid: false, message: 'หัวเรื่องต้องไม่เกิน 200 ตัวอักษร' };
            return { isValid: true, message: '' };
        case 'message':
            if (!trimmedValue) return { isValid: false, message: 'กรุณาระบุข้อความ' };
            if (trimmedValue.length < 10) return { isValid: false, message: 'ข้อความต้องมีอย่างน้อย 10 ตัวอักษร' };
            if (trimmedValue.length > 1000) return { isValid: false, message: 'ข้อความต้องไม่เกิน 1000 ตัวอักษร' };
            return { isValid: true, message: '' };
        case 'comment':
            if (!trimmedValue) return { isValid: false, message: 'กรุณาระบุความคิดเห็น' };
            if (trimmedValue.length < 5) return { isValid: false, message: 'ความคิดเห็นต้องมีอย่างน้อย 5 ตัวอักษร' };
            if (trimmedValue.length > 500) return { isValid: false, message: 'ความคิดเห็นต้องไม่เกิน 500 ตัวอักษร' };
            return { isValid: true, message: '' };
        case 'feedbackEmail':
            if (!trimmedValue) return { isValid: true, message: '' };
            if (!emailRegex.test(trimmedValue.toLowerCase())) return { isValid: false, message: 'รูปแบบอีเมลไม่ถูกต้อง' };
            return { isValid: true, message: '' };
        case 'rating':
            if (!trimmedValue) return { isValid: false, message: 'กรุณาเลือกคะแนน' };
            const ratingNumber = parseInt(trimmedValue, 10);
            if (Number.isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
                return { isValid: false, message: 'คะแนนต้องอยู่ระหว่าง 1 ถึง 5' };
            }
            return { isValid: true, message: '' };
        default:
            return { isValid: true, message: '' };
    }
}

async function submitContactForm() {
    if (isSubmitting) return;
    const isValid = validateForm(contactValidationFields);
    if (!isValid) {
        showStatusMessage('❌ กรุณาตรวจสอบข้อมูลติดต่ออีกครั้ง', 'error');
        return;
    }
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    data.name = getTrimmedValue(data.name);
    data.email = getTrimmedValue(data.email).toLowerCase();
    data.subject = getTrimmedValue(data.subject);
    data.message = getTrimmedValue(data.message);
    data.phone = getTrimmedValue(data.phone);
    data.company = getTrimmedValue(data.company);
    if (!data.phone) delete data.phone;
    if (!data.company) delete data.company;
    
    try {
        isSubmitting = true;
        updateSubmitButton('contactSubmit', 'กำลังส่ง...', true);
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatusMessage('✅ ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็ว', 'success');
            contactForm.reset();
        } else {
            showStatusMessage(`❌ เกิดข้อผิดพลาด: ${result.message}`, 'error');
            if (result.errors) {
                displayValidationErrors(result.errors);
            }
        }
    } catch (error) {
        showStatusMessage('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        console.error('Error:', error);
    } finally {
        isSubmitting = false;
        updateSubmitButton('contactSubmit', 'ส่งข้อความ', false);
    }
}

async function submitFeedbackForm() {
    if (isSubmitting) return;
    const isValid = validateForm(feedbackValidationFields);
    if (!isValid) {
        showStatusMessage('❌ กรุณาตรวจสอบข้อมูลความคิดเห็นอีกครั้ง', 'error');
        return;
    }
    
    const formData = new FormData(feedbackForm);
    const data = Object.fromEntries(formData.entries());
    data.rating = parseInt(data.rating, 10);
    data.comment = getTrimmedValue(data.comment);
    data.email = getTrimmedValue(data.email);
    if (!data.email) delete data.email;
    
    try {
        isSubmitting = true;
        updateSubmitButton('feedbackSubmit', 'กำลังส่ง...', true);
        
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        if (result.success) {
            showStatusMessage('✅ ส่งความคิดเห็นเรียบร้อย ขอบคุณสำหรับคำติชม', 'success');
            feedbackForm.reset();
            ratingValue.textContent = ratingSlider.value;
        } else {
            showStatusMessage(`❌ เกิดข้อผิดพลาด: ${result.message}`, 'error');
            if (result.errors) {
                displayValidationErrors(result.errors);
            }
        }
    } catch (error) {
        showStatusMessage('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        console.error('Error:', error);
    } finally {
        isSubmitting = false;
        updateSubmitButton('feedbackSubmit', 'ส่งความคิดเห็น', false);
    }
}

function showStatusMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `status-message ${type}`;
    messageDiv.textContent = message;
    
    statusMessages.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function updateSubmitButton(buttonId, text, disabled) {
    const button = document.getElementById(buttonId);
    button.textContent = text;
    button.disabled = disabled;
}

function displayValidationErrors(errors) {
    errors.forEach(error => {
        showStatusMessage(`🔸 ${error}`, 'error');
    });
}

// API Testing Functions
async function loadContacts() {
    try {
        apiResults.textContent = 'Loading contacts...';
        const response = await fetch('/api/contact');
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'ไม่สามารถโหลดข้อมูลติดต่อ');
        }
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading contacts: ' + error.message;
    }
}

async function loadFeedbackStats() {
    try {
        apiResults.textContent = 'Loading feedback stats...';
        const response = await fetch('/api/feedback/stats');
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'ไม่สามารถโหลดสถิติความคิดเห็น');
        }
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading feedback stats: ' + error.message;
    }
}

async function loadAPIStatus() {
    try {
        apiResults.textContent = 'Loading API status...';
        const response = await fetch('/api/status');
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'ไม่สามารถโหลดสถานะ API');
        }
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading API status: ' + error.message;
    }
}

async function loadAPIDocs() {
    try {
        const response = await fetch('/api/docs');
        const data = await response.json();
        apiResults.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        apiResults.textContent = 'Error loading API docs: ' + error.message;
    }
}
