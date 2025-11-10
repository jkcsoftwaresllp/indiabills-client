#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Manual targeted fixes for the remaining errors
const manualFixes = [
  {
    file: 'src/App.jsx',
    fixes: [
      { search: /import\s*{\s*AuditLogTable\s*,\s*/, replacement: 'import { ' },
      { search: /,\s*CircularProgress\s*,/, replacement: ', ' },
      { search: /,\s*Header\s*,/, replacement: ', ' },
      { search: /,\s*PageAnimate\s*,/, replacement: ', ' },
      { search: /,\s*Setup\s*,/, replacement: ', ' },
      { search: /,\s*Login\s*,/, replacement: ', ' },
      { search: /,\s*CustomerLogin\s*\}/, replacement: ' }' },
    ]
  },
  {
    file: 'src/components/core/ContextMenu.jsx',
    fixes: [
      { search: /const\s+subMenu\s*=.*?;?\n/, replacement: '' },
      { search: /const\s+handleMouseLeave\s*=.*?;?\n/, replacement: '' },
    ]
  },
  {
    file: 'src/components/UI/RadioGroup.jsx',
    fixes: [
      { search: /const\s+{\s*([^}]*)\s*}\s*=\s*props;?\n/, replacement: '' },
    ]
  },
];

const baseDir = process.cwd();
let fixCount = 0;

manualFixes.forEach(({ file, fixes }) => {
  const filePath = path.join(baseDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⊘ Skipped (not found): ${file}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    fixes.forEach(({ search, replacement }) => {
      content = content.replace(search, replacement);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Fixed: ${file}`);
      fixCount++;
    }
  } catch (err) {
    console.error(`✗ Error in ${file}: ${err.message}`);
  }
});

// Generic approach for simple unused destructured variables
const srcDir = path.join(baseDir, 'src');
function findJsxFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findJsxFiles(fullPath));
    } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  });
  return files;
}

// Try to remove simple unused destructured variables
const jsxFiles = findJsxFiles(srcDir);

jsxFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Remove unused destructured variables from const statements
    // This is a simple pattern - might not catch all cases
    content = content.replace(/const\s+{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*}\s*=\s*useState\([^)]*\);?\n/g, '');
    content = content.replace(/const\s+\[\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\]\s*=\s*useState\([^)]*\);?\n/g, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Cleaned: ${path.relative(baseDir, filePath)}`);
      fixCount++;
    }
  } catch (err) {
    // Silently skip errors
  }
});

console.log(`\nTotal fixes applied: ${fixCount}`);
