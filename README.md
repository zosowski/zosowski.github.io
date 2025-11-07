# STMA Technology &amp; Engineering Education Website

This repository contains a static website for the STMA Technology &amp; Engineering Education department. The site features a shared header, persistent navigation tree, and dedicated pages for each program area.

## Structure

- `src/layouts` &mdash; Base HTML shells used during the build step.
- `src/partials` &mdash; Shared fragments such as the `<head>` metadata and global header.
- `src/pages` &mdash; Source content for each page, including front matter that sets navigation state.
- `src/config/navigation.json` &mdash; Central definition of the primary navigation links.
- `assets/css/style.css` &mdash; Global styles defining the responsive layout, navigation, and typography.
- `build.js` &mdash; Lightweight build script that assembles source pages with the shared partials.

## Development

1. Edit content inside `src/pages/*.html`. Each file begins with optional front matter where you can specify the active navigation key or override the page title.
2. Run `npm run build` to regenerate the distributable HTML files in the repository root.
3. Open the generated HTML files in a browser to preview the site locally. All pages share the same navigation and automatically highlight the active section.

## Extending the Site

1. Create a new file in `src/pages` that contains the page content. Include `navKey: <section>` in the front matter if the page should highlight a navigation entry.
2. Add the new page to `src/config/navigation.json` when the navigation menu itself needs to change.
3. Run `npm run build` to update the generated HTML files.
4. Add any additional styling to `assets/css/style.css` to keep presentation consistent.
