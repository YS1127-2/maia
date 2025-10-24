# バックエンド用Dockerfile
FROM eclipse-temurin:21-jdk-alpine

# 作業ディレクトリを設定
WORKDIR /app

# Gradleラッパーとビルドファイルをコピー
COPY gradlew .
COPY gradle gradle/
COPY build.gradle .
COPY settings.gradle .
COPY gradle.properties .
COPY dependencies.gradle .
COPY config config/

# プロジェクトのソースをコピー
COPY application-core application-core/
COPY infrastructure infrastructure/
COPY system-common system-common/
COPY web web/
COPY web-consumer web-consumer/
COPY web-admin web-admin/
COPY batch batch/

# Gradleラッパーに実行権限を付与
RUN chmod +x gradlew

# 依存関係をダウンロードしてビルド（キャッシュ最適化のため）
RUN ./gradlew build -x test --no-daemon

# ポートを公開
EXPOSE 8080

# アプリケーションを起動
CMD ["./gradlew", "web-consumer:bootRunDev", "--no-daemon"]
