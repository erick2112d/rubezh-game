# Аналитика сайта «Рубеж»

Google Analytics: аккаунт ERA, ресурс 560650610, тег G-24NKG1SP3R.

Публичный сайт: https://erick2112d.github.io/rubezh-game/

Аналитика загружается после согласия посетителя. В подвале есть кнопка изменения выбора. Рекламные сигналы отключены. Неизвестные параметры URL не передаются в `page_location`. Страница оплаты `paid.html` не содержит тега аналитики.

Событие `download_click` означает нажатие кнопки, а не завершённое скачивание:

- `download_platform`: `android` или `windows`;
- `button_location`: `hero` или `download`;
- `file_name`: имя файла;
- `link_url`: публичная ссылка скачивания.

Для разреза по платформам в Google Analytics создаётся специальный параметр уровня события «Платформа скачивания» с именем `download_platform`. Просмотры и переходы с UTM доступны в стандартных отчётах о трафике.

Под кнопками показывается независимая статистика GitHub: сумма `download_count` для файлов `Rubezh.apk` и `Rubezh_Windows.zip` во всех опубликованных релизах. Проверка обновлений `version.json` не учитывается. Это загрузки, включая обновления и повторы, а не уникальные игроки.

Браузер получает свежие данные публичного API GitHub и кэширует их на час. Токен GitHub посетителям не передаётся. При ограничениях API или проблемах сети сохраняется последнее известное значение; для нового браузера используется `docs/download-stats.json`. Чтобы обновить этот резервный снимок при очередной публикации сайта: `python tools/update_download_stats.py`.

Ссылка для TikTok:
https://erick2112d.github.io/rubezh-game/?utm_source=tiktok&utm_medium=social&utm_campaign=beta

Ссылка для YouTube:
https://erick2112d.github.io/rubezh-game/?utm_source=youtube&utm_medium=video&utm_campaign=beta
