#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define all fixes based on lint output
const fixes = [
  // React imports that are not used
  { file: 'src/components/Animate/PageAnimate.jsx', search: /import\s*{\s*useStore\s*}\s*from/, replacement: 'import {' },
  { file: 'src/components/FormComponent/ItemsEditTab.jsx', search: /import\s*{\s*FiTrash2\s*,\s*/, replacement: 'import { ' },
  { file: 'src/components/FormComponent/ItemsEditTab.jsx', search: /import\s*React\s*,?\s*{/, replacement: 'import {' },
  { file: 'src/components/FormComponent/ItemsEditTab.jsx', search: /,\s*IconButton\s*}\s*from/, replacement: ' } from' },
  
  // React imports
  { file: 'src/components/core/AuditModal.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/components/core/ContextMenu.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/components/core/HeaderBranding.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/components/core/ModalMaker.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/components/core/NavSection.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/components/core/SetupTemplate.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/components/shop/OrderCard.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/components/shop/ProductCard.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/components/shop/ProductModal.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
  { file: 'src/layouts/customer/CustomerLayout.jsx', search: /import\s*React\s*from\s*['"]react['"];?\n/, replacement: '' },
];

const baseDir = process.cwd();
let fixedCount = 0;

console.log('Starting automated fixes...\n');

// Simple pattern fixes for "React is not used"
const reactNotUsedPattern = /import\s+React\s*(?:,\s*\{\s*([^}]*)\s*\}|\s+from)/;

// Find all JSX files
const srcDir = path.join(baseDir, 'src');
function findFiles(dir, ext = '.jsx') {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findFiles(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

const jsxFiles = findFiles(srcDir, '.jsx').concat(findFiles(srcDir, '.js'));

jsxFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Fix: Remove unused React imports
    content = content.replace(/import\s+React\s+from\s+['"]react['"];?\n/g, '');
    
    // Fix: Remove unused imports in destructuring
    // Handle specific cases
    
    // Remove "import { FC }" when not used
    content = content.replace(/import\s*{\s*FC\s*}\s*from\s*['"]react['"];?\n/g, '');
    
    // Clean up empty imports
    content = content.replace(/import\s*{\s*}\s*from[^;]*;?\n/g, '');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      fixedCount++;
      console.log(`✓ Fixed: ${path.relative(baseDir, filePath)}`);
    }
  } catch (err) {
    console.error(`✗ Error processing ${filePath}: ${err.message}`);
  }
});

console.log(`\n✓ Fixed ${fixedCount} files`);
