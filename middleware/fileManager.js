const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// สร้างโฟลเดอร์ data ถ้าไม่มี
const ensureDataDir = async () => {
    try {
        await fs.access(DATA_DIR);
    } catch (error) {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
};

// อ่านข้อมูลจากไฟล์
const readJsonFile = async (filename) => {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Error reading file:', error);
        }
        return [];
    }
};

// เขียนข้อมูลลงไฟล์
const writeJsonFile = async (filename, data) => {
    try {
        await ensureDataDir();
        const filePath = path.join(DATA_DIR, filename);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing file:', error);
        return false;
    }
};

const getNextId = (existingData) => {
    if (!Array.isArray(existingData) || existingData.length === 0) {
        return 1;
    }
    const numericIds = existingData
        .map(item => (item && typeof item.id === 'number' ? item.id : null))
        .filter(id => typeof id === 'number' && Number.isFinite(id));
    if (numericIds.length === 0) {
        return 1;
    }
    return Math.max(...numericIds) + 1;
};

// เพิ่มข้อมูลใหม่ลงไฟล์
const appendToJsonFile = async (filename, newData) => {
    try {
        const existingData = await readJsonFile(filename);
        
        const dataWithId = {
            ...newData,
            id: getNextId(existingData),
            createdAt: new Date().toISOString()
        };
        
        existingData.push(dataWithId);
        await writeJsonFile(filename, existingData);
        return dataWithId;
    } catch (error) {
        console.error('Error appending to file:', error);
        return null;
    }
};

// ส่งกลับจำนวนข้อมูลในแต่ละไฟล์
const getFileStats = async () => {
    await ensureDataDir();
    const stats = {};
    try {
        const files = await fs.readdir(DATA_DIR);
        for (const file of files) {
            if (path.extname(file) !== '.json') continue;
            const data = await readJsonFile(file);
            stats[file] = Array.isArray(data) ? data.length : 0;
        }
    } catch (error) {
        console.error('Error reading stats:', error);
    }
    return stats;
};

module.exports = {
    readJsonFile,
    writeJsonFile,
    appendToJsonFile,
    getFileStats
};
