const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const pagesDir = path.join(srcDir, 'pages');
const layoutPath = path.join(srcDir, 'layouts', 'base.html');
const headPartialPath = path.join(srcDir, 'partials', 'head.html');
const headerPartialPath = path.join(srcDir, 'partials', 'site-header.html');
const navConfigPath = path.join(srcDir, 'config', 'navigation.json');

const defaultTitle = 'STMA Technology &amp; Engineering Education';

function indentBlock(content, spaces) {
  const padding = ' '.repeat(spaces);
  return content
    .split('\n')
    .map((line) => (line.length ? `${padding}${line}` : line))
    .join('\n');
}

function parseFrontMatter(raw) {
  const frontMatterMatch = raw.match(/^---\s*([\s\S]*?)\s*---\s*/);
  if (!frontMatterMatch) {
    return { data: {}, body: raw.trim() };
  }

  const frontMatterContent = frontMatterMatch[1];
  const body = raw.slice(frontMatterMatch[0].length).trim();
  const data = {};

  frontMatterContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    const [key, ...valueParts] = trimmed.split(':');
    if (!key || valueParts.length === 0) {
      return;
    }
    const valueRaw = valueParts.join(':').trim();
    if (!valueRaw) {
      return;
    }
    const unquoted = valueRaw.replace(/^['"]|['"]$/g, '');
    data[key.trim()] = unquoted;
  });

  return { data, body };
}

function renderHead(template, title) {
  const pageTitle = title || defaultTitle;
  return template.replace(/{{\s*title\s*}}/g, pageTitle);
}

function buildNav(config, activeKey) {
  const navItems = config
    .map((item) => {
      const isActive = item.key === activeKey;
      const classAttribute = isActive ? ' class="active"' : '';
      return `    <li><a${classAttribute} href="${item.href}">${item.label}</a></li>`;
    })
    .join('\n');

  return [
    '<nav aria-label="Main navigation">',
    '  <h2>Explore Programs</h2>',
    '  <ul>',
    navItems,
    '  </ul>',
    '</nav>',
  ]
    .filter(Boolean)
    .join('\n');
}

function ensureTrailingNewline(content) {
  return content.endsWith('\n') ? content : `${content}\n`;
}

function build() {
  if (!fs.existsSync(pagesDir)) {
    throw new Error('The src/pages directory does not exist.');
  }

  const layout = fs.readFileSync(layoutPath, 'utf8');
  const headPartial = fs.readFileSync(headPartialPath, 'utf8');
  const headerPartial = fs.readFileSync(headerPartialPath, 'utf8');
  const navConfig = JSON.parse(fs.readFileSync(navConfigPath, 'utf8'));

  const pageFiles = fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith('.html'));

  pageFiles.forEach((file) => {
    const pagePath = path.join(pagesDir, file);
    const raw = fs.readFileSync(pagePath, 'utf8');
    const { data, body } = parseFrontMatter(raw);

    const head = indentBlock(renderHead(headPartial, data.title), 2);
    const header = indentBlock(headerPartial, 2);
    const nav = indentBlock(buildNav(navConfig, data.navKey), 4);
    const content = indentBlock(body, 6);

    const rendered = layout
      .replace('%%HEAD%%', head)
      .replace('%%HEADER%%', header)
      .replace('%%NAV%%', nav)
      .replace('%%CONTENT%%', content);

    const outputPath = path.join(rootDir, file);
    fs.writeFileSync(outputPath, ensureTrailingNewline(rendered));
  });
}

build();
