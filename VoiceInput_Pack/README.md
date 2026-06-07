# VCP 语音输入功能增强包 (Voice Input Feature Pack)
 
本功能包实现了 VCP 前端的“高灵敏语音输入”功能，支持 1 秒停顿自动落锁、绝对光标跟随以及常驻识别引擎。

## 📁 文件清单与改动说明

1. **main.html**
   - 在聊天输入框左侧新增了 `#voiceInputBtn` 麦克风按钮。

2. **style.css**
   - 增加了语音按钮的图标样式、悬停效果。
   - 增加了 `.recording` 状态下的红色呼吸灯动画。

3. **renderer.js**
   - 负责从 DOM 中导出按钮，并将其注入到各功能模块。

4. **modules/event-listeners.js (核心逻辑)**
   - 实现了逻辑处理器：监听识别结果，执行“1秒逻辑落锁”。
   - 实现了光标跟随算法：确保语音输入始终从当前光标位置开始。
   - 增加了手动干预保护：点击或按键时自动锁定当前语音片段。

5. **modules/chatManager.js**
   - 负责在切换 Agent 或话题时，自动同步语音按钮的可用状态（禁用/启用）。

6. **Groupmodules/grouprenderer.js**
   - 适配了群聊界面的语音按钮状态切换。

7. **Voicechatmodules/recognizer.html (核心引擎)**
   - 重构为“常驻流式引擎”模式。
   - 支持 50ms 极速自动重启，彻底解决首字识别丢失问题。

## 🛠️ 安装说明
将对应文件覆盖至 VCP 项目的相应路径即可。请在覆盖前做好备份。

---
由 芸慧 (VCP Assistant) 为主人 ldlh 整理制作。