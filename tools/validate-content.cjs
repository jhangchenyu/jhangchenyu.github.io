const fs = require('node:fs');
const path = require('node:path');
const matter = require('gray-matter');
const topics = require('../src/_data/topics.json');
const root = path.resolve(__dirname, '..');
const slugs = new Set();
const failures = [];
const publicationDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
for (const name of fs.readdirSync(path.join(root, 'src/posts')).filter(name => name.endsWith('.md'))) {
  const { data, content } = matter.read(path.join(root, 'src/posts', name));
  const problems = [];
  for (const key of ['title', 'description', 'slug', 'category', 'date']) if (!data[key]) problems.push(`缺少 ${key}`);
  if (data.status !== 'published') problems.push('src/posts 只放已發布文章；草稿請留在 drafts');
  if (!topics.some(topic => topic.id === data.category)) problems.push('分類不存在');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug || '')) problems.push('slug 必須是小寫英文、數字與連字號');
  if (slugs.has(data.slug)) problems.push('slug 重複');
  slugs.add(data.slug);
  const date = new Date(data.date);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) > publicationDay) problems.push('日期無效或尚未到發布日');
  if (!content.trim()) problems.push('文章沒有內文');
  if (data.tags && (!Array.isArray(data.tags) || !data.tags.every(tag => typeof tag === 'string'))) problems.push('tags 必須是文字陣列');
  if (/\]\((?:file:|[A-Za-z]:[\\/])/i.test(content)) problems.push('圖片或連結不可使用本機絕對路徑');
  if (problems.length) failures.push(`${name}: ${problems.join('；')}`);
}
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log(`Validated ${slugs.size} published article(s), ${topics.length} categories.`);
