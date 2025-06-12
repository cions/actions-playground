import * as path from "node:path";

export function printEnvvars(): void {
  const names = Object.keys(process.env).sort();
  for (const name of names) {
    const value = process.env[name] ?? "";
    if (value.split(path.delimiter).every((x) => path.isAbsolute(x))) {
      const formatted = value.replaceAll(
        path.delimiter,
        "\n" + " ".repeat(name.length) + path.delimiter,
      );
      process.stdout.write(`${name}=${formatted}\n`);
    } else {
      process.stdout.write(`${name}=${value}\n`);
    }
  }
}
