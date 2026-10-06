const fs = require('node:fs');
const path = require('node:path');
const { spawnSync, spawn } = require('node:child_process');
const readline = require('node:readline/promises');
const matter = require('gray-matter');
const topics = require('../src/_data/topics.json');
const root = path.resolve(__dirname, '..');
const drafts = path.join(root, 'drafts');
const posts = path.join(root, 'src/posts');
const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', shell: false });
  if (result.status !== 0) throw new Error(`${command} 未完成；請先處理上方訊息，再重試。`);
}
function gitOutput(args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || 'Git 檢查失敗');
  return result.stdout.trim();
}
function build() {
  if (!fs.existsSync(path.join(root, 'node_modules/@11ty/eleventy/cmd.cjs'))) throw new Error('缺少 Eleventy，請先在網站資料夾執行 npm ci。');
  run(process.execPath, ['tools/validate-content.cjs']);
  run(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs']);
  run(process.execPath, ['tools/check-site.cjs']);
}
// Reject links and paths outside this workspace before writing or removing files.
function workspacePath(file) {
  const resolved = path.resolve(file);
  const relative = path.relative(root, resolved);
  if (!relative || relative.startsWith(`..${path.sep}`) || relative === '..' || path.isAbsolute(relative)) throw new Error('檔案必須位於網站資料夾內。');
  let current = root;
  for (const part of relative.split(path.sep)) {
    current = path.join(current, part);
    try { if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`為避免修改連結指向的檔案，請先移除符號連結：${current}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return resolved;
}
function transaction() {
  const files = [], directories = [];
  function mkdir(dir) {
    if (dir === root) return;
    workspacePath(dir);
    if (fs.existsSync(dir)) {
      if (!fs.statSync(dir).isDirectory()) throw new Error(`資料夾位置已被檔案占用：${dir}`);
      return;
    }
    mkdir(path.dirname(dir));
    fs.mkdirSync(dir);
    directories.push({ file: dir, stat: fs.statSync(dir) });
  }
  function write(file, bytes, original = null) {
    workspacePath(file);
    mkdir(path.dirname(file));
    const expected = Buffer.from(bytes);
    const fd = fs.openSync(file, original === null ? 'wx+' : 'r+');
    const entry = { file, original, expected, stat: fs.fstatSync(fd) };
    try {
      if (original !== null && !fs.readFileSync(file).equals(original)) throw new Error(`文章已被其他操作修改，請重新選擇：${file}`);
      files.push(entry);
      fs.writeFileSync(fd, expected);
      fs.ftruncateSync(fd, expected.length);
    } catch (error) {
      // A failed write can leave a partial file; remember only the bytes we own.
      if (files.includes(entry)) entry.expected = fs.readFileSync(file);
      throw error;
    } finally { fs.closeSync(fd); }
  }
  function copy(source, destination) {
    workspacePath(source);
    workspacePath(destination);
    const stat = fs.lstatSync(source);
    if (stat.isDirectory()) {
      mkdir(destination);
      for (const name of fs.readdirSync(source).sort()) copy(path.join(source, name), path.join(destination, name));
    } else if (stat.isFile()) write(destination, fs.readFileSync(source));
    else throw new Error(`圖片資料夾只能包含一般檔案與資料夾：${source}`);
  }
  function unchanged(entry) {
    workspacePath(entry.file);
    if (!fs.existsSync(entry.file)) return false;
    const stat = fs.statSync(entry.file);
    return stat.dev === entry.stat.dev && stat.ino === entry.stat.ino && fs.readFileSync(entry.file).equals(entry.expected);
  }
  function verify() {
    for (const entry of files) if (!unchanged(entry)) throw new Error(`發布期間檔案被修改，已停止提交：${entry.file}`);
  }
  function rollback() {
    const warnings = [];
    for (const entry of [...files].reverse()) {
      try {
        if (!fs.existsSync(entry.file)) continue;
        if (!unchanged(entry)) { warnings.push(`保留已被其他操作修改的檔案：${entry.file}`); continue; }
        if (entry.original === null) fs.unlinkSync(entry.file);
        else fs.writeFileSync(entry.file, entry.original);
      } catch (error) { warnings.push(`無法回復 ${entry.file}：${error.message}`); }
    }
    for (const entry of [...directories].reverse()) {
      try {
        workspacePath(entry.file);
        if (!fs.existsSync(entry.file)) continue;
        const stat = fs.statSync(entry.file);
        if (stat.dev === entry.stat.dev && stat.ino === entry.stat.ino && fs.readdirSync(entry.file).length === 0) fs.rmdirSync(entry.file);
      } catch (error) { warnings.push(`保留資料夾 ${entry.file}：${error.message}`); }
    }
    return warnings;
  }
  return { write, copy, verify, rollback, files };
}
function readCandidate(file, isDraft) {
  workspacePath(file);
  const raw = fs.readFileSync(file, 'utf8');
  return { file, raw, ...matter(raw), isDraft };
}
function alreadyCommitted(item) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.data.slug || '')) return false;
  const result = spawnSync('git', ['show', `HEAD:src/posts/${item.data.slug}.md`], { cwd: root, encoding: 'utf8' });
  const expected = matter.stringify(item.content, { ...item.data, status: 'published' });
  return result.status === 0 && result.stdout.replace(/\r\n/g, '\n') === expected.replace(/\r\n/g, '\n');
}
function pendingPushCount() {
  const result = spawnSync('git', ['rev-list', '--count', '@{upstream}..HEAD'], { cwd: root, encoding: 'utf8' });
  return result.status === 0 ? Number(result.stdout.trim()) : null;
}
function pushCommitted(slug) {
  try { run('git', ['push']); }
  catch (error) { throw new Error(`文章已保留在本機 Git 提交中，尚未確認推送成功。\n修正上方 Git 訊息後，重新開啟「發布文章.cmd」選 0，或執行 npm run publish -- --push。\n${error.message}`); }
  const site = require('../src/_data/site.json');
  console.log(`\n已推送，GitHub 正在建置。完成後的網址：${site.url}${site.basePath.replace(/\/$/, '')}/${slug ? `articles/${slug}/` : ''}`);
  console.log(`發布狀態：${site.repository}/actions`);
}
function openFile(file) {
  console.log(`\n檔案：${file}`);
  if (process.platform === 'win32') spawn('notepad.exe', [file], { detached: true, stdio: 'ignore' }).unref();
}
async function create() {
  const title = (await terminal.question('文章標題：')).trim();
  if (!title) throw new Error('標題不可空白。');
  topics.forEach((topic, index) => console.log(`${index + 1}. ${topic.name}`));
  const topic = topics[Number(await terminal.question('分類編號：')) - 1];
  if (!topic) throw new Error('請選擇有效的分類編號。');
  const autoSlug = `note-${Date.now()}`;
  const slug = (await terminal.question(`英文網址代稱（可直接 Enter 使用 ${autoSlug}）：`)).trim() || autoSlug;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('網址代稱只能用小寫英文、數字及連字號。');
  const target = path.join(drafts, `${slug}.md`);
  if (fs.existsSync(target) || fs.existsSync(path.join(posts, `${slug}.md`))) throw new Error('這個代稱已存在，請換一個。');
  fs.mkdirSync(drafts, { recursive: true });
  const data = { title, description: '請填寫一兩句摘要。', date: today(), category: topic.id, slug, tags: [], status: 'draft' };
  fs.writeFileSync(target, matter.stringify('\n## 想寫的事\n\n從這裡開始。\n', data), 'utf8');
  console.log('\n草稿已建立，只保存在本機。寫好並存檔後，執行「發布文章.cmd」。');
  openFile(target);
}
async function publish() {
  if (process.argv.includes('--push')) { pushCommitted(); return; }
  if (gitOutput(['diff', '--cached', '--name-only'])) throw new Error('Git 已有待提交的其他檔案，請先完成或取消該次操作，再發布文章。');
  const candidates = [];
  if (fs.existsSync(drafts)) for (const name of fs.readdirSync(drafts).filter(name => name.endsWith('.md'))) {
    const item = readCandidate(path.join(drafts, name), true);
    if (item.data.status === 'published') continue;
    if (alreadyCommitted(item)) console.log(`「${item.data.title}」已提交。若推送曾失敗，請選 0；後續內容請修改 src/posts/${item.data.slug}.md。`);
    else candidates.push(item);
  }
  const changed = gitOutput(['diff', '--name-only', '-z', '--', 'src/posts']).split('\0').filter(Boolean);
  for (const name of changed) {
    const file = path.join(root, name);
    if (fs.existsSync(file) && name.endsWith('.md')) candidates.push(readCandidate(file, false));
  }
  const pending = pendingPushCount();
  if (!candidates.length) {
    console.log('沒有待發布的草稿或已修改文章。');
    if (pending === null || pending > 0) {
      console.log(pending === null ? '目前無法查詢遠端分支；可以直接重試推送。' : `有 ${pending} 個已提交版本尚未推送。`);
      await terminal.question('按 Enter 重試推送，或 Ctrl+C 取消：');
      pushCommitted();
    }
    return;
  }
  console.log(`0. 只推送已提交版本（發布中斷後重試${pending ? `；目前 ${pending} 個` : ''}）`);
  candidates.forEach((item, index) => console.log(`${index + 1}. ${item.data.title}（${item.isDraft ? '草稿' : '修改'}）`));
  const answer = (await terminal.question('要發布哪一篇？輸入編號；重試推送請輸入 0：')).trim();
  if (answer === '0') { pushCommitted(); return; }
  const selected = candidates[Number(answer) - 1];
  if (!selected) throw new Error('請選擇有效的文章編號。');
  const slug = selected.data.slug;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) throw new Error('文章的 slug 不正確。');
  if (!selected.data.description || /請填寫/.test(selected.data.description)) throw new Error('請先填好文章摘要。');
  const target = selected.isDraft ? path.join(posts, `${slug}.md`) : selected.file;
  if (selected.isDraft && fs.existsSync(target)) throw new Error('相同網址的文章已存在。請直接修改已發布檔案，避免覆蓋。');
  console.log(`\n即將公開：${selected.data.title}\n分類：${topics.find(topic => topic.id === selected.data.category)?.name}\n文章網址：/articles/${slug}/`);
  await terminal.question('確認內容已可公開後，按 Enter 發布；Ctrl+C 可取消：');
  if (fs.readFileSync(workspacePath(selected.file), 'utf8') !== selected.raw) throw new Error('文章在選擇後已修改，請重新執行發布以使用最新內容。');
  const original = selected.isDraft ? null : Buffer.from(selected.raw);
  const data = { ...selected.data, status: 'published' };
  if (!selected.isDraft) data.updated = today();
  const draftAssets = path.join(drafts, 'assets', slug);
  const publicAssets = path.join(root, 'src/assets/articles', slug);
  const edits = transaction();
  const paths = [path.relative(root, target).split(path.sep).join('/')];
  const beforeHead = gitOutput(['rev-parse', 'HEAD']);
  let staged = false;
  try {
    edits.write(target, matter.stringify(selected.content, data), original);
    if (selected.isDraft && fs.existsSync(draftAssets)) {
      edits.copy(draftAssets, publicAssets);
      paths.push(...edits.files.filter(entry => entry.file !== target).map(entry => path.relative(root, entry.file).split(path.sep).join('/')));
    } else if (!selected.isDraft && fs.existsSync(publicAssets)) {
      workspacePath(publicAssets);
      paths.push(`src/assets/articles/${slug}`);
    }
    build();
    edits.verify();
    staged = true;
    run('git', ['add', '--', ...paths]);
    // --only prevents a concurrent, unrelated staging operation from being committed.
    run('git', ['commit', '--only', '-m', `Publish: ${data.title}`, '--', ...paths]);
  } catch (error) {
    if (gitOutput(['rev-parse', 'HEAD']) !== beforeHead) throw new Error(`Git 提交已變動，為保留已提交內容，未回復檔案。請檢查 git log 與 git status；如文章已提交，可執行 npm run publish -- --push。\n${error.message}`);
    const warnings = [];
    if (staged) {
      try { run('git', ['reset', '--quiet', 'HEAD', '--', ...paths]); }
      catch (resetError) { warnings.push(`本次 staging 無法自動撤回，請先執行 git status 檢查：${resetError.message}`); }
    }
    warnings.push(...edits.rollback());
    throw new Error(`${error.message}\n${warnings.length ? warnings.join('\n') : '已撤回本次發布變更，草稿與原有檔案保留，可直接重新發布。'}`);
  }
  if (selected.isDraft) {
    const draftMark = transaction();
    try {
      if (fs.readFileSync(workspacePath(selected.file), 'utf8') === selected.raw) draftMark.write(selected.file, matter.stringify(selected.content, data), Buffer.from(selected.raw));
      else console.log('草稿在發布期間已被修改，因此保留最新草稿；本次選定的內容已提交。');
    } catch (error) { console.log(`文章已提交，但無法更新草稿標記：${error.message}\n${draftMark.rollback().join('\n')}\n重新發布會核對 Git 提交，避免重複建立同一文章。`); }
  }
  pushCommitted(slug);
}
(async () => {
  try { if (process.argv[2] === 'new') await create(); else if (process.argv[2] === 'publish') await publish(); else throw new Error('請使用 npm run new 或 npm run publish。'); }
  catch (error) { console.error(`\n${error.message}`); process.exitCode = 1; }
  finally { terminal.close(); }
})();
