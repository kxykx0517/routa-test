const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'recommendations.db');

const activities = [
  { name: '户外跑步', description: '在公园或跑道上跑步，释放内啡肽，提升心情', mood: '开心', energy: '高' },
  { name: '瑜伽冥想', description: '通过瑜伽体式和冥想放松身心，减轻焦虑', mood: '焦虑', energy: '低' },
  { name: '看电影', description: '观看一部喜欢的电影，放松疲惫的身心', mood: '疲惫', energy: '低' },
  { name: '爬山', description: '攀登附近的山丘，享受自然风光和成就感', mood: '开心', energy: '高' },
  { name: '听音乐', description: '聆听舒缓或欢快的音乐，调节情绪', mood: '焦虑,疲惫', energy: '低' },
  { name: '打篮球', description: '和朋友们一起打篮球，挥洒汗水', mood: '开心', energy: '高' },
  { name: '泡温泉', description: '在温泉中放松，缓解身体疲劳', mood: '疲惫', energy: '低' },
  { name: '绘画创作', description: '通过绘画表达内心情感，释放压力', mood: '焦虑', energy: '低' },
  { name: '阅读', description: '沉浸在一本好书中，暂时远离烦恼', mood: '焦虑,疲惫', energy: '低' },
  { name: '舞蹈', description: '跟随音乐自由舞动，释放快乐能量', mood: '开心', energy: '高' },
  { name: '烹饪美食', description: '下厨制作一道美味佳肴，享受创造的乐趣', mood: '开心,疲惫', energy: '中' },
  { name: '公园散步', description: '在绿树成荫的公园里漫步，深呼吸新鲜空气', mood: '焦虑,疲惫', energy: '低' },
  { name: '骑行', description: '骑自行车探索城市或乡间小路', mood: '开心', energy: '高' },
  { name: '深呼吸冥想', description: '练习深呼吸技巧，平复焦虑情绪', mood: '焦虑', energy: '低' },
  { name: '桌游', description: '和朋友们一起玩桌游，享受社交乐趣', mood: '开心', energy: '中' },
];

function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
    });

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        mood TEXT NOT NULL,
        energy TEXT NOT NULL CHECK(energy IN ('高', '中', '低'))
      )`);

      db.get('SELECT COUNT(*) as count FROM activities', (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const stmt = db.prepare('INSERT INTO activities (name, description, mood, energy) VALUES (?, ?, ?, ?)');
          for (const a of activities) {
            stmt.run(a.name, a.description, a.mood, a.energy);
          }
          stmt.finalize();
        }
        db.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  });
}

function queryByMoodAndEnergy(mood, energy) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) return reject(err);
    });
    const sql = `SELECT * FROM activities WHERE (instr(mood, ?) > 0 OR mood = ?) AND energy = ?`;
    db.all(sql, [mood, mood, energy], (err, rows) => {
      if (err) return reject(err);
      db.close();
      resolve(rows);
    });
  });
}

function getAllActivities() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) return reject(err);
    });
    db.all('SELECT * FROM activities', (err, rows) => {
      if (err) return reject(err);
      db.close();
      resolve(rows);
    });
  });
}

module.exports = { initDatabase, queryByMoodAndEnergy, getAllActivities };
