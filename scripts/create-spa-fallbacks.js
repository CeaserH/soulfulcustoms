const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");
const redirectsPath = path.join(distDir, "_redirects");

if (!fs.existsSync(indexPath)) {
  throw new Error("dist/index.html was not found. Run the Parcel build first.");
}

fs.copyFileSync(indexPath, notFoundPath);
fs.writeFileSync(redirectsPath, "/* /index.html 200\n");

console.log("Created SPA fallbacks: dist/404.html and dist/_redirects");
