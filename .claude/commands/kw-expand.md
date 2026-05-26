---
description: シード/クラスタからキーワードを拡張し台帳(keywords.csv)に追記する
---
keyword-researcher エージェントを使って、次のシード/クラスタについてキーワードを拡張してください: $ARGUMENTS

手順:
1. keyword-researcher サブエージェントを起動し、検索意図・cluster・journey_phase・収益phase・cv_destination・priority・supervisor を分類させる。
2. 既存 content/pipeline/keywords.csv と既存記事との重複を照合（重複は統合候補として notes に）。
3. status=backlog で台帳に追記。
4. 追記したKW一覧を表で報告。
