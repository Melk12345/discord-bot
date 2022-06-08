import DiscordJS, { Intents, Message } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

client.on('ready', () => {
    console.log('The bot is online');
})

client.on('messageCreate', () => {
    if (Message.content === 'ping') {
        Message.reply({
            content: 'pong',
        })
    }
})

client.login(process.env.TOKEN);

