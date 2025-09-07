// Generic shape for a slash command module.
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface CommandModule {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
