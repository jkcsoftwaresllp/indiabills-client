#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get lint output
let lintOutput;
try {
  lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf-8' });
} catch (e) {
  lintOutput = e.stdout ? e.stdout.toString() : '';
}

const baseDir = process.cwd();
const lintLines = lintOutput.split('\n');
const errors = [];

let currentFile = null;
for (const line of lintLines) {
  // Detect file path
  if (line && !line.startsWith(' ') && (line.includes('.js') || line.includes('.jsx'))) {
    currentFile = line;
  }
  // Extract error
  if (currentFile && line.match(/^\s+(\d+):(\d+)\s+error/)) {
    const match = line.match(/^\s+(\d+):(\d+)\s+error\s+(.+?)\s+(no-unused-vars|react\/no-unescaped-entities)/);
    if (match) {
      const [, lineNum, col, msg] = match;
      errors.push({
        file: currentFile,
        lineNum: parseInt(lineNum),
        col: parseInt(col),
        message: msg
      });
    }
  }
}

console.log(`Found ${errors.length} errors to fix\n`);

const fileMap = {};
errors.forEach(err => {
  if (!fileMap[err.file]) fileMap[err.file] = [];
  fileMap[err.file].push(err);
});

let fixedCount = 0;

Object.entries(fileMap).forEach(([filePath, fileErrors]) => {
  if (!fs.existsSync(filePath)) return;

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    const contentLines = content.split('\n');

    // Sort by line number descending to avoid index shifting
    const sorted = fileErrors.sort((a, b) => b.lineNum - a.lineNum);

    for (const err of sorted) {
      const idx = err.lineNum - 1;
      if (idx < 0 || idx >= contentLines.length) continue;

      const line = contentLines[idx];

      // Handle no-unescaped-entities - replace quotes
      if (err.message.includes('can be escaped')) {
        contentLines[idx] = line
          .replace(/'/g, '&apos;')
          .replace(/"/g, '&quot;');
        continue;
      }

      // Handle no-unused-vars - remove the variable
      const varMatch = err.message.match(/'([^']+)' is (?:defined|assigned)/);
      if (!varMatch) continue;

      const varName = varMatch[1];

      // Remove from imports or variable declarations
      if (line.includes('import')) {
        let newLine = line;
        newLine = newLine.replace(new RegExp(`\\s*,?\\s*\\b${varName}\\b\\s*,?`, 'g'), ' ');
        newLine = newLine.replace(/{\\s*,/, '{');
        newLine = newLine.replace(/,\\s*}/, '}');
        newLine = newLine.replace(/\\{\\s*\\}/, '');
        contentLines[idx] = newLine.replace(/\s+/g, ' ').trim();
        if (!contentLines[idx]) contentLines[idx] = '';
      } else if (line.includes('const') || line.includes('let') || line.includes('var')) {
        // Try to intelligently remove the variable
        if (line.match(new RegExp(`const\\s*{[^}]*${varName}`))) {
          // Handle destructuring
          let newLine = line.replace(new RegExp(`\\b${varName}\\b\\s*,?\\s*`, 'g'), '');
          newLine = newLine.replace(/{\\s*,/, '{').replace(/,\\s*}/, '}').replace(/{\\s*}/, '');
          contentLines[idx] = newLine;
        } else if (line.match(new RegExp(`const\\s*\\[\\s*.*${varName}`))) {
          // Array destructuring
          let newLine = line.replace(new RegExp(`\\b${varName}\\b\\s*,?\\s*`, 'g'), '');
          newLine = newLine.replace(/\\[\\s*,/, '[').replace(/,\\s*\\]/, ']').replace(/\\[\\s*\\]/, '');
          contentLines[idx] = newLine;
        } else if (line.trim().startsWith(`const ${varName}`) || line.trim().startsWith(`let ${varName}`)) {
          // Entire line is this variable
          contentLines[idx] = '';
        }
      }
    }

    content = contentLines
      .filter(l => l !== '')
      .join('\n')
      .replace(/\n\n\n+/g, '\n\n')
      .replace(/^import\\s*{\\s*}\\s*from[^;]*;?/gm, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      fixedCount++;
    }
  } catch (err) {
    // Silent skip
  }
});

console.log(`Fixed ${fixedCount} files`);
