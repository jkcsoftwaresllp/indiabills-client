const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all files with unused React import errors
let lintOutput = '';
try {
  lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf-8' });
} catch (e) {
  lintOutput = e.stdout || '';
}

const lines = lintOutput.split('\n');

const filesToFix = new Set();

for (const line of lines) {
  if (line.includes("'React' is defined but never used")) {
    const match = line.match(/^([^:]+):/);
    if (match) {
      filesToFix.add(match[1]);
    }
  }
}

console.log(`Found ${filesToFix.size} files with unused React imports`);

let fixed = 0;
filesToFix.forEach((file) => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const original = content;
    
    // Remove standalone "import React" 
    content = content.replace(/^import React from ['"]react['"];\n/m, '');
    content = content.replace(/^import\s+React\s*,\s*\{\s*\}\s*from\s+['"]react['"];\n/m, '');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`✓ Fixed: ${file}`);
      fixed++;
    }
  } catch (err) {
    // Ignore errors
  }
});

console.log(`Fixed ${fixed} files`);
