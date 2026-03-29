const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace border radius
    content = content.replace(/rounded-(lg|xl|2xl|3xl)/g, 'rounded-md');
    
    // Replace large paddings on buttons
    // We will look for className="..." inside <button> tags and replace py-3, py-4, px-6, px-8 with px-4 py-2
    // A simpler way is to just replace them globally in the file if they are next to button-like classes, but that's risky.
    // Let's just replace the border radius first.
    
    fs.writeFileSync(filePath, content);
  }
});
