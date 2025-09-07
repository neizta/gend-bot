// Routes button interactions by customId prefix.
// Here we handle nigend:create and nigend:delete.
// Database calls are not implemented yet; you can plug them in later.

import type { Client, ButtonInteraction } from 'discord.js';

export function wireComponentHandler(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    try {
      // Simple prefix-based routing
      if (customId === 'nigend:create') {
        // TODO: open a modal, collect fields, and insert into DB
        await interaction.reply({ content: 'Création d’un Nigend — (à implémenter).', ephemeral: true });
        return;
      }

      if (customId === 'nigend:delete') {
        // TODO: show a select menu or confirm deletion, then delete in DB
        await interaction.reply({ content: 'Suppression d’un Nigend — (à implémenter).', ephemeral: true });
        return;
      }
    } catch (err) {
      console.error('[components] Error:', err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
      }
    }
  });
}
