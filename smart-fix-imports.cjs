#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();

// Map of icons to find in code and their import source
const iconMappings = {
  'Fi': { source: "react-icons/fi", icons: new Set() },
  'MUI': { source: "@mui/icons-material", icons: new Set([
    'SearchOff', 'AddCircleRounded', 'Favorite', 'FavoriteBorder'
  ]) }
};

// Scan all JSX files for undefined icons and add imports
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

const jsxFiles = findJsxFiles(srcDir);
let fixedCount = 0;

// These are the known missing imports from the lint output
const knownMissing = {
  'src/components/LayoutComponent/NotFound.jsx': ['SearchOff', 'AddCircleRounded'],
  'src/components/core/QuickEditModal.jsx': ['FiSave'],
  'src/components/core/EditableDataGrid.jsx': ['FiX', 'FiEdit', 'FiCheckCircle', 'FiSearch', 'FiZap', 'FiColumns'],
  'src/components/shop/OrderCard.jsx': ['FiShoppingCart'],
  'src/pages/products/ProductCard.jsx': ['Favorite', 'FavoriteBorder'],
  'src/pages/invoices/ViewInvoice.jsx': ['FiX', 'FiShoppingCart'],
  'src/pages/orders/ViewOrders.jsx': ['FiSettings', 'FiArrowLeft', 'FiArrowRight', 'FiCheckCircle'],
  'src/pages/customers/EditCustomer.jsx': ['FiCheckCircle', 'FiDollarSign', 'FiEdit', 'FiFileText'],
  'src/pages/customers/ViewCustomers.jsx': ['FiColumns', 'FiChevronUp', 'FiChevronDown'],
  'src/pages/products/AddProduct.jsx': ['FiArrowLeft', 'FiUploadCloud', 'FiSave'],
  'src/pages/supplier/AddSupplier.jsx': ['FiBriefcase', 'FiArrowRight'],
  'src/pages/transport/AddTransport.jsx': ['FiBriefcase'],
};

Object.entries(knownMissing).forEach(([filePath, icons]) => {
  const fullPath = path.join(baseDir, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⊘ ${filePath} (not found)`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    const original = content;
    const contentLines = content.split('\n');

    // Find icon import line or create one
    const featherIcons = icons.filter(i => i.startsWith('Fi'));
    const muiIcons = icons.filter(i => !i.startsWith('Fi'));

    if (featherIcons.length > 0) {
      let foundFiImport = false;
      for (let i = 0; i < contentLines.length; i++) {
        if (contentLines[i].includes("from 'react-icons/fi'")) {
          // Merge icons into existing import
          const match = contentLines[i].match(/import\s*{\s*([^}]*)\s*}\s*from/);
          if (match) {
            const existing = match[1].split(',').map(s => s.trim()).filter(s => s);
            const allIcons = new Set([...existing, ...featherIcons]);
            contentLines[i] = `import { ${Array.from(allIcons).join(', ')} } from 'react-icons/fi';`;
            foundFiImport = true;
            break;
          }
        }
      }

      if (!foundFiImport) {
        // Add new import at top
        contentLines.unshift(`import { ${featherIcons.join(', ')} } from 'react-icons/fi';`);
      }
    }

    if (muiIcons.length > 0) {
      let foundMuiImport = false;
      for (let i = 0; i < contentLines.length; i++) {
        if (contentLines[i].includes("from '@mui/icons-material'")) {
          const match = contentLines[i].match(/import\s*{\s*([^}]*)\s*}\s*from/);
          if (match) {
            const existing = match[1].split(',').map(s => s.trim()).filter(s => s);
            const allIcons = new Set([...existing, ...muiIcons]);
            contentLines[i] = `import { ${Array.from(allIcons).join(', ')} } from '@mui/icons-material';`;
            foundMuiImport = true;
            break;
          }
        }
      }

      if (!foundMuiImport) {
        contentLines.unshift(`import { ${muiIcons.join(', ')} } from '@mui/icons-material';`);
      }
    }

    content = contentLines.join('\n');

    if (content !== original) {
      fs.writeFileSync(fullPath, content);
      console.log(`✓ ${filePath}`);
      fixedCount++;
    }
  } catch (err) {
    console.error(`✗ ${filePath}: ${err.message}`);
  }
});

console.log(`\nTotal files fixed: ${fixedCount}`);
