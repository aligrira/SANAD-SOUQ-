import fs from 'fs';

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Replace AnimatePresence mode="wait"
code = code.replace(/<AnimatePresence mode="wait">/g, '<div>');

// Fix closing AnimatePresence
code = code.replace(/<\/AnimatePresence>\s*<\/div>\s*<\/div>\s*\{\/\* Dynamic Verification Payment/g, '</div>\n        </div>\n      </div>\n\n      {/* Dynamic Verification Payment');

// Replace tab motion.divs
code = code.replace(/<motion\.div\s+key="tab-[^"]+"[\s\S]*?className="(.*?)"\s*>/g, (match, classNames) => {
  return `<div className="${classNames}">`;
});

// Since we changed `<motion.div>` to `<div>` for the tabs, we need to change matching `</motion.div>` to `</div>`.
// Rather than regex hacking, let's just make the tabs regular components? No, we can just replace ALL `</motion.div>` with `</div>`
code = code.replace(/<\/motion\.div>/g, '</div>');
// Then restore the ones that matter:
code = code.replace(/<motion\.div\n\s+initial=\{{ opacity: 0 }}\n/g, '<motion.div\n      initial={{ opacity: 0 }}\n');

// Restore the root closing
const lines = code.split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('</div>')) {
        lines[i] = lines[i].replace('</div>', '</motion.div>');
        break;
    }
}
code = lines.join('\n');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
