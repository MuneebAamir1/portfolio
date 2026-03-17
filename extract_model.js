const fs = require('fs');
const html = fs.readFileSync('hero-with-avatar-updated.html', 'utf8');
const match = html.match(/const MODEL_B64 = "([^"]+)"/);
if (match) {
  const b64 = match[1];
  const buffer = Buffer.from(b64, 'base64');
  fs.writeFileSync('public/model.glb', buffer);
  console.log("Model extracted successfully to public/model.glb");
} else {
  console.log("Could not find MODEL_B64 string in the HTML file.");
}
