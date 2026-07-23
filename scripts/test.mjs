import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Script } from "node:vm";

const projectRoot = resolve(import.meta.dirname, "..");
const html = await readFile(resolve(projectRoot, "index.html"), "utf8");
const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

if (!scriptMatch) {
  throw new Error("index.html 中未找到脚本");
}

new Script(scriptMatch[1]);

for (const requiredText of [
  "拼多多报名原价计算器",
  "计算报名原价",
  "所有SKU精确匹配"
]) {
  if (!html.includes(requiredText)) {
    throw new Error(`页面缺少关键内容：${requiredText}`);
  }
}

console.log("页面结构、中文编码与脚本语法检查通过");
