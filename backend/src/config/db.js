import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readData(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error(`Error reading ${collection}:`, err);
    return [];
  }
}

function writeData(collection, data) {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // Retry once in case of file locking by sync watchers
    try {
      const tempPath = `${filePath}.${Date.now()}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
      fs.copyFileSync(tempPath, filePath);
      fs.unlinkSync(tempPath);
    } catch (retryErr) {
      console.error(`Error writing ${collection}:`, retryErr);
    }
  }
}

export const db = {
  find(collection, filterFn = () => true) {
    const items = readData(collection);
    return items.filter(filterFn);
  },

  findOne(collection, filterFn) {
    const items = readData(collection);
    return items.find(filterFn) || null;
  },

  findById(collection, id) {
    const items = readData(collection);
    return items.find(item => item.id === id) || null;
  },

  insert(collection, item) {
    const items = readData(collection);
    const newItem = {
      id: item.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    writeData(collection, items);
    return newItem;
  },

  insertMany(collection, newItems) {
    const items = readData(collection);
    const stampedItems = newItems.map(item => ({
      id: item.id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    items.unshift(...stampedItems);
    writeData(collection, items);
    return stampedItems;
  },

  updateById(collection, id, updates) {
    const items = readData(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeData(collection, items);
    return items[index];
  },

  deleteById(collection, id) {
    const items = readData(collection);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    writeData(collection, filtered);
    return true;
  },

  deleteMany(collection, filterFn) {
    const items = readData(collection);
    const retained = items.filter(item => !filterFn(item));
    const deletedCount = items.length - retained.length;
    writeData(collection, retained);
    return deletedCount;
  }
};
