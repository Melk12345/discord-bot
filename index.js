const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const bot = new Discord.Client();

let userData = JSON.parse(fs.readFileSync("Storage/userData.json", "utf8"));
let prefix = "?";

function format(amount) {
    return amount.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

bot.on("message", msg => {
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

    // GAMES
    let cfWins = userData[JSONTitle].userCFWins;
    if (!cfWins) cfWins = 0;

    let cfLosses = userData[JSONTitle].userCFLosses;
    if (!cfLosses) cfLosses = 0;

    let rpsWins = userData[JSONTitle].userRPSWins;
    if (!rpsWins) rpsWins = 0;

    let rpsLosses = userData[JSONTitle].userRPSLosses;
    if (!rpsLosses) rpsLosses = 0;

    userData[JSONTitle].userAmount = userBalance;
    userData[JSONTitle].bankAmount = bankBalance;
    userData[JSONTitle].cooldownDaily = timeRemaining;
    userData[JSONTitle].lastUpdatedDaily = lastDaily;

    // GAMES
    userData[JSONTitle].userCFWins = cfWins;
    userData[JSONTitle].userCFLosses = cfLosses;
    userData[JSONTitle].userRPSWins = rpsWins;
    userData[JSONTitle].userRPSLosses = rpsLosses;

    // farm game
    let level = userData[JSONTitle].farmLevel;
    if (!level) level = 0;

    let currentXP = userData[JSONTitle].farmCurrentXP;
    if (!currentXP) currentXP = 0;

    let XPReq = userData[JSONTitle].farmXPReq;
    if (!XPReq) XPReq = 100;

    let inventory = userData[JSONTitle].farmInventory;
    if (!inventory) inventory = {wheat: 0, carrots: 0, potatoes: 0};

    let inventoryValue = userData[JSONTitle].farmInventoryValue;
    if (!inventoryValue) inventoryValue = 0;

    let plantMax = userData[JSONTitle].farmPlantMax;
    if (!plantMax) plantMax = {wheat: 10, carrots: 10, potatoes: 10 };

    let plantBaseXP = userData[JSONTitle].farmBaseXP;
    if (!plantBaseXP) plantBaseXP = {wheat: 1, carrots: 2, potatoes: 3 };

    let plantBaseSellPrice = userData[JSONTitle].farmBaseSellPrice;
    if (!plantBaseSellPrice) plantBaseSellPrice = {wheat: 1, carrots: 2, potatoes: 3 };

    let totalMoney = userData[JSONTitle].farmTotalMoney;
    if (!totalMoney) totalMoney = 0;


    userData[JSONTitle].farmLevel = level;
    userData[JSONTitle].farmCurrentXP = currentXP;
    userData[JSONTitle].farmXPReq = XPReq;
    userData[JSONTitle].farmInventory = inventory;
    userData[JSONTitle].farmInventoryValue = inventoryValue;
    userData[JSONTitle].farmPlantMax = plantMax;
    userData[JSONTitle].farmBaseXP = plantBaseXP;



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
        else if (Number.isNaN(depositAmount)) msg.channel.send("Please enter a valid deposit amount!");

        if (depositAmount < 0) {
            msg.channel.send("You can't deposit negative money :rage:");
            return;
        }

        if (depositAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your balance to deposit!"); 
            return;
        }

        if (!depositAmount) {
            msg.channel.send("Invalid command!\nPlease use this format !deposit [depositAmount/all/half/quarter/eighth]");
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
        else if (Number.isNaN(withdrawAmount)) msg.channel.send("Please enter a valid withdraw amount!");

        if (withdrawAmount < 0) {
            msg.channel.send("You can't withdraw negative money :rage:");
            return;
        }
    
        if (withdrawAmount > bankBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your bank to withdraw!"); 
            return;
        }
    
        if (!withdrawAmount) {
            msg.channel.send("Invalid command!\nPlease use this format !withdraw [withdrawAmount/all/half/quarter/eighth]");
            return;
        }
    
        switch(withdrawAmount) {
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
    // stats
    if (msg.content === prefix + "stats") {
        msg.channel.send("**" + msg.author.username + "**'s Game Stats:\n" +
        "Coinflip: **" + format(cfWins) + "W - " + format(cfLosses) + "L**\n" +
        "Rock Paper Scissors: **" + format(rpsWins) + "W - " + format(rpsLosses) + "L**");
    }

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
        else if (Number.isNaN(betAmount)) msg.channel.send("Please enter a valid bet amount!");

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
            cfWins++;
        } else {
            userBalance -= betAmount;
            cfLosses++;
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

        userData[JSONTitle].userCFWins = cfWins;
        userData[JSONTitle].userCFLosses = cfLosses;
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
        else if (Number.isNaN(betAmount)) msg.channel.send("Please enter a valid bet amount!");
    
        if (Number.isNaN(betAmount)) {
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
                rpsWins++;
            } else if (computerMove == "p") {
                msg.channel.send("Computer move: Paper\n" +
                "Player move: Rock\n" +
                "Paper covers rock! You lose **$" + loseAmount + "**:(");
                userBalance -= loseAmount;
                rpsLosses++;
            }
        } else if (playerMove == "p") {
            if (computerMove == "r") {
                msg.channel.send("Player move: Paper\n" +
                "Computer move: Rock\n" +
                "Paper covers rock! You win **$" + winAmount + "**!");
                userBalance += winAmount;
                rpsWins++;
            } else if (computerMove == "s") {
                msg.channel.send("Computer move: Scissors\n" +
                "Player move: Paper\n" +
                "Scissors cuts paper! You lose **$" + loseAmount + "**:(");
                userBalance -= loseAmount;
                rpsLosses++;
            }
        } else if (playerMove == "s"){
            if (computerMove == "p") {
                msg.channel.send("Player move: Scissors\n" +
                "Computer move: Paper\n" +
                "Scissors cuts paper! You win **$" + winAmount + "**!");
                userBalance += winAmount;
                rpsWins++;
            } else if (computerMove == "r") {
                msg.channel.send("Computer move: Rock\n" +
                "Player move: Scissors\n" +
                "Rock smashes scissors! You lose **$" + loseAmount + "**:(");
                userBalance -= loseAmount;
                rpsLosses++;
            }
        }
    
        userData[JSONTitle].userRPSWins = rpsWins;
        userData[JSONTitle].userRPSLosses = rpsLosses;
        userData[JSONTitle].userAmount = userBalance;
            
        fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })
    }

    // bj
    if (msg.content.startsWith(prefix + "bj")) {
        let betAmount = args[0];

        if (!betAmount) {
            msg.channel.send("Please use this format !bj [betAmount|all|half|quarter|eighth]");
            return;
        }

        if (betAmount == "all") betAmount = userBalance;
        else if (betAmount == "half") betAmount = userBalance / 2;
        else if (betAmount == "quarter") betAmount = userBalance / 4;
        else if (betAmount == "eighth") betAmount = userBalance / 8;
        else if (Number.isNaN(betAmount)) msg.channel.send("Please enter a valid bet amount!");

        if (betAmount < 0) {
            msg.channel.send("You can't bet negative money :rage:");
            return;
        }

        if (betAmount > userBalance || userBalance == 0) {
            msg.channel.send("**" + msg.author.username + "**, you don't have enough money in your balance!"); 
            return;
        }

        let userHand = {};

        for (let i = 1; i < 6; i++) {
            userHand[i] = Math.floor(Math.random() * (11 - 2) + 2); 
            if (i > 2) userHand[i] = 0;
        }

        let userHandSum = 0;

        for (let i = 1; i < 6; i++) {
            userHandSum += userHand[i];
        }

        let computerHand = {};

        for (let i = 1; i < 6; i++) {
            computerHand[i] = Math.floor(Math.random() * (11 - 2) + 2); 
            if (i > 1) computerHand[i] = 0;
        }

        let computerHandSum = 0;

        for (let i = 1; i < 6; i++) {
            computerHandSum += computerHand[i];
        }

        const InProgressBJEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setAuthor({name: "**" + sender.username + ", you bet " + betAmount + "** to play Blackjack", iconURL: sender.avatarURL()})
            .addFields(
                { name: "**Dealer [**" + computerHandSum + "+?]", value: JSON.stringify(computerHand) },
                { name: "**" + sender.username + " [**" + userHandSum + "]", value: JSON.stringify(userHand) }
            )
            .setFooter({ text: "Game is in progress..." });

        const userWinBJEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setAuthor({name: "**" + sender.username + ", you bet " + betAmount + "** to play Blackjack", iconURL: sender.avatarURL()})
            .addFields(
                { name: "**Dealer [**" + computerHandSum + "]", value: JSON.stringify(computerHand) },
                { name: "**" + sender.username + " [**" + userHandSum + "]", value: JSON.stringify(userHand) }
            )
            .setFooter({ text: "You won **$" + betAmount + "**!" });

        const userLostBJEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setAuthor({name: "**" + sender.username + ", you bet " + betAmount + "** to play Blackjack", iconURL: sender.avatarURL()})
            .addFields(
                { name: "**Dealer [**" + computerHandSum + "]", value: JSON.stringify(computerHand) },
                { name: "**" + sender.username + " [**" + userHandSum + "]", value: JSON.stringify(userHand) }
            )
            .setFooter({ text: "You lost **$" + betAmount + "** :(" });


        msg.channel.send(InProgressBJEmbed);


        if (userHandSum == 21) {
            msg.channel.send(userWinBJEmbed);  
            return;
        } else if (userHandSum > 21) {
            msg.channel.send(userLostBJEmbed);  
            return;
        }

    }
    //#endregion

    // farm game commands
    //#region 
    if (msg.content === prefix + "inv") {
        inventoryValue = (plantBaseSellPrice.wheat * inventory.wheat) + (plantBaseSellPrice.carrots * inventory.carrots) + (plantBaseSellPrice.potatoes * inventory.potatoes);
        fame = Math.floor(150 * Math.sqrt(totalMoney/1e4));
        const invEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Farming Simulator")
            .setThumbnail(sender.avatarURL())
            .addFields(
                {
                    name: 
                        sender.username + "'s Info", value: "Balance: __**$" + userBalance + "**__\n" +
                        "Fame: " + fame + "\n" +
                        "**Level " + level + "**, " + Math.floor(currentXP) + "/" + Math.round(XPReq) + " XP to next level.\n"
                },
                {
                    name: 
                        "Produce", value: inventory.wheat + " Wheat\n" +
                        inventory.carrots + " Carrots\n" +
                        inventory.potatoes + " Potatoes\n" +
                        "Inventory Value: __**$" + inventoryValue + "**__"
                },
            );
        msg.channel.send(invEmbed);
    }

    if (msg.content === prefix + "farm") {
        let numRoll = Math.floor(Math.random() * (3 - 1) + 1); // 1, 2, 3
        let wheatRoll = Math.floor(Math.random() * (plantMax.wheat - 1) + 1);
        let carrotsRoll = Math.floor(Math.random() * (plantMax.carrots - 1) + 1);
        let potatoesRoll = Math.floor(Math.random() * (plantMax.potatoes - 1) + 1);
        let XPGained = 0;
        
        if (numRoll == 0) {
            XPGained = wheatRoll * plantBaseXP.wheat;
            inventory.wheat += wheatRoll;
            currentXP += XPGained;
            userData[JSONTitle].farmInventory = inventory;
            userData[JSONTitle].farmCurrentXP = currentXP;
            if (currentXP >= XPReq) {
                currentXP -= XPReq;
                level++;
                XPReq = 100 * Math.pow(1.15, level);
                userData[JSONTitle].farmCurrentXP = currentXP;
                userData[JSONTitle].farmLevel = level;
                userData[JSONTitle].farmXPReq = XPReq;
            }
            text = wheatRoll + " Wheat\n +" + XPGained + " XP!"
        } else if (numRoll == 1) {
            XPGained = (wheatRoll * plantBaseXP.wheat) + (carrotsRoll * plantBaseXP.carrots);
            inventory.wheat += wheatRoll;
            inventory.carrots += carrotsRoll;
            currentXP += XPGained;
            userData[JSONTitle].farmInventory = inventory;
            userData[JSONTitle].farmCurrentXP = currentXP;
            if (currentXP >= XPReq) {
                currentXP -= XPReq;
                level++;
                XPReq = 100 * Math.pow(1.15, level);
                userData[JSONTitle].farmCurrentXP = currentXP;
                userData[JSONTitle].farmLevel = level;
                userData[JSONTitle].farmXPReq = XPReq;
            }
            text = wheatRoll + " Wheat\n" + carrotsRoll + " Carrots\n+" + XPGained + " XP!"
        } else {
            XPGained = (wheatRoll * plantBaseXP.wheat) + (carrotsRoll * plantBaseXP.carrots) + (potatoesRoll * plantBaseXP.potatoes);
            inventory.wheat += wheatRoll;
            inventory.carrots += carrotsRoll;
            inventory.potatoes += potatoesRoll;
            currentXP += XPGained;
            userData[JSONTitle].farmInventory = inventory;
            userData[JSONTitle].farmCurrentXP = currentXP;
            if (currentXP >= XPReq) {
                currentXP -= XPReq;
                level++;
                XPReq = 100 * Math.pow(1.15, level);
                userData[JSONTitle].farmCurrentXP = currentXP;
                userData[JSONTitle].farmLevel = level;
                userData[JSONTitle].farmXPReq = XPReq;
            }
            text = wheatRoll + " Wheat\n" + carrotsRoll + " Carrots\n" + potatoesRoll + " Potatoes\n" + "+" + XPGained + " XP!"
        }

        fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
            if (err) console.error(err);
        })

        const farmEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Farming Simulator")
            .setThumbnail(sender.avatarURL())
            .addFields(
                { name: "**You gained**:", value: text }
            );
        msg.channel.send(farmEmbed);
    }

    if (msg.content === prefix + "sell") {
        inventoryValue = (plantBaseSellPrice.wheat * inventory.wheat) + (plantBaseSellPrice.carrots * inventory.carrots) + (plantBaseSellPrice.potatoes * inventory.potatoes);

        if (inventoryValue == 0) {
            msg.channel.send("You have no produce to sell! Do ?farm to get some produce!");
            return;
        }

        if (inventoryValue > 0) {
            userBalance += inventoryValue;
            totalMoney += inventoryValue;

            const sellEmbed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Farming Simulator")
                .setThumbnail(sender.avatarURL())
                .addFields(
                    { name: "Produce Sold!", value: "You sold your produce for __**$" + inventoryValue + "**__!\n" + "You now have __**$" + userBalance + "**__!" },
                );
            msg.channel.send(sellEmbed);

            inventoryValue = 0;
            inventory.wheat = 0;
            inventory.carrots = 0;
            inventory.potatoes = 0;

            userData[JSONTitle].farmInventory = inventory;
            userData[JSONTitle].userAmount = userBalance;
            userData[JSONTitle].farmInventoryValue = inventoryValue;
    
            fs.writeFile("Storage/userData.JSON", JSON.stringify(userData), (err) => {
                if (err) console.error(err);
            })
        }
    
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