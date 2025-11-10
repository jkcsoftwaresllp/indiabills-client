const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get lint output
let lintOutput;
try {
  lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf-8' });
} catch (e) {
  lintOutput = e.stdout || e.output?.join('');
}

const lines = lintOutput.split('\n');
const fileErrors = {};

// Parse errors from lint output
for (const line of lines) {
  const match = line.match(/^([^:]+):(\d+):(\d+)\s+error\s+(.+?)\s+(no-unused-vars|react\/jsx-no-undef|react\/no-unescaped-entities|react\/display-name)/);
  if (match) {
    const [, filePath, lineNum, , message, errorType] = match;
    if (!fileErrors[filePath]) {
      fileErrors[filePath] = [];
    }
    fileErrors[filePath].push({
      line: parseInt(lineNum),
      message,
      errorType
    });
  }
}

console.log(`Found errors in ${Object.keys(fileErrors).length} files\n`);

// Fix each file
Object.entries(fileErrors).forEach(([filePath, errors]) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let updated = content;
    const contentLines = content.split('\n');

    // Sort errors by line number in reverse to avoid index shifting
    const sortedErrors = errors.sort((a, b) => b.line - a.line);

    for (const error of sortedErrors) {
      const lineIdx = error.line - 1;
      const line = contentLines[lineIdx];

      if (error.errorType === 'no-unused-vars') {
        const match = error.message.match(/'([^']+)' is defined but never used/);
        const match2 = error.message.match(/'([^']+)' is assigned a value but never used/);
        const varName = match?.[1] || match2?.[1];

        if (varName && line) {
          // Handle import statements
          if (line.includes('import')) {
            // Remove from imports
            if (line.includes(`{ ${varName}`)) {
              updated = updated.replace(
                new RegExp(`{\\s*${varName}\\s*,?\\s*`, 'g'),
                '{ '
              );
              updated = updated.replace(
                new RegExp(`{\\s*,\\s*${varName}\\s*`, 'g'),
                '{ '
              );
            } else if (line.includes(`, ${varName}`)) {
              updated = updated.replace(new RegExp(`,\\s*${varName}`, 'g'), '');
            } else if (line.includes(`${varName},`)) {
              updated = updated.replace(new RegExp(`${varName}\\s*,`, 'g'), '');
            } else if (line.match(new RegExp(`^import ${varName}`))) {
              // Remove whole import line
              const importLineMatch = updated.match(new RegExp(`^import ${varName}[^;]*;?`, 'm'));
              if (importLineMatch) {
                updated = updated.replace(importLineMatch[0] + '\n', '');
              }
            }
            // Clean up empty imports
            updated = updated.replace(/import\s*{\s*}\s*from/g, '');
          } else {
            // Remove variable declaration or assignment
            contentLines[lineIdx] = '';
          }
        }
      } else if (error.errorType === 'react/no-unescaped-entities') {
        // Replace unescaped entities
        if (line) {
          updated = updated.replace(/'/g, '&apos;');
        }
      } else if (error.errorType === 'react/display-name') {
        // Add displayName to component
        if (line.includes('forwardRef') || line.includes('=>')) {
          // This requires more context, skip for now
        }
      }
    }

    // Clean up extra blank lines and empty imports
    updated = updated
      .replace(/import\s*{\s*}\s*from[^;]+;/g, '')
      .replace(/\n\n\n+/g, '\n\n');

    if (content !== updated) {
      fs.writeFileSync(filePath, updated);
      console.log(`✓ Fixed: ${filePath}`);
    }
  } catch (err) {
    console.error(`✗ Error fixing ${filePath}: ${err.message}`);
  }
});

console.log('\nDone!');
