const fs = require('fs');
const path = require('path');

const basePath = 'c:\\Users\\tomas\\Documents\\vscode\\RunthisRepo\\run-this-repo';

const dirs = [
  path.join(basePath, 'lib', 'supabase'),
  path.join(basePath, 'app', 'login'),
  path.join(basePath, 'app', 'dashboard', 'analyses', '[id]'),
  path.join(basePath, 'app', 'api', 'auth', 'logout'),
  path.join(basePath, 'app', 'api', 'analyses', 'save')
];

let output = 'Creating directories...\n\n';

// Create directories
dirs.forEach(dir => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      output += `✓ Created: ${dir}\n`;
    } else {
      output += `✓ Already exists: ${dir}\n`;
    }
  } catch (err) {
    output += `✗ Error creating ${dir}: ${err.message}\n`;
  }
});

output += '\nVerifying directories...\n\n';

// Verify directories exist
dirs.forEach(dir => {
  try {
    if (fs.existsSync(dir)) {
      const stats = fs.statSync(dir);
      output += `✓ Verified: ${dir}\n`;
    } else {
      output += `✗ Not found: ${dir}\n`;
    }
  } catch (err) {
    output += `✗ Error verifying ${dir}: ${err.message}\n`;
  }
});

console.log(output);

// Also save to file for verification
fs.writeFileSync(path.join(basePath, '.dir-creation-report.txt'), output);
