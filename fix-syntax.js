import fs from 'fs';
import path from 'path';

const backendPath = '../NIkdel-backend';
const controllerPath = path.join(backendPath, 'src', 'controllers', 'product.controller.js');

let content = fs.readFileSync(controllerPath, 'utf8');

if (content.endsWith('});\n});\r\n') || content.endsWith('});\r\n});\r\n') || content.endsWith('});\n});\n') || content.endsWith('});\n});') || content.endsWith('});\r\n});')) {
  content = content.replace(/}\);\s*}\);\s*$/, '});\n');
  fs.writeFileSync(controllerPath, content);
  console.log('Fixed syntax error at the end of product.controller.js');
} else {
  console.log('Extra brace not found at the end.');
}
