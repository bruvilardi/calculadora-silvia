const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We want to make body text "bem escuro de azul, quase preto" -> text-blue-950
// Let's replace text-blue-700 and text-blue-800 with text-blue-950 globally first
code = code.replace(/text-blue-800/g, 'text-blue-950');
code = code.replace(/text-blue-700/g, 'text-blue-950');

// For text-blue-600, let's only replace it if it's NOT an icon.
// Icons usually have "w-6 h-6" or similar nearby, or it's inside a <LucideIcon tag, but let's just do targeted replacements for text classes.
// p tags
code = code.replace(/<p className="([^"]*)text-blue-600([^"]*)"/g, '<p className="$1text-blue-950$2"');
// span tags
code = code.replace(/<span className="([^"]*)text-blue-600([^"]*)"/g, '<span className="$1text-blue-950$2"');
// div tags containing text
code = code.replace(/<div className="([^"]*)text-blue-600([^"]*)"/g, '<div className="$1text-blue-950$2"');

fs.writeFileSync('src/App.tsx', code);
