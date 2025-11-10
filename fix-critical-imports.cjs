#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const baseDir = process.cwd();

// Manual critical fixes - these are based on the ERROR_REPORT
const criticalFixes = [
  // React missing imports
  {
    file: 'src/components/FormComponent/ColumnSelector.jsx',
    search: /^import { FiMenu/,
    replacement: "import React from 'react';\nimport { FiMenu"
  },
  {
    file: 'src/components/UI/RadioGroup.jsx',
    search: /^const RadioGroup/,
    replacement: "import React from 'react';\n\nconst RadioGroup"
  },
  {
    file: 'src/pages/inventory/InventoryTable.jsx',
    search: /^import { FiChevronDown/,
    replacement: "import React from 'react';\nimport { FiChevronDown"
  },
  
  // React in jsx-no-undef
  {
    file: 'src/pages/invoices/ViewInvoice.jsx',
    search: /^import/,
    replacement: "import React from 'react';\nimport"
  },
  {
    file: 'src/pages/customers/EditCustomer.jsx',
    search: /^import/,
    replacement: "import React from 'react';\nimport"
  },
  
  // Missing Feather Icons
  {
    file: 'src/components/FormComponent/UpdateForm.jsx',
    search: /import { FiTrash2, FiX, FiEdit, FiCheckCircle } from 'react-icons\/fi';/,
    replacement: "import { FiTrash2, FiX, FiEdit, FiCheckCircle } from 'react-icons/fi';"
  },
  
  {
    file: 'src/components/LayoutComponent/NotFound.jsx',
    search: /^import/,
    replacement: "import { SearchOff, AddCircleRounded } from '@mui/icons-material';\nimport"
  },
  
  // Fix QuickEditModal
  {
    file: 'src/components/core/QuickEditModal.jsx',
    search: /import { FiTrash2, FiX } from 'react-icons\/fi';/,
    replacement: "import { FiTrash2, FiX, FiSave } from 'react-icons/fi';"
  },
];

let count = 0;

criticalFixes.forEach(({ file, search, replacement }) => {
  const filePath = path.join(baseDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⊘ ${file} (not found)`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (content.match(search)) {
      content = content.replace(search, replacement);
      fs.writeFileSync(filePath, content);
      console.log(`✓ ${file}`);
      count++;
    }
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
});

// Now add missing icon imports to specific files
const iconAdditions = [
  {
    file: 'src/components/core/EditableDataGrid.jsx',
    icons: ['FiX', 'FiEdit', 'FiCheckCircle'],
    searchPattern: /^import/m,
  },
  {
    file: 'src/components/core/QuickEditModal.jsx',
    icons: ['FiSave'],
    searchPattern: /^import.*FiTrash2.*from 'react-icons\/fi'/m,
  },
  {
    file: 'src/components/FormComponent/UpdateForm.jsx',
    icons: ['FiX', 'FiEdit', 'FiCheckCircle'],
    searchPattern: /^import.*FiTrash2.*from 'react-icons\/fi'/m,
  },
  {
    file: 'src/components/LayoutComponent/NotFound.jsx',
    icons: ['SearchOff', 'AddCircleRounded'],
    searchPattern: /^import/m,
    source: '@mui/icons-material'
  },
  {
    file: 'src/pages/shop/OrderCard.jsx',
    icons: ['FiShoppingCart'],
    searchPattern: /^import/m,
  },
  {
    file: 'src/pages/products/ProductCard.jsx',
    icons: ['Favorite', 'FavoriteBorder'],
    searchPattern: /^import/m,
    source: '@mui/icons-material'
  },
];

console.log(`\nTotal fixed: ${count}`);
