import 'dotenv/config';
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import mysql from 'mysql2/promise';

// 1) DB pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

// 2) Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 3) Définition de commandes (ex : /ping et /cad)
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Renvoie Pong!'),

  new SlashCommandBuilder()
    .setName('cad')
    .setDescription('Exemple: liste des patrouilles enregistrées')
].map(c => c.toJSON());

// 4) Déploiement des slash commands (au démarrage)
async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  if (process.env.DISCORD_GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID!, process.env.DISCORD_GUILD_ID!),
      { body: commands }
    );
    console.log('Slash commands guild déployées.');
  } else {
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands }
    );
    console.log('Slash commands globales déployées (prennent ~1h à apparaître).');
  }
}

// 5) Listeners
client.once('ready', () => {
  console.log(`Connecté en tant que ${client.user?.tag}.`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'cad') {
    try {
      const [rows] = await pool.query('SELECT id, nom_patrouille, chef_groupe FROM patrouilles ORDER BY id DESC LIMIT 10');
      const lines = (rows as any[]).map(r => `#${r.id} — ${r.nom_patrouille} (Chef: ${r.chef_groupe})`).join('\n') || 'Aucune patrouille.';
      await interaction.reply('**Patrouilles récentes :**\n' + lines);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Erreur lors de la lecture en base.', ephemeral: true });
    }
  }
});

// 6) Boot
(async () => {
  try {
    await registerCommands();
    await client.login(process.env.DISCORD_TOKEN);
  } catch (e) {
    console.error('Erreur de démarrage :', e);
    process.exit(1);
  }
})();