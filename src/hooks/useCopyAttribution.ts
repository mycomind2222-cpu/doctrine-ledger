import { useEffect } from 'react';

/**
 * When a user copies text from the page, appends a source attribution
 * with a link back to the current URL. This creates organic backlinks
 * when pasted into blogs, forums, or chat.
 */
export const useCopyAttribution = () => {
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const selection = document.getSelection();
      if (!selection || selection.toString().length < 40) return; // only for meaningful selections

      const text = selection.toString();
      const source = `\n\n— Source: BLACKFILES (${window.location.href})`;
      
      e.clipboardData?.setData('text/plain', text + source);
      e.clipboardData?.setData('text/html', 
        `${selection.getRangeAt(0).cloneContents().textContent}<br><br><em>— Source: <a href="${window.location.href}">BLACKFILES</a></em>`
      );
      e.preventDefault();
    };

    document.addEventListener('copy', handler);
    return () => document.removeEventListener('copy', handler);
  }, []);
};
