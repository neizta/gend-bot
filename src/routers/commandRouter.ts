// Simple command router loading explicit command modules.
// If you want dynamic imports, you can expand later.

import { Collection, REST, Routes, type Client } from 'discord.js';
import type { CommandModule } from '../types/Commands.js';
import nigend from '../commands/nigend.js';

type CommandMap = Collection<string, CommandModule>;

// Build command collection (add more here later)
export function buildCommandMap(): CommandMap {
  const commands = new Collection<string, CommandModule>();
  commands.set(nigend.data.name, nigend);
  return commands;
}

// Register slash commands to Discord (guild if provided, else global)
export async function registerSlashCommands(clientId: string, token: string, guildId?: string) {
  const rest = new REST({ version: '10' }).setToken(token);

  // Collect JSON bodies from command modules
  const commandBodies = [nigend.data.toJSON()];

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandBodies });
    console.log('[commands] Guild commands deployed.');
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body: commandBodies });
    console.log('[commands] Global commands deployed (can take up to ~1h to appear).');
  }
}

// Attach interactionCreate listener for chat-input commands
export function wireCommandHandler(client: Client, commandMap: CommandMap) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commandMap.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`[commands] Error in ${interaction.commandName}:`, err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
      }
    }
  });
}
