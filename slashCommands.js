// slashCommands.js
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

console.log('🔍 Loaded CLIENT_ID:', CLIENT_ID);
console.log('🔍 Loaded TOKEN:', TOKEN ? TOKEN.slice(0, 10) + '...' : '❌ MISSING');

if (!TOKEN || !CLIENT_ID) {
  console.error('❌ Missing DISCORD_BOT_TOKEN or CLIENT_ID in env.');
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName('helpmint')
    .setDescription('Show the Mint Bot help menu'),

  new SlashCommandBuilder()
    .setName('trackmint')
    .setDescription('Start tracking a contract')
    .addStringOption(opt => opt.setName('name').setDescription('Name for this contract').setRequired(true))
    .addStringOption(opt => opt.setName('address').setDescription('Contract address').setRequired(true))
    .addNumberOption(opt => opt.setName('price').setDescription('Mint price (number)').setRequired(true))
    .addStringOption(opt => opt.setName('token').setDescription('Token used to mint').setRequired(false)),

  new SlashCommandBuilder()
    .setName('untrackmint')
    .setDescription('Stop tracking a contract')
    .addStringOption(opt => opt.setName('name').setDescription('Contract name to stop').setRequired(true)),

  new SlashCommandBuilder()
    .setName('channels')
    .setDescription('Show all alert channels for a contract')
    .addStringOption(opt => opt.setName('name').setDescription('Contract name').setRequired(true)),

  new SlashCommandBuilder()
    .setName('untrackchannel')
    .setDescription('Remove this channel from a contract’s alerts')
    .addStringOption(opt => opt.setName('name').setDescription('Contract name').setRequired(true)),

  new SlashCommandBuilder()
    .setName('mintest')
    .setDescription('Simulate a mint for test/debugging'),

  new SlashCommandBuilder()
    .setName('selltest')
    .setDescription('Simulate a token-based sale alert'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('🌐 Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered globally!');
  } catch (err) {
    console.error('❌ Error registering slash commands:', err);
  }
})();
