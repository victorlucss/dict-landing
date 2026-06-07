// Repoint every "/Dict.dmg" download link at the latest real release on GitHub,
// and fill any .dl-version label. The repo's bundled Dict.dmg is only a tiny
// placeholder, so we never want to serve it. Falls back to the releases page if
// the GitHub API is unreachable.
(async () => {
  const links = document.querySelectorAll('a[href$="Dict.dmg"]');
  const RELEASES = 'https://github.com/victorlucss/dict/releases/latest';
  links.forEach((a) => { a.href = RELEASES; });
  try {
    const res = await fetch('https://api.github.com/repos/victorlucss/dict/releases/latest');
    if (!res.ok) return;
    const rel = await res.json();
    const dmg = (rel.assets || []).find((a) => a.name.endsWith('.dmg'));
    if (dmg) links.forEach((a) => { a.href = dmg.browser_download_url; });
    const v = (rel.tag_name || '').replace(/^v/, '');
    if (v) document.querySelectorAll('.dl-version').forEach((el) => { el.textContent = 'v' + v; });
  } catch (_) { /* keep the releases-page fallback */ }
})();
