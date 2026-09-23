import { checkbox, select, confirm, input } from "@inquirer/prompts";
import { clients } from "./config/clients.js";
import { scenarios } from "./config/scenarios.js";

export async function askEnvironment(currentEnv = "staging") {
  return select({
    message: "Select target environment:",
    choices: [
      { name: "Staging (staging)", value: "staging" },
      { name: "Production (production)", value: "production" },
    ],
    default: currentEnv,
  });
}

export async function askClients(defaultClientIds = [], options = {}) {
  const selectedMap = new Map();
  let selectedEnv = options.initialEnv || "staging";

  for (const id of defaultClientIds) {
    const found = clients.find(c => c.id === id);
    if (found) selectedMap.set(found.id, found);
  }

  while (true) {
    const selectedNames = Array.from(selectedMap.values()).map(c => c.name);
    const summary = selectedNames.length > 0 ? selectedNames.join(", ") : "None";

    const roundTripCount = clients.filter(c => c.roundTrip).length;
    const connectingCount = clients.filter(c => c.connecting).length;
    const oneWayCount = clients.filter(c => c.oneWay).length;

    const choices = [
      { name: "📋 Select / Edit from client list (Interactive)", value: "list" },
      { name: "🔍 Search / Paste client list (Batch Input)", value: "batch" },
      { name: `⚡ Filter by capability: Round Trip (${roundTripCount}) / Connecting (${connectingCount}) / One Way (${oneWayCount})`, value: "capability" },
      { name: `🌐 Change target environment [Current: ${selectedEnv}]`, value: "env" },
    ];

    if (selectedMap.size > 0) {
      choices.push({ name: "🗑️ Clear current selection", value: "clear" });
      choices.push({ name: `✅ Done with client selection (${selectedMap.size} selected: ${summary})`, value: "done" });
    }

    const action = await select({
      message: `Client Selection [Current: ${summary} | Env: ${selectedEnv}]. Choose an option:`,
      choices,
    });

    if (action === "done") {
      return {
        selectedClients: Array.from(selectedMap.values()),
        selectedEnv,
      };
    }

    if (action === "env") {
      selectedEnv = await askEnvironment(selectedEnv);
      console.log(`\n🌐 Target environment set to: ${selectedEnv}\n`);
      continue;
    }

    if (action === "clear") {
      selectedMap.clear();
      console.log("\n🗑️ Selection cleared.\n");
      continue;
    }

    if (action === "list") {
      const chosen = await checkbox({
        message: "Select client(s)",
        choices: clients.map(c => ({
          name: c.name,
          value: c,
          checked: selectedMap.has(c.id),
        })),
        required: selectedMap.size === 0,
      });

      selectedMap.clear();
      for (const c of chosen) {
        selectedMap.set(c.id, c);
      }

      if (selectedMap.size > 0) {
        console.log(`\n✅ Selected ${selectedMap.size} client(s): ${Array.from(selectedMap.values()).map(c => c.name).join(", ")}\n`);
        return {
          selectedClients: Array.from(selectedMap.values()),
          selectedEnv,
        };
      }
    }

    if (action === "capability") {
      const capability = await select({
        message: "Select capability to filter clients:",
        choices: [
          { name: `🔄 Supporting Round Trip (${roundTripCount} clients)`, value: "roundTrip" },
          { name: `🔗 Supporting Connecting Reservation (${connectingCount} clients)`, value: "connecting" },
          { name: `➡️ Supporting One Way (${oneWayCount} clients)`, value: "oneWay" },
        ],
      });

      const filtered = clients.filter(c => Boolean(c[capability]));

      const picked = await checkbox({
        message: `Clients supporting ${capability} (${filtered.length} available):`,
        choices: filtered.map(c => ({
          name: c.name,
          value: c,
          checked: selectedMap.has(c.id),
        })),
      });

      const pickedIds = new Set(picked.map(c => c.id));
      for (const c of filtered) {
        if (pickedIds.has(c.id)) {
          selectedMap.set(c.id, c);
        } else {
          selectedMap.delete(c.id);
        }
      }

      console.log(`\n✅ Updated client selection (${selectedMap.size}): ${Array.from(selectedMap.values()).map(c => c.name).join(", ")}\n`);
    }

    if (action === "batch") {
      const rawInput = await input({
        message: "Search / Paste client names or tags (comma, space, or newline separated):",
        validate: (value) => value.trim().length > 0 || "Please enter or paste at least one client name",
      });

      const tokens = rawInput
        .split(/[\r\n,;\t]+/)
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const matched = [];
      const unmatched = [];

      for (const token of tokens) {
        const term = token.toLowerCase();
        const found = clients.find(c =>
          c.name.toLowerCase() === term ||
          c.id.toLowerCase() === term ||
          (c.tag && c.tag.toLowerCase() === term)
        ) || clients.find(c =>
          c.name.toLowerCase().includes(term) ||
          (c.tag && c.tag.toLowerCase().includes(term))
        );

        if (found) {
          if (!matched.some(m => m.id === found.id)) {
            matched.push(found);
          }
        } else {
          unmatched.push(token);
        }
      }

      if (matched.length > 0) {
        for (const c of matched) {
          selectedMap.set(c.id, c);
        }
        console.log(`\n✅ Matched ${matched.length} client(s): ${matched.map(c => c.name).join(", ")}`);
      }

      if (unmatched.length > 0) {
        console.log(`⚠️ Could not match client(s) for: "${unmatched.join('", "')}"`);
      }

      console.log(`\n✅ Updated client selection (${selectedMap.size}): ${Array.from(selectedMap.values()).map(c => c.name).join(", ")}\n`);
    }
  }
}

export async function askScenario(selectedClients, defaultScenarioIds = []) {
  const availableScenarios = scenarios.filter(scenario =>
    selectedClients.some(client => scenario.supports(client))
  );

  return checkbox({
    message: "Select scenario(s)",
    choices: availableScenarios.map(scenario => ({
      name: scenario.name,
      value: scenario,
      checked: defaultScenarioIds.includes(scenario.id),
    })),
    required: true,
  });
}

export async function askBrowser(defaultBrowser = "chromium") {
  return select({
    message: "Select browser",
    choices: [
      { name: "Chromium (Desktop Chrome)", value: "chromium" },
      { name: "Firefox (Desktop Firefox)", value: "firefox" },
      { name: "Microsoft Edge", value: "Microsoft Edge" },
    ],
    default: defaultBrowser,
  });
}

export async function askExecutionMode(defaultMode = "headed") {
  return select({
    message: "Select execution mode",
    choices: [
      { name: "Headed (Browser UI visible)", value: "headed" },
      { name: "Headless (Background execution)", value: "headless" },
    ],
    default: defaultMode,
  });
}

export async function askAdvancedOptions(defaults = {}) {
  const workersChoice = await select({
    message: "Select worker concurrency (--workers)",
    choices: [
      { name: "1 Worker (Sequential / Default)", value: 1 },
      { name: "2 Workers (Parallel)", value: 2 },
      { name: "4 Workers (Fast Parallel)", value: 4 },
    ],
    default: defaults.workers ?? 1,
  });

  const retriesChoice = await select({
    message: "Select retry attempts (--retries)",
    choices: [
      { name: "0 Retries (Default)", value: 0 },
      { name: "1 Retry", value: 1 },
      { name: "2 Retries", value: 2 },
    ],
    default: defaults.retries ?? 2,
  });

  const autoOpenReport = await confirm({
    message: "Auto open HTML report after test finishes?",
    default: defaults.autoOpenReport ?? true,
  });

  return {
    workers: workersChoice,
    retries: retriesChoice,
    autoOpenReport,
  };
}

export async function askInitialAction({ hasLastRun, presets }) {
  const choices = [];

  if (hasLastRun) {
    choices.push({ name: "⚡ Quick Run Last Selection", value: "last_run" });
  }

  if (presets && presets.length > 0) {
    choices.push({ name: `⭐ Use Saved Preset (${presets.length} available)`, value: "preset" });
  }

  choices.push({ name: "🎯 New Custom Selection", value: "custom" });

  if (presets && presets.length > 0) {
    choices.push({ name: "🗑️ Delete a Saved Preset", value: "delete_preset" });
  }

  choices.push({ name: "🚪 Exit QC Runner", value: "exit" });

  return select({
    message: "What would you like to do?",
    choices,
  });
}

export async function askPresetSelection(presets) {
  return select({
    message: "Select a Preset to run",
    choices: presets.map(p => ({
      name: `⭐ ${p.name} [Clients: ${p.clientIds.join(", ")} | Env: ${p.env || "staging"} | Browser: ${p.browser} | Mode: ${p.mode}]`,
      value: p,
    })),
  });
}

export async function askConfirmationAction() {
  return select({
    message: "Choose an action",
    choices: [
      { name: "🚀 Run Playwright", value: "run" },
      { name: "📋 Dry Run / Print Command Only", value: "dry_run" },
      { name: "💾 Save as New Preset & Run", value: "save_and_run" },
      { name: "⚙️ Advanced Options (Workers / Retries / Report)", value: "advanced" },
      { name: "❌ Cancel", value: "cancel" },
    ],
  });
}

export async function askPresetName() {
  return input({
    message: "Enter preset name:",
    validate: (val) => val.trim().length > 0 || "Preset name cannot be empty",
  });
}

export async function askDeletePreset(presets) {
  if (!presets || presets.length === 0) return null;
  return select({
    message: "Select preset to delete",
    choices: [
      ...presets.map(p => ({ name: `🗑️ Delete "${p.name}"`, value: p.id })),
      { name: "⬅️ Back", value: null },
    ],
  });
}

export async function askPostRunAction() {
  return select({
    message: "What would you like to do next?",
    choices: [
      { name: "🔄 Return to Main Menu", value: "menu" },
      { name: "🚪 Exit QC Runner", value: "exit" },
    ],
  });
}