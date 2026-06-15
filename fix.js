const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Replace AnimatePresence mode="wait"
code = code.replace(/<AnimatePresence mode="wait">/g, '<div>');

// Change </AnimatePresence> to </div>. But wait, we have another AnimatePresence at the bottom.
// Let's be careful. The one for tabs ends right before the modal.
code = code.replace(/<\/AnimatePresence>\s*<\/div>\s*<\/div>\s*{\/\* Dynamic Verification Payment/g, '</div>\n        </div>\n      </div>\n\n      {/* Dynamic Verification Payment');

// Replace tab motion.divs
code = code.replace(/<motion\.div\s+key="tab-[^"]+"[\s\S]*?className="(.*?)"\s*>/g, (match, classNames) => {
  return `<div className="${classNames}">`;
});

// Since we changed `<motion.div>` to `<div>` for the tabs, we need to change `</motion.div>` to `</div>`.
// There are multiple `</motion.div>`s in the tabs.
// Actually, we can just replace all `</motion.div>` with `</div>`, and then restore `motion.div` for the modal and root.
code = code.replace(/<\/motion\.div>/g, '</div>');

// The root motion.div starts at line ~379: `<motion.div \n initial={{...}} ... className="fixed inset-0...`
// The main modal: `<motion.div \n key="receipt-modal"...`
// Let's just fix the root back:
code = code.replace(/<motion\.div\n\s+initial={{ opacity: 0 }}/, '<motion.div\n      initial={{ opacity: 0 }}');
code = code.replace(/<\/div>\n$/, '</motion.div>\n');

// And the receipt modal:
code = code.replace(/key="receipt-modal"/, 'key="receipt-modal"'); // this wasn't changed

fs.writeFileSync('src/components/AdminPanel.tsx', code);
