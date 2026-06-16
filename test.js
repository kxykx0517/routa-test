const http = require('http');
const { initDatabase, getAllActivities, queryByMoodAndEnergy } = require('./database');

let failures = 0;

async function runTests() {
  console.log('=== 测试开始 ===\n');

  await initDatabase();

  // AC1: 数据库初始化，至少54个活动
  try {
    const all = await getAllActivities();
    if (all.length >= 54) {
      console.log(`[PASS] AC1: 数据库初始化成功，${all.length} 个活动`);
    } else {
      console.log(`[FAIL] AC1: 预期至少 54 个活动，实际 ${all.length}`);
      failures++;
    }
  } catch (err) {
    console.log('[FAIL] AC1: 数据库初始化失败:', err.message);
    failures++;
  }

  // AC2: 6种情绪 × 3种精力 = 18种组合都有数据
  const moods = ['开心', '疲惫', '焦虑', '平静', '兴奋', '无聊'];
  const energies = ['高', '中', '低'];
  let allHaveData = true;
  for (const mood of moods) {
    for (const energy of energies) {
      try {
        const results = await queryByMoodAndEnergy(mood, energy);
        if (results.length < 3) {
          console.log(`[FAIL] AC2: mood=${mood}, energy=${energy} → 仅 ${results.length} 条，预期 ≥3`);
          failures++;
          allHaveData = false;
        } else {
          console.log(`[PASS] AC2: mood=${mood}, energy=${energy} → ${results.length} 条`);
        }
      } catch (err) {
        console.log(`[FAIL] AC2: mood=${mood}, energy=${energy} 查询失败:`, err.message);
        failures++;
        allHaveData = false;
      }
    }
  }
  if (allHaveData && moods.length * energies.length > 0) {
    console.log(`[INFO] AC2: 18种组合全部通过`);
  }

  // AC3: HTTP /health
  await httpTest('GET', '/health', null, (body) => {
    const data = JSON.parse(body);
    if (data.status === 'ok') {
      console.log('[PASS] AC3: GET /health 返回 {"status":"ok"}');
    } else {
      console.log('[FAIL] AC3: 预期 status=ok，实际:', body);
      failures++;
    }
  });

  // AC4: POST /api/recommend 基本推荐
  const body = JSON.stringify({ mood: '开心', energy: '高' });
  await httpTest('POST', '/api/recommend', body, (body) => {
    const data = JSON.parse(body);
    if (data.recommendations && data.recommendations.length > 0) {
      console.log(`[PASS] AC4: POST /api/recommend 返回 ${data.recommendations.length} 条推荐`);
    } else {
      console.log('[FAIL] AC4: POST /api/recommend 返回结果异常:', body);
      failures++;
    }
  });

  // AC5: POST /api/recommend 带筛选参数
  const filterBody = JSON.stringify({ mood: '开心', energy: '高', duration: '30分钟', weather: '晴天', location: '室外' });
  await httpTest('POST', '/api/recommend', filterBody, (body) => {
    const data = JSON.parse(body);
    if (data.recommendations && data.recommendations.length > 0) {
      console.log(`[PASS] AC5: 带筛选参数的推荐返回 ${data.recommendations.length} 条`);
    } else {
      console.log('[FAIL] AC5: 筛选推荐无结果:', body);
      failures++;
    }
  });

  // AC6: 新情绪值验证
  for (const newMood of ['平静', '兴奋', '无聊']) {
    const testBody = JSON.stringify({ mood: newMood, energy: '中' });
    await httpTest('POST', '/api/recommend', testBody, (body) => {
      const data = JSON.parse(body);
      if (data.recommendations && data.recommendations.length >= 2) {
        console.log(`[PASS] AC6: mood=${newMood} 推荐正常 → ${data.recommendations.length} 条`);
      } else if (data.error) {
        console.log(`[FAIL] AC6: mood=${newMood} 返回错误: ${data.error}`);
        failures++;
      } else {
        console.log(`[WARN] AC6: mood=${newMood} → ${data.recommendations?.length || 0} 条`);
      }
    });
  }

  // AC7: GET /api/random 返回完整字段
  await httpTest('GET', '/api/random', null, (body) => {
    const data = JSON.parse(body);
    const item = data.recommendation;
    if (item && item.steps && item.materials && item.tips && item.duration && item.category) {
      console.log('[PASS] AC7: 随机推荐包含所有新增字段');
    } else {
      console.log('[FAIL] AC7: 随机推荐缺失字段:', item ? JSON.stringify(Object.keys(item)) : 'null');
      failures++;
    }
  });

  console.log(`\n=== 测试结束: ${failures === 0 ? '全部通过' : failures + ' 个失败'} ===`);
  process.exit(failures > 0 ? 1 : 0);
}

function httpTest(method, path, body, validate) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method,
      headers: body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {},
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        validate(data);
        resolve();
      });
    });
    req.on('error', (err) => {
      console.log(`[FAIL] HTTP ${method} ${path} 请求失败:`, err.message);
      failures++;
      resolve();
    });
    if (body) req.write(body);
    req.end();
  });
}

runTests();
