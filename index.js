const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const bot = new Discord.Client();

let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
let prefix = "?";

function format(amount) {
    return amount.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

bot.on("message", msg => {
    if (!msg.content.startsWith(prefix)) return;

    let cont = msg.content.slice(1).split(" ");
    let args = cont.slice(1);

    let sender = msg.author;
    if (!userData[sender.id + msg.guild.id]) userData[sender.id + msg.guild.id] = {};

    let userBalance = userData[sender.id + msg.guild.id].userAmount;
    if (!userBalance) userBalance = 0;

    let bankBalance = userData[sender.id + msg.guild.id].bankAmount;
    if (!bankBalance) bankBalance = 0;

    let lastDaily = userData[sender.id + msg.guild.id].lastUpdatedDaily;
    let timeRemaining = userData[sender.id + msg.guild.id].cooldownDaily;
    if (!lastDaily) {
        lastDaily = Date.now();
        timeRemaining = 0;
    }

    userData[sender.id + msg.guild.id].userAmount = userBalance;
    userData[sender.id + msg.guild.id].bankAmount = bankBalance;


    userData[sender.id + msg.guild.id].cooldownDaily = timeRemaining;
    userData[sender.id + msg.guild.id].lastUpdatedDaily = lastDaily;


    fs.writeFile('Storage/userData.JSON', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    })

    // test commands
    //#region 
    // ping
    if (msg.content === prefix + 'ping') {
        msg.channel.send("Pong!");
    }

    // set
    if (msg.content.startsWith(prefix + 'set')) {
        let amount = parseInt(args[0]);

        userBalance = amount;

        msg.channel.send("**" + msg.author.username + "**, your balance was set to __**" + format(Math.round(userBalance)) + "**__ currency!");

        userData[sender.id + msg.guild.id].userAmount = userBalance;

        fs.writeFile('Storage/userData.JSON', JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }
    //#endregion

    // economy commands
    //#region 
    // bal
    if (msg.content === prefix + 'bal') {
        msg.channel.send("**" + msg.author.username + "**, you have __**" + format(Math.round(userBalance)) + "**__ currency!");
    }

    //bank
    if (msg.content === prefix + 'bank') {
        msg.channel.send("**" + msg.author.username + "**, you have __**" + format(Math.round(bankBalance)) + "**__ currency in your bank!");
    }

    // deposit
    if (msg.content.startsWith(prefix + 'deposit')) {
        let depositAmount = args[0];

        if (depositAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough currency in your balance to deposit!"); 
            return;
        }

        if (!depositAmount) {
            msg.channel.send("Invalid command!\nPlease use this format !deposit [depositAmount/all/half/quarter/eighth]");
            return;
        }

        switch(args[0]) {
            case "all":
                depositAmount = userBalance;
                break;
            case "half":
                depositAmount = userBalance / 2;
                break;
            case "quarter":
                depositAmount = userBalance / 4;
                break;
            case "eighth":
                depositAmount = userBalance / 8;
                break;
            default:
                depositAmount = parseInt(args[0]);
                if (Number.isNaN(depositAmount)) {
                    msg.channel.send("Please enter a valid deposit amount!");
                }
        }

        userBalance -= depositAmount;
        bankBalance += depositAmount;

        msg.channel.send("**" + msg.author.username + "**, you deposited __**" + format(depositAmount) + "**__ currency to your bank!");

        userData[sender.id + msg.guild.id].userAmount = userBalance;
        userData[sender.id + msg.guild.id].bankAmount = bankBalance;

        fs.writeFile('Storage/userData.JSON', JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }

    // withdraw
    if (msg.content.startsWith(prefix + 'withdraw')) {
        let withdrawAmount = args[0];
    
        if (withdrawAmount > bankBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough currency in your bank to withdraw!"); 
            return;
        }
    
        if (!withdrawAmount) {
            msg.channel.send("Invalid command!\nPlease use this format !withdraw [withdrawAmount/all/half/quarter/eighth]");
            return;
        }
    
        switch(args[0]) {
            case "all":
                withdrawAmount = userBalance;
                break;
            case "half":
                withdrawAmount = userBalance / 2;
                break;
            case "quarter":
                withdrawAmount = userBalance / 4;
                break;
            case "eighth":
                withdrawAmount = userBalance / 8;
                break;
            default:
                withdrawAmount = parseInt(args[0]);
                if (Number.isNaN(withdrawAmount)) {
                    msg.channel.send("Please enter a valid withdraw amount!");
                }
        }
    
        userBalance += withdrawAmount;
        bankBalance -= withdrawAmount;
    
        msg.channel.send("**" + msg.author.username + "**, you withdrew __**" + format(withdrawAmount) + "**__ currency from your bank!");
    
        userData[sender.id + msg.guild.id].userAmount = userBalance;
        userData[sender.id + msg.guild.id].bankAmount = bankBalance;
    
        fs.writeFile('Storage/userData.JSON', JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }

    // daily
    if (msg.content === prefix + 'daily') {
        let amount = 5000;
        const now = Date.now();
        let delta = (now - lastDaily) / 1000;
        timeRemaining -= delta;

        if (timeRemaining <= 0) {
            timeRemaining = 79200;
            userBalance += amount;
            lastDaily = Date.now();

            let hours = Math.floor(timeRemaining / 3600); 
            let minutes = Math.floor((timeRemaining - (hours * 3600)) / 60); 
            let seconds = timeRemaining - (hours * 3600) - (minutes * 60);

            msg.channel.send("**" + msg.author.username + "**, __**" + format(amount) + "**__ currency was added to your balance!\n" +
            "Your next daily is in: __**" + Math.round(hours) + "H " + Math.round(minutes) + "M " + Math.round(seconds) + "S**__");

            userData[sender.id + msg.guild.id].userAmount = userBalance;
            userData[sender.id + msg.guild.id].lastUpdatedDaily = lastDaily;
            userData[sender.id + msg.guild.id].cooldownDaily = timeRemaining;
            
            fs.writeFile('Storage/userData.JSON', JSON.stringify(userData), (err) => {
                if (err) console.error(err);
            })
        } else {

            let hours = Math.floor(timeRemaining / 3600); 
            let minutes = Math.floor((timeRemaining - (hours * 3600)) / 60); 
            let seconds = timeRemaining - (hours * 3600) - (minutes * 60);

            msg.channel.send("**" + msg.author.username + "**, your daily is not ready yet!\n" +
            "You need to wait __**" + Math.round(hours) + "H " + Math.round(minutes) + "M " + Math.round(seconds) + "S**__");

            userData[sender.id + msg.guild.id].cooldownDaily = timeRemaining;

            fs.writeFile('Storage/userData.JSON', JSON.stringify(userData), (err) => {
                if (err) console.error(err);
            })
        }
    }
    //#endregion

    // game commands
    // cf
    if (msg.content.startsWith(prefix + 'cf')) {
        const playerInput = args[0];
        let betAmount = parseInt(args[1]);

        if (betAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough currency in your balance!"); 
            return;
        }

        if (!["h", "t"].includes(playerInput)) {
            msg.channel.send("Invalid command!\nPlease use this format !cf [h/t] [betAmount/all/half/quarter/eighth]"); 
            return;
        }

        switch(args[1]) {
            case "all":
                betAmount = userBalance;
                break;
            case "half":
                betAmount = userBalance / 2;
                break;
            case "quarter":
                betAmount = userBalance / 4;
                break;
            case "eighth":
                betAmount = userBalance / 8;
                break;
            default:
                betAmount = parseInt(args[1]);
                if (Number.isNaN(betAmount)) {
                    msg.channel.send("Please enter a valid bet amount!");
                }
        }

        let result = Math.random() > 0.5; // over 0.5 = heads, less = tails
        let resultText = result ? "won" : "lost";
        
        if (result) {
            userBalance += betAmount * 2;
        } else {
            userBalance -= betAmount;
        } 

        if (playerInput == "h") {
            playerRoll = "heads";
        } else {
            playerRoll = "tails";
        }
    
        if (resultText == "won") {
            msg.channel.send("**" + msg.author.username + "** spent __**" + format(Math.round(betAmount)) + "**__ currency and chose **" + playerRoll + 
            "**.\nYou " +  resultText + " __**" + format(Math.round(betAmount * 2)) + "**__ currency!");
        } else {
            msg.channel.send("**" + msg.author.username + "** spent __**" + format(Math.round(betAmount)) + "**__ currency and chose **" + playerRoll + 
            "**.\nYou " + resultText + " it all :(");
        }

        userData[sender.id + msg.guild.id].userAmount = userBalance;

        fs.writeFile('Storage/userData.JSON', JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }

    // bj
    if (msg.content.startsWith(prefix + 'bj')) {

        let betAmount = parseInt(args[0]);

        if (betAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough currency in your balance!"); 
            return;
        }

        if (!betAmount) {
            msg.channel.send("Invalid command!\nPlease use this format !bj [betAmount/all/half/quarter/eighth]");
            return;
        }

        switch(args[1]) {
            case "all":
                betAmount = userBalance;
                break;
            case "half":
                betAmount = userBalance / 2;
                break;
            case "quarter":
                betAmount = userBalance / 4;
                break;
            case "eighth":
                betAmount = userBalance / 8;
                break;
            default:
                betAmount = parseInt(args[0]);
                if (Number.isNaN(betAmount)) {
                    msg.channel.send("Please enter a valid bet amount!");
                }
        }
    }
});

bot.on("ready", () => {
    // collection of commands that your bot will recognize
    bot.commands = new Discord.Collection();
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
                bot.commands.set(cmds.config.command, cmds);
            }
        });
    });
   console.log("The bot is online.");
});

bot.login(config.token);