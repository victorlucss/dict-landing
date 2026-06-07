// Repoint every "/Dict.dmg" download link at the latest real release on GitHub,
// pick the asset for the visitor's OS, and label the button accordingly. The
// repo's bundled Dict.dmg is only a tiny placeholder, so we never serve it.
// Falls back to the releases page if the GitHub API is unreachable.
(async () => {
  const RELEASES = 'https://github.com/victorlucss/dict/releases/latest';
  const links = document.querySelectorAll('a[href$="Dict.dmg"]');
  links.forEach((a) => { a.href = RELEASES; });

  // Guess the OS so the primary button says the right thing.
  const ua = navigator.userAgent || '';
  let os = 'mac';
  if (/Windows/i.test(ua)) os = 'win';
  else if (/Linux/i.test(ua) && !/Android/i.test(ua)) os = 'linux';

  const labels = { mac: 'Download for macOS', win: 'Download for Windows', linux: 'Download for Linux' };
  const matches = {
    mac: (n) => n.endsWith('.dmg'),
    win: (n) => n.endsWith('-setup.exe'),
    linux: (n) => n.endsWith('.AppImage'),
  };
  document.querySelectorAll('.dl-label').forEach((el) => { el.textContent = labels[os]; });

  try {
    const res = await fetch('https://api.github.com/repos/victorlucss/dict/releases/latest');
    if (!res.ok) return;
    const rel = await res.json();
    const assets = rel.assets || [];
    const asset = assets.find((a) => matches[os](a.name)) || assets.find((a) => a.name.endsWith('.dmg'));
    if (asset) links.forEach((a) => { a.href = asset.browser_download_url; });
    const v = (rel.tag_name || '').replace(/^v/, '');
    if (v) document.querySelectorAll('.dl-version').forEach((el) => { el.textContent = 'v' + v; });
  } catch (_) { /* keep the releases-page fallback */ }
})();
