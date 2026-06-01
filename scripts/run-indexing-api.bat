@echo off
REM ====================================================================
REM  Google Indexing API 自動実行バッチ
REM
REM  用途: 1日200件のクォータをmiCommit記事＋補助金LPで使い切るため、
REM        毎朝9:05に自動実行する想定。
REM
REM  実行方法:
REM   A) 手動: このbatファイルをダブルクリック
REM   B) 自動: Windowsタスクスケジューラに登録
REM      （登録手順は docs/INDEXING_DAILY_SCHEDULE.md 参照）
REM
REM  ログ: logs\indexing-cron-YYYYMMDD.log に追記
REM ====================================================================

cd /d "%~dp0\.."

REM 日付付きログファイル名
for /f "tokens=2 delims==" %%a in ('wmic os get localdatetime /value') do set datetime=%%a
set today=%datetime:~0,4%%datetime:~4,2%%datetime:~6,2%
set LOGFILE=logs\indexing-cron-%today%.log

REM logsディレクトリ確保
if not exist logs mkdir logs

echo. >> "%LOGFILE%"
echo ======================================== >> "%LOGFILE%"
echo  Indexing API 自動実行: %datetime% >> "%LOGFILE%"
echo ======================================== >> "%LOGFILE%"

REM dry-run で送信予定確認
echo [Dry Run] 送信予定確認... >> "%LOGFILE%"
call npm run index:run:oauth -- --dry-run >> "%LOGFILE%" 2>&1

REM 本実行
echo. >> "%LOGFILE%"
echo [本実行] 200URLを送信します... >> "%LOGFILE%"
call npm run index:run:oauth >> "%LOGFILE%" 2>&1

echo. >> "%LOGFILE%"
echo [完了] %datetime% >> "%LOGFILE%"
echo. >> "%LOGFILE%"

REM 結果サマリ（成功/エラー件数）
python -c "import json; d=json.load(open('logs/indexing-status.json',encoding='utf-8')); today=__import__('datetime').date.today().isoformat(); s=sum(1 for v in d['urls'].values() if v['status']=='SUCCESS' and v['lastSent'].startswith(today)); e=sum(1 for v in d['urls'].values() if v['status']=='ERROR' and v['lastSent'].startswith(today)); print(f'本日 SUCCESS:{s} / ERROR:{e}')" >> "%LOGFILE%" 2>&1

REM 任意：完了時のpopup（コメントアウト）
REM msg "%USERNAME%" "Indexing API 完了。logs\indexing-cron-%today%.log を確認"

exit /b 0
