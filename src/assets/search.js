(() => {
  'use strict';
  const form = document.querySelector('[data-search-index]');
  if (!form) return;
  const output = document.querySelector('[data-search-results]');
  const status = document.querySelector('[data-search-status]');
  const query = form.elements.q;
  const category = form.elements.category;
  let entries = [];
  const normalized = text => String(text).normalize('NFKC').toLocaleLowerCase();
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  function render() {
    const terms = normalized(query.value).trim().split(/\s+/).filter(Boolean);
    const matches = entries.filter(entry => (!category.value || category.value === entry.category)
      && terms.every(term => normalized([entry.title, entry.description, entry.text, ...entry.tags].join(' ')).includes(term)));
    status.textContent = `找到 ${matches.length} 篇文章`;
    const list = node('div', undefined, 'article-list');
    for (const entry of matches) {
      const row = node('article', undefined, 'article-row');
      const meta = node('div', undefined, 'article-meta');
      const date = node('time', entry.date); date.dateTime = entry.date;
      meta.append(node('span', entry.categoryName), date);
      const body = node('div');
      const heading = node('h3');
      const link = node('a', entry.title); link.href = entry.url; heading.append(link);
      const tags = node('div', undefined, 'article-tags');
      entry.tags.forEach(tag => tags.append(node('span', '#' + tag)));
      body.append(heading, node('p', entry.description), tags);
      row.append(meta, body); list.append(row);
    }
    if (!matches.length) {
      const empty = node('div', undefined, 'empty-state');
      empty.append(node('h3', '還沒找到符合的文章'), node('p', '試試其他關鍵字，或選擇所有分類。'));
      output.replaceChildren(empty);
    } else output.replaceChildren(list);
    const params = new URLSearchParams();
    if (query.value.trim()) params.set('q', query.value.trim());
    if (category.value) params.set('category', category.value);
    history.replaceState(null, '', location.pathname + (params.size ? '?' + params : ''));
  }
  fetch(form.dataset.searchIndex).then(response => {
    if (!response.ok) throw new Error('Search index unavailable');
    return response.json();
  }).then(data => {
    entries = data;
    const params = new URLSearchParams(location.search);
    query.value = params.get('q') || '';
    category.value = params.get('category') || '';
    form.hidden = false;
    form.addEventListener('submit', event => { event.preventDefault(); render(); });
    form.addEventListener('input', render);
    form.addEventListener('reset', () => { query.value = ''; category.value = ''; render(); });
    render();
  }).catch(() => { status.textContent = '搜尋暫時無法載入，下方仍可瀏覽所有文章。'; });
})();
