const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");

const config = require("./config.json");

const client = new Discord.Client();

client.login(config.token);

client.on("ready", () => {
     // collection of commands that your bot will recognize
     client.commands = new Discord.Collection();
     // /source/ directory
     let srcDir = path.resolve(__dirname, "./source");
     // use file system (fs) to load each directory
     let modules = fs.readdirSync(srcDir).filter(file => fs.statSync(
         path.join(srcDir, file)).isDirectory());
 
     // loop through each directory and
     modules.forEach(module=>{
         // tell us where it's looking
         console.log("Loading Folder: " + module);
 
         // find the js files
         let commandFiles = fs.readdirSync(path.resolve(`${srcDir}/${module}`)).
             filter(file => !fs.statSync(path.resolve(srcDir, module, file)).isDirectory()).
             filter(file => file.endsWith('.js'));
 
         // loop through each js file in the directory
         commandFiles.forEach((f, i) => {
             // get the file
             var cmds = require(`${srcDir}/${module}/${f}`);
             // if it has a config
             if (cmds.config) {
                 // print it out and
                 console.log(` =>Loaded file ${module}/${f}`);
                 // add it to our collection of commands
                 client.commands.set(cmds.config.command, cmds);
             }
         });
     });
    console.log("The bot is online.");
});

// Every message we get runs through here
client.on("message", msg => {
    if (!msg.content.startsWith("!")) return;
    let cont = msg.content.slice(1).split(" ");
    let args = cont.slice(1);
    let cmd = client.commands.get(cont[0].toLowerCase());
    if (cmd) cmd.run(client, msg, args);
});