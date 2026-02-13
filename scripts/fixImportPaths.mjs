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

function calculateCorrectImportPath(filePath) {
  // Get the depth from src folder
  const srcIndex = filePath.indexOf('/src/');
  if (srcIndex === -1) return null;
  
  const filePathFromSrc = filePath.substring(srcIndex + 5);
  const depth = (filePathFromSrc.match(/\//g) || []).length;
  
  // We need to go up 'depth' levels to reach src, then go into components/UI
  const upCount = depth; // Number of ../ needed
  const relativePath = '../'.repeat(upCount) + 'components/UI';
  
  return relativePath;
}

// Main execution
const srcDir = path.join(__dirname, '../src');
const files = getAllFiles(srcDir);

let modified = 0;
let errors = 0;

files.forEach((filePath) => {
  try {
    if (filePath.includes('components/UI/')) {
      return; // Skip files already in UI folder
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Find and fix incorrect import paths
    const correctPath = calculateCorrectImportPath(filePath);
    
    if (!correctPath) return;
    
    // Fix paths that are wrong
    content = content.replace(
      /from ['"].*components\/UI['"]/g,
      `from '${correctPath}'`
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      const relPath = path.relative(srcDir, filePath);
      modified++;
    }
  } catch (error) {
    const relPath = path.relative(srcDir, filePath);
    console.error(`✗ Error in ${relPath}: ${error.message}`);
    errors++;
  }
});
