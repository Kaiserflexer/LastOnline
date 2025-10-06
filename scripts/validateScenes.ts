import fs from "fs";
import path from "path";
import Ajv from "ajv";
import schema from "../docs/codex/schema-min.json";
import { ensureJsonArray } from "./ensureJsonArray";

const SCENE_DIR = path.resolve(process.cwd(), "src/scenes");

function loadScenes(filePath: string): unknown[] {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(ensureJsonArray(raw));
}

function main() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema as any);
  const files = fs.readdirSync(SCENE_DIR).filter((file) => file.endsWith(".json"));
  let hasError = false;

  for (const file of files) {
    const fullPath = path.join(SCENE_DIR, file);
    const data = loadScenes(fullPath);
    const valid = validate(data);
    if (!valid) {
      console.error(`Schema errors in ${file}:`, validate.errors);
      hasError = true;
    } else {
      console.log(`${file}: OK (${(data as unknown[]).length} scenes)`);
    }
  }

  if (hasError) {
    process.exit(1);
  }
}

main();
