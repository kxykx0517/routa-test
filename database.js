const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'recommendations.db');

const activities = [
  // ===== 开心 + 高 =====
  { name: '户外跑步', description: '在公园或跑道上跑步，释放内啡肽，提升心情', steps: '1. 热身5分钟：动态拉伸腿部\n2. 匀速跑步20-30分钟\n3. 冷身5分钟：慢走+静态拉伸', materials: '跑鞋、运动服、水壶、手机（记录路线）', tips: '跑前必热身，跑后必拉伸；根据体感调整速度；保持规律呼吸', duration: '30-45分钟', mood: '开心', energy: '高', category: '运动类', weather: '晴天', location: '室外', duration_min: 35 },
  { name: '爬山徒步', description: '攀登附近的山丘或步道，享受自然风光和成就感', steps: '1. 查看路线地图，准备补给\n2. 匀速攀登，注意呼吸节奏\n3. 登顶休息拍照，原路返回', materials: '登山鞋、背包、水（1L+）、零食、防晒霜', tips: '提前查看天气；穿防滑鞋；带足饮水；天黑前下山', duration: '2-3小时', mood: '开心', energy: '高', category: '运动类', weather: '晴天', location: '室外', duration_min: 120 },
  { name: '跳有氧舞蹈', description: '跟随欢快音乐舞动，燃烧卡路里，心情大好', steps: '1. 选择一个有氧舞蹈视频教程\n2. 跟随节奏完成15-20分钟动作\n3. 放松拉伸5分钟', materials: '运动服、运动鞋、瑜伽垫（可选）、音箱', tips: '初学者选低冲击动作；保持核心收紧；享受音乐不要纠结动作标不标准', duration: '25-35分钟', mood: '开心', energy: '高', category: '运动类', weather: '下雨', location: '在家', duration_min: 30 },
  { name: '骑行探索', description: '骑自行车探索城市或乡间小路，感受风的速度', steps: '1. 检查车况（胎压、刹车、链条）\n2. 规划路线，骑行30-60分钟\n3. 休息时拍照记录沿途风景', materials: '自行车、头盔、水壶、修车工具包', tips: '佩戴头盔；遵守交通规则；夜间骑行需车灯', duration: '30-60分钟', mood: '开心', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 45 },

  // ===== 开心 + 中 =====
  { name: '烹饪美食', description: '下厨制作一道美味佳肴，享受创造的乐趣和成就感', steps: '1. 选择菜谱，准备所有食材\n2. 按步骤处理食材（洗切腌）\n3. 烹饪装盘，拍照记录', materials: '食材、厨具、菜谱、围裙', tips: '先备好所有材料再开火；注意用刀安全；调味循序渐进', duration: '30-60分钟', mood: '开心', energy: '中', category: '生活类', weather: '不限', location: '室内', duration_min: 45 },
  { name: '桌游聚会', description: '和朋友们一起玩桌游，享受社交乐趣和策略挑战', steps: '1. 挑选桌游并熟悉规则\n2. 邀请2-4位朋友一起参与\n3. 进行2-3局游戏', materials: '桌游（卡坦岛/UNO/三国杀等）、零食、饮料', tips: '选择适合人数的游戏；提前熟悉规则避免冷场；娱乐第一胜负第二', duration: '45-90分钟', mood: '开心', energy: '中', category: '娱乐类', weather: '不限', location: '室内', duration_min: 60 },
  { name: '种植花草', description: '种植或打理盆栽植物，感受生命成长的喜悦', steps: '1. 准备花盆、土壤和种子/幼苗\n2. 播种或换盆，浇透水\n3. 放置到合适光照位置，记录生长', materials: '花盆、营养土、种子/幼苗、喷壶、园艺工具', tips: '不同植物需水量不同；新手推荐多肉或绿萝；避免积水烂根', duration: '20-40分钟', mood: '开心', energy: '中', category: '生活类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '摄影采风', description: '带着相机或手机出门拍照，发现生活中的美', steps: '1. 确定拍摄主题（街景/自然/人像）\n2. 寻找有趣的光影和构图\n3. 后期简单调色分享', materials: '相机或手机、备用电池、存储卡', tips: '黄金时刻（日出日落）光线最美；多尝试不同角度；拍RAW格式方便后期', duration: '30-60分钟', mood: '开心', energy: '中', category: '艺术类', weather: '晴天', location: '室外', duration_min: 45 },

  // ===== 开心 + 低 =====
  { name: '看喜剧短片', description: '看一段搞笑短片或相声，开怀大笑放松心情', steps: '1. 选择喜欢的喜剧类型\n2. 观看约15分钟\n3. 和家人朋友分享好笑片段', materials: '手机/电脑、喜剧片单', tips: '推荐看经典喜剧或脱口秀；大笑可以释放内啡肽', duration: '15-20分钟', mood: '开心', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 15 },
  { name: '撸猫/宠物互动', description: '和宠物玩耍互动，感受毛茸茸的治愈力量', steps: '1. 准备宠物喜欢的玩具或零食\n2. 和宠物互动10-15分钟（逗猫棒/抛球）\n3. 给宠物梳毛，增进感情', materials: '宠物玩具、零食、梳毛刷', tips: '观察宠物情绪，不要强迫互动；互动后及时奖励', duration: '10-20分钟', mood: '开心', energy: '低', category: '生活类', weather: '不限', location: '在家', duration_min: 15 },
  { name: '听轻快音乐', description: '聆听节奏轻快的音乐，让好心情延续', steps: '1. 创建欢快歌单（Pop/Funk/拉丁）\n2. 戴耳机出门散步，边听边走\n3. 跟着节奏轻轻摇摆', materials: '手机、耳机、音乐App', tips: '试试带耳机沉浸式聆听；注意周围交通安全', duration: '15-25分钟', mood: '开心', energy: '低', category: '娱乐类', weather: '不限', location: '室外', duration_min: 20 },

  // ===== 疲惫 + 高 =====
  { name: '小睡片刻', description: '短暂小睡20-30分钟，快速恢复精力', steps: '1. 设置25分钟闹钟\n2. 找安静黑暗的环境躺下\n3. 放松全身，自然入睡', materials: '眼罩、耳塞、毯子', tips: '控制在30分钟内避免昏沉；设闹钟；不要刚吃完就睡', duration: '20-30分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '不限', location: '在家', duration_min: 25 },
  { name: '泡热水澡', description: '在温热的水中浸泡，缓解全身肌肉疲劳', steps: '1. 放热水（40°C左右）\n2. 加入浴盐或精油\n3. 浸泡15-20分钟，配合深呼吸', materials: '浴盐/精油、浴巾、香薰蜡烛', tips: '水温不要过高；超过20分钟容易头晕；泡后及时补水', duration: '20-30分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '下雨', location: '在家', duration_min: 25 },
  { name: '全身按摩', description: '用泡沫轴或按摩仪放松紧绷的肌肉', steps: '1. 从背部开始，用泡沫轴滚动\n2. 按摩腿部、肩颈各3-5分钟\n3. 重点部位重复放松', materials: '泡沫轴、按摩球、按摩仪', tips: '避开骨头和关节；疼痛感以舒适为准；配合深呼吸效果更好', duration: '20-30分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '不限', location: '室内', duration_min: 25 },

  // ===== 疲惫 + 中 =====
  { name: '轻柔瑜伽', description: '做舒缓的瑜伽拉伸，恢复身体柔韧性和能量', steps: '1. 铺好瑜伽垫，做5分钟调息\n2. 进行猫牛式、婴儿式、前屈等舒缓体式\n3. 以摊尸式结束放松5分钟', materials: '瑜伽垫、舒适衣物、瑜伽砖（可选）', tips: '不要勉强拉伸到疼痛；关注呼吸；每个体式保持3-5个呼吸', duration: '20-30分钟', mood: '疲惫', energy: '中', category: '运动类', weather: '阴天', location: '室内', duration_min: 25 },
  { name: '公园慢走', description: '在绿树成荫的公园里悠闲漫步，呼吸新鲜空气', steps: '1. 找最近的公园或绿地\n2. 慢走15-20分钟，不追求速度\n3. 途中停下来看看花草树木', materials: '舒适的鞋子、水杯', tips: '选择树荫多的路线；放慢脚步；注意脚下安全', duration: '20-30分钟', mood: '疲惫', energy: '中', category: '运动类', weather: '晴天', location: '室外', duration_min: 25 },
  { name: '听播客/有声书', description: '躺着或坐着听感兴趣的播客，不费力的放松方式', steps: '1. 选择感兴趣的主题播客\n2. 找舒服的姿势闭上眼睛听\n3. 可以边听边做简单家务', materials: '手机/平板、耳机或音箱', tips: '选择节奏舒缓的节目；车速调为1倍速即可；设置定时关闭', duration: '25-40分钟', mood: '疲惫', energy: '中', category: '娱乐类', weather: '不限', location: '在家', duration_min: 30 },

  // ===== 疲惫 + 低 =====
  { name: '静坐冥想', description: '安静地坐下，专注于呼吸，让身心彻底放空', steps: '1. 找安静处盘腿坐下\n2. 闭上眼睛，专注于一呼一吸\n3. 思绪飘走时温柔地带回来', materials: '冥想垫/坐垫、毯子（保暖）', tips: '初学者从5分钟开始；不要评判走神；使用计时器App', duration: '10-20分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 15 },
  { name: '芳香疗愈', description: '使用精油或香薰，通过嗅觉放松身心', steps: '1. 选择舒缓精油（薰衣草/洋甘菊）\n2. 使用香薰机或直接嗅吸\n3. 配合深呼吸静坐5-10分钟', materials: '精油、香薰机或扩香木', tips: '选择纯天然精油；初次使用做皮肤测试；孕妇慎用某些精油', duration: '15-25分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 20 },
  { name: '躺平听纯音乐', description: '躺着什么也不做，只听舒缓的纯音乐', steps: '1. 准备舒适的躺卧位置\n2. 播放纯音乐或自然白噪音\n3. 闭眼放空，什么都不想', materials: '音箱/耳机、舒适躺椅或床', tips: '推荐钢琴曲或自然白噪音；音量调低；可设定时关闭', duration: '15-30分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 20 },

  // ===== 焦虑 + 高 =====
  { name: '拳击训练', description: '打沙袋或进行拳击训练，痛快释放压力和负面情绪', steps: '1. 缠好护手带，戴好拳击手套\n2. 练习直拳、摆拳组合3分钟×5组\n3. 跳绳5分钟放松', materials: '拳击手套、护手带、沙袋、跳绳', tips: '手腕保持直立避免扭伤；每组间休息30秒；初学者先学正确姿势', duration: '25-40分钟', mood: '焦虑', energy: '高', category: '运动类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '高强度间歇训练', description: '进行HIIT训练，让汗水带走焦虑情绪', steps: '1. 热身5分钟（开合跳+高抬腿）\n2. 20秒全力运动+10秒休息，循环8轮\n3. 冷身拉伸5分钟', materials: '运动服、运动鞋、瑜伽垫、计时器', tips: '尽全力但保持正确姿势；初学者可减少循环数；训练后补充蛋白质', duration: '20-30分钟', mood: '焦虑', energy: '高', category: '运动类', weather: '不限', location: '室内', duration_min: 25 },
  { name: '全力奔跑', description: '在户外全力奔跑，感受风的速度和彻底的释放感', steps: '1. 动态热身5分钟\n2. 间歇冲刺：快跑1分钟+慢跑2分钟，重复6组\n3. 慢走冷身5分钟', materials: '跑鞋、运动服、心率监测（可选）', tips: '选择平坦安全的路线；跑前不要吃太饱；根据心率调整强度', duration: '25-35分钟', mood: '焦虑', energy: '高', category: '运动类', weather: '晴天', location: '室外', duration_min: 30 },

  // ===== 焦虑 + 中 =====
  { name: '整理收纳房间', description: '整理和收纳房间，在秩序感中获得内心的平静', steps: '1. 分类物品：保留/丢弃/收纳\n2. 按类别整理归位\n3. 擦拭表面，拖地收尾', materials: '收纳盒、垃圾袋、抹布、标签贴', tips: '一次只整理一个区域；断舍离不犹豫；整理后点香薰增加仪式感', duration: '30-60分钟', mood: '焦虑', energy: '中', category: '生活类', weather: '阴天', location: '在家', duration_min: 45 },
  { name: '陶艺/手工', description: '通过陶艺或手工制作，专注手部动作让焦虑消失', steps: '1. 准备陶泥或手工材料\n2. 揉泥、塑形或制作手工作品\n3. 上色装饰，等待晾干', materials: '陶泥/手工材料包、工具、围裙', tips: '享受过程不必追求完美；泥土的触感有镇定作用；可在家使用免烤陶泥', duration: '40-60分钟', mood: '焦虑', energy: '中', category: '艺术类', weather: '阴天', location: '室内', duration_min: 50 },
  { name: '写日记/手账', description: '把焦虑的想法写下来，梳理情绪，减轻心理负担', steps: '1. 准备日记本和笔\n2. 写下此刻的感受和想法（不设限）\n3. 列出3件值得感恩的事', materials: '日记本/手账本、笔、贴纸（可选）', tips: '不要在意文笔，真实最重要；可以尝试「晨间三页」法；写完可以撕掉释放', duration: '15-25分钟', mood: '焦虑', energy: '中', category: '生活类', weather: '不限', location: '在家', duration_min: 20 },

  // ===== 焦虑 + 低 =====
  { name: '深呼吸练习', description: '用4-7-8呼吸法平复焦虑，让身体进入放松状态', steps: '1. 坐直或躺下，放松肩膀\n2. 吸气4秒→屏息7秒→呼气8秒\n3. 重复5轮', materials: '计时器或深呼吸App', tips: '呼气时间要长于吸气；如果头晕就恢复正常呼吸；每天练习效果更好', duration: '5-10分钟', mood: '焦虑', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '大自然散步', description: '在安静的自然环境中散步，让绿意安抚焦虑', steps: '1. 去最近的公园或有树木的地方\n2. 缓慢行走，注意周围的声音和气味\n3. 停下来触摸树叶或花朵', materials: '舒适的鞋子、水', tips: '放下手机，专注感官体验；深呼吸草木的气息；光脚踩草地有奇效', duration: '20-30分钟', mood: '焦虑', energy: '低', category: '自然类', weather: '晴天', location: '室外', duration_min: 25 },
  { name: '品茶静心', description: '专注泡一杯茶，通过茶道仪式感让心静下来', steps: '1. 烧水，温杯洗茶具\n2. 放入茶叶，注水冲泡\n3. 闻香品味，小口慢饮', materials: '茶叶、茶具（壶/杯/公道杯）、开水', tips: '选择乌龙茶或花草茶；专注每一个动作；不看手机专心品茶', duration: '15-25分钟', mood: '焦虑', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 20 },

  // ===== 平静 + 高 =====
  { name: '太极/八段锦', description: '练习太极或八段锦，以柔克刚，身心合一', steps: '1. 穿宽松衣物，找平坦场地\n2. 跟随视频练习八段锦全套12分钟\n3. 收势调息，静立2分钟', materials: '宽松衣物、瑜伽垫（可选）、教学视频', tips: '动作要慢，配合呼吸；初学者先学分解动作；坚持练习效果更好', duration: '15-25分钟', mood: '平静', energy: '高', category: '运动类', weather: '不限', location: '室内', duration_min: 20 },
  { name: '游泳', description: '在水中匀速游进，感受水流带来的平静与专注', steps: '1. 更衣热身，淋浴适应水温\n2. 自由泳或蛙泳500-1000米\n3. 水中放松漂浮5分钟', materials: '泳衣/泳裤、泳镜、泳帽、毛巾、拖鞋', tips: '饭后1小时再下水；注意泳池开放时间；初学者带浮板', duration: '30-45分钟', mood: '平静', energy: '高', category: '运动类', weather: '不限', location: '室内', duration_min: 35 },
  { name: '园艺劳作', description: '在花园或阳台打理植物，与自然安静相处', steps: '1. 检查每盆植物的状态\n2. 浇水、施肥、修剪枯叶\n3. 松土或换盆', materials: '园艺手套、喷壶、肥料、修枝剪', tips: '根据植物习性浇水；戴手套防止划伤；上午或傍晚浇水最佳', duration: '30-50分钟', mood: '平静', energy: '高', category: '自然类', weather: '晴天', location: '室外', duration_min: 40 },

  // ===== 平静 + 中 =====
  { name: '阅读一本好书', description: '沉浸在一本好书中，享受安静的阅读时光', steps: '1. 选择一本想读的书\n2. 找安静舒适的阅读角落\n3. 阅读30分钟，做读书笔记', materials: '纸质书或电子阅读器、书签、笔记本', tips: '保持自然光线；每20分钟远眺放松眼睛；遇到好句子随手摘抄', duration: '30-60分钟', mood: '平静', energy: '中', category: '娱乐类', weather: '阴天', location: '在家', duration_min: 45 },
  { name: '水彩画', description: '用水彩描绘喜欢的风景或图案，享受色彩融合的乐趣', steps: '1. 准备水彩纸、颜料和画笔\n2. 铅笔打稿，从浅色开始上色\n3. 层层叠加，最后勾画细节', materials: '水彩颜料、水彩纸、画笔（大中小）、调色盘、水杯', tips: '水彩由浅入深；控制水量是关键；可以看教程跟着画', duration: '40-60分钟', mood: '平静', energy: '中', category: '艺术类', weather: '不限', location: '在家', duration_min: 50 },
  { name: '钓鱼', description: '在水边安静垂钓，享受等待的宁静和期待', steps: '1. 准备钓具和鱼饵\n2. 找好钓位，打窝下竿\n3. 安静等待，享受自然', materials: '鱼竿、鱼线、鱼钩、鱼饵、折叠椅、遮阳帽', tips: '提前查看钓鱼点规定；注意防晒；享受过程比鱼获更重要', duration: '1-3小时', mood: '平静', energy: '中', category: '自然类', weather: '晴天', location: '室外', duration_min: 90 },

  // ===== 平静 + 低 =====
  { name: '正念冥想', description: '通过正念冥想练习，专注于当下，获得深层平静', steps: '1. 坐在安静处，背挺直\n2. 专注于呼吸或者身体扫描\n3. 每次走神温柔拉回注意力', materials: '冥想垫、计时器、冥想App（可选）', tips: '初学者用引导式冥想App；每天同一时间练习形成习惯', duration: '10-20分钟', mood: '平静', energy: '低', category: '放松类', weather: '阴天', location: '在家', duration_min: 15 },
  { name: '观鸟', description: '在窗边或公园安静观察鸟类，体会自然的韵律', steps: '1. 准备望远镜和鸟类图鉴\n2. 在窗边或公园找安静处坐下\n3. 记录看到的鸟类种类和行为', materials: '望远镜、鸟类图鉴/App、笔记本', tips: '清晨鸟类最活跃；保持安静不惊扰；穿颜色不鲜艳的衣物', duration: '20-40分钟', mood: '平静', energy: '低', category: '自然类', weather: '晴天', location: '室外', duration_min: 30 },
  { name: '编织/钩针', description: '通过编织或钩针，在手部重复动作中获得平静', steps: '1. 选择合适的毛线和编织针\n2. 起针后按图案重复编织\n3. 每完成一排检查平整度', materials: '毛线、编织针/钩针、剪刀、图案教程', tips: '初学者从围巾或杯垫开始；选择粗针粗线更容易上手', duration: '30-60分钟', mood: '平静', energy: '低', category: '艺术类', weather: '下雨', location: '在家', duration_min: 45 },

  // ===== 兴奋 + 高 =====
  { name: '攀岩', description: '挑战攀岩墙，用全身力量和技巧向上攀登', steps: '1. 穿戴安全带和攀岩鞋\n2. 观察路线，规划手点脚点\n3. 逐段向上攀登，登顶后安全降下', materials: '攀岩鞋、安全带、镁粉袋、攀岩馆会员', tips: '初学者从顶绳开始；多用腿部力量节省手臂；相信保护系统', duration: '45-90分钟', mood: '兴奋', energy: '高', category: '运动类', weather: '不限', location: '室内', duration_min: 60 },
  { name: '蹦床/弹跳', description: '在蹦床公园或家用蹦床上尽情弹跳', steps: '1. 穿防滑袜，热身5分钟\n2. 从基础弹跳到花式动作\n3. 组间休息，补水', materials: '防滑袜、蹦床馆门票/家用蹦床、水壶', tips: '不要多人同时在一个蹦床区域；学习正确落地的姿势', duration: '30-45分钟', mood: '兴奋', energy: '高', category: '运动类', weather: '不限', location: '在家', duration_min: 35 },
  { name: '卡丁车', description: '驾驶卡丁车在赛道上飞驰，享受速度与激情', steps: '1. 佩戴头盔，调整座椅\n2. 熟悉赛道和刹车油门\n3. 驾驶3-4轮，每轮8-10圈', materials: '卡丁车馆费用、运动鞋', tips: '安全第一，遵守赛道规则；入弯前减速出弯加速；保持视线看向前方', duration: '30-60分钟', mood: '兴奋', energy: '高', category: '娱乐类', weather: '不限', location: '室外', duration_min: 45 },

  // ===== 兴奋 + 中 =====
  { name: 'KTV唱歌', description: '去KTV唱歌，尽情释放表演欲和欢乐情绪', steps: '1. 预约KTV包间\n2. 点歌，每人轮流唱\n3. 合唱、喝彩，享受音乐氛围', materials: 'KTV费用、润喉糖', tips: '开唱前简单开嗓；点大家都会的歌更有氛围；适度用嗓保护声带', duration: '1-2小时', mood: '兴奋', energy: '中', category: '娱乐类', weather: '不限', location: '室内', duration_min: 75 },
  { name: '密室逃脱', description: '和朋友一起挑战密室逃脱，解谜闯关', steps: '1. 选择主题预订房间\n2. 分组分工搜索线索\n3. 合作解谜，争取在时间内逃出', materials: '密室费用（通常60-120元/人）', tips: '仔细搜索每个角落；及时和队友分享线索；不懂可以请求提示', duration: '45-60分钟', mood: '兴奋', energy: '中', category: '娱乐类', weather: '不限', location: '室内', duration_min: 50 },
  { name: '学一支舞蹈', description: '跟着视频学一支流行舞蹈，有趣又有成就感', steps: '1. 选择喜欢的舞蹈教程\n2. 分解动作逐个学习\n3. 配合音乐完整跳3-5遍', materials: '手机/电视播放教程、运动鞋、舒适衣物', tips: '从慢速开始；对着镜子练习；录下自己的视频对比改进', duration: '30-45分钟', mood: '兴奋', energy: '中', category: '运动类', weather: '不限', location: '在家', duration_min: 35 },

  // ===== 兴奋 + 低 =====
  { name: '看热血电影', description: '观看一部热血励志电影，感受激情和感动', steps: '1. 选择一部高分热血电影\n2. 准备零食和饮料，调暗灯光\n3. 沉浸观看，感受故事的力量', materials: '投影仪/电视、电影片单、零食、毛毯', tips: '推荐《阿甘正传》《当幸福来敲门》；关灯看更有氛围', duration: '1.5-2.5小时', mood: '兴奋', energy: '低', category: '娱乐类', weather: '下雨', location: '在家', duration_min: 100 },
  { name: '玩激情游戏', description: '玩一局竞技性或故事性强的电子游戏', steps: '1. 打开游戏主机或电脑\n2. 选择喜欢的游戏（竞技/冒险/剧情）\n3. 玩30-60分钟，注意休息', materials: '游戏主机/电脑、手柄/键鼠、显示器', tips: '设置定时提醒防止沉迷；每30分钟远眺休息', duration: '30-60分钟', mood: '兴奋', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 45 },
  { name: '看体育比赛', description: '观看一场精彩的体育比赛直播，为喜欢的队伍加油', steps: '1. 查看今日赛事安排\n2. 准备零食和饮料\n3. 观看比赛，感受竞技的激情', materials: '电视/手机/平板、零食、饮料', tips: '和朋友一起看更有氛围；关注赛事预告不错过精彩', duration: '1-3小时', mood: '兴奋', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 90 },

  // ===== 无聊 + 高 =====
  { name: 'DIY木工', description: '尝试简单的木工DIY，制作实用小物件（手机架等）', steps: '1. 设计图纸，标记尺寸\n2. 锯切木材，打磨边缘\n3. 组装上漆，完成成品', materials: '木材、锯子、砂纸、木工胶、尺子、铅笔', tips: '初学者选简单项目；戴手套防木刺；工作台保持整洁', duration: '1-2小时', mood: '无聊', energy: '高', category: '生活类', weather: '不限', location: '在家', duration_min: 75 },
  { name: '志愿者活动', description: '参加志愿者活动，帮助他人让时间变得有意义', steps: '1. 查找本地志愿者招募信息\n2. 报名并参加培训\n3. 按时参与服务活动', materials: '舒适衣物、水杯、志愿者注册', tips: '选择感兴趣的领域（动物/环保/教育）；量力而行；坚持比一次重要', duration: '2-4小时', mood: '无聊', energy: '高', category: '生活类', weather: '晴天', location: '室外', duration_min: 150 },
  { name: '学一项新技能', description: '利用在线教程快速学习一项新技能', steps: '1. 选择想学的技能（摄影/剪辑/编程等）\n2. 找免费入门教程\n3. 跟着做一个简单的项目', materials: '电脑/手机、网络、笔记本', tips: '从最小项目开始；不要追求完美；每天坚持练习30分钟', duration: '30-60分钟', mood: '无聊', energy: '高', category: '生活类', weather: '不限', location: '在家', duration_min: 45 },

  // ===== 无聊 + 中 =====
  { name: '拼图挑战', description: '挑战500-1000片的拼图，专注又解压', steps: '1. 倒出所有拼图，按颜色分类\n2. 先拼边框，再拼色块\n3. 逐个区域完成，感受成就感', materials: '拼图（500-1000片）、拼图垫、分类盒', tips: '在光线好的地方拼；从特征明显的区域开始；每天拼一点', duration: '1-3小时', mood: '无聊', energy: '中', category: '娱乐类', weather: '不限', location: '在家', duration_min: 90 },
  { name: '烘焙甜点', description: '烘焙饼干或蛋糕，香甜的味道让心情变好', steps: '1. 称量所有材料\n2. 按顺序混合搅拌\n3. 放入烤箱，等待出炉', materials: '烤箱、面粉、糖、鸡蛋、黄油、模具、秤', tips: '严格按照配方比例；烤箱提前预热；注意安全防烫', duration: '40-80分钟', mood: '无聊', energy: '中', category: '生活类', weather: '不限', location: '在家', duration_min: 60 },
  { name: '学乐器入门', description: '学习一种乐器的基础演奏（尤克里里/口琴等）', steps: '1. 准备乐器（推荐尤克里里或口琴）\n2. 学习基础指法和音阶\n3. 练习弹奏一首简单曲子', materials: '乐器（尤克里里/口琴/竖笛）、调音器、教程', tips: '入门乐器选择性价比高的；每天练15分钟比每周2小时有效', duration: '20-40分钟', mood: '无聊', energy: '中', category: '艺术类', weather: '不限', location: '在家', duration_min: 30 },

  // ===== 无聊 + 低 =====
  { name: '看纪录片', description: '看一部有趣的自然或人文纪录片，既放松又长知识', steps: '1. 选择高分纪录片\n2. 准备舒适的观看环境\n3. 边看边记录有趣的知识点', materials: '电视/电脑、纪录片清单（推荐BBC/Netflix）', tips: '推荐《地球脉动》《人类星球》；看纪录片比刷短视频更有获得感', duration: '45-60分钟', mood: '无聊', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 50 },
  { name: '数独/逻辑谜题', description: '做数独或逻辑谜题，动脑解闷', steps: '1. 准备数独书或下载App\n2. 从初级难度开始\n3. 逐步挑战更高级别', materials: '数独书/App、铅笔、橡皮', tips: '从简单开始建立信心；遇到困难先放一放再回来', duration: '15-30分钟', mood: '无聊', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 20 },
  { name: '整理旧照片', description: '翻看和整理手机里的旧照片，回忆美好时光', steps: '1. 打开相册，按年份浏览\n2. 删除模糊重复的照片\n3. 精选照片创建主题相册', materials: '手机/电脑、云存储空间', tips: '按事件或年份分类；备份到云端防止丢失；可以制作电子相册', duration: '20-40分钟', mood: '无聊', energy: '低', category: '生活类', weather: '不限', location: '在家', duration_min: 30 },

  // ===== 新增活动（补齐筛选覆盖）=====

  // 开心 + 高：补齐 5分钟/15分钟
  { name: '快速拉伸操', description: '在阳台或客厅做一套快速全身拉伸，唤醒身体', steps: '1. 站立，双臂上举拉伸30秒\n2. 体侧屈左右各30秒\n3. 腿部前后摆动各1分钟', materials: '瑜伽垫（可选）、舒适衣物', tips: '拉伸时保持呼吸；不要弹震式拉伸；以舒适为度', duration: '5-10分钟', mood: '开心', energy: '高', category: '运动类', weather: '不限', location: '在家', duration_min: 8 },
  // 开心 + 中：补齐 5分钟/15分钟
  { name: '手指韵律操', description: '通过手指的灵活运动来活跃大脑，简单有趣', steps: '1. 双手握拳再张开，重复20次\n2. 左右手指依次对碰\n3. 手指交叉翻转练习', materials: '无需特殊材料', tips: '可以配合节奏感音乐进行；每天练习可提高手指灵活性', duration: '5-10分钟', mood: '开心', energy: '中', category: '娱乐类', weather: '不限', location: '在家', duration_min: 8 },
  // 开心 + 低：补齐 5分钟 + 1小时+
  { name: '阳台看日出', description: '早起在阳台静静观看日出，感受新一天的开始', steps: '1. 查看当天日出时间\n2. 提前5分钟到阳台\n3. 安静观看，拍照记录', materials: '手机（拍日出）、保温杯（热饮）', tips: '查看天气预报选晴天观看；注意保暖', duration: '5-10分钟', mood: '开心', energy: '低', category: '自然类', weather: '不限', location: '在家', duration_min: 5 },
  { name: '追剧时光', description: '找一部喜欢的电视剧或综艺，沉浸式享受', steps: '1. 挑选想看的剧集\n2. 准备零食和毯子\n3. 连看2-3集', materials: '电视/平板、零食、毛毯', tips: '每看一集站起来活动一下；控制总时长避免久坐', duration: '1-2小时', mood: '开心', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 60 },

  // 疲惫 + 高：补齐 室外 + 5分钟 + 15分钟 + 1小时+
  { name: '阳台深呼吸', description: '在开放阳台做深呼吸，吸入新鲜空气', steps: '1. 站到阳台，双手叉腰\n2. 用鼻子深吸4秒\n3. 用嘴缓慢呼气8秒，重复10轮', materials: '舒适衣物', tips: '保持背部挺直；呼气时间是吸气两倍；感觉头晕就暂停', duration: '5-10分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '吊床午睡', description: '在户外树荫下的吊床中小憩片刻', steps: '1. 在树荫下固定好吊床\n2. 躺入吊床调整舒适姿势\n3. 盖上薄毯小睡30-60分钟', materials: '吊床、固定绳、薄毯', tips: '选择平坦安全的地点；避开正午烈日；设闹钟防止睡过头', duration: '30-60分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '不限', location: '室外', duration_min: 60 },
  // 疲惫 + 中：补齐 5分钟 + 15分钟 + 1小时+
  { name: '眼保健操', description: '做一套完整的眼保健操，缓解眼疲劳', steps: '1. 闭目放松30秒\n2. 按揉太阳穴、攒竹穴各24次\n3. 远近交替调焦1分钟', materials: '无需特殊材料', tips: '做操前先洗手；动作轻柔不要用力按压', duration: '5-10分钟', mood: '疲惫', energy: '中', category: '放松类', weather: '不限', location: '在家', duration_min: 5 },
  { name: '泡脚放松', description: '用热水泡脚，配合按摩缓解全身疲劳', steps: '1. 准备40°C左右热水\n2. 浸泡双脚15-20分钟\n3. 擦干后按摩足底3分钟', materials: '泡脚桶、热水、浴盐（可选）、毛巾', tips: '水温不要过高以免烫伤；泡后及时擦干保暖', duration: '20-30分钟', mood: '疲惫', energy: '中', category: '放松类', weather: '不限', location: '在家', duration_min: 60 },
  // 疲惫 + 低：补齐 室外 + 5分钟 + 1小时+
  { name: '摇椅观云', description: '在庭院或阳台的摇椅上看云卷云舒', steps: '1. 搬一把摇椅到阳台或庭院\n2. 盖上薄毯舒服躺下\n3. 仰望天空，观察云朵变化', materials: '摇椅、薄毯、热饮', tips: '选择天气好的时候；放下手机专注看云；可配合轻音乐', duration: '10-15分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '不限', location: '室外', duration_min: 10 },
  { name: '户外吊床小憩', description: '在庭院或公园吊床上悠闲度过午后', steps: '1. 选择树荫处挂好吊床\n2. 带上耳机听舒缓音乐\n3. 闭眼放松30-60分钟', materials: '吊床、耳机、防晒帽', tips: '注意防晒；选择安静安全的地点', duration: '30-60分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '不限', location: '室外', duration_min: 60 },

  // 焦虑 + 高：补齐 5分钟 + 15分钟 + 1小时+
  { name: '深呼吸放松', description: '用4-7-8呼吸法快速平复焦虑情绪', steps: '1. 坐直，手放腹部\n2. 吸气4秒→屏息7秒→呼气8秒\n3. 重复5轮', materials: '计时器', tips: '呼气要慢而长；初期可能头晕，逐渐适应', duration: '5-10分钟', mood: '焦虑', energy: '高', category: '放松类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '长距离慢跑', description: '在公园或河边进行长距离慢跑，释放压力', steps: '1. 热身5分钟动态拉伸\n2. 慢跑5-8公里，保持匀速\n3. 冷身5分钟静态拉伸', materials: '跑鞋、运动服、水壶、心率带（可选）', tips: '保持心率在有氧区间；跑前补充碳水；跑后补充蛋白质', duration: '40-60分钟', mood: '焦虑', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 60 },
  // 焦虑 + 中：补齐 室外 + 5分钟
  { name: '公园快走', description: '在公园快步行走，让焦虑随汗水释放', steps: '1. 选择平坦的公园步道\n2. 快走15-20分钟，保持心率\n3. 最后慢走5分钟放松', materials: '运动鞋、运动服、水壶', tips: '摆臂幅度要大；步伐比日常走路稍大；注意呼吸节奏', duration: '15-25分钟', mood: '焦虑', energy: '中', category: '运动类', weather: '不限', location: '室外', duration_min: 10 },
  // 焦虑 + 低：补齐 1小时+
  { name: '抄经静心', description: '通过抄写经书或优美文字让心沉静下来', steps: '1. 准备纸笔和要抄写的文本\n2. 端正坐姿，一笔一画抄写\n3. 完成后默读一遍', materials: '钢笔/毛笔、纸、字帖或经文', tips: '不追求速度，重在专注；可以放轻音乐辅助', duration: '40-60分钟', mood: '焦虑', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 60 },

  // 平静 + 高：补齐 在家 + 5分钟 + 1小时+
  { name: '居家园艺', description: '给家里的绿植浇水、擦拭叶片，与植物安静相处', steps: '1. 检查每盆植物的土壤干湿\n2. 浇水、喷湿叶片\n3. 用湿布擦拭叶片灰尘', materials: '喷壶、浇水壶、湿布', tips: '不同植物需水量不同；摸土壤判断是否需浇水', duration: '5-10分钟', mood: '平静', energy: '高', category: '自然类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '茶道品茗', description: '用心泡一壶茶，享受完整的茶道仪式', steps: '1. 温杯洁具，放入茶叶\n2. 注水冲泡，等待出汤\n3. 闻香、品茗，慢慢回味', materials: '茶具套装、茶叶（乌龙/普洱/红茶）、开水壶', tips: '水温根据茶类调整；每泡时间逐渐延长；专注每一个动作', duration: '40-60分钟', mood: '平静', energy: '高', category: '生活类', weather: '不限', location: '在家', duration_min: 60 },
  // 平静 + 中：补齐 5分钟 + 15分钟 + 30分钟
  { name: '书桌整理', description: '花几分钟整理书桌，在整洁中获得秩序感', steps: '1. 清空桌面，分类物品\n2. 擦拭桌面，归位物品\n3. 丢掉不需要的杂物', materials: '抹布、收纳盒、垃圾袋', tips: '一次只需整理一个区域；保持常用物品触手可及', duration: '5-10分钟', mood: '平静', energy: '中', category: '生活类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '品读短诗', description: '找一本诗集，静心品读几首短诗', steps: '1. 选择一本喜爱的诗集\n2. 挑2-3首短诗慢慢品读\n3. 把喜欢的句子抄录下来', materials: '诗集、笔记本、笔', tips: '读出声来更能感受韵律；不必一次读完', duration: '25-35分钟', mood: '平静', energy: '中', category: '艺术类', weather: '不限', location: '在家', duration_min: 30 },
  // 平静 + 低：补齐 5分钟 + 1小时+
  { name: '身体扫描冥想', description: '从头到脚逐一扫描身体各部位，深度放松', steps: '1. 躺下或坐直，闭眼\n2. 从头顶开始，逐部位感受\n3. 每个部位停留30秒，自然呼吸', materials: '瑜伽垫或床', tips: '注意力温和地移动；不要评判任何感受', duration: '8-15分钟', mood: '平静', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '手磨咖啡', description: '用手摇磨豆机研磨咖啡，享受慢时光', steps: '1. 称量15g咖啡豆\n2. 手摇磨豆至均匀粉末\n3. 手冲或法压壶冲泡', materials: '手摇磨豆机、咖啡豆、手冲壶、滤纸', tips: '磨豆前再称豆保持新鲜；水粉比1:15为宜', duration: '40-60分钟', mood: '平静', energy: '低', category: '生活类', weather: '不限', location: '在家', duration_min: 60 },

  // 兴奋 + 高：补齐 5分钟 + 15分钟
  { name: '开合跳挑战', description: '做一组开合跳挑战，快速提升心率', steps: '1. 站立双手垂放\n2. 跳起同时双手上举、双脚打开\n3. 连续做3组，每组20次', materials: '运动鞋、运动服', tips: '落地时膝盖微屈缓冲；保持核心收紧', duration: '5-10分钟', mood: '兴奋', energy: '高', category: '运动类', weather: '不限', location: '在家', duration_min: 8 },
  // 兴奋 + 中：补齐 室外 + 5分钟
  { name: '户外飞盘', description: '和好友在草地上玩飞盘，充满活力', steps: '1. 找一片开阔草坪\n2. 两人相距10-15米传接飞盘\n3. 尝试正手反手不同投法', materials: '飞盘、运动鞋、水壶', tips: '投掷时手腕发力；接盘时双手迎向飞盘', duration: '15-25分钟', mood: '兴奋', energy: '中', category: '运动类', weather: '不限', location: '室外', duration_min: 10 },
  // 兴奋 + 低：补齐 室外 + 5分钟 + 15分钟 + 30分钟
  { name: '街头滑板', description: '在平整的广场练习滑板基础动作', steps: '1. 穿戴护具（头盔、护膝、护肘）\n2. 练习上板、滑行、转弯\n3. 尝试简单的豚跳或荡板', materials: '滑板、头盔、护膝、护肘', tips: '初学者先在草地练习上板平衡；选择平整无车流的场地', duration: '10-20分钟', mood: '兴奋', energy: '低', category: '运动类', weather: '不限', location: '室外', duration_min: 10 },
  { name: '跳舞毯', description: '跟着跳舞毯游戏节奏踩踏舞步，快乐出汗', steps: '1. 连接跳舞毯到游戏主机\n2. 选择一首喜欢的歌曲\n3. 跟随箭头提示踩踏舞步', materials: '跳舞毯、游戏主机/电脑、电视', tips: '先从简单模式开始；穿软底鞋保护脚踝', duration: '25-35分钟', mood: '兴奋', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 30 },

  // 无聊 + 高：补齐 5分钟 + 15分钟 + 30分钟
  { name: '折纸挑战', description: '跟着教程折一个有趣的折纸作品', steps: '1. 准备正方形折纸\n2. 选择教程（千纸鹤/纸飞机/花朵）\n3. 按步骤折叠完成作品', materials: '彩色折纸、教程视频或图解', tips: '折痕要压平；角对角对齐；从简单造型开始', duration: '5-10分钟', mood: '无聊', energy: '高', category: '艺术类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '乐高小拼装', description: '用乐高积木拼装一个小造型', steps: '1. 选择要拼的造型\n2. 按图纸分类积木颗粒\n3. 逐步拼搭完成', materials: '乐高积木套装', tips: '按颜色分类颗粒方便寻找；拼错了也没关系', duration: '25-40分钟', mood: '无聊', energy: '高', category: '娱乐类', weather: '不限', location: '在家', duration_min: 30 },
  // 无聊 + 中：补齐 室外 + 5分钟
  { name: '户外寻宝', description: '在小区或公园里按照线索寻找隐藏的"宝藏"', steps: '1. 在手机上下载寻宝App\n2. 选择附近的寻宝路线\n3. 根据GPS线索寻找宝藏', materials: '手机、充电宝、舒适鞋子', tips: '带上朋友一起更有趣；注意防晒和补水', duration: '10-20分钟', mood: '无聊', energy: '中', category: '娱乐类', weather: '不限', location: '室外', duration_min: 10 },
  // 无聊 + 低：补齐 室外 + 5分钟
  { name: '小区散步', description: '在小区里悠闲地走一圈，看看花草树木', steps: '1. 换好舒适的鞋子\n2. 沿小区步道慢走一圈\n3. 途中观察花草、听听鸟叫', materials: '舒适的鞋子', tips: '放慢脚步注意观察；可以听听播客或音乐', duration: '10-15分钟', mood: '无聊', energy: '低', category: '生活类', weather: '不限', location: '室外', duration_min: 10 },

  // ===== 补齐 ALL 648 种筛选组合 =====
  // 策略：每组补齐 short(≤10)×室外 + short(≤10)×home + long(≥50)×室外 + long(≥50)×home

  // --- ≤10 × 不限 × 室外（11组）---
  { name: '晨间快走', description: '清晨在小区快步走一圈，唤醒身体和大脑', steps: '1. 换好运动鞋\n2. 快走5-8分钟，手臂自然摆动\n3. 深呼吸收尾', materials: '运动鞋、运动服', tips: '保持抬头挺胸；步伐比日常稍大；注意呼吸节奏', duration: '5-10分钟', mood: '开心', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '花园赏花', description: '在小区花园或公园里欣赏盛开的花朵', steps: '1. 找到最近的花园\n2. 慢慢走一圈欣赏不同花卉\n3. 拍几张花的照片', materials: '手机（拍照）', tips: '早晨花朵最新鲜；蹲下来换个视角拍摄', duration: '5-10分钟', mood: '开心', energy: '中', category: '自然类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '小院散步', description: '在自家小院或楼下空地悠闲走几步', steps: '1. 走到户外空地\n2. 慢慢走几圈，感受阳光和微风\n3. 做几个伸展动作', materials: '舒适的鞋子', tips: '放慢脚步关注当下；不需要走很远', duration: '5-10分钟', mood: '开心', energy: '低', category: '运动类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '树下深呼吸', description: '在大树下做几组深呼吸，吸收新鲜空气', steps: '1. 找一棵大树\n2. 面对树冠站立，吸气4秒\n3. 呼气6秒，重复5轮', materials: '无需特殊材料', tips: '选择空气清新的地方；可以光脚踩草地接地气', duration: '5-10分钟', mood: '疲惫', energy: '中', category: '放松类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '林间小跑', description: '在林荫小道上轻松慢跑，释放压力', steps: '1. 热身踝关节绕圈\n2. 慢跑5-8分钟，保持轻松节奏\n3. 慢走1分钟冷身', materials: '跑鞋、运动服', tips: '选择平整路面；落地轻盈；跑完后拉伸小腿', duration: '5-10分钟', mood: '焦虑', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '水边静立', description: '在河边或湖边静静站立，听水流声放松', steps: '1. 走到水边安全位置\n2. 闭眼静立，听水流声\n3. 深呼吸3轮，睁眼欣赏水面', materials: '无需特殊材料', tips: '注意脚下安全；选择安静无人的河段', duration: '5-10分钟', mood: '焦虑', energy: '低', category: '自然类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '露台瑜伽', description: '在露台或阳台上做几式简单瑜伽体式', steps: '1. 铺好瑜伽垫\n2. 做山式站姿30秒\n3. 树式左右各30秒，前屈30秒', materials: '瑜伽垫', tips: '保持呼吸平稳；平衡不稳时可扶墙', duration: '5-10分钟', mood: '平静', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '园中品茗', description: '在花园里泡一杯茶，享受户外茶时光', steps: '1. 用保温杯泡好茶带到花园\n2. 找长椅坐下\n3. 小口品茶，欣赏周围景色', materials: '保温杯、茶叶', tips: '选择花草茶或绿茶；注意防蚊虫', duration: '5-10分钟', mood: '平静', energy: '中', category: '生活类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '草地赤足', description: '脱掉鞋袜在草地上行走，接地气放松', steps: '1. 找一片干净的草地\n2. 脱鞋脱袜，慢慢踏上草地\n3. 走2-3分钟，感受草地的触感', materials: '纸巾（擦脚）', tips: '检查草地无尖锐物；温度适中时进行；注意卫生', duration: '5-10分钟', mood: '平静', energy: '低', category: '放松类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '冲刺短跑', description: '在跑道上做几组短距离冲刺，激活全身', steps: '1. 动态热身5分钟\n2. 30米冲刺×3组，组间休息30秒\n3. 慢走冷身', materials: '跑鞋、运动服', tips: '充分热身避免拉伤；冲刺时摆臂有力', duration: '5-10分钟', mood: '兴奋', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 8 },
  { name: '户外投掷', description: '在开阔场地练习投掷飞盘或沙包', steps: '1. 找开阔空地\n2. 练习正手反手投掷\n3. 设置目标物尝试命中', materials: '飞盘或沙包', tips: '注意周围无人再投掷；手腕发力控制方向', duration: '5-10分钟', mood: '无聊', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 8 },

  // --- ≥50 × 不限 × 室外（15组）---
  { name: '郊野徒步', description: '到郊外徒步路线走一走，享受自然野趣', steps: '1. 查看徒步路线\n2. 带上补给匀速前进\n3. 途中拍照休息', materials: '徒步鞋、背包、水、零食、防晒帽', tips: '提前查看天气；穿长裤防刮伤；带足饮水', duration: '45-90分钟', mood: '开心', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '公园写生', description: '在公园里用水彩或铅笔描绘眼前的风景', steps: '1. 选好写生位置\n2. 铅笔起稿勾勒轮廓\n3. 上色或细化细节', materials: '写生本、铅笔、水彩颜料、便携画架', tips: '选光线稳定的时间段；从简单构图开始', duration: '40-60分钟', mood: '开心', energy: '中', category: '艺术类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '湖边野餐', description: '在湖边铺上野餐垫，享受悠闲的户外野餐', steps: '1. 准备三明治、水果、饮品\n2. 铺好野餐垫\n3. 边吃边欣赏湖景', materials: '野餐垫、食物、饮品、餐具、垃圾袋', tips: '选择树荫下的位置；注意防蚊虫；带走所有垃圾', duration: '40-60分钟', mood: '开心', energy: '低', category: '生活类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '林间吊床', description: '在树林间挂上吊床，享受微微摇晃的放松', steps: '1. 选两棵距离合适的树\n2. 固定吊床两端\n3. 躺入吊床闭眼休息', materials: '吊床、固定带、薄毯', tips: '选粗壮的树干；固定高度以坐姿脚着地为准', duration: '40-60分钟', mood: '疲惫', energy: '中', category: '放松类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '登山远眺', description: '爬上一座小山丘，在山顶俯瞰风景', steps: '1. 选择附近的小山丘\n2. 沿步道匀速攀登\n3. 登顶后休息欣赏全景', materials: '登山鞋、水、零食', tips: '选择有步道的成熟路线；注意防晒；带好垃圾袋', duration: '40-60分钟', mood: '焦虑', energy: '中', category: '运动类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '江边漫步', description: '沿着江边步道悠闲漫步，看江水东流', steps: '1. 到江边步道\n2. 沿江慢走，看往来的船只\n3. 在长椅上坐一会儿', materials: '舒适的鞋子、水杯', tips: '傍晚时分江景最美；注意步道安全', duration: '40-60分钟', mood: '焦虑', energy: '低', category: '自然类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '湖畔垂钓', description: '在湖边安静垂钓，享受等待的专注', steps: '1. 准备钓具和鱼饵\n2. 选好钓位打窝下竿\n3. 安静等待，享受自然', materials: '鱼竿、鱼线、鱼钩、鱼饵、折叠椅', tips: '提前了解钓鱼规定；注意防晒；享受过程比收获重要', duration: '40-60分钟', mood: '平静', energy: '高', category: '自然类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '户外读书', description: '在公园长椅上阅读一本喜欢的书', steps: '1. 选一本轻松的书\n2. 到公园找树荫下的长椅\n3. 安静阅读30-60分钟', materials: '书、水杯、防晒帽', tips: '选择光线充足的座位；每20分钟远眺放松眼睛', duration: '40-60分钟', mood: '平静', energy: '中', category: '娱乐类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '长椅观景', description: '坐在公园长椅上看来往的行人和风景', steps: '1. 找视野开阔的长椅\n2. 坐下放松，观察周围\n3. 放空大脑静静享受', materials: '水杯、帽子', tips: '选择人少安静的区域；放下手机专注感受', duration: '40-60分钟', mood: '平静', energy: '低', category: '放松类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '越野跑', description: '在山野小路上进行越野跑，挑战自我', steps: '1. 选择越野跑路线\n2. 热身5分钟后出发\n3. 跑走结合完成5-8公里', materials: '越野跑鞋、水袋背包、能量胶、GPS手表', tips: '注意脚下路况；上坡小步走，下坡控制速度', duration: '40-60分钟', mood: '兴奋', energy: '高', category: '运动类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '户外探险', description: '探索城市中没去过的角落或小巷', steps: '1. 在地图上标记想探索的区域\n2. 步行前往，边走边发现\n3. 记录有趣的发现', materials: '手机地图、充电宝、舒适的鞋子', tips: '结伴出行更安全；注意时间规划', duration: '40-60分钟', mood: '兴奋', energy: '中', category: '娱乐类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '户外烧烤', description: '在郊外或庭院里举办小型烧烤聚会', steps: '1. 准备食材和炭火\n2. 生火后依次烤制食物\n3. 边烤边吃，享受户外美食', materials: '烧烤炉、炭、食材、调料、锡纸', tips: '注意用火安全；食材提前腌制更入味；准备灭火用水', duration: '40-60分钟', mood: '兴奋', energy: '低', category: '生活类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '户外摄影', description: '带着相机出门拍摄自然风光或城市街景', steps: '1. 确定拍摄主题\n2. 寻找有趣的构图和光影\n3. 从不同角度拍摄同一景物', materials: '相机或手机、备用电池', tips: '黄金时刻（日出后/日落前）光线最佳；多尝试不同视角', duration: '40-60分钟', mood: '无聊', energy: '高', category: '艺术类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '野外写生', description: '在野外用画笔记录自然风景', steps: '1. 带写生本到风景优美处\n2. 简单勾勒轮廓\n3. 用色彩填充细节', materials: '写生本、铅笔、彩色铅笔或水彩', tips: '选一个舒适的坐姿；不必追求完美；记录当下的感受', duration: '40-60分钟', mood: '无聊', energy: '中', category: '艺术类', weather: '不限', location: '室外', duration_min: 60 },
  { name: '放风筝', description: '在空旷的公园或海滩放风筝', steps: '1. 购买或制作风筝\n2. 到空旷场地逆风奔跑放飞\n3. 控制线绳让风筝飞高', materials: '风筝、线轴、手套', tips: '选择有风的天气；远离电线杆和树木', duration: '40-60分钟', mood: '无聊', energy: '低', category: '娱乐类', weather: '不限', location: '室外', duration_min: 60 },

  // --- ≤10 × 不限 × 在家/室内（7组）---
  { name: '肩颈放松', description: '在椅子上做简单的肩颈放松动作', steps: '1. 坐直，双肩放松\n2. 颈部左右侧屈各30秒\n3. 双肩从前向后绕圈10次', materials: '椅子', tips: '动作要缓慢；不要耸肩；配合深呼吸效果更好', duration: '5-10分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '闭目养神', description: '在沙发上闭眼放松几分钟，什么都不想', steps: '1. 在沙发或床上躺下\n2. 闭眼，双手放腹部\n3. 自然呼吸5分钟', materials: '毯子（可选）', tips: '设一个小闹钟避免睡过去；室温调至舒适温度', duration: '5-10分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '折纸静心', description: '折一只千纸鹤或纸花，在手部动作中静心', steps: '1. 准备一张方形折纸\n2. 跟着教程一步步折叠\n3. 完成后放在桌上欣赏', materials: '折纸、教程', tips: '折痕要压平整；注意力集中在手指动作上', duration: '5-10分钟', mood: '焦虑', energy: '中', category: '艺术类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '原地高抬腿', description: '在房间做高抬腿运动，快速提升心率', steps: '1. 站立，双手叉腰\n2. 交替抬高膝盖至腰部高度\n3. 做3组每组20次，组间休息15秒', materials: '运动鞋、运动服', tips: '落地要轻；保持背部挺直；速度由慢到快', duration: '5-10分钟', mood: '兴奋', energy: '中', category: '运动类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '枕头大战', description: '和室友或自己玩一场欢乐的枕头大战', steps: '1. 准备一个柔软的枕头\n2. 对着床或沙发拍打\n3. 尽情释放能量直到出汗', materials: '枕头', tips: '注意周围易碎物品；可以放快节奏音乐助兴', duration: '5-10分钟', mood: '兴奋', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '室内投篮', description: '用纸团和垃圾桶玩室内投篮游戏', steps: '1. 准备废纸揉成纸团\n2. 垃圾桶放在2-3米外\n3. 投篮10次，计数命中次数', materials: '废纸、垃圾桶', tips: '调整距离和角度；可以和家人比赛', duration: '5-10分钟', mood: '无聊', energy: '中', category: '娱乐类', weather: '不限', location: '在家', duration_min: 8 },
  { name: '桌上冰壶', description: '用硬币在桌面上玩冰壶游戏', steps: '1. 在桌面一端画一个靶心\n2. 从另一端滑出硬币\n3. 比谁离靶心更近', materials: '硬币或瓶盖、胶带（画靶心）', tips: '桌面要光滑；控制力度是关键', duration: '5-10分钟', mood: '无聊', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 8 },

  // --- ≥50 × 不限 × 在家/室内（5组）---
  { name: '室内健身操', description: '跟着视频做一套完整的室内健身操', steps: '1. 打开健身操视频\n2. 跟随教练完成全套动作\n3. 最后5分钟拉伸放松', materials: '瑜伽垫、运动服、手机/电视', tips: '根据自身体能调整动作幅度；保持水分补充', duration: '40-60分钟', mood: '开心', energy: '高', category: '运动类', weather: '不限', location: '在家', duration_min: 60 },
  { name: '躺卧听书', description: '躺着听一本有声书或播客，不费力的放松', steps: '1. 选择一本感兴趣的有声书\n2. 躺在床上闭眼聆听\n3. 听到有意思的地方暂停思考', materials: '手机、耳机', tips: '设置定时关闭防止睡着后继续播放；选择节奏舒缓的书', duration: '40-60分钟', mood: '疲惫', energy: '高', category: '娱乐类', weather: '不限', location: '在家', duration_min: 60 },
  { name: '床上拉伸', description: '在床上做一套完整的全身被动拉伸', steps: '1. 仰卧，双膝抱胸30秒\n2. 蝴蝶式拉伸大腿内侧\n3. 脊柱扭转左右各30秒', materials: '床或瑜伽垫、枕头', tips: '动作要慢；拉伸到微酸即可；配合深呼吸', duration: '40-60分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 60 },
  { name: '静心抄写', description: '安静地抄写一篇喜欢的文章或诗词', steps: '1. 准备纸笔和要抄写的文本\n2. 端正坐姿开始抄写\n3. 完成后默读一遍自己写的内容', materials: '钢笔、纸、字帖或书籍', tips: '不追求速度；注意字迹工整；可以放轻音乐辅助', duration: '40-60分钟', mood: '焦虑', energy: '高', category: '放松类', weather: '不限', location: '在家', duration_min: 60 },
  { name: '家居整理', description: '花时间彻底整理一个房间，获得秩序感', steps: '1. 选定要整理的房间\n2. 分类物品：保留、捐赠、丢弃\n3. 擦拭收纳，恢复整洁', materials: '收纳盒、垃圾袋、抹布', tips: '一次只整理一个区域；断舍离不犹豫', duration: '40-60分钟', mood: '焦虑', energy: '中', category: '生活类', weather: '不限', location: '在家', duration_min: 60 },

  // ===== 新增 72 个活动 =====
  // ===== 开心 + 高（4个）=====
  { name: '活力开合跳', description: '做一组开合跳快速唤醒身体，心情随之飞扬', steps: '1. 站立，双手垂放两侧\n2. 跳起双脚打开、双手上举击掌\n3. 连续做50次，分2组完成', materials: '运动鞋、运动服', tips: '落地时膝盖微屈缓冲；保持均匀呼吸', duration: '5分钟', mood: '开心', energy: '高', category: '运动类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '短途骑行', description: '在晴朗天气里骑行一小段路，感受微风拂面', steps: '1. 检查自行车胎压和刹车\n2. 沿绿道骑行10-15分钟\n3. 找一处风景好的地方停下休息', materials: '自行车、头盔、水壶', tips: '佩戴头盔确保安全；选择人少的骑行路线', duration: '15分钟', mood: '开心', energy: '高', category: '运动类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '家庭卡拉OK', description: '在家用麦克风唱歌，释放快乐能量', steps: '1. 连接麦克风或打开K歌App\n2. 选择喜欢的歌曲列表\n3. 尽情唱30分钟', materials: '麦克风/手机K歌App、音箱', tips: '选节奏欢快的歌；可以邀请家人一起合唱', duration: '30分钟', mood: '开心', energy: '高', category: '娱乐类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '大幅丙烯画创作', description: '在画布上大胆挥洒色彩，用抽象画表达快乐', steps: '1. 固定画布，挤好颜料\n2. 用大刷子大胆铺色\n3. 叠加细节直到满意', materials: '丙烯颜料、画布、大小画笔、调色盘', tips: '不要怕画错，丙烯可以覆盖；大胆使用鲜艳色彩', duration: '1小时以上', mood: '开心', energy: '高', category: '艺术类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 开心 + 中（4个）=====
  { name: '自拍搞怪照', description: '用手机拍几组搞怪自拍，记录当下的好心情', steps: '1. 找光线好的位置\n2. 尝试不同角度和表情\n3. 加上滤镜和贴纸分享给朋友', materials: '手机、自拍杆（可选）', tips: '自然光效果最好；放松表情更自然', duration: '5分钟', mood: '开心', energy: '中', category: '娱乐类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '花丛赏蝶', description: '在花园里观赏蝴蝶在花丛中飞舞的美丽画面', steps: '1. 找到有花朵的花园或公园\n2. 静静等待蝴蝶飞来\n3. 观察蝴蝶采蜜的过程并拍照', materials: '手机或相机', tips: '穿颜色鲜艳的衣服吸引蝴蝶；保持安静不要惊扰', duration: '15分钟', mood: '开心', energy: '中', category: '自然类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '创意水果拼盘', description: '把水果切成有趣的形状摆盘，好看又好吃', steps: '1. 选择3-4种颜色不同的水果\n2. 切成有趣的形状（星星/心形）\n3. 在盘中摆出图案', materials: '水果（西瓜/草莓/芒果等）、水果刀、盘子', tips: '注意用刀安全；颜色搭配越丰富越好', duration: '30分钟', mood: '开心', energy: '中', category: '生活类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '做手工贺卡', description: '亲手制作一张精美的贺卡送给朋友或家人', steps: '1. 准备卡纸和装饰材料\n2. 设计贺卡布局并剪裁\n3. 粘贴装饰并写下祝福语', materials: '卡纸、剪刀、胶水、彩笔、贴纸', tips: '折叠前先设计好布局；手写祝福语更有温度', duration: '1小时以上', mood: '开心', energy: '中', category: '艺术类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 开心 + 低（4个）=====
  { name: '哼唱小曲', description: '跟着哼唱一首喜欢的旋律，不需歌词也开心', steps: '1. 脑海中选择一首熟悉的歌\n2. 轻轻哼出旋律\n3. 边走边哼或坐着哼都行', materials: '无需特殊材料', tips: '不用在意音准；哼唱时可以轻轻摆动身体', duration: '5分钟', mood: '开心', energy: '低', category: '娱乐类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '树荫下读诗', description: '在树荫下找一处安静的地方读几首小诗', steps: '1. 带一本诗集找树荫坐下\n2. 慢慢品读2-3首诗\n3. 闭上眼睛回味诗句的意境', materials: '诗集、坐垫（可选）', tips: '选择阴凉舒适的位置；读出声来更有韵律感', duration: '15分钟', mood: '开心', energy: '低', category: '娱乐类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '回忆快乐相册', description: '翻看以前的快乐照片，重温美好瞬间', steps: '1. 打开手机或电脑相册\n2. 浏览标记了笑脸的照片\n3. 回想每张照片背后的故事', materials: '手机或电脑', tips: '可以和家人一起看；边看边分享当时的趣事', duration: '30分钟', mood: '开心', energy: '低', category: '生活类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '编织毛线毯', description: '用粗毛线编织一条小毯子，温暖又治愈', steps: '1. 选择喜欢的毛线颜色\n2. 学习基础编织针法\n3. 按图案编织30x30cm的小毯子', materials: '粗毛线、编织针、剪刀', tips: '选择粗毛线更容易上手；每织完一排检查平整度', duration: '1小时以上', mood: '开心', energy: '低', category: '艺术类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 疲惫 + 高（4个）=====
  { name: '颈部放松操', description: '快速做一套颈部放松动作，缓解肩颈疲劳', steps: '1. 坐直，双肩放松下沉\n2. 缓慢低头抬头各5次\n3. 左右侧屈各5次，配合深呼吸', materials: '椅子', tips: '动作缓慢不要用力过猛；配合呼吸效果更好', duration: '5分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '草坪躺卧', description: '在阳光下的草坪上躺下，让阳光温暖全身', steps: '1. 找一片干净平坦的草坪\n2. 铺上垫子或直接躺下\n3. 闭眼享受阳光和微风', materials: '野餐垫或毯子、防晒霜', tips: '避开正午烈日；涂抹防晒霜；设闹钟防止晒伤', duration: '15分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '筋膜枪按摩', description: '用筋膜枪按摩酸痛的肌肉群，快速缓解疲劳', steps: '1. 选择适合的按摩头\n2. 从肩颈开始缓慢移动\n3. 每个部位停留30-60秒', materials: '筋膜枪、按摩头套装', tips: '避开骨头和关节；从低档开始；不要在同一个位置停留过久', duration: '30分钟', mood: '疲惫', energy: '高', category: '放松类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '精油香薰冥想', description: '在香薰环境中进行深度冥想，彻底放松身心', steps: '1. 选择舒缓精油滴入香薰机\n2. 盘腿坐好，调暗灯光\n3. 闭眼冥想，跟随呼吸放松全身', materials: '香薰机、薰衣草精油、冥想垫', tips: '选择安静不受打扰的时间；可以播放白噪音辅助', duration: '1小时以上', mood: '疲惫', energy: '高', category: '放松类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 疲惫 + 中（4个）=====
  { name: '靠墙站立', description: '靠墙站立几分钟，矫正体态的同时放松脊椎', steps: '1. 背靠墙壁站立，脚跟离墙5cm\n2. 后脑勺、肩胛骨、臀部贴墙\n3. 保持3-5分钟，自然呼吸', materials: '平整的墙壁', tips: '收腹挺胸；膝盖微屈不要锁死；每天坚持改善体态', duration: '5分钟', mood: '疲惫', energy: '中', category: '运动类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '河边静坐', description: '在河边找块石头坐下，听水流声放空大脑', steps: '1. 找到河边安全的位置\n2. 面对水流坐下\n3. 专注听水流声，放空15分钟', materials: '坐垫或折叠椅', tips: '选择水流平缓的安全河段；注意防蚊虫', duration: '15分钟', mood: '疲惫', energy: '中', category: '放松类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '热敷眼罩休息', description: '戴上热敷眼罩闭目养神，缓解眼疲劳和头痛', steps: '1. 加热眼罩至舒适温度\n2. 靠在沙发或床上戴好眼罩\n3. 闭眼放松25-30分钟', materials: '热敷眼罩（可微波或USB加热）', tips: '温度以温热舒适为宜，不要过烫；可以播放轻音乐', duration: '30分钟', mood: '疲惫', energy: '中', category: '放松类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '温泉浴放松', description: '在室内浴缸模拟温泉浴，加入浴盐彻底放松', steps: '1. 放一缸40°C左右的热水\n2. 加入温泉浴盐或入浴剂\n3. 浸泡30-60分钟，配合深呼吸', materials: '浴缸、温泉浴盐、浴枕、香薰蜡烛', tips: '水温不宜过高；每15分钟起身休息；泡后及时补水', duration: '1小时以上', mood: '疲惫', energy: '中', category: '放松类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 疲惫 + 低（4个）=====
  { name: '伸懒腰全套', description: '做一次完整的伸懒腰，从手指尖到脚趾尖', steps: '1. 站立或坐着，双臂上举\n2. 手指交叉掌心向上推\n3. 全身伸展保持10秒，重复3次', materials: '无需特殊材料', tips: '伸展到极限时配合吸气；放松时呼气', duration: '5分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '长椅观云', description: '坐在公园长椅上仰望天空，看云朵缓缓飘移', steps: '1. 找视野开阔的长椅\n2. 仰头看天空的云朵\n3. 想象云朵的形状，放空思绪', materials: '水杯、防晒帽', tips: '选择背对太阳的位置；放下手机专注于天空', duration: '15分钟', mood: '疲惫', energy: '低', category: '放松类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '沙发音乐躺', description: '瘫在沙发上听一张完整的纯音乐专辑', steps: '1. 选出喜欢的纯音乐或氛围音乐专辑\n2. 在沙发上找最舒服的姿势\n3. 闭眼从头听到尾', materials: '手机/音箱、沙发、毯子', tips: '选择舒缓的钢琴曲或自然音效；音量调低', duration: '30分钟', mood: '疲惫', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '足底穴位按摩', description: '用按摩工具按压足底穴位，疏通经络缓解疲劳', steps: '1. 用温水泡脚10分钟\n2. 擦干后涂抹按摩油\n3. 用按摩棒按压涌泉穴等反射区', materials: '泡脚盆、按摩棒、按摩油、毛巾', tips: '力度以酸胀舒适为宜；饭后1小时内不宜按摩', duration: '1小时以上', mood: '疲惫', energy: '低', category: '放松类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 焦虑 + 高（4个）=====
  { name: '握拳放松法', description: '通过握拳再放松的动作循环，快速缓解紧张感', steps: '1. 坐直，双手自然放在腿上\n2. 用力握拳5秒，感受紧张\n3. 突然放松，感受松弛感，重复5轮', materials: '无需特殊材料', tips: '配合呼吸：握拳时吸气，放松时呼气', duration: '5分钟', mood: '焦虑', energy: '高', category: '放松类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '林荫道奔跑', description: '在林荫道上快速奔跑，让焦虑随风消散', steps: '1. 热身踝关节和膝关节\n2. 中等速度奔跑10-15分钟\n3. 慢走5分钟冷身', materials: '跑鞋、运动服', tips: '选择树荫多的路线避免暴晒；保持节奏呼吸', duration: '15分钟', mood: '焦虑', energy: '高', category: '运动类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '撕纸解压', description: '把废纸撕成细条，通过破坏动作释放焦虑', steps: '1. 准备一叠废纸或旧报纸\n2. 双手用力撕成细条\n3. 把纸条揉成团扔掉', materials: '废纸/旧报纸', tips: '撕得越细越解压；可以配合喊出声来', duration: '30分钟', mood: '焦虑', energy: '高', category: '放松类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '练习瑜伽倒立', description: '在室内靠墙练习倒立或半倒立，转换视角放松心情', steps: '1. 靠墙放置瑜伽垫\n2. 双手撑地，双腿上墙成L型\n3. 保持3-5分钟，自然呼吸', materials: '瑜伽垫、墙壁', tips: '初学者从L型倒立开始；颈部不适不要做；饭后2小时再练习', duration: '1小时以上', mood: '焦虑', energy: '高', category: '运动类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 焦虑 + 中（4个）=====
  { name: '手指深呼吸', description: '用手指跟随呼吸画圈，让注意力回到当下', steps: '1. 坐下，一只手伸出\n2. 用另一只手指沿手指轮廓画圈\n3. 吸气时上移，呼气时下移，重复3轮', materials: '无需特殊材料', tips: '放慢速度；注意力集中在手指触感上', duration: '5分钟', mood: '焦虑', energy: '中', category: '放松类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '沙包投掷', description: '在户外向目标投掷沙包，释放焦虑情绪', steps: '1. 在地上画一个靶心\n2. 站在3米外向靶心投掷\n3. 每投10次为一组，记录命中次数', materials: '沙包或豆袋、粉笔（画靶）', tips: '投掷时用上全身力量；注意周围安全', duration: '15分钟', mood: '焦虑', energy: '中', category: '运动类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '涂色解压画册', description: '用彩笔在解压涂色本上填色，专注当下', steps: '1. 选择一张喜欢的图案\n2. 挑选彩笔配色\n3. 在图案内耐心填色', materials: '解压涂色本、彩色铅笔或马克笔', tips: '不需要配色规则；填满边界即可；享受过程而非结果', duration: '30分钟', mood: '焦虑', energy: '中', category: '艺术类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '烘焙面包', description: '从揉面开始做一条手工面包，揉面过程特别解压', steps: '1. 称量面粉、水、酵母等材料\n2. 揉面10-15分钟至光滑\n3. 发酵、整形、烘烤', materials: '高筋面粉、酵母、盐、水、烤箱、揉面垫', tips: '揉面要揉到出膜；发酵温度保持在28-32°C', duration: '1小时以上', mood: '焦虑', energy: '中', category: '生活类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 焦虑 + 低（4个）=====
  { name: '478呼吸法', description: '用4-7-8呼吸法快速平复心率和焦虑感', steps: '1. 坐直，舌尖抵上颚\n2. 吸气4秒→屏息7秒→呼气8秒\n3. 重复4轮', materials: '计时器', tips: '呼气声要完整呼出；如果头晕就恢复正常呼吸', duration: '5分钟', mood: '焦虑', energy: '低', category: '放松类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '喂鸽子麻雀', description: '在广场或公园撒一把谷物喂鸽子和小鸟', steps: '1. 准备一些谷物或面包屑\n2. 找到有鸽子的广场\n3. 撒出食物安静观察小鸟啄食', materials: '谷物/面包屑', tips: '保持安静不惊扰；选择允许喂食的区域', duration: '15分钟', mood: '焦虑', energy: '低', category: '自然类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '泡花草茶冥想', description: '泡一杯花草茶，专注感受茶香和温暖', steps: '1. 烧水，选择花草茶（洋甘菊/薰衣草）\n2. 注水冲泡，闻香等待\n3. 小口慢饮，配合深呼吸', materials: '花草茶、茶杯、开水壶', tips: '水温85°C为宜；泡3-5分钟出味；全程不看手机', duration: '30分钟', mood: '焦虑', energy: '低', category: '放松类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '数字油画', description: '在标有数字的画布上填涂对应颜色，完成一幅画作', steps: '1. 打开数字油画套装\n2. 按照数字对应的颜色填涂\n3. 由浅色到深色逐步完成', materials: '数字油画套装、画笔、清水', tips: '从大面积色块开始填；每画完一种颜色洗笔', duration: '1小时以上', mood: '焦虑', energy: '低', category: '艺术类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 平静 + 高（4个）=====
  { name: '站桩调息', description: '以站桩姿势静立，调节呼吸，感受体内气感流动', steps: '1. 双脚与肩同宽，膝盖微屈\n2. 双手抱圆于胸前\n3. 自然呼吸，静站3-5分钟', materials: '舒适平底鞋', tips: '想象头顶有绳牵引；放松肩膀；不追求时间长短', duration: '5分钟', mood: '平静', energy: '高', category: '运动类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '庭院修剪', description: '在庭院中修剪花草树枝，享受静谧的劳作时光', steps: '1. 观察需要修剪的植物\n2. 用修枝剪剪去枯枝杂叶\n3. 清理修剪下来的枝叶', materials: '修枝剪、园艺手套、扫帚', tips: '剪口要平整利于植物愈合；戴手套防划伤', duration: '15分钟', mood: '平静', energy: '高', category: '自然类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '磨墨练字', description: '用毛笔磨墨练字，在缓慢的动作中沉淀心绪', steps: '1. 倒墨汁或磨墨\n2. 铺好宣纸，蘸墨\n3. 临摹字帖，一笔一画书写', materials: '毛笔、墨汁/墨条、宣纸、字帖、砚台', tips: '握笔放松；中锋行笔；每个字写慢一点', duration: '30分钟', mood: '平静', energy: '高', category: '艺术类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '篆刻印章', description: '用刻刀在印章石上雕刻文字或图案', steps: '1. 在印石上用铅笔写稿\n2. 用刻刀沿线条刻制\n3. 盖印检查效果，修整完善', materials: '印石、刻刀套装、印泥、铅笔', tips: '初学者从简单的白文开始；刻刀保持锋利；注意用刀安全', duration: '1小时以上', mood: '平静', energy: '高', category: '艺术类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 平静 + 中（4个）=====
  { name: '整理书架', description: '花几分钟把书架上的书按顺序整理好', steps: '1. 把书全部取出\n2. 按类别或颜色重新排列\n3. 擦拭书架后把书归位', materials: '抹布、分类标签（可选）', tips: '可以按颜色排列更美观；不看的书可以捐出去', duration: '5分钟', mood: '平静', energy: '中', category: '生活类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '户外速写', description: '在户外用简单的线条快速画出眼前的景物', steps: '1. 带速写本和铅笔到户外\n2. 选择一处有趣景物\n3. 用线条快速勾勒轮廓', materials: '速写本、铅笔、橡皮', tips: '速写贵在快速捕捉；不必追求细节；每天练习', duration: '15分钟', mood: '平静', energy: '中', category: '艺术类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '插花艺术', description: '用鲜花和绿叶创作一盆插花作品', steps: '1. 准备花材和花器\n2. 修剪花枝长度和角度\n3. 按高低层次插入花器', materials: '鲜花、花器、花剪、花泥', tips: '主花居中，配花环绕；叶子填充空隙；每天换水延长花期', duration: '30分钟', mood: '平静', energy: '中', category: '生活类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '十字绣', description: '在绣布上按图案一针一针绣出完整的十字绣作品', steps: '1. 穿好绣线，找到图案中心\n2. 按图案颜色逐格刺绣\n3. 完成后清洗熨平', materials: '十字绣套件、绣绷、针线', tips: '绣线不要拉太紧；每完成一个区域检查背面整齐度', duration: '1小时以上', mood: '平静', energy: '中', category: '艺术类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 平静 + 低（4个）=====
  { name: '凝视烛火', description: '在安全的距离凝视烛火的跳动，让心随之平静', steps: '1. 在桌上放置一支蜡烛\n2. 点燃后坐在50cm外\n3. 专注凝视火焰，不思考任何事', materials: '蜡烛、烛台、打火机', tips: '保持安全距离；不要移开视线；注意防火', duration: '5分钟', mood: '平静', energy: '低', category: '放松类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '池塘观鱼', description: '在公园池塘边安静地观赏锦鲤游动', steps: '1. 找有观赏鱼的池塘\n2. 蹲下或坐下安静观察\n3. 看鱼儿游动的轨迹和水波', materials: '面包屑（可选，喂鱼）', tips: '选择水质清澈的池塘；不要大声喧哗惊扰鱼群', duration: '15分钟', mood: '平静', energy: '低', category: '自然类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '折纸莲花', description: '用纸折出一朵莲花，在重复折叠中平静心绪', steps: '1. 准备一张方形彩纸\n2. 按照折纸莲花教程逐步折叠\n3. 完成花瓣塑形', materials: '彩色折纸、牙签（塑形用）', tips: '折痕要压深压实；花瓣可以用牙签卷出弧度', duration: '30分钟', mood: '平静', energy: '低', category: '艺术类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '临摹古画', description: '临摹一幅古代山水画，感受笔墨间的意境', steps: '1. 选择一幅喜欢的古画图片\n2. 铺宣纸，用铅笔打稿\n3. 用毛笔蘸淡墨勾勒渲染', materials: '宣纸、毛笔、墨汁、古画图片、镇纸', tips: '从简单的树石开始临摹；先读画再下笔', duration: '1小时以上', mood: '平静', energy: '低', category: '艺术类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 兴奋 + 高（4个）=====
  { name: '原地高抬腿冲刺', description: '做30秒原地高抬腿冲刺，快速燃爆能量', steps: '1. 站立，手臂前后摆动\n2. 膝盖尽量抬高至腰部\n3. 快速交替30秒×3组', materials: '运动鞋、运动服', tips: '保持背部挺直；落地轻快；组间休息15秒', duration: '5分钟', mood: '兴奋', energy: '高', category: '运动类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '沙滩排球', description: '在沙滩或草地上打一场轻松的排球', steps: '1. 找同伴2-4人\n2. 在沙滩或草坪拉网\n3. 进行对打或比赛', materials: '排球、球网（可用绳子替代）、运动鞋', tips: '用手腕垫球；团队配合最重要；注意补水防晒', duration: '15分钟', mood: '兴奋', energy: '高', category: '运动类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '跳尊巴舞', description: '跟着Zumba视频跳拉丁风格有氧舞蹈', steps: '1. 打开尊巴舞蹈视频\n2. 跟着节奏摆动身体\n3. 完成整首曲子的舞蹈组合', materials: '电视/投影仪、运动服、运动鞋', tips: '臀部要动起来；跟着音乐释放自己；不要怕跳错', duration: '30分钟', mood: '兴奋', energy: '高', category: '运动类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '室内攀岩训练', description: '在攀岩馆挑战不同难度的攀岩路线', steps: '1. 穿戴好攀岩装备\n2. 从简单路线开始热身\n3. 逐条挑战更高难度路线', materials: '攀岩鞋、安全带、镁粉', tips: '用手臂和腿部协同发力；多观察路线再爬', duration: '1小时以上', mood: '兴奋', energy: '高', category: '运动类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 兴奋 + 中（4个）=====
  { name: '即兴舞蹈', description: '随意跟着音乐扭动身体，没有规则只有快乐', steps: '1. 播放一首喜欢的歌\n2. 闭上眼睛随意舞动\n3. 全身放松跟着节奏走', materials: '手机/音箱', tips: '不要在意动作是否好看；活动全身每个关节', duration: '5分钟', mood: '兴奋', energy: '中', category: '运动类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '追逐泡泡', description: '在阳光下吹泡泡并追逐它们，找回童真', steps: '1. 准备泡泡水或买吹泡泡玩具\n2. 到开阔场地吹泡泡\n3. 追着泡泡跑，用手或脚触碰', materials: '泡泡水、吹泡棒', tips: '逆风方向吹泡泡可以吹得更远；阳光下泡泡有彩虹色', duration: '15分钟', mood: '兴奋', energy: '中', category: '娱乐类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '学街舞片段', description: '学一段15-30秒的街舞动作，帅翻全场', steps: '1. 找一段简单的街舞教程\n2. 分解学习每个动作\n3. 连贯起来跟着音乐跳', materials: '手机/电脑、运动鞋', tips: '先从慢速练习；对着镜子纠正动作；录视频看效果', duration: '30分钟', mood: '兴奋', energy: '中', category: '运动类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '玩音乐合成器', description: '用电子合成器或App创作一段电子音乐', steps: '1. 打开合成器App或设备\n2. 选择音色和节奏\n3. 录制一段旋律循环', materials: '合成器/音乐制作App、耳机、MIDI键盘（可选）', tips: '从简单的鼓点开始叠加；尝试不同音色组合', duration: '1小时以上', mood: '兴奋', energy: '中', category: '艺术类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 兴奋 + 低（4个）=====
  { name: '鼓点节奏拍打', description: '在桌面上拍打出有节奏的鼓点，感受律动', steps: '1. 双手放在桌上\n2. 模仿鼓点节奏拍打桌面\n3. 左右手交替打出节奏型', materials: '桌面或桌子', tips: '从简单的4/4拍开始；跟着脑海中的节拍', duration: '5分钟', mood: '兴奋', energy: '低', category: '娱乐类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '公园滑板体验', description: '在公园平整路面尝试滑板基础滑行', steps: '1. 穿戴护具（头盔护膝护肘）\n2. 练习上板站稳\n3. 在平地上练习蹬地滑行', materials: '滑板、头盔、护膝、护肘', tips: '初学者在草地练上板；重心在前脚；不要急转弯', duration: '15分钟', mood: '兴奋', energy: '低', category: '运动类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '看电竞比赛直播', description: '观看一场精彩的电竞比赛直播，为喜欢的战队加油', steps: '1. 查看今天的比赛赛程\n2. 打开直播平台\n3. 观看比赛并参与弹幕互动', materials: '电脑/手机、直播平台App', tips: '和朋友一起看更有氛围；留意赛事预告', duration: '30分钟', mood: '兴奋', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '拼乐高机械组', description: '拼装一套乐高机械组模型，享受机械结构的乐趣', steps: '1. 打开乐高机械组套装\n2. 按图纸分拣零件\n3. 逐步拼装完成机械结构', materials: '乐高机械组套装、零件分拣盘', tips: '按步骤拼装不要跳跃；齿轮咬合要对齐', duration: '1小时以上', mood: '兴奋', energy: '低', category: '娱乐类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 无聊 + 高（4个）=====
  { name: '倒立尝试', description: '靠墙尝试倒立或头手倒立，换个角度看世界', steps: '1. 铺好瑜伽垫靠墙\n2. 双手撑地，双腿上墙\n3. 保持平衡10-30秒', materials: '瑜伽垫、墙壁', tips: '初学者由他人辅助；颈部不适不要做；饭后2小时再练', duration: '5分钟', mood: '无聊', energy: '高', category: '运动类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '寻宝游戏', description: '在小区里按自己设定的线索玩一次寻宝游戏', steps: '1. 在脑中设计3条线索\n2. 按照线索在小区寻找目标物\n3. 找到后拍照打卡', materials: '手机', tips: '线索可以和生活场景结合；带上朋友一起更有趣', duration: '15分钟', mood: '无聊', energy: '高', category: '娱乐类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '魔方速拧练习', description: '练习快速还原魔方，挑战自己的最好成绩', steps: '1. 准备一个三阶魔方\n2. 打乱魔方后开始计时\n3. 用层先法或CFOP法还原', materials: '三阶魔方、计时器', tips: '初学者学习层先法；每天练习指法会越来越快', duration: '30分钟', mood: '无聊', energy: '高', category: '娱乐类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '组装宜家家具', description: '自己动手组装一件新家具，享受动手的成就感', steps: '1. 打开包装核对零件\n2. 阅读说明书按步骤组装\n3. 拧紧所有螺丝完成', materials: '家具零件、螺丝刀、说明书', tips: '按步骤操作不要心急；螺丝先不要完全拧紧方便调整', duration: '1小时以上', mood: '无聊', energy: '高', category: '生活类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 无聊 + 中（4个）=====
  { name: '抛接球挑战', description: '用网球做抛接练习，训练手眼协调', steps: '1. 拿一个网球\n2. 向上抛起再用同手接住\n3. 尝试双手交替抛接两个球', materials: '网球或乒乓球', tips: '先单手练习再双手；视线跟随球的轨迹', duration: '5分钟', mood: '无聊', energy: '中', category: '运动类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '户外野花采集', description: '在野地或公园采集不同的野花制作标本', steps: '1. 带一个小篮子和剪刀\n2. 寻找不同种类的野花\n3. 采集后夹在书本中压平', materials: '小篮子、剪刀、旧书或报纸', tips: '不要采摘保护植物；每种采一朵即可', duration: '15分钟', mood: '无聊', energy: '中', category: '自然类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '折纸大全', description: '挑战折出不同造型的折纸作品（动物/花朵/飞机）', steps: '1. 准备多张彩色折纸\n2. 搜索折纸教程\n3. 逐个挑战不同难度造型', materials: '彩色折纸、折纸书或教程', tips: '从简单造型开始逐步进阶；折痕要压平整', duration: '30分钟', mood: '无聊', energy: '中', category: '艺术类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '学做异国料理', description: '挑战做一道从来没有做过的异国料理', steps: '1. 选择一道异国料理（咖喱/意面/寿司等）\n2. 采购需要的特殊食材\n3. 按照菜谱一步一步制作', materials: '食材、厨具、菜谱', tips: '提前备好所有材料再开火；注意调味循序渐进', duration: '1小时以上', mood: '无聊', energy: '中', category: '生活类', weather: '阴天', location: '室内', duration_min: 60 },

  // ===== 无聊 + 低（4个）=====
  { name: '手指操', description: '做一套手指灵活性操，活动手指关节', steps: '1. 双手握拳再张开10次\n2. 大拇指依次触碰其他指尖\n3. 双手对掌拉伸', materials: '无需特殊材料', tips: '动作由慢到快；每天练习增加手指灵活性', duration: '5分钟', mood: '无聊', energy: '低', category: '娱乐类', weather: '不限', location: '不限', duration_min: 5 },
  { name: '荡秋千', description: '在小区或公园的秋千上轻轻荡起，感受微风', steps: '1. 找到秋千\n2. 坐上秋千，双手握紧链条\n3. 用身体带动秋千轻轻荡起', materials: '秋千', tips: '握紧链条防止滑脱；幅度由小到大', duration: '15分钟', mood: '无聊', energy: '低', category: '娱乐类', weather: '晴天', location: '室外', duration_min: 15 },
  { name: '看漫画书', description: '找一本漫画书或条漫，轻松享受故事', steps: '1. 选择喜欢的漫画类型\n2. 找沙发或床上舒适的姿势\n3. 一口气看完一个篇章', materials: '漫画书/手机看漫画App', tips: '选择轻松搞笑题材；注意用眼卫生', duration: '30分钟', mood: '无聊', energy: '低', category: '娱乐类', weather: '不限', location: '在家', duration_min: 30 },
  { name: '听长篇评书', description: '听一段长篇评书或相声，在故事中消磨时光', steps: '1. 选择一部经典评书或相声\n2. 调好音量躺下闭眼\n3. 跟随讲述人在脑海中想象画面', materials: '手机/音箱、耳机', tips: '选择经典作品（三国/水浒等）；设置定时关闭', duration: '1小时以上', mood: '无聊', energy: '低', category: '娱乐类', weather: '阴天', location: '室内', duration_min: 60 },
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
        steps TEXT,
        materials TEXT,
        tips TEXT,
        duration TEXT,
        duration_min INTEGER,
        category TEXT,
        mood TEXT NOT NULL,
        energy TEXT NOT NULL CHECK(energy IN ('高', '中', '低')),
        weather TEXT,
        location TEXT
      )`);

      db.get('SELECT COUNT(*) as count FROM activities', (err, row) => {
        if (err) return reject(err);
        if (row.count === 0) {
          const stmt = db.prepare(`INSERT INTO activities (name, description, steps, materials, tips, duration, duration_min, category, mood, energy, weather, location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
          for (const a of activities) {
            stmt.run(a.name, a.description, a.steps, a.materials, a.tips, a.duration, a.duration_min, a.category, a.mood, a.energy, a.weather, a.location);
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

function queryByMoodAndEnergy(mood, energy, filters) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
      if (err) return reject(err);
    });
    let sql = 'SELECT * FROM activities WHERE (instr(mood, ?) > 0 OR mood = ?) AND energy = ?';
    const params = [mood, mood, energy];

    if (filters) {
      if (filters.duration && filters.duration !== '不限') {
        switch (filters.duration) {
          case '5分钟': sql += ' AND duration_min <= 10'; break;
          case '15分钟': sql += ' AND duration_min <= 20'; break;
          case '30分钟': sql += ' AND duration_min <= 40'; break;
          case '1小时以上': sql += ' AND duration_min >= 50'; break;
        }
      }
      if (filters.weather && filters.weather !== '不限') {
        sql += ' AND (weather = ? OR weather = \'不限\')';
        params.push(filters.weather);
      }
      if (filters.location && filters.location !== '不限') {
        if (filters.location === '室内') {
          sql += ' AND (location = ? OR location = \'在家\')';
        } else {
          sql += ' AND location = ?';
        }
        params.push(filters.location);
      }
    }

    db.all(sql, params, (err, rows) => {
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
