// Routes button + user-select interactions for Nigend creation/deletion.

import {
  ActionRowBuilder,
  UserSelectMenuBuilder,
  EmbedBuilder,
  type Client,
  MessageFlags,
} from 'discord.js';
import { generateUniqueNigend, extractFullnameFromDisplayName, insertNigendRecord } from '../lib/nigend.js';

export function wireComponentHandler(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    try {
      // 1) Button: "Créer un Nigend" -> show user select
      if (interaction.isButton()) {
        if (interaction.customId === 'nigend:create') {
          const row = new ActionRowBuilder<UserSelectMenuBuilder>().addComponents(
            new UserSelectMenuBuilder()
              .setCustomId('nigend:create:pickuser')
              .setPlaceholder('Sélectionne un membre pour créer son NIGEND')
              .setMinValues(1)
              .setMaxValues(1)
          );

          await interaction.reply({
            content: 'Sélectionne le membre ci-dessous :',
            components: [row],
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        if (interaction.customId === 'nigend:delete') {
          // TODO: implement delete flow (select target, confirm, delete)
          await interaction.reply({
            content: 'Suppression d’un Nigend — (à implémenter).',
            flags: MessageFlags.Ephemeral
          });
          return;
        }
      }

      // 2) User select: create the Nigend entry
      if (interaction.isUserSelectMenu()) {
        if (interaction.customId === 'nigend:create:pickuser') {
          const userId = interaction.values[0]; // selected user snowflake

          if (!interaction.guild) {
            await interaction.update({ content: 'Action invalide hors serveur.', components: [], embeds: [] });
            return;
          }

          const member = await interaction.guild.members.fetch(userId);

          const assigned = member.displayName;                 // e.g. "CEN | Yanis Bellei"
          const fullname = extractFullnameFromDisplayName(assigned); // "Yanis Bellei"
          const nigend = await generateUniqueNigend();

          await insertNigendRecord({
            discordId: userId,
            nigend,
            fullname,
            assigned,
            phone: null,
          });

          const embed = new EmbedBuilder()
            .setTitle('NIGEND créé ✅')
            .setColor(0x16a34a)
            .setDescription(
              [
                `**Membre :** <@${userId}>`,
                `**NIGEND :** \`${nigend}\``,
                `**Nom complet :** ${fullname}`,
                `**Affectation (Discord) :** ${assigned}`,
                `**Téléphone :** (non renseigné)`,
              ].join('\n')
            );

          // Replace the selector with a success message
          await interaction.update({
            content: 'Création effectuée.',
            components: [],
            embeds: [embed],
          });

          return;
        }
      }
    } catch (err) {
      console.error('[components] Error:', err);
      // Try to reply/update gracefully
      try {
        if (interaction.isRepliable()) {
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'Une erreur est survenue.', flags: MessageFlags.Ephemeral });
          }
        }
      } catch {}
    }
  });
}