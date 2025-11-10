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
const lines = lintOutput.split('\n');

// Build error map
const errorMap = {};
let currentFile = null;

for (const line of lines) {
  if (line && !line.startsWith(' ') && (line.includes('.jsx') || line.includes('.js'))) {
    currentFile = line;
    if (!errorMap[currentFile]) {
      errorMap[currentFile] = [];
    }
  }

  if (currentFile && line.match(/^\s+\d+:\d+\s+error\s+.+no-unused-vars/)) {
    const match = line.match(/^\s+(\d+):(\d+)\s+error\s+([^n]+)no-unused-vars/);
    if (match) {
      const [, lineNum, col, msg] = match;
      errorMap[currentFile].push({
        lineNum: parseInt(lineNum),
        col: parseInt(col),
        message: msg.trim()
      });
    }
  }
}

let fixedCount = 0;

Object.entries(errorMap).forEach(([filePath, errors]) => {
  if (errors.length === 0 || !fs.existsSync(filePath)) return;

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    const contentLines = content.split('\n');

    // Process errors by line number (descending)
    const sorted = errors.sort((a, b) => b.lineNum - a.lineNum);

    for (const error of sorted) {
      const idx = error.lineNum - 1;
      if (idx < 0 || idx >= contentLines.length) continue;

      const line = contentLines[idx];
      const varMatch = error.message.match(/'([^']+)' is (?:defined|assigned)/);
      if (!varMatch) continue;

      const varName = varMatch[1];

      // Handle imports
      if (line.includes('import')) {
        let newLine = line;
        // Remove from destructuring
        newLine = newLine.replace(new RegExp(`\\s*,?\\s*${varName}\\s*,?\\s*`, 'g'), ' ');
        newLine = newLine.replace(/{\\s*,/, '{').replace(/,\\s*}/, '}');
        newLine = newLine.replace(/import\\s*{\\s*}\\s*from/, 'FROM_REMOVE');

        if (newLine.includes('FROM_REMOVE')) {
          contentLines[idx] = '';
        } else {
          contentLines[idx] = newLine.replace(/\\s+/g, ' ').trim();
        }
      } else if ((line.includes('const ') || line.includes('let ') || line.includes('var ')) && !line.includes('//')) {
        // Try to clear unused variable declarations
        // This is risky, so only do it for simple cases
        if (line.match(new RegExp(`(?:const|let|var)\\s+${varName}\\s*=`))) {
          // Could be a simple declaration, but we need to be careful
          // For now, skip these to avoid breaking code
          continue;
        }
      }
    }

    content = contentLines
      .filter(l => l !== '')
      .join('\n')
      .replace(/\n\n\n+/g, '\n\n')
      .replace(/FROM_REMOVE/g, '');

    if (content !== original && content.trim().length > 0) {
      fs.writeFileSync(filePath, content);
      fixedCount++;
    }
  } catch (err) {
    // Skip silently
  }
});

console.log(`Fixed unused imports in ${fixedCount} files`);
