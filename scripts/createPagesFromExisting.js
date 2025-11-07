const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcPagesDir = path.join(rootDir, 'src', 'pages');
const navConfigPath = path.join(rootDir, 'src', 'config', 'navigation.json');

if (!fs.existsSync(srcPagesDir)) {
  fs.mkdirSync(srcPagesDir, { recursive: true });
}

const navConfig = JSON.parse(fs.readFileSync(navConfigPath, 'utf8'));
const hrefToKey = new Map(navConfig.map((item) => [item.href, item.key]));

const defaultTitle = 'STMA Technology &amp; Engineering Education';

function stripIndent(value) {
  const lines = value.split('\n');
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)[0].length);

  const indent = indents.length ? Math.min(...indents) : 0;

  return lines
    .map((line) => line.slice(indent))
    .join('\n')
    .trim();
}

const htmlFiles = fs
  .readdirSync(rootDir)
  .filter((file) => file.endsWith('.html') && file !== '404.html');

htmlFiles.forEach((file) => {
  const filePath = path.join(rootDir, file);
  const html = fs.readFileSync(filePath, 'utf8');

  const mainMatch = html.match(/<main>([\s\S]*?)<\/main>/);
  if (!mainMatch) {
    throw new Error(`Unable to locate <main> content in ${file}`);
  }
  const mainContent = stripIndent(mainMatch[1]);

  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : defaultTitle;

  const activeMatch = html.match(/<a class="active" href="([^"]+)"/);
  const navKey = activeMatch ? hrefToKey.get(activeMatch[1]) : undefined;

  const frontMatter = ['---'];
  if (title && title !== defaultTitle) {
    frontMatter.push(`title: ${JSON.stringify(title)}`);
  }
  if (navKey) {
    frontMatter.push(`navKey: ${navKey}`);
  }
  frontMatter.push('---');

  const pagePath = path.join(srcPagesDir, file);
  const pageContent = `${frontMatter.join('\n')}\n${mainContent}\n`;

  fs.writeFileSync(pagePath, pageContent);
});
