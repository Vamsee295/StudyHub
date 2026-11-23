const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
            callback(dirPath);
        }
    });
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // Radius
    content = content.replace(/rounded-3xl/g, 'rounded-lg');
    content = content.replace(/rounded-2xl/g, 'rounded-md');
    content = content.replace(/rounded-xl/g, 'rounded-md');

    // Shadows
    content = content.replace(/shadow-2xl/g, 'border border-[var(--border)]');
    content = content.replace(/shadow-xl/g, 'border border-[var(--border)]');
    content = content.replace(/shadow-lg/g, 'border border-[var(--border)]');
    content = content.replace(/shadow-md/g, 'border border-[var(--border)] shadow-sm');
    
    // Gradients & Backgrounds
    content = content.replace(/bg-gradient-to-[a-z]+/g, 'bg-[var(--surface)]');
    content = content.replace(/from-[a-zA-Z0-9-]+/g, '');
    content = content.replace(/via-[a-zA-Z0-9-]+/g, '');
    content = content.replace(/to-[a-zA-Z0-9-]+/g, '');
    content = content.replace(/backdrop-blur-(sm|md|lg|xl|2xl|3xl)/g, '');
    content = content.replace(/bg-white\/[0-9]+/g, 'bg-[var(--surface)]');
    
    // Borders
    content = content.replace(/border-gray-100/g, 'border-[var(--border)]');
    content = content.replace(/border-gray-200/g, 'border-[var(--border)]');
    content = content.replace(/border-gray-300/g, 'border-[var(--border-strong)]');

    // Text colors
    content = content.replace(/text-gray-900/g, 'text-[var(--ink)]');
    content = content.replace(/text-gray-800/g, 'text-[var(--ink)]');
    content = content.replace(/text-gray-700/g, 'text-[var(--ink-secondary)]');
    content = content.replace(/text-gray-600/g, 'text-[var(--ink-secondary)]');
    content = content.replace(/text-gray-500/g, 'text-[var(--ink-muted)]');
    content = content.replace(/text-gray-400/g, 'text-[var(--ink-muted)]');
    
    // Background colors
    content = content.replace(/bg-gray-50/g, 'bg-[var(--canvas)]');
    content = content.replace(/bg-gray-100/g, 'bg-[var(--surface-subdued)]');
    
    // Primary Blue mappings
    content = content.replace(/bg-blue-600/g, 'bg-[var(--accent)]');
    content = content.replace(/bg-blue-700/g, 'bg-[var(--accent-hover)]');
    content = content.replace(/bg-blue-50/g, 'bg-[var(--accent-soft)]');
    content = content.replace(/text-blue-600/g, 'text-[var(--accent)]');
    content = content.replace(/text-blue-700/g, 'text-[var(--accent)]');
    
    // Typography
    content = content.replace(/font-extrabold/g, 'font-semibold');
    content = content.replace(/font-bold/g, 'font-semibold');
    content = content.replace(/tracking-tight/g, '');
    content = content.replace(/tracking-wide/g, '');

    // Cleanup multiple spaces caused by removals
    content = content.replace(/className="([^"]*)"/g, (match, p1) => {
        let cleaned = p1.replace(/\s+/g, ' ').trim();
        return `className="${cleaned}"`;
    });
    content = content.replace(/className={`([^`]+)`}/g, (match, p1) => {
        let cleaned = p1.replace(/ +/g, ' '); // don't trim completely to avoid breaking template literal logic
        return `className={\`${cleaned}\`}`;
    });

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${filePath}`);
    }
}

walkDir('./frontend', processFile);
console.log('Migration complete');
