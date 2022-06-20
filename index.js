const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const bot = new Discord.Client();

let userData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));
let prefix = "?";

function format(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

bot.on("message", async msg => {
    if (!msg.content.startsWith(prefix)) return;

    let cont = msg.content.slice(1).split(" ");
    let args = cont.slice(1);

    let sender = msg.author;
    let JSONTitle = "Sender Username: " + sender.username;
    if (!userData[JSONTitle]) userData[JSONTitle] = {};

    let userBalance = userData[JSONTitle].userAmount;
    if (!userBalance) userBalance = 0;

    let bankBalance = userData[JSONTitle].bankAmount;
    if (!bankBalance) bankBalance = 0;

    let lastDaily = userData[JSONTitle].lastUpdatedDaily;
    let timeRemaining = userData[JSONTitle].cooldownDaily;
    if (!lastDaily) {
        lastDaily = Date.now();
        timeRemaining = 0;
    }

    userData[JSONTitle].userAmount = userBalance;
    userData[JSONTitle].bankAmount = bankBalance;
    userData[JSONTitle].cooldownDaily = timeRemaining;
    userData[JSONTitle].lastUpdatedDaily = lastDaily;


    fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    })

    // test commands
    //#region 
    // ping
    if (msg.content === prefix + "ping") {
        msg.channel.send('Pong!').then (async (message) => {
            msg.channel.send("Latency is " + (message.createdTimestamp - msg.createdTimestamp) + "ms.");
        });
    }

    // set
    if (msg.content.startsWith(prefix + "set")) {
        let amount = parseInt(args[0]);

        if (amount < 0) {
            msg.channel.send("Please enter a valid amount!");
            return;
        }

        userBalance = amount;

        msg.channel.send("**" + msg.author.username + "**, your balance was set to __**$" + format(Math.round(userBalance)) + "**__!");

        userData[JSONTitle].userAmount = userBalance;

        fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }
    //#endregion

    // general commands
    //#region 
    if (msg.content.startsWith(prefix + "help")) {
        let command = args[0];

        if (!command) {
            const helpEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Command List")
            .setThumbnail(sender.avatarURL())
            .setDescription("Here is the list of commands!\n" +
            "For more info on a specific command, use " + prefix + "help {commandName}")
            .addFields(
                { name: "Test", value: "``ping``, ``set``", },
                { name: "General", value: "``help``" },
                { name: "Economy", value: "``bal``, ``bank``, ``deposit``, ``withdraw``, ``daily``" },
                { name: "Game", value: "``stats``, ``cf``, ``rps``, ``bj``" },
            );

            msg.channel.send(helpEmbed);
            return;
        }
        
        switch (command) {
            case "ping":
                const helpPingEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "ping command")
                    .addFields(
                        { name: "Usage", value: prefix + "ping" },
                        { name: "Description", value: "Replies with Pong! and checks latency" },
                    )
                msg.channel.send(helpPingEmbed);
                break;
            case "set":
                const helpSetEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "set command")
                    .addFields(
                        { name: "Usage", value: prefix + "set [setAmount]" },
                        { name: "Description", value: "Set your bank amount to any positive number" },
                        { name: "Example", value: prefix + "set 1000" },
                        { name: "Reminders", value: "[] = argument options" },
                    )
                msg.channel.send(helpSetEmbed);
                break;
            case "help":
                const helpHelpEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "help command")
                    .addFields(
                        { name: "Usage", value: prefix + "help {commandName}" },
                        { name: "Description", value: "Displays list of commands and additional info on a specific command" },
                        { name: "Example", value: prefix + "help ping" },
                        { name: "Reminders", value: "{} = optional arguments" },
                    )
                msg.channel.send(helpHelpEmbed);
                break;
            case "bal":
                const helpBalEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "bal command")
                    .addFields(
                        { name: "Usage", value: prefix + "bal" },
                        { name: "Description", value: "Displays your balance and bank amount! Earn money by playing games and collecting dailies!" },
                    )
                msg.channel.send(helpBalEmbed);
                break;
            case "deposit":
                const helpDepositEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "deposit command")
                    .addFields(
                        { name: "Usage", value: prefix + "deposit [depositAmount|all|half|quarter|eighth]" },
                        { name: "Description", value: "Deposit money from your balance into your bank account!" },
                        { name: "Example", value: prefix + "deposit 1000" },
                        { name: "Reminders", value: "[] = argument options" },
                    )
                msg.channel.send(helpDepositEmbed);
                break;
            case "withdraw":
                const helpWithdrawEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "withdraw command")
                    .addFields(
                        { name: "Usage", value: prefix + "withdraw [withdrawAmount|all|half|quarter|eighth]" },
                        { name: "Description", value: "withdraw money from your bank account into your balance!" },
                        { name: "Example", value: prefix + "withdraw 1000" },
                        { name: "Reminders", value: "[] = argument options" },
                    )
                msg.channel.send(helpWithdrawEmbed);
                break;
            case "daily":
                const helpDailyEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "daily command")
                    .addFields(
                        { name: "Usage", value: prefix + "daily" },
                        { name: "Description", value: "Collect $5000 every 22 hours!" },
                    )
                msg.channel.send(helpDailyEmbed);
                break;
            case "stats":
                const helpStatsEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "stats command")
                    .addFields(
                        { name: "Usage", value: prefix + "stats" },
                        { name: "Description", value: "Check your wins and losses in each minigame!"},
                    )
                msg.channel.send(helpStatsEmbed);
                break;
            case "cf":
                const helpCFEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "cf command")
                    .addFields(
                        { name: "Usage", value: prefix + "cf" },
                        { name: "Description", value: "Flip a coin and bet money which side the coin will land on!"},
                        { name: "Example", value: prefix + "cf h 1000" },
                        { name: "Reminders", value: "[] = argument options" },
                    )
                msg.channel.send(helpCFEmbed);
                break;
            case "rps":
                const helpRPSEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle("Command Info")
                    .setThumbnail(sender.avatarURL())
                    .setDescription("Shows additional info on the " + prefix + "rps command")
                    .addFields(
                        { name: "Usage", value: prefix + "rps [r|p|s] [betAmount|all|half|quarter|eighth]" },
                        { name: "Description", value: "Play Rock Paper Scissors with the bot!"},
                        { name: "Example", value: prefix + "rps r 1000" },
                        { name: "Reminders", value: "[] = argument options" },
                    )
                msg.channel.send(helpRPSEmbed);
                break;
            case "bj":

                break;
            default:
                msg.channel.send("Could not find that command!");
                break;
        }
    }
    //#endregion

    // economy commands
    //#region 
    // bal
    if (msg.content === prefix + "bal") {
        msg.channel.send("**" + msg.author.username + "**, you have __**$" + format(Math.round(userBalance)) + "**__\n" + 
        "You have __**$" + format(Math.round(bankBalance)) + "**__ in your bank!");

        const balEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(sender.username)
            .setThumbnail(sender.avatarURL())
            .addFields(
                { name: "Balance", value: "__**$" + format(Math.round(userBalance)) + "**__" },
                { name: "Bank", value: "__**$" + format(Math.round(bankBalance)) + "**__" },
            );
            msg.channel.send(balEmbed);
    }

    // deposit
    if (msg.content.startsWith(prefix + "deposit")) {
        let depositAmount = args[0];

        if (!depositAmount) {
            msg.channel.send("Please enter a deposit amount!");
            return;
        }

        if (depositAmount == "all") depositAmount = userBalance;
        else if (depositAmount == "half") depositAmount = userBalance / 2;
        else if (depositAmount == "quarter") depositAmount = userBalance / 4;
        else if (depositAmount == "eighth") depositAmount = userBalance / 8;
        else if (isNaN(parseInt(depositAmount))) {
            msg.channel.send("Please enter a valid deposit amount!");
            return;
        }

        if (depositAmount < 0) {
            msg.channel.send("You can't deposit negative money :rage:");
            return;
        }

        if (depositAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your balance to deposit!"); 
            return;
        }

        userBalance -= depositAmount;
        bankBalance += depositAmount;

        msg.channel.send("**" + msg.author.username + "**, you deposited __**$" + format(depositAmount) + "**__ to your bank!");

        userData[JSONTitle].userAmount = userBalance;
        userData[JSONTitle].bankAmount = bankBalance;

        fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }

    // withdraw
    if (msg.content.startsWith(prefix + "withdraw")) {
        let withdrawAmount = args[0];

        if (!withdrawAmount) {
            msg.channel.send("Please enter a withdraw amount!");
            return;
        }

        if (withdrawAmount == "all") withdrawAmount = userBalance;
        else if (withdrawAmount == "half") withdrawAmount = userBalance / 2;
        else if (withdrawAmount == "quarter") withdrawAmount = userBalance / 4;
        else if (withdrawAmount == "eighth") withdrawAmount = userBalance / 8;
        else if (isNaN(parseInt(withdrawAmount))) {
            msg.channel.send("Please enter a valid withdraw amount!");
            return;
        }

        if (withdrawAmount < 0) {
            msg.channel.send("You can't withdraw negative money :rage:");
            return;
        }
    
        if (withdrawAmount > bankBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your bank to withdraw!"); 
            return;
        }
    
        userBalance += withdrawAmount;
        bankBalance -= withdrawAmount;
    
        msg.channel.send("**" + msg.author.username + "**, you withdrew __**$" + format(withdrawAmount) + "**__ from your bank!");
    
        userData[JSONTitle].userAmount = userBalance;
        userData[JSONTitle].bankAmount = bankBalance;
    
        fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }
    
    // daily
    if (msg.content === prefix + "daily") {
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

            msg.channel.send("**" + msg.author.username + "**, __**$" + format(amount) + "**__ was added to your balance!\n" +
            "Your next daily is in: __**" + Math.round(hours) + "H " + Math.round(minutes) + "M " + Math.round(seconds) + "S**__");

            userData[JSONTitle].userAmount = userBalance;
            userData[JSONTitle].lastUpdatedDaily = lastDaily;
            userData[JSONTitle].cooldownDaily = timeRemaining;
            
            fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
                if (err) console.error(err);
            })
        } else {

            let hours = Math.floor(timeRemaining / 3600); 
            let minutes = Math.floor((timeRemaining - (hours * 3600)) / 60); 
            let seconds = timeRemaining - (hours * 3600) - (minutes * 60);

            msg.channel.send("**" + msg.author.username + "**, your daily is not ready yet!\n" +
            "You need to wait __**" + Math.round(hours) + "H " + Math.round(minutes) + "M " + Math.round(seconds) + "S**__");

            userData[JSONTitle].cooldownDaily = timeRemaining;

            fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
                if (err) console.error(err);
            })
        }
    }
    //#endregion

    // minigame commands
    //#region

    // cf
    if (msg.content.startsWith(prefix + "cf")) {
        const playerInput = args[0];
        let betAmount = args[1];

        if (!playerMove || !betAmount || !["h", "t"].includes(playerInput)) {
            msg.channel.send("Please use this format " + prefix + "rps [r/p/s] [betAmount/all/half/quarter/eighth]");
            return;
        }

        if (betAmount == "all") betAmount = userBalance;
        else if (betAmount == "half") betAmount = userBalance / 2;
        else if (betAmount == "quarter") betAmount = userBalance / 4;
        else if (betAmount == "eighth") betAmount = userBalance / 8;
        else if (isNaN(parseInt(betAmount))) {
            msg.channel.send("Please enter a valid bet amount!");
            return;
        }

        if (betAmount < 0) {
            msg.channel.send("You can't bet negative money :rage:");
            return;
        }

        if (betAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your balance!"); 
            return;
        }

        let result = Math.random() > 0.5;
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
            msg.channel.send("**" + msg.author.username + "** spent __**$" + format(Math.round(betAmount)) + "**__ and chose **" + playerRoll + 
            "**.\nYou " +  resultText + " __**$" + format(Math.round(betAmount * 2)) + "**__ !");
        } else {
            msg.channel.send("**" + msg.author.username + "** spent __**$" + format(Math.round(betAmount)) + "**__ and chose **" + playerRoll + 
            "**.\nYou " + resultText + " it all :(");
        }

        userData[JSONTitle].userAmount = userBalance;

        fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }

    // rps
    if (msg.content.startsWith(prefix + "rps")) {
        let playerMove = args[0];
        let betAmount = args[1];

        if (!playerMove || !betAmount || !["r", "p", "s"].includes(playerMove)) {
            msg.channel.send("Please use this format " + prefix + "rps [r/p/s] [betAmount/all/half/quarter/eighth]");
            return;
        }
    
        if (betAmount == "all") betAmount = userBalance;
        else if (betAmount == "half") betAmount = userBalance / 2;
        else if (betAmount == "quarter") betAmount = userBalance / 4;
        else if (betAmount == "eighth") betAmount = userBalance / 8;
        else if (isNaN(parseInt(betAmount))) {
            msg.channel.send("Please enter a valid bet amount!");
            return;
        }
    
        if (betAmount < 0) {
            msg.channel.send("You can't bet negative money :rage:");
            return;
        }
    
        if (betAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your balance!"); 
            return;
        }
    
        let computerMove = Math.floor(Math.random() * 3); // returns 0, 1, 2
        let winAmount = betAmount * 2;
        let loseAmount = betAmount;
    
        if (computerMove == 0) computerMove = "r";
        else if (computerMove == 1) computerMove = "p";
        else computerMove = "s";
    
        if (playerMove == computerMove) {
            msg.channel.send("Tie! Both players selected the same move.");
        } else if (playerMove == "r") {
            if (computerMove == "s") {
                msg.channel.send("Player move: Rock\n" +
                "Computer move: Scissors\n" +
                "Rock smashes scissors! You win **$" + winAmount + "**!");
                userBalance += winAmount;
            } else if (computerMove == "p") {
                msg.channel.send("Computer move: Paper\n" +
                "Player move: Rock\n" +
                "Paper covers rock! You lose **$" + loseAmount + "**:(");
                userBalance -= loseAmount;
            }
        } else if (playerMove == "p") {
            if (computerMove == "r") {
                msg.channel.send("Player move: Paper\n" +
                "Computer move: Rock\n" +
                "Paper covers rock! You win **$" + winAmount + "**!");
                userBalance += winAmount;
            } else if (computerMove == "s") {
                msg.channel.send("Computer move: Scissors\n" +
                "Player move: Paper\n" +
                "Scissors cuts paper! You lose **$" + loseAmount + "**:(");
                userBalance -= loseAmount;
            }
        } else if (playerMove == "s"){
            if (computerMove == "p") {
                msg.channel.send("Player move: Scissors\n" +
                "Computer move: Paper\n" +
                "Scissors cuts paper! You win **$" + winAmount + "**!");
                userBalance += winAmount;
            } else if (computerMove == "r") {
                msg.channel.send("Computer move: Rock\n" +
                "Player move: Scissors\n" +
                "Rock smashes scissors! You lose **$" + loseAmount + "**:(");
                userBalance -= loseAmount;
            }
        }
    
        userData[JSONTitle].userAmount = userBalance;
            
        fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }

    // slots
    if (msg.content.startsWith(prefix + "slots")) {
        let betAmount = args[0];

        if (!betAmount) {
            msg.channel.send("Please use this format " + prefix + "slots [betAmount/all/half/quarter/eighth");
            return;
        }

        if (betAmount == "all") betAmount = userBalance;
        else if (betAmount == "half") betAmount = userBalance / 2;
        else if (betAmount == "quarter") betAmount = userBalance / 4;
        else if (betAmount == "eighth") betAmount = userBalance / 8;
        else if (isNaN(parseInt(betAmount))) {
            msg.channel.send("Please enter a valid bet amount!");
            return;
        }

        if (betAmount < 0) {
            msg.channel.send("You can't bet negative money :rage:");
            return;
        }

        if (betAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your balance!");
            return;
        }

        let emojis = [`:cherries:`, `:grapes:`, `:melon:`, `:seven:`];
        let borderMiddle = "``|        |``";
        let borderBottom = "``|        |``";
        var possibleFails = [
            `${emojis[0]} ${emojis[1]} ${emojis[2]}`,
            `${emojis[0]} ${emojis[1]} ${emojis[3]}`,
            `${emojis[0]} ${emojis[2]} ${emojis[3]}`,
            `${emojis[0]} ${emojis[2]} ${emojis[1]}`,
            `${emojis[0]} ${emojis[3]} ${emojis[2]}`,
            `${emojis[0]} ${emojis[3]} ${emojis[1]}`,
      
            `${emojis[1]} ${emojis[0]} ${emojis[2]}`,
            `${emojis[1]} ${emojis[0]} ${emojis[3]}`,
            `${emojis[1]} ${emojis[2]} ${emojis[0]}`,
            `${emojis[1]} ${emojis[2]} ${emojis[3]}`,
            `${emojis[1]} ${emojis[3]} ${emojis[0]}`,
            `${emojis[1]} ${emojis[3]} ${emojis[2]}`,
      
            `${emojis[2]} ${emojis[0]} ${emojis[3]}`,
            `${emojis[2]} ${emojis[0]} ${emojis[1]}`,
            `${emojis[2]} ${emojis[1]} ${emojis[0]}`,
            `${emojis[2]} ${emojis[1]} ${emojis[3]}`,
            `${emojis[2]} ${emojis[3]} ${emojis[0]}`,
            `${emojis[2]} ${emojis[3]} ${emojis[1]}`,
      
            `${emojis[0]} ${emojis[3]} ${emojis[2]}`,
            `${emojis[0]} ${emojis[3]} ${emojis[1]}`,
            `${emojis[0]} ${emojis[1]} ${emojis[2]}`,
            `${emojis[0]} ${emojis[1]} ${emojis[3]}`,
            `${emojis[0]} ${emojis[2]} ${emojis[3]}`,
            `${emojis[0]} ${emojis[2]} ${emojis[1]}`
          ];
        var possibleDoubles = [
            `${emojis[0]} ${emojis[0]} ${emojis[2]}`,
            `${emojis[0]} ${emojis[0]} ${emojis[1]}`,
            `${emojis[0]} ${emojis[0]} ${emojis[3]}`,
            `${emojis[0]} ${emojis[1]} ${emojis[0]}`,
            `${emojis[0]} ${emojis[3]} ${emojis[0]}`,
            `${emojis[0]} ${emojis[2]} ${emojis[0]}`,
            `${emojis[3]} ${emojis[0]} ${emojis[0]}`,
            `${emojis[2]} ${emojis[0]} ${emojis[0]}`,
            `${emojis[1]} ${emojis[0]} ${emojis[0]}`,
      
            `${emojis[2]} ${emojis[2]} ${emojis[0]}`,
            `${emojis[2]} ${emojis[2]} ${emojis[1]}`,
            `${emojis[2]} ${emojis[2]} ${emojis[3]}`,
            `${emojis[2]} ${emojis[1]} ${emojis[2]}`,
            `${emojis[2]} ${emojis[0]} ${emojis[2]}`,
            `${emojis[2]} ${emojis[3]} ${emojis[2]}`,
            `${emojis[0]} ${emojis[2]} ${emojis[2]}`,
            `${emojis[1]} ${emojis[2]} ${emojis[2]}`,
            `${emojis[3]} ${emojis[2]} ${emojis[2]}`,
      
            `${emojis[0]} ${emojis[0]} ${emojis[3]}`,
            `${emojis[0]} ${emojis[0]} ${emojis[1]}`,
            `${emojis[0]} ${emojis[0]} ${emojis[2]}`,
            `${emojis[0]} ${emojis[1]} ${emojis[0]}`,
            `${emojis[0]} ${emojis[2]} ${emojis[0]}`,
            `${emojis[0]} ${emojis[3]} ${emojis[0]}`,
            `${emojis[1]} ${emojis[0]} ${emojis[0]}`,
            `${emojis[2]} ${emojis[0]} ${emojis[0]}`,
            `${emojis[3]} ${emojis[0]} ${emojis[0]}`,
      
            `${emojis[1]} ${emojis[1]} ${emojis[0]}`,
            `${emojis[1]} ${emojis[1]} ${emojis[3]}`,
            `${emojis[1]} ${emojis[1]} ${emojis[2]}`,
            `${emojis[1]} ${emojis[0]} ${emojis[1]}`,
            `${emojis[1]} ${emojis[2]} ${emojis[1]}`,
            `${emojis[1]} ${emojis[3]} ${emojis[1]}`,
            `${emojis[0]} ${emojis[1]} ${emojis[1]}`,
            `${emojis[2]} ${emojis[1]} ${emojis[1]}`,
            `${emojis[3]} ${emojis[1]} ${emojis[1]}`
          ];
        let possibleTriples = [
            `${emojis[2]} ${emojis[2]} ${emojis[2]}`,
            `${emojis[0]} ${emojis[0]} ${emojis[0]}`,
            `${emojis[1]} ${emojis[1]} ${emojis[1]}`,
          ];
        let jackpot = `${emojis[3]} ${emojis[3]} ${emojis[3]}`;

        let message = "";

        let roll = Math.random() * 100;

        if (roll <= 65) {
            message += "**" + sender.username + "**, you rolled trash!\n";
            message += "**``___SLOTS___``**\n" + possibleFails[Math.floor(Math.random() * (possibleFails.length))] + "\n" +borderMiddle + "\n" + borderBottom + "\n";
            message += "You lost $__**" + format(Math.round(betAmount)) + "**__!";
            userBalance -= betAmount;
            msg.channel.send(message);
        } else if (roll > 99) { // JACKPOT
            let winAmount = betAmount * 10;
            message += "**" + sender.username + "**, you hit the jackpot!\n";
            message += "**``___SLOTS___``**\n" + jackpot + "\n" +
            borderMiddle + "\n" 
            + borderBottom;
            message += "You won $__**" + format(Math.round(winAmount)) + "**__!";
            userBalance += winAmount;
            msg.channel.send(message);
        } else if (roll > 89) { // Triple
            let winAmount = betAmount * 3;
            message += "**" + sender.username + "**, you rolled a triple!\n";
            message += "**``___SLOTS___``**\n" + possibleTriples[Math.floor(Math.random() * (possibleTriples.length))] + "\n" + borderMiddle + "\n" + borderBottom + "\n";
            message += "You won $__**" + format(Math.round(winAmount)) + "**__!";
            userBalance += winAmount;
            msg.channel.send(message);
        } else { // DOUBLE
            let winAmount = betAmount * 2;
            message += "**" + sender.username + "**, you rolled a double!\n";
            message += "**``___SLOTS___``**\n" + possibleDoubles[Math.floor(Math.random() * (possibleDoubles.length))] + "\n" + borderMiddle + "\n" + borderBottom + "\n";
            message += "You won $__**" + format(Math.round(winAmount)) + "**__!";
            userBalance += winAmount;
            msg.channel.send(message);
        }

        userData[JSONTitle].userAmount = userBalance;

        fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }

    // bj
    if (msg.content.startsWith(prefix + "bj")) {
        let betAmount = args[0];

        if (!betAmount) {
            msg.channel.send("Please use this format " + prefix + "bj [betAmount/all/half/quarter/eighth");
            return;
        }

        if (betAmount == "all") betAmount = userBalance;
        else if (betAmount == "half") betAmount = userBalance / 2;
        else if (betAmount == "quarter") betAmount = userBalance / 4;
        else if (betAmount == "eighth") betAmount = userBalance / 8;
        else if (isNaN(parseInt(betAmount))) {
            msg.channel.send("Please enter a valid bet amount!");
            return;
        }

        if (betAmount < 0) {
            msg.channel.send("You can't bet negative money :rage:");
            return;
        }

        if (betAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your balance!");
            return;
        }

        function generateRandom() {
            return Math.floor(Math.random() * 10) + 1;
        }
    
        let playerHand = [generateRandom(), generateRandom()];
        let dealerHand = [generateRandom(), "?"];

        function printPlayerHand() {
            for (let i = 0; i < playerHand.length; i++) {
                if (i == 0) playerHandMessage += playerHand[i];
                else playerHandMessage += ' + ' + playerHand[i];
            }
        }

        function printDealerHand() {
            for (let i = 0; i < dealerHand.length; i++) {
                if (i == 0) dealerHandMessage += dealerHand[i];
                else dealerHandMessage += ' + ' + dealerHand[i];
            }
        }

        let playerHandMessage = "";
        let dealerHandMessage = "";
        let gameFinished = false;
    
        let playerHandSum = 0;
        let dealerHandSum = `${dealerHand[0]}`;
    
        function calculatePlayerHandSum() {
            for (let i = 0; i < playerHand.length; i++) {
                playerHandSum += playerHand[i];
            }
        }
    
        function calculateDealerHandSum() {
            for (let i = 0; i < dealerHand.length; i++) {
                dealerHandSum += dealerHand[i];
            }
        }
    
        printPlayerHand();
        printDealerHand();
        calculatePlayerHandSum();

        let gameStateMessage = "Game is in progress";
        let winAmount = betAmount * 2;
        let hitEmoji = "👊";
        let standEmoji = "🛑";

        const filter = (reaction, user) => {
            return (reaction.emoji.name === hitEmoji || reaction.emoji.name === standEmoji) && user.id === msg.author.id;
        };
        
        const collector = msg.createReactionCollector({ filter, time: 15000 });
        
        collector.on('collect', (reaction) => {
            msg.channel.send("Success5!");
            if (reaction.emoji.name === hitEmoji) {
                msg.channel.send("Success!");
                hit();
            } else if (reaction.emoji.name === stopEmoji) {
                stand();
                msg.channel.send("Success1!");
            }
        });

        function editEmbed() {
            message.edit({ embeds: [bjEmbed] });
        }

        function checkPlayerGameState() {
            if (playerHandSum == 21) {
                gameFinished = true;
                gameStateMessage = `You got $${winAmount} for winning!`;
                userBalance += winAmount;
            } else if (playerHandSum > 21) {
                gameFinished = true;
                gameStateMessage = `You lost $${betAmount} :(`;
                userBalance -= betAmount;
            }
        }

        function checkDealerGameState() {
            if (dealerHandSum == 21) {
                gameFinished = true;
                gameStateMessage = `You lost $${betAmount} :(`;
                userBalance -= betAmount;
            } else if (dealerHandSum > 21) {
                gameFinished = true;
                gameStateMessage = `You got $${winAmount} for winning!`;
                userBalance += winAmount;
            }
        }

        function hit() {
            if (gameFinished) return;

            msg.channel.send("Success2");
            playerHand.push(generateRandom());
            printPlayerHand();
            checkPlayerGameState();
            editEmbed();
        }
        
        function stand() {
            if (gameFinished) return;
            msg.channel.send("Success3");

            while (dealerSum < 17) {
                dealerHand.push(generateRandom());
                calculateDealerHandSum();
                printDealerHand();
                checkDealerGameState();
                editEmbed();
            }
        }
    
        const bjEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setThumbnail(sender.avatarURL())
            .setDescription(sender.username + ", you bet $" + betAmount + " to play Blackjack!")
            .addFields(
                { name: "Dealer [" + dealerHandSum + "]", value: dealerHandMessage, inline: true },
                { name: sender.username + " [" + playerHandSum + "]", value: playerHandMessage, inline: true },
            )
            .setFooter(gameStateMessage);
            const embedMessage = await msg.channel.send({ embed: bjEmbed });
            await embedMessage.react("👊");
            await embedMessage.react("🛑");
    }

    //#endregion

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
        // tell us where it"s looking
        console.log("Loading Folder: " + module);

        // find the js files
        let commandFiles = fs.readdirSync(path.resolve(`${srcDir}/${module}`)).
            filter(file => !fs.statSync(path.resolve(srcDir, module, file)).isDirectory()).
            filter(file => file.endsWith(".js"));

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