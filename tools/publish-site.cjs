const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
// Publish website sources and their maintenance files, not unrelated local notes.
const scope = [
  'src', 'tools', 'templates', '.github', 'eleventy.config.cjs',
  'package.json', 'package-lock.json', '.gitignore', '.gitattributes',
  'README.md', '文章更新教學.md', '發布網站.cmd', '預覽網站.cmd'
];

function run(command, args, capture = false) {
  const result = spawnSync(command, args, {
    cwd: root, shell: false, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    stdio: capture ? 'pipe' : 'inherit'
  });
  if (result.status !== 0) throw new Error(result.error?.message || result.stderr?.trim() || `${command} 未完成，請查看上方訊息。`);
  return result.stdout || '';
}
const git = args => run('git', ['--literal-pathspecs', ...args], true);
const names = output => output.split('\0').filter(Boolean);
const unique = items => [...new Set(items)].sort();

function changedFiles() {
  return unique([
    ...names(git(['diff', '--name-only', '--no-renames', '-z', 'HEAD', '--', ...scope])),
    ...names(git(['ls-files', '--others', '--exclude-standard', '-z', '--', ...scope]))
  ]);
}

function snapshot() {
  const files = unique(names(git(['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', ...scope])));
  const hash = crypto.createHash('sha256');
  for (const file of files) {
    const absolute = path.join(root, file);
    hash.update(file + '\0');
    let stat;
    try { stat = fs.lstatSync(absolute); }
    catch (error) { if (error.code === 'ENOENT') { hash.update('deleted\0'); continue; } throw error; }
    if (!stat.isFile()) throw new Error(`網站來源必須是一般檔案：${file}`);
    hash.update(crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest());
  }
  return hash.digest('hex');
}

function build() {
  if (!fs.existsSync(path.join(root, 'node_modules/@11ty/eleventy/cmd.cjs'))) {
    throw new Error('缺少網站建置套件，請先在網站資料夾執行 npm ci，再重試發布。');
  }
  run(process.execPath, ['tools/validate-content.cjs']);
  // _site is generated output. Start clean so deleted pages cannot survive a build.
  const output = path.resolve(root, '_site');
  if (fs.existsSync(output)) {
    const resolvedRoot = fs.realpathSync(root);
    if (fs.lstatSync(output).isSymbolicLink() || fs.realpathSync(output) !== path.join(resolvedRoot, '_site')) {
      throw new Error('_site 指向其他位置，已停止清理；請檢查預覽輸出資料夾。');
    }
    fs.rmSync(output, { recursive: true });
  }
  run(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs']);
  run(process.execPath, ['tools/check-site.cjs']);
}

function publish() {
  if (git(['branch', '--show-current']).trim() !== 'main' ||
      git(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']).trim() !== 'origin/main') {
    throw new Error('請在追蹤 origin/main 的 main 分支發布網站。');
  }
  for (const state of ['MERGE_HEAD', 'CHERRY_PICK_HEAD', 'REVERT_HEAD', 'rebase-merge', 'rebase-apply']) {
    if (fs.existsSync(path.resolve(root, git(['rev-parse', '--git-path', state]).trim()))) {
      throw new Error('目前有尚未完成的 Git 合併或重整，請先完成該次操作再發布。');
    }
  }
  if (git(['diff', '--name-only', '--diff-filter=U']).trim()) throw new Error('請先處理 Git 衝突，再發布網站。');
  const beforeHead = git(['rev-parse', 'HEAD']).trim();
  const files = changedFiles();
  const pending = Number(git(['rev-list', '--count', '@{upstream}..HEAD']).trim());
  if (!files.length && pending === 0) {
    console.log('網站沒有新修改，也沒有待推送版本。修改檔案並按 Ctrl+S 後，再執行「發布網站.cmd」。');
    return;
  }
  console.log(files.length ? `本次更新 ${files.length} 個網站檔案：\n${files.map(file => `  ${file}`).join('\n')}` : `沒有新的檔案修改；重試推送 ${pending} 個已提交版本。`);
  const before = snapshot();
  console.log('\n正在建置並檢查網站……');
  build();
  if (snapshot() !== before || git(['rev-parse', 'HEAD']).trim() !== beforeHead ||
      JSON.stringify(changedFiles()) !== JSON.stringify(files)) {
    throw new Error('建置期間網站檔案或版本有變動，尚未提交或推送；請重新執行「發布網站.cmd」。');
  }
  if (files.length) {
    run('git', ['--literal-pathspecs', 'add', '--', ...files]);
    // Keep any unrelated staged work out of this commit.
    run('git', ['--literal-pathspecs', 'commit', '--only', '-m', 'Update website', '--', ...files]);
  }
  try { run('git', ['push', 'origin', 'main']); }
  catch (error) {
    throw new Error(`本機提交已保留，尚未確認推送成功。處理下方問題後，再執行「發布網站.cmd」即可重試。\n${error.message}`);
  }
  console.log('\n已推送到 GitHub。請等待 Actions 建置／部署成功，再重新整理網站。');
}

try { publish(); }
catch (error) { console.error(`\n發布停止：${error.message}`); process.exitCode = 1; }
finally {
  try {
    const site = JSON.parse(fs.readFileSync(path.join(root, 'src/_data/site.json'), 'utf8'));
    console.log(`\n網站：${site.url}${site.basePath || '/'}`);
    console.log(`部署狀態：${site.repository}/actions`);
  } catch { /* The build error already explains invalid or missing site data. */ }
}
