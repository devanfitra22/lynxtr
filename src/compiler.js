const ESCAPE = {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"};
const escapeHtml = value => String(value).replace(/[&<>"]/g, c => ESCAPE[c]);

function readString(source, keyword, start) {
  const re = new RegExp("^\\s*" + keyword + "\\s+\"((?:\\\\.|[^\"\\\\])*)\"");
  const match = source.slice(start).match(re);
  if (!match) throw new SyntaxError("Expected " + keyword + ' with a quoted value.');
  return { value: match[1], end: start + match[0].length };
}

function findBlockEnd(source, start) {
  let depth=1, quote=false;
  for (let i=start;i<source.length;i++) {
    const c=source[i];
    if(c==='\"' && source[i-1]!=='\\') quote=!quote;
    if(quote) continue;
    if(c==='{') depth++;
    if(c==='}') { depth--; if(depth===0) return i; }
  }
  throw new SyntaxError("Unclosed Lynxtr block.");
}

function parseAttributes(block) {
  const attrs={};
  for(const line of block.split("\n")) {
    const m=line.trim().match(/^(nome|name)\s+"([^"]*)"$/);
    if(m) attrs.name=m[2];
  }
  return attrs;
}

function compileBody(source) {
  let html="", i=0;
  while(i<source.length) {
    while(/\s/.test(source[i]??"")) i++;
    if(i>=source.length) break;
    if(source[i]==='}') return {html,end:i};

    const rest=source.slice(i);
    const keyword=["judul","teks","gambar","tombol","input","video","audio"].find(k=>rest.trimStart().startsWith(k+" "));
    if(!keyword) throw new SyntaxError("Unknown Lynxtr syntax near: "+rest.trim().slice(0,40));

    i += rest.match(/^\s*/)[0].length;
    const parsed=readString(source,keyword,i);
    i=parsed.end;
    while(/\s/.test(source[i]??"")) i++;

    let block="";
    if(source[i]==='{') {
      const end=findBlockEnd(source,i+1);
      block=source.slice(i+1,end);
      i=end+1;
    }

    const value=escapeHtml(parsed.value);
    if(keyword==="judul") html += `<h1>${value}</h1>\n`;
    if(keyword==="teks") html += `<p>${value}</p>\n`;
    if(keyword==="gambar") html += `<img src="${value}" alt="">\n`;
    if(keyword==="video") html += `<video controls src="${value}"></video>\n`;
    if(keyword==="audio") html += `<audio controls src="${value}"></audio>\n`;
    if(keyword==="input") {
      const attrs=parseAttributes(block);
      const name=attrs.name ? ` name="${escapeHtml(attrs.name)}"` : "";
      html += `<input type="text" placeholder="${value}"${name}>\n`;
    }
    if(keyword==="tombol") {
      const action=block.match(/(?:aksi|action)\s+"([^"]*)"/)?.[1];
      const onclick=action ? ` onclick="${escapeHtml(action)}"` : "";
      html += `<button${onclick}>${value}</button>\n`;
    }
  }
  return {html,end:i};
}

export function compile(source) {
  const page=source.match(/^\s*halaman\s+"((?:\\.|[^"\\])*)"\s*\{/);
  if(!page) throw new SyntaxError('A Lynxtr file must start with: halaman "Title" {');
  const open=source.indexOf("{",page.index);
  const close=findBlockEnd(source,open+1);
  const {html}=compileBody(source.slice(open+1,close));
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page[1])}</title>
<style>
:root{font-family:system-ui,sans-serif;color-scheme:light dark}
body{max-width:900px;margin:0 auto;padding:2rem;line-height:1.6}
img,video{max-width:100%;height:auto}
button,input{font:inherit;padding:.65rem .8rem;margin:.25rem 0}
audio{width:min(100%,500px)}
</style>
</head>
<body>
${html}</body>
</html>
`;
}
