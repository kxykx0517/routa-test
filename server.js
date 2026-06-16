const express = require('express');
const cors = require('cors');
const { initDatabase, queryByMoodAndEnergy } = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/recommend', async (req, res) => {
  const { mood, energy } = req.body;

  if (!mood || !energy) {
    return res.status(400).json({ error: '请提供 mood 和 energy 参数' });
  }

  const validMoods = ['开心', '疲惫', '焦虑'];
  const validEnergies = ['高', '中', '低'];

  if (!validMoods.includes(mood)) {
    return res.status(400).json({ error: '无效的 mood 参数，有效值：开心、疲惫、焦虑' });
  }
  if (!validEnergies.includes(energy)) {
    return res.status(400).json({ error: '无效的 energy 参数，有效值：高、中、低' });
  }

  try {
    const results = await queryByMoodAndEnergy(mood, energy);
    res.json({ recommendations: results });
  } catch (err) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`推荐系统服务已启动，端口: ${PORT}`);
    });
  } catch (err) {
    console.error('启动失败:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
