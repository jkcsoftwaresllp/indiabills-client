const fs = require('fs');

const files = {
  '/Users/abdullahmuhammadyasir/Desktop/IndiaBills_Software/v2_new/indiabills-client/src/components/FormComponent/CollapsableSection.jsx': ['useState'],
  '/Users/abdullahmuhammadyasir/Desktop/IndiaBills_Software/v2_new/indiabills-client/src/components/FormComponent/CustomerSelector.jsx': ['useState'],
  '/Users/abdullahmuhammadyasir/Desktop/IndiaBills_Software/v2_new/indiabills-client/src/components/FormComponent/ImageUpload.jsx': ['useState'],
  '/Users/abdullahmuhammadyasir/Desktop/IndiaBills_Software/v2_new/indiabills-client/src/components/FormComponent/PhoneInput.jsx': ['useState'],
  '/Users/abdullahmuhammadyasir/Desktop/IndiaBills_Software/v2_new/indiabills-client/src/components/FormComponent/TableGeneration.jsx': ['useState'],
  '/Users/abdullahmuhammadyasir/Desktop/IndiaBills_Software/v2_new/indiabills-client/src/components/FormComponent/UpdateForm.jsx': ['useState'],
  '/Users/abdullahmuhammadyasir/Desktop/IndiaBills_Software/v2_new/indiabills-client/src/components/LayoutComponent/PromptButton.jsx': ['useState'],
  '/Users/abdullahmuhammadyasir/Desktop/IndiaBills_Software/v2_new/indiabills-client/src/components/UI/Slide.jsx': ['useEffect'],
};

Object.entries(files).forEach(([file, hooks]) => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Find first import line
    const lines = content.split('\n');
    let importIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("from 'react'")) {
        importIdx = i;
        break;
      }
    }
    
    if (importIdx === -1) {
      // Add new import
      let firstImportIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^import /)) {
          firstImportIdx = i;
          break;
        }
      }
      
      if (firstImportIdx !== -1) {
        lines.splice(firstImportIdx, 0, `import { ${hooks.join(', ')} } from 'react';`);
        fs.writeFileSync(file, lines.join('\n'));
        console.log(`✓ Added imports to ${file.split('/').pop()}`);
      }
    }
  } catch (e) {
    console.error(`✗ Error fixing ${file}`);
  }
});
