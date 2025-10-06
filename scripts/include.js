(() => {
  const INCLUDE_ATTRIBUTE = 'data-include';

  const loadInclude = async (placeholder) => {
    const path = placeholder.getAttribute(INCLUDE_ATTRIBUTE);

    if (!path) {
      return;
    }

    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Failed to load include: ${path} (${response.status})`);
      }

      const markup = await response.text();
      const template = document.createElement('template');
      template.innerHTML = markup.trim();

      const fragment = template.content.cloneNode(true);
      placeholder.replaceWith(fragment);
    } catch (error) {
      console.error(error);
    }
  };

  const notifyLoaded = () => {
    window.__includesLoaded = true;
    document.dispatchEvent(new CustomEvent('includesLoaded'));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const placeholders = document.querySelectorAll(`[${INCLUDE_ATTRIBUTE}]`);
      if (!placeholders.length) {
        notifyLoaded();
        return;
      }

      Promise.all(Array.from(placeholders, loadInclude)).finally(notifyLoaded);
    });
    return;
  }

  const placeholders = document.querySelectorAll(`[${INCLUDE_ATTRIBUTE}]`);
  if (!placeholders.length) {
    notifyLoaded();
    return;
  }

  Promise.all(Array.from(placeholders, loadInclude)).finally(notifyLoaded);
})();
