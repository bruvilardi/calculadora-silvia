const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace teal with blue
code = code.replace(/teal-/g, 'blue-');

// Replace sky with blue
code = code.replace(/sky-/g, 'blue-');

// Replace slate with blue to make the whole theme blue
code = code.replace(/slate-900/g, 'blue-950');
code = code.replace(/slate-800/g, 'blue-900');
code = code.replace(/slate-700/g, 'blue-800');
code = code.replace(/slate-600/g, 'blue-700');
code = code.replace(/slate-500/g, 'blue-600');
code = code.replace(/slate-400/g, 'blue-400');
code = code.replace(/slate-300/g, 'blue-300');
code = code.replace(/slate-200/g, 'blue-200');
code = code.replace(/slate-100/g, 'blue-100');
code = code.replace(/slate-50/g, 'blue-50');

fs.writeFileSync('src/App.tsx', code);
