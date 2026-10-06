const markdownIt = require('markdown-it');
const site = require('./src/_data/site.json');
const topics = require('./src/_data/topics.json');
const basePath = process.env.SITE_BASE_PATH || site.basePath;
const publicationDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

const plainText = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const articleDate = value => new Date(value).toISOString().slice(0, 10);
const prefix = value => `${basePath.replace(/\/$/, '')}/${String(value).replace(/^\//, '')}`;

module.exports = function(config) {
  config.addPassthroughCopy({ 'src/assets': 'assets' });
  config.addPassthroughCopy({ 'src/.nojekyll': '.nojekyll' });
  config.addWatchTarget('src/assets');
  const md = markdownIt({ html: true, linkify: true, typographer: false });
  md.core.ruler.push('heading_ids', state => {
    const used = new Map();
    state.tokens.forEach((token, index) => {
      if (token.type !== 'heading_open') return;
      const title = state.tokens[index + 1].content;
      const stem = title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
      const count = (used.get(stem) || 0) + 1;
      used.set(stem, count);
      token.attrSet('id', count === 1 ? stem : `${stem}-${count}`);
    });
  });
  config.setLibrary('md', md);
  config.addFilter('dateText', articleDate);
  config.addFilter('topicFor', id => topics.find(topic => topic.id === id));
  config.addFilter('inTopic', (articles, id) => articles.filter(article => article.data.category === id));
  config.addFilter('inSection', (articles, section) => articles.filter(article => topics.find(t => t.id === article.data.category)?.section === section));
  config.addFilter('latest', (articles, count = 4) => articles.slice(0, count));
  config.addFilter('exceptArticle', (articles, slug) => articles.filter(article => article.data.slug !== slug));
  config.addFilter('readTime', content => {
    const text = plainText(content);
    const chinese = (text.match(/[\u3400-\u9fff]/g) || []).length;
    const words = text.replace(/[\u3400-\u9fff]/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(chinese / 350 + words / 220));
  });
  config.addFilter('toc', content => {
    const headings = Array.from(String(content).matchAll(/<h([23]) id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gs));
    return headings.map(([, level, id, title]) => `<li class="toc-level-${level}"><a href="#${encodeURIComponent(id)}">${escape(plainText(title))}</a></li>`).join('');
  });
  config.addFilter('asJson', value => JSON.stringify(value).replace(/</g, '\\u003c'));
  config.addFilter('searchEntries', articles => articles.map(article => ({
    title: article.data.title, description: article.data.description,
    category: article.data.category, categoryName: topics.find(t => t.id === article.data.category).name,
    tags: article.data.tags || [], date: articleDate(article.date),
    text: plainText(article.templateContent), url: prefix(article.url)
  })));
  config.addFilter('absolute', value => `${site.url}${prefix(value)}`);
  config.addCollection('articles', collection => collection.getFilteredByGlob('src/posts/*.md')
    .filter(item => item.data.status === 'published' && articleDate(item.date) <= publicationDay)
    .sort((a, b) => b.date - a.date || a.data.slug.localeCompare(b.data.slug)));
  config.addGlobalData('buildYear', new Date().getUTCFullYear());
  config.addGlobalData('basePath', basePath);
  return { dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    templateFormats: ['njk', 'md', '11ty.js'], markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk', pathPrefix: basePath };
};
