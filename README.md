# STMA Technology & Engineering Education Website

This repository contains a static website for the STMA Technology & Engineering Education department. The site features a shared header, persistent navigation tree, and dedicated pages for each program area.

## Structure

- `index.html` — Landing page introducing the department.
- `pages/teachers/index.html` — Faculty directory and support resources.
- `pages/<program>/index.html` — Overview page for each program area (`metals`, `woods`, `engineering`, `computer-science`, `construction`, `other`).
- `pages/<program>/*.html` — Course detail pages grouped alongside their program overview.
- `assets/css/style.css` — Global styles defining the responsive layout, navigation, and typography.

## Development

Open any of the HTML files in a browser to preview the site locally. All pages share the same navigation and automatically highlight the active section.

## Extending the Site

1. Duplicate one of the existing program folders or course pages when adding new content.
2. Update the navigation list in the shared HTML template to include the new link.
3. Add any additional styling to `assets/css/style.css` to keep presentation consistent.
