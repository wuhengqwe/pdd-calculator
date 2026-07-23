import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = resolve(projectRoot, "dist");
const serverRoot = resolve(outputRoot, "server");
const html = await readFile(resolve(projectRoot, "index.html"), "utf8");

await rm(outputRoot, { recursive: true, force: true });
await mkdir(serverRoot, { recursive: true });

const worker = `const HTML = ${JSON.stringify(html)};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/" && url.pathname !== "/index.html") {
      return new Response("Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }

    return new Response(HTML, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff",
        "referrer-policy": "strict-origin-when-cross-origin"
      }
    });
  }
};
`;

await writeFile(resolve(serverRoot, "index.js"), worker, "utf8");
