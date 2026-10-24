"""Refresh the public fallback snapshot; failures leave the previous file intact."""
import datetime
import json
from pathlib import Path
import urllib.request

totals = {'android': 0, 'windows': 0}
names = {'Rubezh.apk': 'android', 'Rubezh_Windows.zip': 'windows'}
found = False
for page in range(1, 21):
    req = urllib.request.Request(
        f'https://api.github.com/repos/erick2112d/rubezh-game/releases?per_page=100&page={page}',
        headers={'User-Agent': 'Rubezh-download-stats', 'Accept': 'application/vnd.github+json'})
    with urllib.request.urlopen(req, timeout=20) as response:
        releases = json.load(response)
    if not isinstance(releases, list):
        raise ValueError('Unexpected release list')
    for release in releases:
        if release.get('draft'):
            continue
        for asset in release['assets']:
            if asset['name'] in names:
                count = asset['download_count']
                if not isinstance(count, int) or count < 0:
                    raise ValueError('Invalid count')
                totals[names[asset['name']]] += count
                found = True
    if len(releases) < 100:
        break
else:
    raise ValueError('Too many release pages')
if not found:
    raise ValueError('No game files found')
totals['updated_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
path = Path(__file__).resolve().parents[1] / 'docs' / 'download-stats.json'
path.write_text(json.dumps(totals, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(totals))
