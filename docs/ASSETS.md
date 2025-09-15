v1.01 画像アセット（暫定・外部CDN）

- 概要
  - リポジトリに画像が未配置のため、v1.01ではUnsplash Sourceを利用して外部CDN画像を参照しています。
  - 将来的に `assets/images/` に最適化済みのWebPを配置し、ローカル配信へ切り替え予定です。

- 使用箇所と画像ソース
  - ヒーロー: https://source.unsplash.com/1600x900/?beauty,salon,interior
  - 事例 Before: https://source.unsplash.com/600x400/?eyebrow,closeup,beauty
  - 事例 After: https://source.unsplash.com/600x400/?eyebrow,styling,beauty

- ライセンス/クレジット
  - Unsplashの利用規約に準拠（帰属は任意ですが推奨）。本番運用では実際に使用された写真の最終URLから写真ID/作者名を特定し、本ファイルへ記録します。
  - 例（記録フォーマット）
    - title: 不明（Unsplash Source）
    - author: 取得後に追記
    - url: 取得後に追記（例: https://unsplash.com/photos/<id>）
    - license: Unsplash License

- 備考
  - LP/HPで画像の具体的指定がない場合は、ミニマル/清潔感/高コントラストをデフォルトトーンとし、人物は原則控えめに選定します。
  - 画像の最適化（WebP複数解像度）とローカル化を行うタイミングで、本ファイルを確定版に更新します。

