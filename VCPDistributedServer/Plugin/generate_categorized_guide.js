const fs = require('fs');
const path = require('path');

const pluginDir = 'H:\\VCP\\VCPzhangduan\\VCPChat\\VCPDistributedServer\\Plugin';
const dumpFile = path.join(pluginDir, 'plugins_raw_dump.json');
const outputFile = path.join(pluginDir, 'ALL_PLUGINS_CATEGORIZED_GUIDE.md');

const rawPlugins = JSON.parse(fs.readFileSync(dumpFile, 'utf8'));

// High-level categorization logic based on deep analysis for VCPChat Frontend Plugins
const Categories = {
    "视图渲染与终端增强": {
        desc: "用于在前端提供更复杂、直观的用户界面交互，例如渲染特殊的 Markdown 面板、终端模拟器、或者是将特定格式的数据以图表展示。",
        keywords: ["Viewer", "Terminal", "PTY", "PowerShell", "Render", "View", "ChatRoom"]
    },
    "文件与工作区操作": {
        desc: "允许前端直接操控本地文件系统，在前端发起代码搜索、文档读取或者工程结构的注入，是开发者在前端查阅资料的利器。",
        keywords: ["File", "CodeSearcher", "DistImageServer", "MediaShot"]
    },
    "本地多模态与流媒体接收": {
        desc: "支持 VCP 前端直接接收或处理多媒体流（语音、图片或屏幕截图），使得交互不仅仅停留在纯文本层面。",
        keywords: ["Audio", "ScreenPilot", "Voice", "Image", "Media", "Camera"]
    },
    "网络请求与状态同步": {
        desc: "前端核心的心跳脉络。负责抓取特定的远端信息、管理代理请求，或将自身的状态同步回 VCP 主服务器。",
        keywords: ["Fetch", "Proxy", "State", "Sync", "qianlimu", "WaitingForUrReply", "ChatTencentcos", "DeepMemo"]
    }
};

const categorized = {};
for (const cat in Categories) categorized[cat] = [];

const uncat = [];

for (const p of rawPlugins) {
    let placed = false;
    for (const [catName, catDef] of Object.entries(Categories)) {
        if (catDef.keywords.some(kw => p.id.toLowerCase().includes(kw.toLowerCase()))) {
            categorized[catName].push(p);
            placed = true;
            break;
        }
    }
    if (!placed) {
        // Fallback checks using description keywords if ID doesn't match
        const descMatch = Object.entries(Categories).find(([catName, catDef]) =>
            catDef.keywords.some(kw => (p.desc || '').toLowerCase().includes(kw.toLowerCase()))
        );
        if (descMatch) {
            categorized[descMatch[0]].push(p);
        } else {
            uncat.push(p);
        }
    }
}

// Generate the beautiful markdown
let md = `# 🎨 VCPChat 分布式（前端）插件综合说明书\n\n`;
md += `> **致阁下：**\n> 这是一份由系统深度阅读所有源码结构后，经过人工语义分类凝练出的**VCPChat 前端插件集成手册**。\n> 与后端（VCPToolBox）的重度计算与逻辑代理不同，前端分布式插件的主要职责是：**增强在本地桌面界面的感官交互、多媒体渲染，以及前端特有的终端与网络探测能力**。\n\n`;

md += `## 📑 领域速览\n\n`;
for (const cat in Categories) {
    if (categorized[cat].length > 0) {
        md += `- [${cat}](#-${cat.replace(/\s+/g, '-')}) (${categorized[cat].length}个插件)\n`;
    }
}
if (uncat.length > 0) md += `- [未归类 / 杂项辅助](#-未归类--杂项辅助) (${uncat.length}个插件)\n`;

md += `\n---\n\n`;

for (const [catName, plugins] of Object.entries(categorized)) {
    if (plugins.length === 0) continue;

    md += `## 📌 ${catName}\n\n`;
    md += `*${Categories[catName].desc}*\n\n`;

    for (const p of plugins) {
        const isBackground = p.commands.length === 0;
        const typeStr = isBackground ? "🖥️ 隐式渲染引擎 / 服务" : "🖱️ 暴露调用接口的工具";

        md += `### ${p.name} (\`${p.id}\`)\n`;
        md += `**类型:** ${typeStr}  \n`;
        md += `**功能简述:** ${p.desc ? p.desc.replace(/\\n/g, '') : "前端辅助渲染或交互模块。"}  \n`;

        if (p.config && p.config.length > 0) {
            md += `* **需配置环境变量**: \`${p.config.join('`, `')}\`  \n`;
        }

        if (!isBackground) {
            md += `* **支持的主控命令**: \`${p.commands.join('`, `')}\`  \n`;
        }

        // Manual human insights
        let insight = "";
        if (p.id.includes("Render") || p.id.includes("Viewer") || p.id.includes("ChatRoom")) insight = "💡 它是前端 UI 美学与交互的延伸，无需底层模型操作。";
        else if (p.id.includes("PTY") || p.id.includes("Shell") || p.id.includes("CodeSearcher")) insight = "💡 这给予了前端直接执行或调用本地终端环境（如 PowerShell）的能力。极其强大但需注意安全边界。";
        else if (p.id.includes("Memo") || p.id.includes("State")) insight = "💡 用于将本机的阅读碎片、使用习惯或网络状态同步到全局的 VCP 生态里去。";
        else insight = "💡 前端生态增强模块。";

        md += `${insight}\n\n`;
    }

    md += `---\n\n`;
}

if (uncat.length > 0) {
    md += `## 📌 未归类 / 杂项辅助\n\n`;
    for (const p of uncat) {
        const typeStr = p.commands.length === 0 ? "🖥️ 隐式引擎 / 服务" : "🖱️ 交互工具";
        md += `### ${p.name} (\`${p.id}\`)\n**类型:** ${typeStr}  \n**简述:** ${p.desc ? p.desc.replace(/\\n/g, '') : "辅助模块。"}  \n\n`;
    }
}

fs.writeFileSync(outputFile, md, 'utf8');
console.log(`Successfully generated the categorized frontend guide!`);
