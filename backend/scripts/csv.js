// csv.js — minimal, dependency-free CSV parser.
// Handles: BOM stripping, quoted fields, "" escaped quotes inside quoted fields,
// commas and newlines embedded in quoted fields, CRLF/LF line endings.
'use strict';

function parseCSV(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  const n = text.length;

  function endField() {
    row.push(field);
    field = '';
  }
  function endRow() {
    endField();
    rows.push(row);
    row = [];
  }

  while (i < n) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ',') {
      endField();
      i += 1;
      continue;
    }
    if (c === '\r') {
      i += 1;
      continue; // swallow, \n (or end) will terminate the row
    }
    if (c === '\n') {
      endRow();
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }
  // last field/row if file doesn't end with newline
  if (field.length > 0 || row.length > 0) endRow();

  // drop fully-empty trailing rows
  return rows.filter(r => !(r.length === 1 && r[0] === ''));
}

function parseCSVFile(text) {
  const rows = parseCSV(text);
  const header = rows[0].map(h => h.trim());
  return rows.slice(1).map(r => {
    const obj = {};
    header.forEach((h, idx) => { obj[h] = r[idx] !== undefined ? r[idx] : ''; });
    return obj;
  });
}

module.exports = { parseCSV, parseCSVFile };
