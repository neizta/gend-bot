// Command-to-roles authorization table.
// Put here the role IDs allowed to run each command, in addition to admins.
// NOTE: use raw Discord role IDs as strings.

export const commandPermissions: Record<
  string,
  { allowedRoleIds: string[]; allowAdmins: boolean }
> = {
  // Example for /nigend:
  nigend: {
    allowedRoleIds: [
      "1360903273707737209", // Rôle: Commandant de Région
      "1360903273682440221", // Rôle: Commandant Adjoint de Région
      "1360903273682440220", // Rôle: Commandant de Groupement
      "1360903273682440219", // Rôle: Commandant Adjoint de Groupement
      "1360903273682440216", // Rôle: Commandant de Compagnie
      "1360903273682440215", // Rôle: Commandant Adjoint de Compagnie
      "1360903273682440214", // Rôle: Commandant de Brigade
      "1360903273682440213", // Rôle: Commandant Adjoint de Brigade
      "1360903273682440221", // Rôle: Commandant Adjoint de Région
      "1360903273615458526", // Rôle: Expert d'Intervention Professionnel
      "1360903273615458527", // Rôle: Instructeur d'Intervention Professionnel
      "1360903273594228867", // Rôle: Moniteur d'Intervention Professionnel


    ],
    allowAdmins: true, // admins can always run
  },

  // You can add more commands below as you implement them:
  // autrecommande: { allowedRoleIds: ["..."], allowAdmins: true },
};
