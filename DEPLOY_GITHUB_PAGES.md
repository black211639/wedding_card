# GitHub Pages 部署教學

這份文件是教你把目前的 `wedding_card` 專案上傳到 GitHub，並啟用 `GitHub Pages`，讓網站變成可以直接用手機開啟的公開網址。

這個專案目前已經可以直接部署到 GitHub Pages，因為它使用的是純靜態檔案：

- `index.html`
- `style.css`
- `script.js`
- `wedding_info.json`
- `assets/`

另外我也加了 `.nojekyll`，可避免 GitHub Pages 對專案做不必要的 Jekyll 處理。

## 一、你要上傳哪些檔案

請把以下檔案與資料夾上傳到 GitHub repository 根目錄：

- `index.html`
- `style.css`
- `script.js`
- `wedding_info.json`
- `assets/`
- `.nojekyll`

以下檔案不是 GitHub Pages 必要檔案，可以不上傳：

- `README.md`
- `PROJECT_STATUS.md`
- `DEPLOY_GITHUB_PAGES.md`

## 二、在 GitHub 建立 repository

1. 打開 GitHub 並登入。
2. 右上角點 `+`。
3. 點 `New repository`。
4. Repository name 輸入你要的名稱，例如：
   `wedding_card`
5. 建議選 `Public`。
6. 按 `Create repository`。

提醒：

- 如果你是一般專案網站，repository 名稱可以自由命名。
- 發布後網址通常會是：
  `https://你的GitHub帳號.github.io/你的repository名稱/`

例如：

`https://your-account.github.io/wedding_card/`

這是 GitHub 官方對 project site 的一般規則。來源：GitHub Docs 說明 project site 預設位置是 `https://<owner>.github.io/<repositoryname>`。  
https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## 三、把檔案上傳到 GitHub

如果你不想用指令，直接用網頁上傳就可以。

### 方式 A：直接拖曳上傳

1. 進入你剛建立的 repository。
2. 點 `Add file`。
3. 點 `Upload files`。
4. 把以下檔案拖進去：
   - `index.html`
   - `style.css`
   - `script.js`
   - `wedding_info.json`
   - `.nojekyll`
5. 再把整個 `assets` 資料夾裡的檔案一起拖進去。

注意：

- GitHub 網頁上傳時，資料夾結構要保留正確。
- `assets/photos/cover.jpg`
- `assets/photos/photo1.jpg`
- `assets/photos/photo2.jpg`
- `assets/photos/photo3.jpg`

如果你直接從檔案總管把整個資料夾拖進 GitHub 上傳區，通常會保留結構。

6. 下方 `Commit changes` 可直接用預設訊息，或填：
   `first upload wedding card`
7. 點 `Commit changes`

### 方式 B：用 GitHub Desktop

如果你有安裝 GitHub Desktop，也可以：

1. 在 GitHub Desktop clone 這個 repository
2. 把本機 `wedding_card` 專案裡的檔案複製進 repository 資料夾
3. Commit
4. Push

## 四、確認首頁檔案位置正確

GitHub Pages 會找首頁入口檔案，常見是：

- `index.html`

目前這個專案的 `index.html` 已經在根目錄，所以符合 GitHub Pages 要求。

根據 GitHub 官方文件，若使用 branch/folder 當發布來源，入口檔案要放在來源資料夾最上層。  
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 五、啟用 GitHub Pages

上傳完成後，開始開啟 Pages。

1. 進入你的 repository
2. 點 `Settings`
3. 左側找到 `Pages`
4. 在 `Build and deployment` 區塊，`Source` 選：
   `Deploy from a branch`
5. Branch 選：
   `main`
6. Folder 選：
   `/ (root)`
7. 按 `Save`

這是 GitHub 官方目前建議的基本 branch 發布方式。  
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 六、取得網站連結

啟用後等幾分鐘，GitHub Pages 會自動發布。

之後你可以在：

- `Settings` → `Pages`

看到網站網址，通常會像這樣：

`https://你的GitHub帳號.github.io/wedding_card/`

GitHub 官方文件提到，發布後可在 repository 的 `Settings` 裡進入 `Pages` 並點 `Visit site` 查看。  
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 七、之後怎麼更新內容

如果你之後要修改內容：

1. 改 `wedding_info.json`
2. 或替換 `assets/photos/` 裡的照片
3. 再重新上傳到同一個 GitHub repository
4. GitHub Pages 會自動重新發布

一般來說，幾分鐘內會更新完成。

GitHub 官方文件提到，變更發布後可能需要最多約 10 分鐘才會生效。  
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 八、建議你實際上傳的最小清單

如果你只想先快速上線，最少上傳這些就夠：

- `index.html`
- `style.css`
- `script.js`
- `wedding_info.json`
- `assets/`
- `.nojekyll`

## 九、常見問題

### 1. 為什麼網址打開是 404

常見原因：

- `index.html` 沒有放在 repository 根目錄
- `Pages` 還沒啟用
- Branch 或 folder 選錯
- 剛發布還在等待中

### 2. 為什麼圖片沒出現

常見原因：

- `assets` 沒有完整上傳
- `assets/photos/` 結構跑掉
- 圖片檔名大小寫不一致

### 3. 為什麼修改 JSON 後沒更新

先確認：

- 你有把新的 `wedding_info.json` 再次上傳
- GitHub Pages 已重新發布
- 手機瀏覽器有時會快取，重新整理或改用無痕模式再看一次

## 十、官方文件

- Creating a GitHub Pages site  
  https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

- Configuring a publishing source for your GitHub Pages site  
  https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

- What is GitHub Pages?  
  https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
