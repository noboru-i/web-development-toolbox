# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際にClaude Code (claude.ai/code) に対してガイダンスを提供します。

## プロジェクトアーキテクチャ

これはWeb開発ユーティリティ用のMCP（Model Context Protocol）サーバー実装を含むTypeScriptモノレポです。アーキテクチャは2つのメインパッケージを持つワークスペースベースの構造に従っています：

- **web-development-toolbox-mcp**: エンコーディング、色変換、日時操作、QRコード、画像生成のユーティリティツールを提供するメインMCPサーバー
- **web-development-toolbox-mcp-remote**: OAuth統合を備えたCloudflare Workersベースのリモート版

## 開発コマンド

### ビルド・開発
```bash
# 全パッケージをビルド
npm run build

# 全パッケージのウォッチモード
npm run watch

# 特定パッケージをビルド
npm run build --workspace=packages/web-development-toolbox-mcp

# デバッグ用MCPインスペクターを実行
cd packages/web-development-toolbox-mcp && npm run inspector
```

### パッケージ固有のコマンド
```bash
# MCPパッケージ
cd packages/web-development-toolbox-mcp
npm run build
npm run inspector

# リモートパッケージ (Cloudflare Workers)
cd packages/web-development-toolbox-mcp-remote
npm run build
npm run start        # wrangler dev
npm run deploy       # wrangler deploy
npm run inspector    # 同時実行: inspector + dev server
```

## コード構造

### Operationsパターン
両パッケージとも、各ユーティリティ カテゴリが独自のモジュールに分離されたモジュラー操作パターンを使用しています：
- `operations/base64.ts` - Base64エンコーディング/デコーディング
- `operations/color.ts` - 色フォーマット変換（hex、RGB、HSV）
- `operations/datetime.ts` - Unix/ISOタイムスタンプ変換
- `operations/image.ts` - プレースホルダー画像生成
- `operations/jwt.ts` - JWTトークンデコーディング
- `operations/qr.ts` - QRコード生成
- `operations/uuid.ts` - UUID v4/v7生成

### MCPサーバーアーキテクチャ
メインサーバー（`index.ts`）はModel Context Protocol SDKを使用し、以下の機能があります：
- `server-handlers.ts`の`getAvailableTools()`によるツール登録
- ツール実行のための`handleToolCall()`によるリクエスト処理
- 入力検証とJSONスキーマ生成のためのZodスキーマ

## コーディング規準

- **コメント**: 常に英語でコメントを記述する（.github/copilot-instructions.md に基づく）
- **TypeScript**: 明示的な型を使用し、`any`を避け、単一責任の原則に従う
- **JSDoc**: エクスポート関数には英語でJSDocコメントを含める
- **関数**: 複雑なロジックは独立した関数に分離する
- **エクスポート**: エクスポート関数と内部関数を明確に区別する

## TypeScript設定

プロジェクトはTypeScriptコンポジット設定を使用しています：
- ターゲット: ES2022
- モジュール: Node16
- 厳密モード有効
- ワークスペースパッケージ用のプロジェクト参照