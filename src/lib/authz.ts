// Small authorization utility.
// Checks if a guild user can execute a command based on Admin or role IDs.

import {
  ChatInputCommandInteraction,
  GuildMember,
  PermissionsBitField,
} from 'discord.js';
import { commandPermissions } from '../config/permissions.js';

export function canExecuteCommand(interaction: ChatInputCommandInteraction): {
  ok: boolean;
  reason?: string;
} {
  const name = interaction.commandName;
  const cfg = commandPermissions[name];

  // If no config for this command, default to admins only for safety,
  // or you can choose to default to allow all (not recommended).
  if (!cfg) {
    return {
      ok: false,
      reason: "Cette commande n'est pas configurée côté permissions.",
    };
  }

  if (!interaction.inGuild() || !interaction.member) {
    return { ok: false, reason: "Cette commande doit être utilisée sur un serveur." };
  }

  const member = interaction.member as GuildMember;

  // Admins bypass if allowed
  if (
    cfg.allowAdmins &&
    member.permissions.has(PermissionsBitField.Flags.Administrator)
  ) {
    return { ok: true };
  }

  // Role-based allow
  if (cfg.allowedRoleIds.length > 0) {
    const hasAllowedRole = cfg.allowedRoleIds.some((rid) =>
      member.roles.cache.has(rid)
    );
    if (hasAllowedRole) return { ok: true };
  }

  return {
    ok: false,
    reason:
      "Tu n'as pas la permission d'exécuter cette commande.",
  };
}
