/* Public GitHub release download totals; no account credentials in the browser. */
(() => {
  'use strict';
  const API = 'https://api.github.com/repos/erick2112d/rubezh-game/releases?per_page=100';
  const KEY = 'rubezh-release-downloads-v1';
  const MAX_AGE = 60 * 60 * 1000;
  const FILES = { 'Rubezh.apk': 'android', 'Rubezh_Windows.zip': 'windows' };
  const nodes = document.querySelectorAll('[data-download-count]');
  if (!nodes.length) return;
  let newest = 0;

  function valid(data) {
    return data && Number.isFinite(Date.parse(data.updated_at)) &&
      ['android', 'windows'].every(p => Number.isSafeInteger(data[p]) && data[p] >= 0);
  }
  function render(data) {
    if (!valid(data)) return;
    const timestamp = Date.parse(data.updated_at);
    if (timestamp < newest) return;
    newest = timestamp;
    const date = new Date(data.updated_at).toLocaleString('ru-RU');
    nodes.forEach(node => {
      node.querySelector('strong').textContent = data[node.dataset.downloadCount].toLocaleString('ru-RU');
      node.title = `Все опубликованные версии. Данные GitHub на ${date}`;
    });
  }
  function cached() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (_) { return null; }
  }
  async function get(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } finally { clearTimeout(timeout); }
  }
  async function refresh() {
    // This snapshot remains available when the GitHub API is rate limited.
    try { render(await get('download-stats.json')); } catch (_) { /* Keep the loading placeholder. */ }
    const previous = cached();
    if (valid(previous)) {
      render(previous);
      const age = Date.now() - Date.parse(previous.updated_at);
      if (age >= 0 && age < MAX_AGE) return;
    }
    try {
      const totals = { android: 0, windows: 0, updated_at: new Date().toISOString() };
      let found = false;
      for (let page = 1; ; page++) {
        if (page > 20) throw new Error('Too many release pages');
        const releases = await get(`${API}&page=${page}`);
        if (!Array.isArray(releases)) throw new Error('Unexpected API response');
        for (const release of releases) {
          if (release.draft) continue;
          if (!Array.isArray(release.assets)) throw new Error('Missing assets');
          for (const asset of release.assets) {
            const platform = FILES[asset.name];
            if (!platform) continue;
            if (!Number.isSafeInteger(asset.download_count) || asset.download_count < 0) throw new Error('Invalid count');
            totals[platform] += asset.download_count;
            found = true;
          }
        }
        if (releases.length < 100) break;
      }
      if (!found) throw new Error('No game files');
      render(totals);
      try { localStorage.setItem(KEY, JSON.stringify(totals)); } catch (_) { /* Storage may be disabled. */ }
    } catch (_) { /* Preserve the last known totals instead of showing a false zero. */ }
  }
  refresh();
})();
