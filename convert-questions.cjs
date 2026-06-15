const fs = require('fs');
let content = fs.readFileSync('questions2.json', 'utf8').trim();

// Fix double ]] at end: find the second-to-last ] and use it
const lastIdx = content.lastIndexOf(']');
const secondLastIdx = content.lastIndexOf(']', lastIdx - 1);
if (secondLastIdx > 0 && content.substring(lastIdx + 1).trim() === '') {
  // Extra ] at end - trim everything after second-to-last ]
  content = content.substring(0, secondLastIdx + 1);
}

// Remove comments
content = content.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

// Quote property names
content = content.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

// Convert single-quoted to double-quoted, escaping inner double quotes
let result = '';
let inDouble = false;
let inSingle = false;

for (let i = 0; i < content.length; i++) {
  const ch = content[i];

  if (!inDouble && !inSingle) {
    if (ch === '"') {
      inDouble = true;
      result += ch;
    } else if (ch === "'") {
      inSingle = true;
      result += '"';
    } else {
      result += ch;
    }
  } else if (inDouble) {
    if (ch === '\\' && i + 1 < content.length && content[i+1] === '"') {
      result += '\\"'; i++;
    } else if (ch === '"') {
      inDouble = false;
      result += ch;
    } else {
      result += ch;
    }
  } else if (inSingle) {
    if (ch === '\\' && i + 1 < content.length && content[i+1] === "'") {
      result += "'"; i++;
    } else if (ch === '"') {
      result += '\\"';
    } else if (ch === "'") {
      inSingle = false;
      result += '"';
    } else {
      result += ch;
    }
  }
}

try {
  const data = JSON.parse(result);
  fs.writeFileSync('questions2.json', JSON.stringify(data, null, 2));
  console.log(`Convertido com sucesso! ${data.length} questoes.`);
} catch(e) {
  const pos = e.message.match(/position\s+(\d+)/);
  if (pos) {
    const p = parseInt(pos[1]);
    const start = Math.max(0, p - 80);
    console.error(`Erro na posicao ${p}:`);
    console.error(`Contexto: ${result.substring(start, p + 80)}`);
  }
  console.error('Erro no JSON:', e.message);
  process.exit(1);
}
