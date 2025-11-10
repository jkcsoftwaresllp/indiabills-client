#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (
        !file.startsWith('.') &&
        file !== 'node_modules' &&
        file !== 'dist' &&
        file !== 'scripts'
      ) {
        getAllFiles(filePath, fileList);
      }
    } else if (
      file.endsWith('.jsx') ||
      file.endsWith('.js') ||
      file.endsWith('.tsx') ||
      file.endsWith('.ts')
    ) {
      fileList.push(filePath);
    }
  });
  return fileList;
}
function replaceMUIImport(content) {
  // Skip if file is in UI folder or is this script
  if (content.includes('Replacement for @mui')) {
    return content;
  }
  let modified = false;
  // Replace @mui/material imports
  content = content.replace(
    /import\s*({[^}]*})\s*from\s*['"]@mui\/material['"]/g,
    (match, imports) => {
      modified = true;
      const importStr = imports.slice(1, -1);
      const components = importStr.split(',').map((c) => c.trim());
      
      // Filter out styled as it needs special handling
      const validComponents = components.filter((c) => c && c !== 'styled');
      
      if (validComponents.length === 0) return '';
      
      return `import { ${validComponents.join(', ')} } from '../components/UI'`;
    }
  );
  // Replace default imports from @mui/material
  content = content.replace(
    /import\s+(\w+)\s+from\s+['"]@mui\/material\/(\w+)['"]/g,
    (match, importName, component) => {
      modified = true;
      return `import { ${component} as ${importName} } from '../components/UI'`;
    }
  );
  // Remove @mui/x-date-pickers imports (TODO for user to handle)
  content = content.replace(
    /import\s+.*from\s+['"]@mui\/x-date-pickers.*['"]/g,
    '// TODO: Replace MUI date picker with alternative'
  );
  // Remove @mui/system styled imports  
  content = content.replace(
    /import\s+.*styled.*from\s+['"]@mui\/system['"]/g,
    '// NOTE: styled removed - use Tailwind CSS instead'
  );
  // Remove @mui/material/colors imports
  content = content.replace(
    /import\s+.*from\s+['"]@mui\/material\/colors['"]/g,
    '// NOTE: Color import removed - define colors in CSS'
  );
  // Remove @mui/material/styles imports
  content = content.replace(
    /import\s+.*from\s+['"]@mui\/material\/styles['"]/g,
    '// NOTE: useTheme removed - use CSS variables instead'
  );
  // Remove @mui/x-api-grid imports
  content = content.replace(
    /import\s+.*from\s+['"]@mui\/x-api-grid['"]/g,
    '// TODO: Replace MUI DataGrid with alternative'
  );
  // Clean up multiple blank lines
  content = content.replace(/\n\n+/g, '\n\n');
  return { content, modified };
}
function getFileRelativePath(filePath) {
  // For replacing import paths, we need to calculate relative path from file to UI folder
  // Assuming all files are in src/, and UI is in src/components/UI
  const srcIndex = filePath.indexOf('/src/');
  if (srcIndex !== -1) {
    const filePathFromSrc = filePath.substring(srcIndex + 5);
    const depth = (filePathFromSrc.match(/\//g) || []).length;
    const basePath = '../'.repeat(depth) + 'components/UI';
    return basePath;
  }
  return '../components/UI';
}
// Main execution
const srcDir = path.join(__dirname, '../src');
const files = getAllFiles(srcDir);
let processed = 0;
let modified = 0;
let errors = 0;
files.forEach((filePath) => {
  try {
    if (filePath.includes('components/UI/')) {
      return; // Skip files already in UI folder
    }
    let content = fs.readFileSync(filePath, 'utf-8');
    const { content: newContent, modified: wasModified } = replaceMUIImport(content);
    if (wasModified) {
      // Adjust import paths based on file depth
      const fileDepth = filePath.substring(srcDir.length).split('/').length - 2;
      const importPath = '../'.repeat(fileDepth + 1) + 'components/UI';
      
      const finalContent = newContent.replace(
        /from ['"]\.\.\/components\/UI['"]/g,
        `from '${importPath}'`
      );
      fs.writeFileSync(filePath, finalContent, 'utf-8');
      console.log(`✓ ${path.relative(srcDir, filePath)}`);
      modified++;
    }
  } catch (error) {
    console.error(`✗ Error in ${path.relative(srcDir, filePath)}: ${error.message}`);
    errors++;
  }
  processed++;
});
console.log(`\n Summary:`);
console.log(`Total files scanned: ${processed}`);
console.log(`Files modified: ${modified}`);
console.log(`Errors: ${errors}`);