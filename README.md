# 婚禮電子喜帖網站

這是一個使用純 `HTML / CSS / JavaScript` 製作的婚禮電子喜帖網站，不需要安裝任何付費套件。

目前這個專案的正式發布方式以 `GitHub Pages` 為主。

專案內已加入 `publish.ps1`，可在本機一鍵提交並上傳到 GitHub。

如果你習慣直接雙擊，也可以使用 `publish.bat`。

## 1. 如何修改 `wedding_info.json`

打開專案內的 `wedding_info.json`，直接修改內容即可。

可修改欄位包含：

- `groom`：新郎名字
- `bride`：新娘名字
- `date`：婚禮日期，建議格式 `YYYY-MM-DD`
- `time`：例如 `午宴`、`晚宴`
- `venue`：宴客地點
- `address`：完整地址
- `map_link`：Google 地圖連結
- `transport`：交通資訊
- `schedule`：婚禮流程
- `note`：小提醒文字

改完之後重新整理頁面即可看到更新。

如果你修改的是 GitHub Pages 上的正式網站，記得把新的 `wedding_info.json` 再上傳到 GitHub。

## 2. 如何替換照片

照片請放在：

`assets/photos/`

目前主要檔名如下：

- `cover.jpg`：首頁封面背景圖
- `photo1.jpg`：輪播第 1 張
- `photo2.jpg`：輪播第 2 張
- `photo3.jpg`：輪播第 3 張

替換方式：

1. 準備你的照片
2. 將檔名改成對應名稱
3. 覆蓋原本的檔案

建議：

- 封面圖可用高解析大圖
- 輪播照片比例盡量接近
- 網站已設定圖片不變形，會自動裁切填滿區塊

## 3. 如何用瀏覽器開啟

你可以用以下方式開啟：

### 方式一：直接打開 `index.html`

直接雙擊 `index.html` 即可。

### 方式二：拖曳到瀏覽器

把 `index.html` 拖曳到 Chrome、Edge 或其他瀏覽器也可以開啟。

## 4. 如何部署到 GitHub Pages

目前正式版本以 `GitHub Pages` 為主。

部署時主要需要上傳：

- `index.html`
- `style.css`
- `script.js`
- `wedding_info.json`
- `assets/`
- `.nojekyll`

如果你要看完整部署步驟，請直接看：

`DEPLOY_GITHUB_PAGES.md`

部署完成後，網站網址通常會是：

`https://你的GitHub帳號.github.io/wedding_card/`

## 5. 如何分享給賓客

最穩定的方式是分享 GitHub Pages 網址。

你可以把網址：

- 傳到 LINE
- 傳到 Facebook Messenger
- 傳到 Email
- 做成 QR Code 放在紙本喜帖上

如果你只是臨時把檔案傳到手機，也可以直接開：
- GitHub Pages 網址

## 6. 如何一鍵上傳更新到 GitHub

專案內有一個：

- `publish.ps1`
- `publish.bat`

用途是幫你自動執行：

- `git add .`
- `git commit`
- `git push origin main`

使用方式：

1. 先改好內容或照片
2. 在專案資料夾裡執行 `publish.ps1`，或直接雙擊 `publish.bat`
3. 輸入這次更新的說明文字
4. 等它自動 push 到 GitHub
5. GitHub Pages 會自動重新發布

如果直接按 Enter，不輸入 commit 訊息，腳本會自動使用預設訊息。

補充：

- 第一次執行時，腳本會先嘗試把本機專案接到 GitHub 上既有的 `main`
- 如果這個 repo 還沒設定 Git 的 `user.name` / `user.email`，腳本會自動詢問你
- 如果 GitHub 要求登入，照畫面完成登入即可

## 7. 專案檔案說明

- `index.html`：網站主頁
- `style.css`：網站樣式
- `script.js`：互動功能與資料載入
- `wedding_info.json`：婚禮資訊
- `assets/photos/`：封面圖與輪播照片
- `assets/icons/`：圖示資料夾
- `publish.ps1`：一鍵提交並上傳到 GitHub
- `publish.bat`：可雙擊執行的一鍵上傳入口
- `DEPLOY_GITHUB_PAGES.md`：GitHub Pages 部署說明
- `PROJECT_STATUS.md`：目前專案狀態與下次修改起點

## 8. 使用方式總結

1. 先改 `wedding_info.json`
2. 再換 `assets/photos/` 裡的照片
3. 打開 `index.html` 檢查畫面
4. 雙擊 `publish.bat` 或執行 `publish.ps1`
5. 等 GitHub Pages 自動重新發布
6. 把 GitHub Pages 網址分享給賓客
