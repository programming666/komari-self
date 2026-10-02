# UI Polish — Komari 界面美化插件

把 Komari 网页界面整体打磨一遍的**前端插件**：跟随主题色的氛围背景、毛玻璃导航栏、
更柔和的卡片 / 表格 / 弹层、主题化滚动条，以及单一主题色的加载动画。

- **只注入 CSS**，不改动任何布局逻辑、接口或数据结构
- **不需要重新编译前后端**，装到任意版本的 Komari 实例即可生效（对上游官方构建同样有效）
- 前台、后台统一生效；全部开关在「后台 → 插件 → 配置」里实时调整，保存即重载
- 只申请 `allowHTMLInject` 一项权限（HTML 片段注入），不申请路由、Node.js、执行、监听等任何权限

```
short      ui-polish
version    1.0.0
权限        allowHTMLInject（仅此项）
入口        script.js
来源        src/entry.js + src/ui-polish.css
```

## 效果预览

左侧为**未修改的上游前端**，右侧为同一实例装上本插件之后（同一批数据、同一时间）：

| 原版 | 装上 UI Polish |
| --- | --- |
| ![原版首页](../../docs/screenshots/plugin-before-home.png) | ![美化后首页](../../docs/screenshots/plugin-after-home.png) |

| 后台节点列表 | 后台节点列表（暗色） |
| --- | --- |
| ![后台列表](../../docs/screenshots/plugin-after-admin-servers.png) | ![后台列表暗色](../../docs/screenshots/plugin-after-admin-servers-dark.png) |

| 插件已装并运行 | 插件配置页 | 首页（暗色） |
| --- | --- | --- |
| ![插件列表](../../docs/screenshots/plugin-installed.png) | ![插件配置](../../docs/screenshots/plugin-config-page.png) | ![暗色首页](../../docs/screenshots/plugin-after-home-dark.png) |

> 截图取自一台**未修改的上游前端**实例，插件是从上面那份市场源安装的。


## 安装

### 方式一：后台上传（推荐）

1. 从 [Releases](https://github.com/programming666/komari-self/releases/tag/ui-polish-v1.0.0) 下载 `ui-polish-1.0.0.zip`（或直接用仓库里的 `dist/ui-polish-1.0.0.zip`），后台 → **插件** → 上传插件
2. 在插件列表里**批准权限并启用**（只请求 HTML 注入）
3. 刷新页面即可看到效果

### 方式二：插件市场

后台 → **插件** → 市场 → 市场来源 → 新增，名称随意，URL 填：

```
https://raw.githubusercontent.com/programming666/komari-self/main/plugins/market/v1.json
```

保存后市场里会出现 UI Polish，可一键安装与更新（该文件由本仓库发布时自动生成，
`download` 指向同一个 release 里的 zip，`sha256` 用于校验）。

### 方式三：手动放置

把这几项复制到 Komari 数据目录下的 `plugin/ui-polish/`，再在后台启用：

```
<数据目录>/plugin/ui-polish/
├── komari-plugin.json   # 清单：名称、版本、图标、权限、配置项
├── script.js            # 入口（由 src/ 生成，含内嵌样式表）
├── icon.svg
└── README.md
```

## 配置项

后台 → 插件 → 配置（保存后插件自动重载，样式即时更新）：

| 键 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `radius` | select | `soft` | 圆角风格：`soft` 略微更圆 / `stock` 沿用主题圆角尺度 / `round` 明显更圆。主题的圆角与缩放设置始终生效 |
| `numerals` | switch | 开 | 实时指标使用等宽数字，更新时不再抖动 |
| `scrollbar` | switch | 开 | 更细的滚动条，悬停变主题色 |
| `motion` | switch | 开 | 节点卡片进场淡入上浮（系统「减少动态效果」时自动禁用） |
| `ambient` | switch | 开 | 氛围背景（主题设置里的自定义背景图仍会正常显示） |
| `ambientIntensity` | select | `standard` | 氛围强度：`subtle` / `standard` / `strong` |
| `glass` | switch | 开 | 毛玻璃导航栏、工具条、页脚与渐变站点标题 |
| `elevation` | switch | 开 | 卡片 / 节点卡 / 用量条 / 对话浮层的分层阴影与圆角 |
| `tables` | switch | 开 | 表格卡片化：强调色表头 + 行悬停反馈 |
| `adminShell` | switch | 开 | 后台内容区透出氛围背景（与前台观感一致） |
| `loader` | switch | 开 | 四色转圈 → 跟随主题色的圆环 |

## 工作原理

1. `script.js` 加载时通过 `server.getConfig()` 读取上面的配置；
2. 把内嵌的样式表按 `/* @section:name */` 标记拆成若干段，丢弃被关闭的段，
   再按配置生成一小段 `--km-*` 变量（容器圆角、氛围强度）；
3. 通过 `server.injectHTML(head, body)` 把结果作为 `<style id="komari-ui-polish">`
   注册进 HTML 注入点，Komari 会把它插到每个 HTML 响应的 `</head>` 之前。

注入的样式位于打包样式表**之后**，同等优先级下后者覆盖前者，所以无需重新构建前端即可改变外观。

样式表是**内嵌**在 `script.js` 里的（构建时生成），因此插件运行时不需要读文件：
不需要 `permissions.node`，也不需要申请路由来托管 CSS 文件。

## 目录结构

```
komari-ui-polish/
├── komari-plugin.json        # 清单
├── src/
│   ├── entry.js              # 入口逻辑（拼装、注入）
│   └── ui-polish.css         # 样式层，按 @section 标记分段
├── script.js                 # 构建产物：内嵌样式表 + 入口逻辑，插件实际加载的文件
├── icon.svg
├── README.md
└── dist/
    └── ui-polish-1.0.0.zip   # 可上传的安装包
```

改动样式或逻辑后重新构建：

```bash
# 在仓库根目录
node scripts/build-plugin.mjs
```

脚本会先由 `src/` 生成 `script.js`（并用 `node --check` 做一次语法校验），
再打成 `dist/ui-polish-<version>.zip`（清单位于压缩包根目录，符合 Komari 的安装要求），
最后打印 sha256。要顺带生成市场源文件：

```bash
node scripts/build-plugin.mjs --market plugins/market/v1.json \
  --download https://github.com/<owner>/<repo>/releases/download/<tag>/ui-polish-1.0.0.zip
```

## 验证情况

在**未修改的上游前端**（`git stash` 掉所有美化改动后重新构建的 dist，编译出 `komari-stock.exe`）上实测，
逐一对比关闭 / 开启插件时的 CSSOM 计算值：

| 观察项 | 关闭插件 | 开启插件 |
| --- | --- | --- |
| 注入的 `<style>` | 无 | 18155 字节 / 86 条规则 |
| `html` 背景 | `rgb(255, 255, 255)` | `rgb(252, 252, 252)` |
| `.theme-root` 背景图 | `none` | `radial-gradient(1400px 720px at 6% -16%, …)` |
| `.km-navbar` 定位 / 模糊 | `static` / `none` | `sticky` / `blur(18px) saturate(1.6)` |
| 节点卡圆角 / 阴影 | `8.8px` / `none` | `19.8px` / 有 |
| 用量条轨道 | 无内阴影 | `0 1px 2px inset` |
| 数字字型 | `normal` | `tabular-nums` |
| 站点标题 | 纯色 | `linear-gradient(100deg, …)` |
| 副标题 | `rgb(230, 231, 255)`（几乎看不见的背景色阶） | `rgb(87, 83, 198)` |

配置开关同样实测有效（保存后约 2 秒生效）：关掉氛围背景 + 毛玻璃导航栏 → 注入体积
18155 → 14918 字节、规则 86 → 71 条、背景渐变消失、导航栏回到 `static`；把圆角切成 `round`
→ 节点卡圆角 `19.8px → 26.4px`；恢复默认后各项与初始值完全一致。全过程浏览器控制台无报错。

市场安装链路（本机无直连公网，走 socks5 代理）也已跑通：把本仓库的 `v1.json` 添加为市场来源后，
目录里出现 `ui-polish 1.0.0`（`installable: true`），一键安装成功，后台插件日志：

```
[plugin] loaded ui-polish
[ui-polish] injected 18 KiB of CSS; sections: numerals, ambient, glass, elevation, tables, adminShell, scrollbar, motion, loader
```

安装后的 4 个文件与发行包内的条目**逐字节一致**；发行包哈希 `e77cacc6…` 与市场清单里的 `sha256`、
以及本地重新构建的结果三者相同（打包已固定时间戳，可复现；市场安装时服务端也会校验该哈希）。

## 已知边界

- 只注入 CSS，因此**无法**修复需要改代码的问题。例如节点价格标签在到期时间字段为空时
  会渲染出 `NaN day` 徽章，属于组件逻辑，已在
  [komari-self](https://github.com/programming666/komari-self) 的前端改动里修掉，
  插件层面不做 DOM 劫持。
- 与「界面美化」相关的另一条路子是把样式直接编进前端：
  见仓库根的 `SELF-FORK.md`。两种方式可以共存，样式是幂等的。
