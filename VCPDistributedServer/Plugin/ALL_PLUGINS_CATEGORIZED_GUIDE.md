# 🎨 VCPChat 分布式（前端）插件综合说明书

> **致阁下：**
> 这是一份由系统深度阅读所有源码结构后，经过人工语义分类凝练出的**VCPChat 前端插件集成手册**。
> 与后端（VCPToolBox）的重度计算与逻辑代理不同，前端分布式插件的主要职责是：**增强在本地桌面界面的感官交互、多媒体渲染，以及前端特有的终端与网络探测能力**。

## 📑 领域速览

- [视图渲染与终端增强](#-视图渲染与终端增强) (3个插件)
- [文件与工作区操作](#-文件与工作区操作) (4个插件)
- [本地多模态与流媒体接收](#-本地多模态与流媒体接收) (1个插件)
- [网络请求与状态同步](#-网络请求与状态同步) (5个插件)
- [未归类 / 杂项辅助](#-未归类--杂项辅助) (11个插件)

---

## 📌 视图渲染与终端增强

*用于在前端提供更复杂、直观的用户界面交互，例如渲染特殊的 Markdown 面板、终端模拟器、或者是将特定格式的数据以图表展示。*

### PowerShell命令执行器 (`OldPowerShellExecutor`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个允许AI执行PowerShell命令并返回其输出的插件。支持阻塞式、后台式以及管理员权限执行。注意：后台式或管理员权限执行会打开一个新的PowerShell窗口，且不会将执行结果直接返回VCP，只会返回任务提交状态。  
* **支持的主控命令**: `PowerShellExecutor`  
💡 这给予了前端直接执行或调用本地终端环境（如 PowerShell）的能力。极其强大但需注意安全边界。

### PowerShell命令执行器 (`PowerShellExecutor`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个允许AI执行PowerShell命令并返回其输出的插件。支持阻塞式、后台式以及管理员权限执行。注意：后台式或管理员权限执行会打开一个新的PowerShell窗口，且不会将执行结果直接返回VCP，只会返回任务提交状态。  
* **支持的主控命令**: `PowerShellExecutor`  
💡 这给予了前端直接执行或调用本地终端环境（如 PowerShell）的能力。极其强大但需注意安全边界。

### PTY Shell 执行器 (`PTYShellExecutor`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个在Linux桌面环境下执行本地Shell命令的插件。使用node-pty创建持久化的PTY会话，支持bash/fish/zsh等Shell，保持环境变量和会话状态。支持同步执行和异步任务模式，自动过滤ANSI转义序列和Shell Integration标记，返回干净的文本输出。  
* **需配置环境变量**: `SHELL_RETURN_MODE`, `SHELL_PRIORITY`, `FORBIDDEN_COMMANDS`, `AUTH_REQUIRED_COMMANDS`, `COMMAND_TIMEOUT`  
* **支持的主控命令**: `PTYShellExecutor`  
💡 这给予了前端直接执行或调用本地终端环境（如 PowerShell）的能力。极其强大但需注意安全边界。

---

## 📌 文件与工作区操作

*允许前端直接操控本地文件系统，在前端发起代码搜索、文档读取或者工程结构的注入，是开发者在前端查阅资料的利器。*

### 代码搜索器 (Rust) (`CodeSearcher`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个使用Rust编写的高性能代码搜索插件，可以在指定的工作区目录中进行快速、精准的代码内容搜索。  
* **需配置环境变量**: `MAX_RESULTS`, `IGNORED_FOLDERS`, `ALLOWED_EXTENSIONS`  
* **支持的主控命令**: `SearchCode`  
💡 这给予了前端直接执行或调用本地终端环境（如 PowerShell）的能力。极其强大但需注意安全边界。

### 分布式图床服务器 (`DistImageServer`)
**类型:** 🖥️ 隐式渲染引擎 / 服务  
**功能简述:** 在分布式服务器上托管一个本地目录，使其可以通过HTTP访问。  
* **需配置环境变量**: `DIST_IMAGE_KEY`, `DIST_IMAGE_PATH`, `DebugMode`  
💡 前端生态增强模块。

### 文件操作器 (`FileOperator`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个强大的文件系统操作插件，允许AI对受限目录进行读、写、列出、移动、复制、删除等多种文件和目录操作。特别增强了文件读取能力，可自动提取PDF、Word(.docx)和表格(.xlsx, .csv)文件的纯文本内容。  
* **需配置环境变量**: `ALLOWED_DIRECTORIES`, `DEFAULT_DOWNLOAD_DIR`, `MAX_FILE_SIZE`, `MAX_DIRECTORY_ITEMS`, `MAX_SEARCH_RESULTS`, `DEBUG_MODE`  
* **支持的主控命令**: `ListAllowedDirectories`, `ReadFile`, `WebReadFile`, `WriteFile`, `AppendFile`, `EditFile`, `ListDirectory`, `FileInfo`, `CopyFile`, `MoveFile`, `RenameFile`, `DeleteFile`, `CreateDirectory`, `SearchFiles`, `DownloadFile`, `ApplyDiff`, `UpdateHistory`, `CreateCanvas`  
💡 前端生态增强模块。

### 多媒体截取工具 (`MediaShot`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个强大的多媒体处理插件，支持视频片段截取、音频片段截取、图像区域截取和编辑等功能。支持中文字体、智能线条粗细、箭头绘制和批量编辑。  
* **需配置环境变量**: `OUTPUT_QUALITY`, `OUTPUT_FORMAT`, `DEFAULT_FONT_SIZE`, `DEFAULT_STROKE_WIDTH`  
* **支持的主控命令**: `CaptureFrame`, `ExtractVideoClip`, `ExtractAudioClip`, `CropImage`, `EditImage`, `BatchEditImage`, `CombinedCapture`  
💡 前端生态增强模块。

---

## 📌 本地多模态与流媒体接收

*支持 VCP 前端直接接收或处理多媒体流（语音、图片或屏幕截图），使得交互不仅仅停留在纯文本层面。*

### 屏幕视觉与操控 (`ScreenPilot`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个强大的屏幕交互插件，允许AI对任意窗口截图（返回base64和分辨率信息）、通过OCR检测截图中的文本位置、直接点击截图中的文本、模拟鼠标点击操作（支持后台不劫持鼠标）、滚轮滚动操作、以及通过Windows UI Automation API检索窗口内可交互元素的名称和坐标。  
* **需配置环境变量**: `SCREENSHOT_DIR`, `VISION_API_FORMAT`, `VISION_API_BASE_URL`, `VISION_EDIT_MODEL`, `VISION_API_KEY`  
* **支持的主控命令**: `ScreenCapture`, `ClickAt`, `InspectUI`, `ClickText`, `ClickVisual`, `ScrollAt`, `TypeText`, `QueryWindows`  
💡 前端生态增强模块。

---

## 📌 网络请求与状态同步

*前端核心的心跳脉络。负责抓取特定的远端信息、管理代理请求，或将自身的状态同步回 VCP 主服务器。*

### 腾讯云COS聊天插件 (`ChatTencentcos`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个简化的腾讯云对象存储（COS）插件，专为聊天场景设计，支持文件上传和下载功能。  
* **需配置环境变量**: `TENCENTCLOUD_SECRET_ID`, `TENCENTCLOUD_SECRET_KEY`, `COS_BUCKET_NAME`, `COS_REGION`, `AGENT_PARENT_DIR`, `AGENT_FOLDERS_CONFIG`, `PLUGIN_PORT`, `COMPRESS_THRESHOLD_MB`  
* **支持的主控命令**: `upload_file`, `download_file`  
💡 前端生态增强模块。

### 深度回忆插件 (`DeepMemo`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 根据关键词从Vchat聊天记录中检索相关上下文，实现AI的深度回忆功能。  
* **支持的主控命令**: `DeepMemo`  
💡 用于将本机的阅读碎片、使用习惯或网络状态同步到全局的 VCP 生态里去。

### 地理教学助手 (`qianlimu`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个基于 Cesium 的地理教学插件，支持相机控制、地理标绘及教案持久化存储。  
* **需配置环境变量**: `COURSEWARE_PATH`  
* **支持的主控命令**: `FlyTo`, `AddDrawing`, `LoadCourseware`, `RemoveDrawings`, `OpenUI`  
💡 前端生态增强模块。

### 千里目状态上报器 (`QianlimuState`)
**类型:** 🖥️ 隐式渲染引擎 / 服务  
**功能简述:** 专门负责监控地理教学系统的状态并更新 AI 占位符。  
💡 用于将本机的阅读碎片、使用习惯或网络状态同步到全局的 VCP 生态里去。

### 等待用户回复 (`WaitingForUrReply`)
**类型:** 🖱️ 暴露调用接口的工具  
**功能简述:** 一个同步插件，用于在AI对话中暂停并等待用户输入。支持预设选项、键盘快捷键和超时处理。  
* **需配置环境变量**: `DEFAULT_TIMEOUT`  
* **支持的主控命令**: `WaitForUserInput`  
💡 前端生态增强模块。

---

## 📌 未归类 / 杂项辅助

### 华山论剑 (`BladeGame`)
**类型:** 🖱️ 交互工具  
**简述:** 一个回合制武侠博弈游戏。你需要管理生命值(HP)和剑气(Energy)与用户对战。  

### 心流锁控制器 (`Flowlock`)
**类型:** 🖱️ 交互工具  
**简述:** 允许AI像人类用户一样控制心流锁功能，包括启动、停止、设置提示词、获取输入框内容、查询状态等操作。  

### 音乐播放器控制器 (`MusicController`)
**类型:** 🖱️ 交互工具  
**简述:** 通过指令控制VChat内置音乐播放器，实现播放、暂停、切歌等功能。  

### 提示词赞助器 (`PromptSponsor`)
**类型:** 🖱️ 交互工具  
**简述:** 一个强大的系统提示词管理插件，允许AI完全控制和管理Agent的系统提示词。支持三种模式：原始富文本、模块化积木块、临时与预制。提供对积木块的增删改查、小仓管理、多仓库操作等完整功能。  

### 米家台灯遥控器 (`TableLampRemote`)
**类型:** 🖱️ 交互工具  
**简述:** 一个通过 mijiaAPI 控制米家台灯的插件。  

### 话题回忆插件 (`TopicMemo`)
**类型:** 🖱️ 交互工具  
**简述:** 获取Vchat的话题列表和完整聊天记录，实现AI的话题级回忆功能。  

### AI主动创建话题 (`TopicSponsor`)
**类型:** 🖱️ 交互工具  
**简述:** 允许Agent创建、查询和管理聊天话题。支持创建话题、读取未锁定话题、检查新话题、查询未读消息、回复话题、验证话题所有权等完整功能。  

### VCP闹钟插件 (`VCPAlarm`)
**类型:** 🖱️ 交互工具  
**简述:** 一个通过启动独立后台进程来实现的闹钟插件。  

### 本地文件秒搜 (Everything) (`VCPEverything`)
**类型:** 🖱️ 交互工具  
**简述:** 通过调用 Everything 命令行工具 (es.exe) 在本地计算机上实现毫秒级文件搜索。  

### 超级骰子 (`VCPSuperDice`)
**类型:** 🖱️ 交互工具  
**简述:** 一个基于物理引擎的高性能3D骰子插件，允许AI或用户通过指令进行真实的骰子投掷，并可干预物理参数。  

### 窗口感知雷达 (`WindowSensor`)
**类型:** 🖥️ 隐式引擎 / 服务  
**简述:** 监控当前设备上有图形界面的活跃进程，构建防干扰的多级上下文感知视界。  

