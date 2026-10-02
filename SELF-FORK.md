# Komari Self —— 界面美化分支

本仓库是 [komari-monitor/komari](https://github.com/komari-monitor/komari) 的个人分支，
在原版后端之上对**前端界面**做了一轮系统性视觉打磨，并把前端源码与构建产物一并放进仓库：
克隆后直接 `go build` / `docker build` 就能得到一个界面美化过的完整 Komari，无需先构建前端。

上游的 README、许可证与版权声明保持原样，本仓库仅供个人自用。

## 目录约定

| 路径 | 说明 |
| --- | --- |
| `frontend/` | 美化后的前端源码快照（React 19 + Vite 6 + Tailwind v4 + Radix Themes），上游为 `komari-monitor/komari-web` |
| `web/public/defaultTheme/dist.tar.zst` | 前端构建产物归档，由 `go:embed` 内嵌。**已提交**，因此克隆后不必先构建前端 |
| `web/public/defaultTheme/komari-theme.json` | 默认主题元数据 |
| `scripts/build-default-theme.mjs` | 把 `frontend/dist` 打包成上面的 `dist.tar.zst`（纯 Node，不依赖 zstd CLI） |

## 界面预览

| 公开首页（亮色） | 公开首页（暗色） |
| --- | --- |
| ![首页 亮色](docs/screenshots/home-light.png) | ![首页 暗色](docs/screenshots/home-dark.png) |

| 管理后台 Dashboard | 节点详情 |
| --- | --- |
| ![后台 Dashboard](docs/screenshots/admin-dashboard.png) | ![节点详情](docs/screenshots/instance.png) |

## 重新构建前端并更新内嵌产物

```bash
cd frontend
npm install
npm run build            # 输出 frontend/dist
cd ..
node scripts/build-default-theme.mjs      # 默认读取 frontend/dist，写入 web/public/defaultTheme/dist.tar.zst
go build -o komari .                      # 或 docker build
```

`scripts/build-default-theme.mjs` 会检查 `frontend/dist/index.html` 是否存在，缺失即报错退出；
产物大小会在结束时打印出来。

## 这一轮界面美化改了什么

设计层集中在新增的 `frontend/src/theme-polish.css`（在 `@radix-ui/themes/styles.css`
之后加载），其余只是少量 token 与组件级微调。**没有改动任何业务逻辑、接口与数据结构。**

1. **设计 token**
   - 更柔和的容器圆角（12–18px），控件保留原有尺度；
   - 三层阴影体系（亮色为冷灰、暗色为纯黑），随主题切换；
   - 由强调色推导的发丝线（hairline）与玻璃拟态表面。
2. **氛围背景**：`.theme-root` 上叠加跟随强调色的双径向渐变，前台与后台统一，滚动时固定；
   原版用 `accent-1` 平铺的纯色背景被替换，用户自定义背景图时自动让位。
3. **导航栏**：吸顶 + 毛玻璃 + 饱和度提升，品牌名渐变色；
   并修正原版把副标题写成 `accent-4`（背景色阶，几乎不可见）的问题，改为可读的文本色阶。
4. **卡片与概览**：节点卡悬停上浮 + 强调色描边 + 顶部高光；概览指标改为左侧带强调条的小卡片；
   搜索/分组工具条改为玻璃面板。
5. **用量条**：轨道加内阴影，填充加高光渐变，数值改用等宽数字（tabular-nums）避免跳动。
6. **表格**：`components/ui/table.tsx` 的表格卡片化 —— 描边、圆角、阴影、表头强调色底、行悬停反馈。
7. **加载态**：替换原版四色（红/蓝/绿/黄）旋转指示器，改为单一强调色圆环 + 淡色轨道，并垂直居中。
8. **缺陷修复**：`PriceTags` 在 `expired_at` 为空字符串 / `null` / 不可解析时，
   会渲染出 `NaN day` 徽章；现在这种情况视为“无到期时间”，不再渲染到期徽章。
9. **细节**：滚动条细化（悬停变强调色）、弹层/对话框统一圆角与阴影、遮罩模糊、
   文本选中色、`prefers-reduced-motion` 下关闭位移动画。

## 说明

- `frontend/` 是快照，不跟随上游自动更新；需要同步上游时手动对比合并。
- 上游 `.gitignore` 默认忽略 `web/public/defaultTheme/*`，本分支用 `git add -f` 强制纳入了
  `dist.tar.zst` —— 这是“克隆即可构建”的前提，改动前端后记得重新生成它。
