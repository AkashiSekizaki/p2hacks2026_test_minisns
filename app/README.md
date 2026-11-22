# ミニSNS

React + Firebase（Authentication / Firestore）で作った小さなSNSです。ログイン、投稿、編集、削除、閲覧ができます。

## セットアップ

1. Node.js 18 以上をインストールする
2. 依存パッケージを入れる

   ```
   npm install
   ```

3. `.env.example` を `.env` にコピーし、配布された Firebase の値を入れる
4. 起動する

   ```
   npm run dev
   ```

   表示された URL（通常 http://localhost:5173）をブラウザで開く

## 画面

| 画面 | パス |
| --- | --- |
| タイムライン・投稿 | `/` |
| ログイン | `/login` |
| 新規登録 | `/signup` |
| 投稿詳細・編集・削除 | `/posts/:id` |
| マイページ | `/me` |

## Firebase の準備（運営用）

1. Firebase コンソールでプロジェクトを作る
2. Authentication で「メール/パスワード」を有効にする
3. Firestore Database を作成する（本番モードで可）
4. 「ルール」に `firestore.rules` の内容を貼って公開する
5. プロジェクトの設定 → マイアプリ → ウェブアプリを追加し、設定値を `.env` に入れる
6. Authentication の「ユーザー」から、既存アカウントをコンソール上で追加しておく（`users` ドキュメントは作らない）
