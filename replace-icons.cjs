const fs = require('fs');
const path = require('path');

function replaceLucide(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      replaceLucide(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /import\s+type\s+\{\s*([^}]+)\s*\}\s+from\s+['"]lucide-react['"];?|import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]lucide-react['"];?/g;
      
      let modified = false;
      
      content = content.replace(regex, (match, typeGroup, group) => {
        const isType = !!typeGroup;
        const actualGroup = typeGroup || group;
        
        let importedItems = actualGroup.split(',').map(s => s.trim()).filter(Boolean);
        let newImports = [];
        
        importedItems.forEach(item => {
          if (item === 'LucideIcon' || item === 'type LucideIcon') {
            newImports.push('IconType as ' + item.replace('type ', ''));
          } else {
            let parts = item.split(/\s+as\s+/);
            let original = parts[0];
            let alias = parts[1];
            if (!alias) alias = original;
            
            newImports.push('Lu' + original + ' as ' + alias);
          }
        });
        
        modified = true;
        if (isType) {
          return 'import type { ' + newImports.join(', ') + ' } from "react-icons/lu";';
        } else {
          if (newImports.some(x => x.includes('IconType as'))) {
            const hasIconType = newImports.length > 0;
            const res = [];
            let others = newImports.filter(x => !x.includes('IconType as'));
            if (others.length > 0) res.push('import { ' + others.join(', ') + ' } from "react-icons/lu";');
            res.push('import { IconType as LucideIcon } from "react-icons";');
            return res.join('\n');
          }
          return 'import { ' + newImports.join(', ') + ' } from "react-icons/lu";';
        }
      });
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  });
}

const srcDir = path.join(__dirname, 'src');
replaceLucide(srcDir);
console.log("Done");
