# live2d_talk
## 開発の手順
### 1. パッケージのインストール
```
npm ci
```
### 2. ビルド
```
npm run build
```
### 3. ローカルでの動作確認
2のビルド完了後に、
- Live Server拡張をインストールしてGo Liveボタンをクリック

もしくは

```
npm run serve
```

※ 変更を反映させるには都度ビルドする必要がある

## ファイル説明
- /src/myui.ts ･･･ ロードの管理やボタンの処理など
- /src/speechrecognition.ts ･･･ 音声認識→返答の処理 
  - /src/worker.js ･･･ 返答を探索する処理
  - /src/replydict.ts ･･･ firebaseから返答のリストを取得する
  - /src/motionno.ts ･･･ 再生するモーション番号を保存, Live2D SDKに渡す
- /src/eyetracking.ts ･･･ 顔をトラッキングして目で追う処理

- /server/coefont.php ･･･ CoeFont API(音声合成API)にCORSの都合で直接アクセスできなかったので、それを回避するためのもの。speechrecognition.tsの112行目で呼び出している
- /server/chaplus.php ･･･ 上と同様の理由でChaplus API(雑談API)にもアクセスできなかったので。speechrecognition.tsの87行目で呼び出している(返答が見つからなかったときに限って雑談APIを使用しているので決して手抜きではない...)

その他のファイルはほとんどCubism SDK for Webのsample(https://docs.live2d.com/cubism-sdk-tutorials/sample-build-web/?locale=ja)そのまま。

## 使用した外部ライブラリ
- Cubism SDK for Web - https://www.live2d.com/download/cubism-sdk/
- clmtrackr - https://github.com/auduno/clmtrackr
- kuromoji - https://www.atilika.org/

## 使用したWeb API
- CoeFont CLOUD API - https://docs.coefont.cloud/
- Chaplus 対話API β - http://www.chaplus.jp/api
