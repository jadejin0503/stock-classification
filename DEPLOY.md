# 股票分类页 — 分享与在线部署

将静态页面发布到公网后，访问者打开链接即可：

- 浏览 20 类产业链分类与 190+ 家公司详情
- **自动实时刷新** A 股行情（新浪财经，每 60 秒 + 手动刷新）
- 搜索、折叠分类、添加自定义股票、编辑「我的备注」（均保存在各自浏览器）

---

## 方式一：GitHub Pages（推荐，免费公网链接）

### 1. 创建仓库并推送

```bash
cd /Users/jade/Desktop/AI_knowledge

# 若 Canvas 不在默认路径，复制一份到仓库内（CI 定时更新行情需要）
cp /Users/jade/.cursor/projects/Users-jade-Desktop-AI-knowledge/canvases/watchlist-classification.canvas.tsx \
   ./watchlist-classification.canvas.tsx

git init
git add .
git commit -m "Add stock classification page"
git branch -M main
git remote add origin https://github.com/jadejin0503/stock-classification.git
git push -u origin main
```

### 2. 开启 GitHub Pages

1. 打开仓库 → **Settings** → **Pages**
2. **Build and deployment** → Source 选 **GitHub Actions**
3. 首次 push 后，Actions 工作流会自动构建并部署

### 3. 获取分享链接

部署成功后地址为：

```
https://jadejin0503.github.io/stock-classification/
```

（若仓库名不同，域名中的路径会相应变化。）

### 4. 自动更新

- **行情**：工作流在**工作日 9:35、15:05（北京时间）**拉取新浪/腾讯快照并重新发布；访客打开页面时仍会**实时拉取**最新价
- **股票列表/详情**：修改 Canvas 或 `stock-details.json` 后，本地运行 `./publish.sh`，再 `git push` 即可

---

## 方式二：本地一键发布（预览 / 手动上传）

```bash
cd /Users/jade/Desktop/AI_knowledge
chmod +x publish.sh
./publish.sh
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080/docs/
```

将 `docs/` 文件夹上传到任意静态托管（Vercel、Netlify、Cloudflare Pages、对象存储静态网站）即可获得 HTTPS 链接，实时行情同样可用。

---

## 方式三：打包 zip 发给他人

```bash
./publish.sh
zip -r stock-classification-share.zip docs/ DEPLOY.md
```

对方解压后：

- **仅浏览快照**：双击 `docs/index.html`（行情为构建时快照，无自动刷新）
- **完整体验（实时行情）**：在 `docs` 目录运行 `python3 -m http.server 8080`，访问 `http://localhost:8080/`

---

## 日常维护命令

| 操作 | 命令 |
|------|------|
| 更新行情快照 + 重建页面 | `./publish.sh` |
| 仅重建页面（不改行情） | `python3 build-stock-html.py` |
| 重新生成风险文案 | `python3 generate-stock-risks.py` |

修改 Canvas 增删股票后，需同步 `stock-details.json` 并执行 `./publish.sh`。

---

## 说明

- **我的备注 / 自定义股票** 存在访客浏览器 `localStorage`，不会云端同步
- 港股、美股显示「请查券商」，不参与实时刷新
- 实时行情依赖新浪财经接口；若偶发失败，页面会回退到内嵌快照并提示重试
