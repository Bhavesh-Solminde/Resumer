/**
 * Script to replace @/ imports with relative paths
 * Run with: node scripts/fix-imports.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, "..", "src");

function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

function getRelativePath(fromFile, toPath) {
  const fromDir = path.dirname(fromFile);
  let relative = path.relative(fromDir, path.join(srcDir, toPath));
  // Convert to forward slashes
  relative = relative.replace(/\\/g, "/");
  // Add ./ prefix if needed
  if (!relative.startsWith(".")) {
    relative = "./" + relative;
  }
  return relative;
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;

  // Match import statements with @/
  const importRegex = /(from\s+["'])@\/([^"']+)(["'])/g;

  content = content.replace(
    importRegex,
    (match, prefix, importPath, suffix) => {
      const relativePath = getRelativePath(filePath, importPath);
      return `${prefix}${relativePath}${suffix}`;
    }
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`Fixed: ${path.relative(srcDir, filePath)}`);
    return true;
  }
  return false;
}

const files = getAllFiles(srcDir);
let fixedCount = 0;

for (const file of files) {
  if (fixImports(file)) {
    fixedCount++;
  }
}

console.log(`\nDone! Fixed ${fixedCount} files.`);
