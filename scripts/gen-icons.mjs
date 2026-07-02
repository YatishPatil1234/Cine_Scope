import fs from "fs";

const svg = (size, rx) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${rx}" fill="#6366f1"/>
  <text x="${size/2}" y="${size*0.65}" font-family="system-ui,sans-serif" font-size="${size*0.5}" font-weight="900" fill="white" text-anchor="middle">C</text>
</svg>`;

fs.mkdirSync("public/icons", { recursive: true });
fs.writeFileSync("public/icons/icon-192.svg", svg(192, 32));
fs.writeFileSync("public/icons/icon-512.svg", svg(512, 80));

// Write minimal 1x1 PNG placeholders so the manifest doesn't 404
// Real PNG icons can be replaced later — browsers also accept SVG
const png1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);
fs.writeFileSync("public/icons/icon-192.png", png1x1);
fs.writeFileSync("public/icons/icon-512.png", png1x1);

console.log("Icons generated in public/icons/");
