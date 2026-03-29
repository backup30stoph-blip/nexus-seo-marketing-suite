const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/ContentPlanner.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/rounded-3xl/g, 'rounded-md');
content = content.replace(/rounded-2xl/g, 'rounded-md');
content = content.replace(/rounded-xl/g, 'rounded-md');
content = content.replace(/rounded-lg/g, 'rounded-md');

fs.writeFileSync(filePath, content);
console.log('Done');
