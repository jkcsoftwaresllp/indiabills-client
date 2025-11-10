#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let lintOutput;
try {
  lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf-8' });
} catch (e) {
  lintOutput = e.stdout ? e.stdout.toString() : '';
}

const baseDir = process.cwd();
const filesToFix = new Set();

// Find all files with "React is defined but never used"
const lines = lintOutput.split('\n');
let currentFile = null;

for (const line of lines) {
  if (line && !line.startsWith(' ') && (line.includes('.jsx') || line.includes('.js'))) {
    currentFile = line;
  }

  if (currentFile && line.includes("'React' is defined but never used")) {
    filesToFix.add(currentFile);
  }
}

console.log(`Found ${filesToFix.size} files with unused React imports\n`);

let fixedCount = 0;

filesToFix.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // Remove unused React imports
    content = content.replace(/import\s+React\s+from\s+['"]react['"];?\n/g, '');
    content = content.replace(/import\s+React,\s*{\s*/, 'import { ');
    content = content.replace(/,\s*React\s*}\s*from/g, ' } from');

    // Clean up extra blank lines
    content = content.replace(/\n\n\n+/g, '\n\n');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ ${path.relative(baseDir, filePath)}`);
      fixedCount++;
    }
  } catch (err) {
    console.error(`✗ ${path.relative(baseDir, filePath)}: ${err.message}`);
  }
});

console.log(`\nFixed ${fixedCount} files`);
