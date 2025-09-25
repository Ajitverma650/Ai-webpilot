// utils/fileUtils.js
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const downloadProject = (files) => {
  const zip = new JSZip();
  Object.entries(files).forEach(([filename, content]) => {
    zip.file(filename, content);
  });
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'ai-generated-website.zip');
  });
};

export const runProjectInNewTab = (files) => {
  // Combine all files into a single HTML document
  let html = files['index.html'] || '';
  const css = files['styles.css'] || '';
  const js = files['script.js'] || '';

  // Inject CSS
  if (css && css.trim()) {
    const styleTag = `<style>${css}</style>`;
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${styleTag}\n</head>`);
    } else if (html.includes('<head>')) {
      html = html.replace('<head>', `<head>\n${styleTag}`);
    } else {
      html = `<style>${css}</style>\n${html}`;
    }
  }

  // Inject JavaScript
  if (js && js.trim()) {
    const scriptTag = `<script>${js}</script>`;
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${scriptTag}\n</body>`);
    } else {
      html = `${html}\n<script>${js}</script>`;
    }
  }

  const newWindow = window.open();
  newWindow.document.write(html);
  newWindow.document.close();
};
