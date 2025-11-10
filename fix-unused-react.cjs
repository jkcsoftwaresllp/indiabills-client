const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all files with unused React import errors
const lintOutput = execSync('npm run lint 2>&1', { encoding: 'utf-8' });
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

filesToFix.forEach((file) => {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Remove "import React" statements where React is not used
    // Keep imports like "import React, { useState }" if there are other imports
    const updated = content
      .replace(/^import React(?:,\s*)?from ['"]react['"];\n/m, '')
      .replace(/^import React,\s*\{\s*\}/m, 'import')
      .replace(/^import React from ['"]react['"];?\s*$/m, '');
    
    if (content !== updated) {
      fs.writeFileSync(file, updated);
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (err) {
    console.error(`✗ Error fixing ${file}: ${err.message}`);
  }
});

console.log('Done!');
