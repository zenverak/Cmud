//This function here is so I can enter the number of seconds instead ms. 
function convTime(tim) {
    return tim * 1000;
}

function addCommText(str) {
    document.getElementById("commands").innerHTML += "<br>" + str;
}

function disComs() {
    var commands = ["Fight", "move", "stats", "Shop", "Equip", "EXIT", "INV","change name"],
        cLen,
        i;
    cLen = commands.length;
    for (i = 0; i < cLen; i++) {
        addCommText(commands[i]);
    }
}



function addResultText(str) {
    var objDiv = document.getElementById("result");
    document.getElementById("result").innerHTML += "<br>" + str;
    objDiv.scrollTop = objDiv.scrollHeight;

}

function addFightText(str) {
    var objDiv = document.getElementById("result");
    document.getElementById("result").innerHTML += "<br><p style='color:red'>" + str + "</p>";
    objDiv.scrollTop = objDiv.scrollHeight;
}

function addShopText(str) {
    var objDiv = document.getElementById("result");
    document.getElementById("result").innerHTML += "<br><p style='color:yellow'>" + str + "</p>";
    objDiv.scrollTop = objDiv.scrollHeight;
}

function addLevelUpText(str) {
    var objDiv = document.getElementById("result");
    document.getElementById("result").innerHTML += "<br><p style='color:#00FF00'>" + str + "</p>";
    objDiv.scrollTop = objDiv.scrollHeight;
}

function addMoveText(str) {
    var objDiv = document.getElementById("result");
    document.getElementById("result").innerHTML += "<br><p style='color:#85C2FF'>" + str + "</p>";
    objDiv.scrollTop = objDiv.scrollHeight;
}

function addDropText(str) {
    var objDiv = document.getElementById("result");
    document.getElementById("result").innerHTML += "<br><p style='color:#FF99FF';font-weight:bold>" + str + "</p>";
    objDiv.scrollTop = objDiv.scrollHeight;
}
function addDirText(str){
	  var objDiv = document.getElementById("result");
    document.getElementById("result").innerHTML += "<br><p style='color:#FF9900';font-weight:bold>" + str + "</p>";
    objDiv.scrollTop = objDiv.scrollHeight;

}
window.onload = disComs();

function game() {
    var gameOn = true,
        roomNum = 0,
        introCount = 0,
        //If a certain place cannot be accessed yet, it will not use defMes, otherwise, I will use defMes
        defMes = "",
        player = {
            name: "",
            lvl: 1,
            hp: 19,
            str: 2,
            def: 1,
            spd: 3,
            expTotal: 0,
            expToLevel: 20,
            expForLevel: 0,
            expToNext: 20,
            inv: {
                weapons: [],
                items: []
            },
            extra: "",
            wIsEquip: false,
            aIsEquip: false,
            weaponName: "",
            weaponStr: 0,
            eWeapon: "",
            money: 0,
			luckyNum:[7],
            updateStats: function () {
                document.getElementById("lvl").innerHTML = "LVL: " + player.lvl + " ";
                document.getElementById("hp").innerHTML = "HP: " + player.hp + " ";
                document.getElementById("str").innerHTML = "STR: " + player.str + " ";
                document.getElementById("def").innerHTML = "DEF: " + player.def + " ";
                document.getElementById("spd").innerHTML = "SPD: " + player.spd + " ";
            },
            updateMoney: function () {
                document.getElementById("money").innerHTML = "Money: " + player.money + " ";
            },
            expChange: function () {
                this.expToNext = this.expToLevel - this.expForLevel;
                document.getElementById("exp").innerHTML = "EXP Till Next Level: " + player.expToNext + " ";
            },
            levelUp: function () {
                this.expToLevel *= 2;
                /* if we have any EXP that is over the required level up amount, I want that amount to apply towards
        their next level for as long as it should go.*/
                if (this.expForLevel > this.expToLevel) {
                    var leftOverExp = this.expForLevel - this.expToLevel;
                    this.expForLevel = leftOverExp;
                }
                this.str++;
                this.def++;
                this.spd++;
                this.hp++;
                this.lvl++;
                addLevelUpText(player.name + " is now lvl " + this.lvl + ". " + "His stats are now Str:" + this.str + " , Def:" + this.def + " , SPD:" + this.spd + " , HP:" + this.hp);
                player.updateStats();
                //This is where I make sure that they don't need to level up again
                if (this.expForLevel > this.expToLevel) {
                    this.levelUp();
                }

            },
            wEquip: function (weapon) {
                var indNum;
                if (weapon.type !== "weapon") {
                    return addResultText("This is not a weapon");
                }
                if (this.isEquip) {
                    this.inv.weapons.push(player.eWeapon);
                    this.weaponStr = 0;
                    this.weaponName = "";
                    this.extra = "";
                    this.wIsEquip = false;

                }

                this.weaponStr = weapon.str;
                this.str += this.weaponStr;
                this.weaponName = weapon.name;
                this.extra = weapon.extra;
                this.eWeapon = weapon;
                indNum = player.inv.weapons.indexOf(weapon);
                delete player.inv.weapons[indNum];
                player.inv.weapons.splice(indNum, 1);
                player.updateStats();

            }
        },

        //For my approach, I keep the name of the weapon and the name
        //of its variable the same.
        sword = new cmud.Weapon(3, "sword", 0, "weapon", 16),
        //These currently do not work as HP never changes. I might want to
        //reimplement fHP which is what I used so that I can add hp with a potion
        potion = new cmud.Item("potion", function () {
            player.hp += Math.round(player.hp * 0.5);
        }, "Heals half of your HP", 3),

        superpotion = new cmud.Item("SuperPotion", function () {
            player.hp = this.hp;
        }, "Heals all of your HP", 100),

        enemyNames1 = ["Child", "Angry Man", "Crazy Robot", "Rabid Dog", "Dancing Children", "Rabid Dog", "Rabid Dog", "Man", "Psycho Mob"],

        
        enemy1 = new cmud.Enemy(enemyNames1[Math.floor(Math.random() * enemyNames1.length)], 10, 3, 1, 1, 10, 2),
        enemy2 = new cmud.Enemy(enemyNames1[Math.floor(Math.random() * enemyNames1.length)], 10, 1, 1, 1, 10, 2);
    //right now this only drops one weapon
    cmud.Enemy.prototype.drop = function () {
        if (2 === Math.floor(Math.random() * 8)) {
            player.inv.weapons.push(sword);
            addDropText("You got a sword");
        }
    };
	cmud.Enemy.prototype.luckyNum = [Math.floor((Math.random()*10)+1)];
    //These are the rooms that I use to move about.
    //Right now many of these have bad descriptions, this will change

  
    var room0 = new cmud.Room({
            "SOUTH": 1
        }, " Your house looks lovely as it always did. There is a reason you bought it as your first house",
        "0", true, defMes, defMes);
    var room1 = new cmud.Room({
        "NORTH": 0,
        "SOUTH": 2,
        "EAST": 3
    }, " The house next door. This is the house of the girl you have always had an eye on.", enemy1, true, defMes, "Someone suspicious lurks around, itching for a fight");
    var room2 = new cmud.Room({
        "NORTH": 1,
        "NORTHEAST": 3,
        "SOUTH": 5,
        "EAST": 4
    }, "Hello there ", enemy2, true, defMes, " You see danger in its most obvious form. Watch out!!!");
    var room3 = new cmud.Room({
        "WEST": 1,
        "SOUTHWEST": 2,
        "SOUTH": 4
    }, "A rundown house", "0", true, defMes, defMes);
    var room4 = new cmud.Room({
        "NORTH": 3,
        "WEST": 2,
        "SOUTH": 6
    }, "Hell", "0", true, defMes, defMes);
    var room5 = new cmud.Room({
        "NORTH": 2,
        "EAST": 6
    }, "Houses with a nice lawn", "0", true, defMes, defMes);
    var room6 = new cmud.Room({
        "NORTH": 4,
        "WEST": 5
    }, "Busy street that leads into your neighborhood", "0", true, defMes, defMes);
		



    /*an array of rooms used to help move through rooms */
    var rooms = [room0, room1, room2, room3, room4, room5, room6];




    function fight() {
		function damageCalc(num,hurter){
			var result =  Math.round(Math.random()*(hurter.str + num) + ((hurter.str * .75) + num)),
			goodNum = Math.floor((Math.random()*10)+1),
			isLuck=false,
			L,
			lLen =hurter.luckyNum.length;
			if(result === 0){
				result = 1;
			}
			for(L = 0;L<lLen;L++){
				if(hurter.luckyNum[L]===goodNum){
					isLuck = true;
					break;
				}
			}
			if(isLuck){
			result = Math.round(result*1.25);
			}
			return result;
		}
        //Checks to see if there is an enemy. NO enemy has value 0
        if (rooms[roomNum].enemy === "0") {
            return addFightText("There is no one to fight here");
        }
        var fighter1 = player,
            fighter2 = rooms[roomNum].enemy;
		if (fighter2.spd > fighter1.spd) {
			sub = fighter1;
			fighter1 = fighter2;
			fighter2 = sub;
			}	
        var die1 = fighter1.str,
            die2 = fighter2.str,
            hp1 = fighter1.hp,
            hp2 = fighter2.hp,
            diffNum1 = fighter1.str - fighter2.def,
            diffNum2 = fighter2.str - fighter1.def,
            dam1 = 0,
            dam2 = 0,
            howFight,
            subEnemey,
			sub,
			recreate;
		if(fighter1.name===player.name){  
		addFightText(fighter2.name + " is coming to knock you down!!!!");
		}else{
		addFightText(fighter1.name + " is coming to knock you down!!!!");
		}
        //This checks for speed. Fighter1 is always you to start with, which as you can see by the code, always gives you an advantage.
        //if SPD is equal, then you go first.
        
        while (hp1 > 0 && hp2 > 0) {
            dam1 = damageCalc(diffNum1,fighter1);
            dam2 = damageCalc(diffNum2,fighter2);
            hp2 -= dam1;
            if (hp2 > 0) {
                break;
            }
            hp1 -= dam2;
            if (hp1 > 0) {
                break;
            }
        }
        //We use the name to determine who is the hero.
        if (fighter1.name === player.name) {
			
            if (hp1 > hp2) {
                addFightText("**********************");
                addFightText("You win and in doing so gain " + rooms[roomNum].enemy.exp + " exp");
                addFightText("You gain " + fighter2.moneyDrop + " money!!");
                addFightText("**********************");
                player.expTotal += fighter2.exp;
                player.expForLevel += fighter2.exp;
                player.money += fighter2.moneyDrop;
                player.expChange();
                player.updateMoney();
                fighter2.drop();
                //I use this to remove the enemy from the room for 60 seconds.
                subEnemy = rooms[roomNum].enemy;
                rooms[roomNum].enemy = "0";
                recreate = setTimeout(rooms[roomNum].enemy = subEnemy, convTime(60));
                if (player.expForLevel >= player.expToLevel) {
                    player.levelUp();
                }
            } else {
                addResultText("you Lost. You lose half of your money");
                player.money = Math.round(player.money * 0.5);
                player.updateMoney();
            }
        } else {
            if (hp2 > hp1) {
                addFightText("**********************");
                addFightText("You win and in doing so gain " + rooms[roomNum].enemy.exp + " exp");
                addFightText("You gain " + fighter1.moneyDrop + " money!!");
                addFightText("**********************");
                player.expTotal += fighter1.enemy.exp;
                player.expForLevel += fighter1.enemy.exp;
                player.money += fighter1.moneyDrop;
                player.expChange();
                player.updateMoney();
                fighter1.drop();
                subEnemy = rooms[roomNum].enemy;
                rooms[roomNum].enemy = "0";
                recreate = setTimeout(rooms[roomNum].enemy = subEnemy, convTime(60));
                if (player.expForLevel >= player.expToLevel) {
                    player.levelUp();
                }
            } else {
                addFightText("you Lost. You lose half of your money");
                player.money = Math.round(player.money * 0.5);
                player.updateMoney();
            }

        }
    }



    //These are my shops
    
    var shop1 = new cmud.Shop([sword], [potion, superpotion], " Are you new here? Buy my stuff and you will always come back");
    room0.shop = shop1;

    function shopDisp(place) {
        var weps = place.shopWeapons,
            ites = place.shopItems,
            wares = weps.concat(ites),
            j = 0,
            k = 0,
            i = 0,
            wLen = weps.length,
            iLen = ites.length,
            waLen = wares.length,
            sellOrBuy,
            bCount,
            whatBuy,
            pWares = player.inv.weapons.concat(player.inv.items),
            psLen = pWares.length,
            indNum,
            p = 0,
            sellChoice,
            buyMore = true,
            leaveShop = true,
            indItemNum;
        while (leaveShop) {
            sellOrBuy = prompt("Do you want to sell or buy? Type exit to leave").toLowerCase();
            switch (sellOrBuy) {
            case "buy":
                addShopText("$$$$$$$$$$$$$$$$$$$$");
                addShopText(place.shopMessage);
                addShopText(" ");
                for (j = 0; j < wLen; j++) {
                    addShopText(weps[j].name + " Str: " + weps[j].str + " Price:" + weps[j].price);
                }
                addShopText(" ");
                for (k = 0; k < iLen; k++) {
                    addShopText(ites[k].name + " Effect: " + ites[k].desc + " Price:" + ites[k].price);
                    addShopText(" ");
                }
                addShopText("$$$$$$$$$$$$$$$$$$$$");
                while (buyMore) {
                    bCount = 0;
                    whatBuy = prompt("What do you want to buy. Type menu to go back.").toLowerCase();
                    if (whatBuy === "menu") {
                        buyMore = false;
                        break;
                    }
                    //Here I need to make sure that I check to find what items needs buying. I then move it to the player.inv array.
                    //also need to add type to items so that it can go to the correct array in the INV object.
                    for (i = 0; i < waLen; i++) {
                        if (whatBuy === wares[i].name.toLowerCase()) {
                            bCount++;
                            if (player.money >= wares[i].price) {
                                if (wares[i].type === "weapon") {
                                    player.inv.weapons.push(wares[i]);
                                    player.money -= wares[i].price;
                                    player.updateMoney();
                                    break;
                                }
                                if (wares[i].type === "item") {
                                    player.inv.items.push(wares[i]);
                                    player.money -= wares[i].price;
                                    player.updateMoney();
                                    break;
                                }
                                //we don't have what we need here yet. This will be for Armor
                            } else {
                                addShopText("You do not have enough money to buy this.");
                            }
                        }
                    }
                    if (bCount === 0) {
                        addShopText("We do not sell this here.");
                    }
                }
                break;

            case "sell":

                for (j = 0; j < psLen; j++) {
                    addShopText(pWares);
                }
                sellChoice = prompt("What do you want to sell. Type menu to go back.").toLowerCase();
                if (sellChoice === "menu") {
                    buyMore = false;
                    break;
                }
                for (p = 0; p < pWares.length; p++) {
                    if (sellChoice === pWares[p].name.toLowerCase()) {
                        addShopText("Thanks for your business!!");
                        player.money += pWares[p].saleValue;
                        player.updateMoney();
                        if (pWares[p].type === "weapon") {
                            indNum = player.inv.weapons.indexOf(pWares[p]);
                            delete player.inv.weapons[indNum];
                            player.inv.weapons.splice(indNum, 1);
                            break;
                        }
                        if (pWares[p].type === "item") {
                            indItemNum = player.inv.weapons.indexOf(pWares[p]);
                            delete player.inv.items[indItemNum];
                            player.inv.items.splice(indItemNum, 1);
                            break;
                        }

                    }
                }
                break;
            case "exit":
                leaveShop = false;
                addShopText("Have a great day!!");
                break;
            default:
                addShopText("I am sorry, I didn't understand you!!");
                break;
            }
        }
        //This is basically my menu type thing

    }

    function roomDisplayer() {
        //Default room number is 0. which is the first item in the rooms array.
        var disRoom = rooms[roomNum],
            roomDir = [],
            whatDo,
            dirs;
		function changeName(){
			var newName = prompt("What do you want to change your name too?");
			player.name = newName;
			document.getElementById("name").innerHTML = "Name: " + newName + " "
		}
        function displayInv() {
            addResultText("Weapons: " + player.inv.weapons);
            addResultText("Items: " + player.inv.items);
        }

        function showShop() {
            if (disRoom.shop === undefined) {
                addResultText("There are no shops here.");
            } else {
                shopDisp(disRoom.shop);
            }
        }

        function equipStuff() {
            var equ,
                ec = 0,
                choice,
                i = 0,
                pwLen = player.inv.weapons.length;
            choice = prompt("What do you want to equip?").toLowerCase();
            for (i = 0; i < pwLen; i++) {
                if (choice === player.inv.weapons[i].name) {
                    ec++;
                    equ = player.inv.weapons[i];
                    break;
                }

            }
            if (ec > 0) {
                player.wEquip(equ);
            } else {
                addResultText("You do not have this Item");
            }
        }


        function move() {
            var cardinal = prompt("Which direction do you want to move?").toUpperCase(),
                where;
            if (disRoom.exits[cardinal] !== undefined) {
                where = disRoom.exits[cardinal];
            } else {
                addResultText("cannot go that way");
                return;
            }
            where = parseInt(where, 10);
            //Here I want to make a way to make sure we can go to that room
            if (rooms[where].canGo) {
                roomNum = where;
            } else {
                //I can eventually make this a message the each blocking place has so that it is customized. For instance, police block road. They are doing blah blah
                addResultText("You cannot go this way yet.");
            }
        }

        function displayStats() {
            addResultText("lvl:" + player.lvl + " Str:" + player.str + " Def:" + player.def + " SPD:" + player.spd + " HP:" + player.hp);
            addResultText("Total EXP:" + player.expTotal + " Exp for level:" + player.expForLevel + " Exp To level:" + player.expToLevel + " Money:" + player.money);
        }
        for (dirs in disRoom.exits) {
            roomDir.push(dirs);
        }

        addMoveText(disRoom.desc);
		addDirText("You can leave this way: "+ roomDir);
        if (disRoom.enemy !== 0) {
            addFightText(disRoom.enemyMess);
        }
        whatDo = prompt("What do you want to do");
        switch (whatDo.toLowerCase()) {
        case "fight":
            fight();
            break;
        case "move":
            move();
            break;
        case "stats":
            displayStats();
            break;
        case "equip":
            equipStuff();
            break;
        case "inv":
            displayInv();
            break;
        case "shop":
            showShop();
            break;
		case "change name":
			changeName();
			break;
        case "exit":
            addResultText("Time to leave");
            gameOn = false;
            break;
        default:
            addResultText("Not sure I understand what is going on");
            break;
        }
    }

    function intro() {
        document.getElementById("result").innerHTML = "";
        var nam = prompt("Please give us your name slave");
        player.name = nam;
        $("#player").children().css("border", "2px groove black");
        document.getElementById("name").innerHTML = "Name: " + nam + " ";
        player.updateStats();
        player.updateMoney();
        document.getElementById("exp").innerHTML = "EXP Till Next Level: " + player.expToNext + " ";
        addResultText(player.name + " is our brave hero. He will win");
    }

    //right now this is my  main game loop

    while (gameOn) {

        if (introCount === 0) {

            intro();
            introCount++;
        }
        roomDisplayer();

    }
}
$("#start").click(game);