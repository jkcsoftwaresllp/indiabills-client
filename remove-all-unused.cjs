#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get lint output
let lintOutput;
try {
  lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf-8' });
} catch (e) {
  lintOutput = e.stdout ? e.stdout.toString() : e.output?.join('');
}

const baseDir = process.cwd();
const fileErrorsMap = {};

// Parse lint output
const lines = lintOutput.split('\n');
let currentFile = null;

for (const line of lines) {
  // Match file path at start of line (no leading spaces)
  if (line && !line.startsWith(' ') && (line.includes('.jsx') || line.includes('.js'))) {
    currentFile = line;
    if (!fileErrorsMap[currentFile]) {
      fileErrorsMap[currentFile] = [];
    }
  }

  // Match error lines with indentation
  if (currentFile && line.match(/^\s+\d+:\d+\s+error/)) {
    const match = line.match(/^\s+(\d+):\d+\s+error\s+(.+?)\s+(no-unused-vars|no-undef|react\/jsx-no-undef)/);
    if (match) {
      const [, lineNum, message] = match;
      fileErrorsMap[currentFile].push({
        lineNum: parseInt(lineNum),
        message,
        line: line.trim()
      });
    }
  }
}

let totalFixed = 0;

// Process each file
Object.entries(fileErrorsMap).forEach(([filePath, errors]) => {
  if (!fs.existsSync(filePath)) return;

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    const contentLines = content.split('\n');

    // Process errors by line number (in reverse order to avoid index shifting)
    const uniqueErrors = {};
    errors.forEach(err => {
      const key = `${err.lineNum}-${err.message}`;
      uniqueErrors[key] = err;
    });

    const sortedErrors = Object.values(uniqueErrors).sort((a, b) => b.lineNum - a.lineNum);

    for (const error of sortedErrors) {
      const lineIdx = error.lineNum - 1;
      if (lineIdx < 0 || lineIdx >= contentLines.length) continue;

      const line = contentLines[lineIdx];

      // Extract variable name
      const varMatch = error.message.match(/'([^']+)' is (?:defined|assigned)/);
      if (!varMatch) continue;

      const varName = varMatch[1];

      // Handle import statements
      if (line.includes('import')) {
        let newLine = line;

        // Handle: import { something } from 'x'
        if (line.includes('import')) {
          // Try to remove specific import from destructuring
          newLine = newLine.replace(new RegExp(`\\b${varName}\\b\\s*,\\s*`, 'g'), '');
          newLine = newLine.replace(new RegExp(`\\s*,\\s*\\b${varName}\\b`, 'g'), '');
          newLine = newLine.replace(new RegExp(`\\{\\s*${varName}\\s*\\}`, 'g'), '{}');
        }

        // Remove empty imports
        newLine = newLine.replace(/import\s*{\s*}\s*from[^;]*;?/, '');

        if (newLine.trim() === '' || newLine.includes('import {} from')) {
          contentLines[lineIdx] = '';
        } else {
          contentLines[lineIdx] = newLine;
        }
      } else if (!line.trim().startsWith('//') && !line.trim().startsWith('*')) {
        // For non-import lines, we might want to preserve them or comment
        // But this is risky, so we skip them
        continue;
      }
    }

    // Rebuild content and clean up
    content = contentLines
      .join('\n')
      .replace(/\n\n\n+/g, '\n\n')
      .replace(/^import\s*{\s*}\s*from[^;]*;?\n/gm, '');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
    }
  } catch (err) {
    console.error(`Error processing ${filePath}: ${err.message}`);
  }
});

console.log(`Fixed ${totalFixed} files`);
