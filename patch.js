import fs from 'fs';
const path = '../NIkdel-backend/src/controllers/product.controller.js';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  "const removeFields = ['select', 'sort', 'page', 'limit', 'search'];",
  `const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'minPrice', 'maxPrice'];\n  if (req.query.minPrice || req.query.maxPrice) {\n    reqQuery.price = {};\n    if (req.query.minPrice) reqQuery.price.gte = req.query.minPrice;\n    if (req.query.maxPrice) reqQuery.price.lte = req.query.maxPrice;\n  }`
);
fs.writeFileSync(path, content);
console.log('Patched');
