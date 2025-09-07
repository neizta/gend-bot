// Entrypoint: sets up client, registers commands, wires routers.
// Removes legacy /ping and /cad, uses /nigend instead.

import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
// If you need DB later, you can re-introduce the pool here.
// import mysql from 'mysql2/promise';

import { buildCommandMap, registerSlashCommands, wireCommandHandler } from './routers/commandRouter.js';
import { wireComponentHandler } from './routers/componentRouter.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', () => {
  console.log(`Connected as ${client.user?.tag}`);
});

(async () => {
  try {
    const token = process.env.DISCORD_TOKEN!;
    const clientId = process.env.DISCORD_CLIENT_ID!;
    const guildId = process.env.DISCORD_GUILD_ID || undefined;

    // Register slash commands (guild if provided, otherwise global)
    await registerSlashCommands(clientId, token, guildId);

    // Wire routers
    const commandMap = buildCommandMap();
    wireCommandHandler(client, commandMap);
    wireComponentHandler(client);

    await client.login(token);
  } catch (e) {
    console.error('Fatal startup error:', e);
    process.exit(1);
  }
})();
