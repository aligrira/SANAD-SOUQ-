import fs from 'fs';

function removeBlur(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/backdrop-blur(-\w+)?\s+/g, '');
    content = content.replace(/\s+backdrop-blur(-\w+)?/g, '');
    content = content.replace(/backdrop-blur(-\w+)?/g, '');
    fs.writeFileSync(filePath, content);
}

[
    'src/components/ProductDetailsModal.tsx',
    'src/components/PublishingTransition.tsx',
    'src/components/PricingPackages.tsx',
    'src/components/MenuModal.tsx',
    'src/components/AddProductModal.tsx',
    'src/components/StateModal.tsx',
    'src/components/Toast.tsx',
    'src/components/VipStoriesRow.tsx',
    'src/components/Sidebar.tsx',
    'src/components/StoryViewerModal.tsx',
    'src/components/DebugView.tsx',
    'src/components/PaymentModal.tsx',
].forEach(removeBlur);
