/**
 * sync-clients.js
 * 
 * Script otomatis untuk sinkronisasi daftar klien dari utils/sites.js
 * ke qc/config/clients.js agar tidak perlu double input.
 * 
 * Jalankan: npm run qc:sync
 * 
 * Cara kerja:
 * 1. Membaca utils/sites.js sebagai teks
 * 2. Parsing semua tag, roundTrip, dan connectingRes
 * 3. Membandingkan dengan qc/config/clients.js yang ada
 * 4. Melaporkan klien baru / yang berubah / yang dihapus
 * 5. Menulis ulang qc/config/clients.js secara otomatis
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITES_PATH = path.join(__dirname, "..", "utils", "sites.js");
const CLIENTS_PATH = path.join(__dirname, "config", "clients.js");

// Nama tampilan khusus yang tidak bisa di-generate dari tag
const DISPLAY_NAME_OVERRIDES = {
  "@ans": "ANS",
  "@aoshuttle": "AO Shuttle",
  "@ats": "ATS",
  "@besttrans": "Best Trans",
  "@btm": "BTM",
  "@ctu": "CTU",
  "@harumbsi": "Harum BSI",
  "@kpm": "KPM",
  "@kupuayu": "Kupu Ayu",
  "@mrtrans": "MR Trans",
  "@mstrans": "MS Trans",
  "@putraremaja": "Putra Remaja",
  "@royalkencana": "Royal Kencana",
  "@sariharum": "Sari Harum",
  "@wbtrans": "WB Trans",
  "@wisatakomodo": "Wisata Komodo",
  "@yantigroup": "Yanti Group",
  "@ztrans": "Z Trans",
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function parseSitesFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const clients = [];

  // Match each site object block: { tag: '@xxx', ..., roundTrip: true/false, connectingRes: true/false }
  const siteBlocks = content.split(/\n\s*\{/).slice(1); // split by opening brace, skip first chunk (imports)

  for (const block of siteBlocks) {
    const tagMatch = block.match(/tag:\s*['"](@\w+)['"]/);
    const roundTripMatch = block.match(/roundTrip:\s*(true|false)/);
    const connectingMatch = block.match(/connectingRes:\s*(true|false)/);

    if (tagMatch) {
      const tag = tagMatch[1];
      const id = tag.replace("@", "");
      const name = DISPLAY_NAME_OVERRIDES[tag] || capitalize(id);
      const roundTrip = roundTripMatch ? roundTripMatch[1] === "true" : false;
      const connecting = connectingMatch ? connectingMatch[1] === "true" : false;

      clients.push({ id, name, tag, oneWay: true, roundTrip, connecting });
    }
  }

  return clients;
}

function parseExistingClients(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, "utf-8");
  const clients = [];

  const matches = content.matchAll(/\{\s*id:\s*"(\w+)",\s*name:\s*"([^"]+)",\s*tag:\s*"(@\w+)",\s*oneWay:\s*(true|false),\s*roundTrip:\s*(true|false),\s*connecting:\s*(true|false)/g);

  for (const match of matches) {
    clients.push({
      id: match[1],
      name: match[2],
      tag: match[3],
      oneWay: match[4] === "true",
      roundTrip: match[5] === "true",
      connecting: match[6] === "true",
    });
  }

  return clients;
}

function generateClientsFile(clients) {
  const lines = clients.map(c =>
    `  { id: "${c.id}", name: "${c.name}", tag: "${c.tag}", oneWay: ${c.oneWay}, roundTrip: ${c.roundTrip}, connecting: ${c.connecting} },`
  );

  return `export const clients = [\n${lines.join("\n")}\n];\n`;
}

function sync() {
  console.log("🔄 Syncing clients from utils/sites.js → qc/config/clients.js\n");

  if (!fs.existsSync(SITES_PATH)) {
    console.error("❌ File tidak ditemukan: utils/sites.js");
    process.exit(1);
  }

  const sitesClients = parseSitesFile(SITES_PATH);
  const existingClients = parseExistingClients(CLIENTS_PATH);

  const existingMap = new Map(existingClients.map(c => [c.id, c]));
  const sitesMap = new Map(sitesClients.map(c => [c.id, c]));

  // Find differences
  const added = [];
  const changed = [];
  const removed = [];

  for (const client of sitesClients) {
    const existing = existingMap.get(client.id);
    if (!existing) {
      added.push(client);
    } else if (
      existing.roundTrip !== client.roundTrip ||
      existing.connecting !== client.connecting
    ) {
      changed.push({ before: existing, after: client });
    }
  }

  for (const client of existingClients) {
    if (!sitesMap.has(client.id)) {
      removed.push(client);
    }
  }

  // Report
  if (added.length === 0 && changed.length === 0 && removed.length === 0) {
    console.log("✅ Sudah sinkron! Tidak ada perubahan.\n");
    console.log(`   Total klien: ${sitesClients.length}`);
    return;
  }

  if (added.length > 0) {
    console.log(`➕ Klien BARU (${added.length}):`);
    for (const c of added) {
      console.log(`   + ${c.name} (${c.tag}) | RT:${c.roundTrip} | CN:${c.connecting}`);
    }
    console.log("");
  }

  if (changed.length > 0) {
    console.log(`🔀 Kapabilitas BERUBAH (${changed.length}):`);
    for (const { before, after } of changed) {
      console.log(`   ~ ${after.name} (${after.tag})`);
      if (before.roundTrip !== after.roundTrip) {
        console.log(`     roundTrip: ${before.roundTrip} → ${after.roundTrip}`);
      }
      if (before.connecting !== after.connecting) {
        console.log(`     connecting: ${before.connecting} → ${after.connecting}`);
      }
    }
    console.log("");
  }

  if (removed.length > 0) {
    console.log(`➖ Klien DIHAPUS dari sites.js (${removed.length}):`);
    for (const c of removed) {
      console.log(`   - ${c.name} (${c.tag})`);
    }
    console.log("");
  }

  // Write updated file
  const output = generateClientsFile(sitesClients);
  fs.writeFileSync(CLIENTS_PATH, output, "utf-8");

  console.log(`✅ qc/config/clients.js berhasil diperbarui!`);
  console.log(`   Total klien: ${sitesClients.length}`);
  console.log(`   Ditambah: ${added.length} | Diubah: ${changed.length} | Dihapus: ${removed.length}`);
}

sync();
