# フロントエンド用Dockerfile
FROM node:22.12.0-slim

# 作業ディレクトリを設定
WORKDIR /app

# すべてのファイルをコピー（ワークスペース構造を保持）
COPY . .

# 依存関係をインストール
# ワークスペース全体の依存関係を正しく解決するため、全ファイルコピー後にインストール
# Cypressのバイナリインストールをスキップ（開発サーバーには不要）
ENV CYPRESS_INSTALL_BINARY=0
RUN npm install

# ポートを公開
EXPOSE 5173

# 開発サーバーを起動
# docker-compose.yamlでcommandをオーバーライドして--hostオプションを指定
CMD ["npm", "run", "mock:consumer"]
