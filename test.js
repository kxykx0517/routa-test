const http = require('http');
const { initDatabase, getAllActivities, queryByMoodAndEnergy } = require('./database');

let failures = 0;

async function runTests() {
  console.log('=== 测试开始 ===\n');

  // AC1 & AC4: 数据库初始化
  try {
    await initDatabase();
    const all = await getAllActivities();
    if (all.length === 15) {
      console.log(`[PASS] AC1/AC4: 数据库初始化成功，预置 ${all.length} 个活动`);
    } else {
      console.log(`[FAIL] AC1/AC4: 预期 15 个活动，实际 ${all.length}`);
      failures++;
    }
  } catch (err) {
    console.log('[FAIL] AC1/AC4: 数据库初始化失败:', err.message);
    failures++;
  }

  // AC3: 推荐查询
  const testCases = [
    { mood: '开心', energy: '高', expectMin: 1 },
    { mood: '疲惫', energy: '低', expectMin: 1 },
    { mood: '焦虑', energy: '低', expectMin: 1 },
  ];
  for (const tc of testCases) {
    try {
      const results = await queryByMoodAndEnergy(tc.mood, tc.energy);
      if (results.length >= tc.expectMin) {
        console.log(`[PASS] AC3: mood=${tc.mood}, energy=${tc.energy} → ${results.length} 条推荐`);
      } else {
        console.log(`[FAIL] AC3: mood=${tc.mood}, energy=${tc.energy} → 预期 >=${tc.expectMin}，实际 ${results.length}`);
        failures++;
      }
    } catch (err) {
      console.log(`[FAIL] AC3: mood=${tc.mood}, energy=${tc.energy} 查询失败:`, err.message);
      failures++;
    }
  }

  // AC2: HTTP /health
  await httpTest('GET', '/health', null, (body) => {
    const data = JSON.parse(body);
    if (data.status === 'ok') {
      console.log('[PASS] AC2: GET /health 返回 {"status":"ok"}');
    } else {
      console.log('[FAIL] AC2: 预期 status=ok，实际:', body);
      failures++;
    }
  });

  // AC3: HTTP POST /api/recommend
  const body = JSON.stringify({ mood: '开心', energy: '高' });
  await httpTest('POST', '/api/recommend', body, (body) => {
    const data = JSON.parse(body);
    if (data.recommendations && data.recommendations.length > 0) {
      console.log(`[PASS] AC3: POST /api/recommend 返回 ${data.recommendations.length} 条推荐`);
    } else {
      console.log('[FAIL] AC3: POST /api/recommend 返回结果异常:', body);
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
