#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get lint output to find actual errors
let lintOutput;
try {
  lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf-8' });
} catch (e) {
  lintOutput = e.stdout ? e.stdout.toString() : '';
}

const baseDir = process.cwd();
const lines = lintOutput.split('\n');

// Parse lint output to find missing imports
const fileErrorMap = {};
let currentFile = null;

for (const line of lines) {
  if (line && !line.startsWith(' ') && (line.includes('.jsx') || line.includes('.js'))) {
    currentFile = line;
    if (!fileErrorMap[currentFile]) {
      fileErrorMap[currentFile] = { fiIcons: new Set(), muiIcons: new Set() };
    }
  }

  if (currentFile && line.includes('jsx-no-undef')) {
    // Extract the undefined symbol
    const match = line.match(/'([^']+)' is not defined/);
    if (match) {
      const symbol = match[1];
      // Determine if it's a Feather icon or MUI icon
      if (symbol.startsWith('Fi') && symbol.length > 2) {
        fileErrorMap[currentFile].fiIcons.add(symbol);
      } else if (['SearchOff', 'AddCircleRounded', 'Favorite', 'FavoriteBorder', 'Divider'].includes(symbol)) {
        fileErrorMap[currentFile].muiIcons.add(symbol);
      }
    }
  }
}

let fixedCount = 0;

Object.entries(fileErrorMap).forEach(([filePath, { fiIcons, muiIcons }]) => {
  if (fiIcons.size === 0 && muiIcons.size === 0) return;
  if (!fs.existsSync(filePath)) {
    console.log(`⊘ ${path.relative(baseDir, filePath)} (not found)`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    const contentLines = content.split('\n');

    // Handle Feather icons
    if (fiIcons.size > 0) {
      const iconsArray = Array.from(fiIcons);
      let foundImport = false;

      for (let i = 0; i < contentLines.length; i++) {
        if (contentLines[i].includes("'react-icons/fi'")) {
          const match = contentLines[i].match(/import\s*{\s*([^}]*)\s*}\s*from/);
          if (match) {
            const existing = new Set(
              match[1].split(',').map(s => s.trim()).filter(s => s)
            );
            iconsArray.forEach(icon => existing.add(icon));
            contentLines[i] = `import { ${Array.from(existing).sort().join(', ')} } from 'react-icons/fi';`;
            foundImport = true;
            break;
          }
        }
      }

      if (!foundImport) {
        // Find last import line and add after it
        let insertIdx = 0;
        for (let i = contentLines.length - 1; i >= 0; i--) {
          if (contentLines[i].includes('import') && contentLines[i].includes('from')) {
            insertIdx = i + 1;
            break;
          }
        }
        contentLines.splice(insertIdx, 0, `import { ${Array.from(fiIcons).sort().join(', ')} } from 'react-icons/fi';`);
      }
    }

    // Handle MUI icons
    if (muiIcons.size > 0) {
      const iconsArray = Array.from(muiIcons);
      let foundImport = false;

      for (let i = 0; i < contentLines.length; i++) {
        if (contentLines[i].includes('@mui/icons-material') || contentLines[i].includes('@mui/material/icons')) {
          const match = contentLines[i].match(/import\s*{\s*([^}]*)\s*}\s*from/);
          if (match) {
            const existing = new Set(
              match[1].split(',').map(s => s.trim()).filter(s => s)
            );
            iconsArray.forEach(icon => existing.add(icon));
            contentLines[i] = `import { ${Array.from(existing).sort().join(', ')} } from '@mui/icons-material';`;
            foundImport = true;
            break;
          }
        }
      }

      if (!foundImport) {
        // Handle special cases
        if (iconsArray.includes('Divider')) {
          // Divider comes from @mui/material
          let foundMuiImport = false;
          for (let i = 0; i < contentLines.length; i++) {
            if (contentLines[i].includes("from '@mui/material'") && !contentLines[i].includes('icons-material')) {
              const match = contentLines[i].match(/import\s*{\s*([^}]*)\s*}\s*from/);
              if (match) {
                const existing = new Set(
                  match[1].split(',').map(s => s.trim()).filter(s => s)
                );
                existing.add('Divider');
                contentLines[i] = `import { ${Array.from(existing).sort().join(', ')} } from '@mui/material';`;
                foundMuiImport = true;
                break;
              }
            }
          }

          if (!foundMuiImport) {
            const nonDivider = iconsArray.filter(i => i !== 'Divider');
            if (nonDivider.length > 0) {
              let insertIdx = 0;
              for (let i = contentLines.length - 1; i >= 0; i--) {
                if (contentLines[i].includes('import') && contentLines[i].includes('from')) {
                  insertIdx = i + 1;
                  break;
                }
              }
              contentLines.splice(insertIdx, 0, `import { ${nonDivider.sort().join(', ')} } from '@mui/icons-material';`);
            }
          }
        } else {
          let insertIdx = 0;
          for (let i = contentLines.length - 1; i >= 0; i--) {
            if (contentLines[i].includes('import') && contentLines[i].includes('from')) {
              insertIdx = i + 1;
              break;
            }
          }
          contentLines.splice(insertIdx, 0, `import { ${Array.from(muiIcons).sort().join(', ')} } from '@mui/icons-material';`);
        }
      }
    }

    content = contentLines.join('\n');

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
