// Slash command: /nigend
// Shows an embed with two buttons: create and delete a Nigend.
// French strings for user-facing text; English comments for code.

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import type { CommandModule } from '../types/Commands.js';

const data = new SlashCommandBuilder()
  .setName('nigend') // command name in French as requested
  .setDescription('Ouvre un panneau pour gérer les Nigend (créer/supprimer).');

async function execute(interaction: ChatInputCommandInteraction) {
  const embed = new EmbedBuilder()
    .setTitle('Gestion des Nigend')
    .setDescription(
      [
        'Utilise les boutons ci-dessous pour **créer** ou **supprimer** un Nigend.',
        'Tu peux annuler à tout moment en fermant ce panneau.',
      ].join('\n')
    )
    .setColor(0x2b6cb0);

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('nigend:create')
      .setLabel('Créer un Nigend')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('nigend:delete')
      .setLabel('Supprimer un Nigend')
      .setStyle(ButtonStyle.Danger),
  );

  await interaction.reply({
    embeds: [embed],
    components: [buttons],
    ephemeral: true, // keep panel private to the triggering user
  });
}

export default { data, execute } satisfies CommandModule;
