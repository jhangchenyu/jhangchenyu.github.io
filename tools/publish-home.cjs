const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const readline = require('node:readline/promises');
const root = path.resolve(__dirname, '..');
const home = 'src/index.njk';
const site = require('../src/_data/site.json');
const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });

function run(command, args, capture = false) {
  const result = spawnSync(command, args, { cwd: root, shell: false, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' });
  if (result.status !== 0) throw new Error(result.error?.message || result.stderr?.trim() || `${command} 未完成，請查看上方訊息。`);
  return result.stdout || '';
}

async function publish() {
  run('git', ['ls-files', '--error-unmatch', '--', home], true);
  const original = fs.readFileSync(path.join(root, home));
  const diff = run('git', ['--no-pager', 'diff', '--no-ext-diff', '--color=never', 'HEAD', '--', home], true);
  if (diff) {
    console.log(`以下是首頁相對於上次提交的變更：\n${diff}`);
    console.log('本次只提交 src/index.njk；其他尚未提交的修改會保留。推送會包含所有已提交未推送的版本。');
    await terminal.question('確認後按 Enter 建置並發布首頁；Ctrl+C 可取消：');
    const unchanged = () => fs.readFileSync(path.join(root, home)).equals(original);
    if (!unchanged()) throw new Error('首頁在確認期間已修改，請重新雙擊「發布首頁.cmd」查看最新差異。');
    if (!fs.existsSync(path.join(root, 'node_modules/@11ty/eleventy/cmd.cjs'))) throw new Error('缺少 Eleventy，請先在網站資料夾執行 npm ci。');
    run(process.execPath, ['tools/validate-content.cjs']);
    run(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs']);
    run(process.execPath, ['tools/check-site.cjs']);
    if (!unchanged()) throw new Error('建置期間首頁已修改，尚未提交；請重新雙擊「發布首頁.cmd」。');
    run('git', ['commit', '--only', '-m', 'Update homepage', '--', home]);
  } else {
    let pending;
    try { pending = Number(run('git', ['rev-list', '--count', '@{upstream}..HEAD'], true).trim()); }
    catch (error) { throw new Error(`首頁沒有新變更，但無法查詢待推送版本，請檢查 Git 遠端與追蹤分支設定。\n${error.message}`); }
    if (pending === 0) { console.log('首頁沒有新變更，也沒有待推送版本。修改並儲存 src/index.njk 後，再雙擊「發布首頁.cmd」。'); return; }
    console.log(`首頁沒有新的修改；有 ${pending} 個本機提交尚未推送。推送會包含所有已提交未推送的版本。`);
    await terminal.question('按 Enter 重試推送已提交版本；Ctrl+C 可取消：');
  }
  try { run('git', ['push']); }
  catch (error) { throw new Error(`尚未確認推送成功，本機提交已保留。修正下方問題後，再雙擊「發布首頁.cmd」即可重試推送。\n${error.message}`); }
  console.log('已推送；請至 GitHub Actions 確認建置與部署結果，完成後重新整理網站。');
}

(async () => {
  try { await publish(); }
  catch (error) { console.error(`\n${error.message}`); process.exitCode = 1; }
  finally {
    terminal.close();
    console.log(`\n網站：${site.url}${site.basePath || '/'}`);
    console.log(`建置／部署狀態：${site.repository}/actions`);
  }
})();
