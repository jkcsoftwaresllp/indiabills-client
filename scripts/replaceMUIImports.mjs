import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function replaceMUIImport(content, filePath) {
  // Skip if file is in UI folder
  if (filePath.includes('components/UI/')) {
    return { content, modified: false };
  }

  let modified = false;

  // Replace @mui/material imports with relative path
  content = content.replace(
    /import\s*({[^}]*})\s*from\s*['"]@mui\/material['"]/g,
    (match, imports) => {
      modified = true;
      const importStr = imports.slice(1, -1);
      const components = importStr.split(',').map((c) => c.trim());
      
      // Filter out styled as it needs special handling
      const validComponents = components.filter((c) => c && c !== 'styled' && c.length > 0);
      
      if (validComponents.length === 0) return '';
      
      // Calculate relative path from current file to components/UI
      const fileDepth = filePath.split('/src/')[1].split('/').length - 1;
      const importPath = '../'.repeat(fileDepth + 1) + 'components/UI';
      
      return `import { ${validComponents.join(', ')} } from '${importPath}'`;
    }
  );

  // Replace specific @mui/material imports
  content = content.replace(
    /import\s+(\w+)\s+from\s+['"]@mui\/material\/(\w+)['"]/g,
    (match, importName, component) => {
      modified = true;
      const fileDepth = filePath.split('/src/')[1].split('/').length - 1;
      const importPath = '../'.repeat(fileDepth + 1) + 'components/UI';
      return `import { ${component} as ${importName} } from '${importPath}'`;
    }
  );

  // Remove @mui/x-date-pickers imports (TODO for user to handle)
  if (content.includes('@mui/x-date-pickers')) {
    modified = true;
    content = content.replace(
      /import\s+.*from\s+['"]@mui\/x-date-pickers.*['"]/g,
      '// TODO: Replace MUI date picker with alternative'
    );
  }

  // Remove @mui/system styled imports  
  if (content.includes('@mui/system')) {
    modified = true;
    content = content.replace(
      /import\s+.*styled.*from\s+['"]@mui\/system['"]/g,
      '// NOTE: styled removed - use Tailwind CSS instead'
    );
  }

  // Remove @mui/material/colors imports
  if (content.includes('@mui/material/colors')) {
    modified = true;
    content = content.replace(
      /import\s+.*from\s+['"]@mui\/material\/colors['"]/g,
      '// NOTE: Color import removed - define colors in CSS'
    );
  }

  // Remove @mui/material/styles imports
  if (content.includes('@mui/material/styles')) {
    modified = true;
    content = content.replace(
      /import\s+.*from\s+['"]@mui\/material\/styles['"]/g,
      '// NOTE: useTheme removed - use CSS variables instead'
    );
  }

  // Remove @mui/x-api-grid imports
  if (content.includes('@mui/x-api-grid')) {
    modified = true;
    content = content.replace(
      /import\s+.*from\s+['"]@mui\/x-api-grid['"]/g,
      '// TODO: Replace MUI DataGrid with alternative'
    );
  }

  // Clean up multiple blank lines
  content = content.replace(/\n\n\n+/g, '\n\n');

  return { content, modified };
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
      processed++;
      return; // Skip files already in UI folder
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    const { content: newContent, modified: wasModified } = replaceMUIImport(content, filePath);

    if (wasModified) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      const relPath = path.relative(srcDir, filePath);
      modified++;
    }
    processed++;
  } catch (error) {
    const relPath = path.relative(srcDir, filePath);
    console.error(`✗ Error in ${relPath}: ${error.message}`);
    errors++;
  }
});
