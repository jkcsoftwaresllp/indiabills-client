const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Map of MUI components to custom UI components
const componentMap = {
  CircularProgress: 'UI',
  Box: 'UI',
  Button: 'UI',
  TextField: 'UI',
  Dialog: 'UI',
  DialogTitle: 'UI',
  DialogContent: 'UI',
  DialogContentText: 'UI',
  DialogActions: 'UI',
  Modal: 'UI',
  Typography: 'UI',
  Paper: 'UI/Paper',
  Card: 'UI/Card',
  CardContent: 'UI/Card',
  CardActions: 'UI/Card',
  Avatar: 'UI/Avatar',
  Chip: 'UI/Chip',
  Grid: 'UI/Grid',
  Table: 'UI/Table',
  TableBody: 'UI/Table',
  TableCell: 'UI/Table',
  TableContainer: 'UI/Table',
  TableHead: 'UI/Table',
  TableRow: 'UI/Table',
  Alert: 'UI/Alert',
  Snackbar: 'UI/Snackbar',
  Autocomplete: 'UI/Autocomplete',
  FormControl: 'UI/FormControl',
  FormLabel: 'UI/FormControl',
  InputLabel: 'UI/FormControl',
  Select: 'UI/Select',
  MenuItem: 'UI/MenuItem',
  Switch: 'UI/Switch',
  IconButton: 'UI/IconButton',
  Tooltip: 'UI/Tooltip',
  Popover: 'UI/Popover',
  Divider: 'UI/Divider',
  Input: 'UI/Input',
  InputAdornment: 'UI/InputAdornment',
  Rating: 'UI/Rating',
};

const srcDir = path.join(__dirname, '../src');
const files = glob.sync(path.join(srcDir, '**/*.{jsx,tsx,js,ts}'), {
  ignore: [
    '**/node_modules/**',
    '**/components/UI/**',
    '**/scripts/**',
  ],
});

let processedCount = 0;
let errorCount = 0;

files.forEach((file) => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    const originalContent = content;

    // Replace @mui imports
    content = content.replace(
      /import\s+({[^}]*})\s+from\s+['"]@mui\/material['"];?/g,
      (match, imports) => {
        const importedComponents = imports
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);

        const validComponents = importedComponents.filter(
          (comp) => componentMap[comp] || comp === 'styled'
        );

        if (validComponents.length === 0) return '';

        const uiComponents = validComponents.filter((c) => componentMap[c] && componentMap[c] === 'UI');
        const otherComponents = validComponents.filter((c) => !componentMap[c] || componentMap[c] !== 'UI');

        let replacement = '';
        if (uiComponents.length > 0) {
          replacement += `import { ${uiComponents.join(', ')} } from '../../components/UI';`;
        }
        
        if (otherComponents.length > 0) {
          // Would need custom components for these
          replacement += `\n// TODO: Replace ${otherComponents.join(', ')} with custom components`;
        }

        return replacement;
      }
    );

    // Remove @mui/x-date-pickers imports (would need separate handling)
    content = content.replace(
      /import\s+.*from\s+['"]@mui\/x-date-pickers.*['"];?/g,
      '// TODO: Replace MUI date pickers with alternative'
    );

    // Remove @mui/system styled imports (would need separate handling)
    content = content.replace(
      /import\s+{.*styled.*}\s+from\s+['"]@mui\/system['"];?/g,
      ''
    );

    // Remove @mui/material/colors imports
    content = content.replace(
      /import\s+{.*}\s+from\s+['"]@mui\/material\/colors['"];?/g,
      ''
    );

    // Remove @mui/material/styles imports
    content = content.replace(
      /import\s+{.*}\s+from\s+['"]@mui\/material\/styles['"];?/g,
      ''
    );

    // Clean up multiple newlines
    content = content.replace(/\n\n+/g, '\n\n');

    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf-8');
      processedCount++;
    }
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
    errorCount++;
  }
});
