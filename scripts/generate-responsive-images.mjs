import assert from "node:assert/strict";
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputRoot = path.join(projectRoot, "public/images/responsive");

const inventory = [
  ...[
    "joy-health-balanced-meal.webp",
    "joy-health-garden-recovery.webp",
    "joy-health-morning.webp",
  ].map((filename) => ({
    source: `public/images/${filename}`,
    outputDirectory: "hero",
    widths: [640, 1024, 1672],
    encoding: "display",
  })),
  ...[
    "biomega-product.png",
    "cellsentials-product.png",
    "clear-protein-creatine-product.png",
    "coquinone-product.png",
    "core-aminos-product.png",
    "healthpak-product.png",
    "magnecal-d-product.png",
    "procosa-product.png",
  ].map((filename) => ({
    source: `public/images/usana/${filename}`,
    outputDirectory: "usana",
    widths: [320, 640, 960],
    encoding: "display",
  })),
  ...[
    "biomega-label.png",
    "cellsentials-label.png",
    "clear-protein-creatine-label.png",
    "coquinone-label.png",
    "core-aminos-label.png",
    "healthpak-label.png",
    "magnecal-d-label.png",
    "procosa-label.png",
  ].map((filename) => ({
    source: `public/images/usana/${filename}`,
    outputDirectory: "usana",
    widths: [320, 640, 960],
    encoding: "label",
  })),
].sort((left, right) => left.source.localeCompare(right.source));

function outputPath(item, width) {
  const basename = path.basename(item.source, path.extname(item.source));
  return path.join(outputRoot, item.outputDirectory, `${basename}-${width}.webp`);
}

function generatedWidths(item, sourceWidth) {
  return [...new Set([
    ...item.widths.filter((width) => width <= sourceWidth),
    sourceWidth,
  ])].sort((left, right) => left - right);
}

async function sourceMetadata(item) {
  const sourcePath = path.join(projectRoot, item.source);
  const metadata = await sharp(sourcePath).metadata();

  assert.ok(
    metadata.format === "png" || metadata.format === "webp",
    `Unsupported source image: ${item.source}`,
  );
  assert.ok(metadata.width && metadata.height, `Invalid source image: ${item.source}`);

  return { ...metadata, sourcePath };
}

async function generate() {
  for (const item of inventory) {
    const metadata = await sourceMetadata(item);
    const widths = generatedWidths(item, metadata.width);

    assert.ok(widths.length > 0, `No non-upscaled widths for ${item.source}`);
    for (const width of widths) {
      const destination = outputPath(item, width);
      await mkdir(path.dirname(destination), { recursive: true });
      const pipeline = sharp(metadata.sourcePath).rotate().resize({
        width,
        withoutEnlargement: true,
      });

      await pipeline
        .webp(
          item.encoding === "label"
            ? {
                nearLossless: true,
                quality: 100,
                alphaQuality: 100,
                effort: 6,
              }
            : {
                quality: 94,
                alphaQuality: 100,
                smartSubsample: true,
                effort: 6,
              },
        )
        .toFile(destination);
    }
  }
}

async function listFiles(directory) {
  const entries = await readdir(directory, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name))
    .sort();
}

async function check() {
  const expected = new Set();

  for (const item of inventory) {
    const metadata = await sourceMetadata(item);
    const widths = generatedWidths(item, metadata.width);
    const originalSize = (await stat(metadata.sourcePath)).size;
    const comparisonWidth = Math.max(...widths.filter((width) => width <= 640));

    for (const width of widths) {
      const destination = outputPath(item, width);
      expected.add(destination);

      const [generatedMetadata, generatedFile] = await Promise.all([
        sharp(destination).metadata(),
        stat(destination),
      ]);
      const expectedHeight = Math.round((metadata.height * width) / metadata.width);

      assert.ok(generatedFile.size > 0, `Empty generated image: ${destination}`);
      assert.equal(generatedMetadata.format, "webp", destination);
      assert.equal(generatedMetadata.width, width, destination);
      assert.ok(
        Math.abs(generatedMetadata.height - expectedHeight) <= 1,
        `Aspect ratio changed for ${destination}`,
      );
      assert.ok(
        generatedMetadata.width <= metadata.width &&
          generatedMetadata.height <= metadata.height,
        `Generated image is larger than its source: ${destination}`,
      );

      if (width === comparisonWidth) {
        assert.ok(
          generatedFile.size < originalSize,
          `Display variant is not smaller than its source: ${destination}`,
        );
      }
    }
  }

  const actual = await listFiles(outputRoot);
  assert.deepEqual(new Set(actual), expected, "Unexpected responsive image output");
  console.log(`Verified ${expected.size} responsive image variants.`);
}

if (process.argv.includes("--check")) {
  await check();
} else {
  await generate();
  await check();
}
