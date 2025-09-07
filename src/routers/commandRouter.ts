import { Collection, REST, Routes, type Client } from 'discord.js';
import type { CommandModule } from '../types/Commands.js';
import nigend from '../commands/nigend.js';

// ✅ NEW: import authorization helper
import { canExecuteCommand } from '../lib/authz.js';

type CommandMap = Collection<string, CommandModule>;

export function buildCommandMap(): CommandMap {
  const commands = new Collection<string, CommandModule>();
  commands.set(nigend.data.name, nigend);
  return commands;
}

export async function registerSlashCommands(clientId: string, token: string, guildId?: string) {
  const rest = new REST({ version: '10' }).setToken(token);

  // If you want to force guild-only execution at API level, you can add setDMPermission(false) in each command.
  const commandBodies = [nigend.data.toJSON()];

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandBodies });
    console.log('[commands] Guild commands deployed.');
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body: commandBodies });
    console.log('[commands] Global commands deployed (can take up to ~1h to appear).');
  }
}

export function wireCommandHandler(client: Client, commandMap: CommandMap) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commandMap.get(interaction.commandName);
    if (!command) return;

    // ✅ NEW: authz check
    const authz = canExecuteCommand(interaction);
    if (!authz.ok) {
      try {
        await interaction.reply({
          content: authz.reason ?? "Tu n'as pas la permission d'exécuter cette commande.",
          ephemeral: true,
        });
      } catch {}
      return;
    }

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
