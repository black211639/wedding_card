# 婚禮電子喜帖

這個專案是純 `HTML / CSS / JavaScript` 靜態網站，不需要安裝 Node.js 或額外套件。
任何一台 Windows 電腦只要有 `Git` 和 `Python 3`，而且 PowerShell 可使用 `py` 或 `python`，就可以編輯、預覽、發布。

## 專案結構

- `index.html`：頁面結構與內嵌備援資料
- `style.css`：版面與樣式
- `script.js`：讀取資料、套用內容、輪播互動
- `wedding_info.json`：婚禮資訊主資料檔
- `assets/photos/`：封面與婚紗照
- `preview.ps1` / `preview.bat`：本機預覽
- `publish.ps1` / `publish.bat`：提交並推送到 GitHub

## 在任何 Windows 電腦怎麼使用

1. 修改 `wedding_info.json`
2. 把照片放到 `assets/photos/`
3. 本機預覽：
   - 雙擊 `preview.bat`
   - 或在 PowerShell 執行 `.\preview.ps1`
4. 開瀏覽器進入 `http://127.0.0.1:8000`
5. 要發布到 GitHub 時，再執行 `publish.bat` 或 `publish.ps1`

## 為什麼要用 preview

`script.js` 會讀取 `wedding_info.json`。
如果直接雙擊 `index.html`，瀏覽器通常會擋掉本機 `fetch`，畫面就可能只顯示 `index.html` 裡的內嵌備援資料，而不是你剛改過的 JSON。

`preview.ps1` 會用 Python 內建的 `http.server` 啟動本機伺服器，這樣資料讀取就會正常。

## 目前已確認的環境條件

- `Git` 可正常使用
- 這個 repo 的 `origin` 已指向 GitHub
- `publish.ps1` 會先檢查 GitHub 遠端連線
- 本機預覽需要 `Python 3`，且 PowerShell 可使用 `py` 或 `python`

## 發布到 GitHub Pages

1. 確認內容修改完成
2. 執行 `publish.bat` 或 `publish.ps1`
3. 輸入 commit message，或直接按 Enter 使用預設訊息
4. 等待 `git push origin main` 完成
5. GitHub Pages 幾分鐘後會更新
