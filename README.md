# NicoNicoCommentsOnAnyVideo

## 概要
任意の動画サイトで、指定したニコニコ動画のコメントをニコニコ風に表示できるGoogle Chrome拡張機能です

- YouTube, AmazonPrimeVideo, TVerで動作確認済み
- ニコニコの有料動画のコメントは取得できません

## 使用方法
### 1. ソースコードをダウンロード
```
git clone https://github.com/aetenotnk/AmazonPrimeVideoWithNicoNico.git
```

### 3. 拡張機能を設定
1. chrome://extensions/ を開く
2. デベロッパーモードに変更する
3. 「パッケージ化されていない拡張機能を読み込む」からダウンロードしたソースコードのフォルダを選択します。


### 3. コメントを表示する
- YouTubeなどの動画を再生した状態にする
- コメントを取得したいニコニコ動画のURLを、拡張機能のポップアップに入力し、「コメントを取得」をクリックする。
- コメントが取得されるまで時間がかかる場合があります。
- 取得するコメントを変更したい場合は、一度ページをリロードしてください。