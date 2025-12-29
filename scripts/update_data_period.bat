@echo off
REM ============================================
REM UMAYOMI データ期間更新スクリプト
REM 年が変わったら START_YEAR と END_YEAR を変更してください
REM ============================================

REM === 設定 (ここを変更) ===
set START_YEAR=2016
set END_YEAR=2025

REM === パス設定 ===
set SOURCE_JRDB=E:\UMAYOMI\jrdb_data
set SOURCE_TFJV=E:\UMAYOMI\tfjv_data
set TARGET_JRDB=E:\UMAYOMI\jrdb_data_%START_YEAR%-%END_YEAR%
set TARGET_TFJV=E:\UMAYOMI\tfjv_data_%START_YEAR%-%END_YEAR%

echo ============================================
echo UMAYOMI データ期間更新
echo ============================================
echo.
echo 対象期間: %START_YEAR% - %END_YEAR%
echo.
echo ソース:
echo   JRDB: %SOURCE_JRDB%
echo   TFJV: %SOURCE_TFJV%
echo.
echo 出力先:
echo   JRDB: %TARGET_JRDB%
echo   TFJV: %TARGET_TFJV%
echo.
echo ============================================
echo.

REM === 確認 ===
echo この設定でデータ抽出を開始しますか？
pause

REM === JRDB データ抽出 ===
echo.
echo [1/2] JRDB データを抽出中...
echo.

if not exist "%TARGET_JRDB%" mkdir "%TARGET_JRDB%"

for /L %%Y in (%START_YEAR%,1,%END_YEAR%) do (
    echo   %%Y 年のデータをコピー中...
    xcopy "%SOURCE_JRDB%\PACI%%Y*" "%TARGET_JRDB%\" /E /I /H /Y /Q
)

echo.
echo [1/2] JRDB データ抽出完了！
echo.

REM === TFJV データ抽出 ===
echo.
echo [2/2] TFJV データを抽出中...
echo.

if not exist "%TARGET_TFJV%\SE_DATA" mkdir "%TARGET_TFJV%\SE_DATA"

for /L %%Y in (%START_YEAR%,1,%END_YEAR%) do (
    echo   %%Y 年のデータをコピー中...
    xcopy "%SOURCE_TFJV%\SE_DATA\%%Y" "%TARGET_TFJV%\SE_DATA\%%Y\" /E /I /H /Y /Q
    
    REM 他のデータ種類も抽出 (必要に応じて)
    if exist "%SOURCE_TFJV%\UM_DATA\%%Y" (
        if not exist "%TARGET_TFJV%\UM_DATA" mkdir "%TARGET_TFJV%\UM_DATA"
        xcopy "%SOURCE_TFJV%\UM_DATA\%%Y" "%TARGET_TFJV%\UM_DATA\%%Y\" /E /I /H /Y /Q
    )
    
    if exist "%SOURCE_TFJV%\BR_DATA\%%Y" (
        if not exist "%TARGET_TFJV%\BR_DATA" mkdir "%TARGET_TFJV%\BR_DATA"
        xcopy "%SOURCE_TFJV%\BR_DATA\%%Y" "%TARGET_TFJV%\BR_DATA\%%Y\" /E /I /H /Y /Q
    )
    
    if exist "%SOURCE_TFJV%\KT_DATA\%%Y" (
        if not exist "%TARGET_TFJV%\KT_DATA" mkdir "%TARGET_TFJV%\KT_DATA"
        xcopy "%SOURCE_TFJV%\KT_DATA\%%Y" "%TARGET_TFJV%\KT_DATA\%%Y\" /E /I /H /Y /Q
    )
)

echo.
echo [2/2] TFJV データ抽出完了！
echo.

REM === 結果確認 ===
echo.
echo ============================================
echo 抽出結果
echo ============================================
echo.

echo JRDB データ:
dir "%TARGET_JRDB%" /s | find "個のファイル"
echo.

echo TFJV データ:
dir "%TARGET_TFJV%" /s | find "個のファイル"
echo.

echo ============================================
echo データ抽出が完了しました！
echo ============================================
echo.
echo 次のステップ:
echo 1. E:\UMAYOMI\umayomi\internal-analysis-tool\config.py を開く
echo 2. DATA_START_YEAR と DATA_END_YEAR を更新する
echo.
pause
