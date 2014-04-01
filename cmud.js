var cmud = {
		
		Room: function (exits, desc, enemy, canGo, mess, enemyMess) {
        this.exits = exits;
        this.desc = desc;
        this.enemy = enemy;
        this.canGo = canGo;
        this.mess = mess;
        this.enemyMess = enemyMess;
    },

    Weapon: function (str, name, extra, type, price) {
        this.name = name;
        this.str = str;
        this.extra = extra;
        this.type = type;
        this.price = price;
        this.saleValue = Math.round(this.price * 0.5);

    },

    Enemy: function (name, hp, str, def, spd, exp, moneyDrop) {
        this.name = name;
        this.hp = hp;
        this.str = str;
        this.def = def;
        this.spd = spd;
        this.exp = exp;
        this.moneyDrop = moneyDrop;
    },


    Item: function (name, effect, desc, price) {
        this.name = name;
        this.effect = effect;
        this.desc = desc;
        this.price = price;
        this.type = "item";
        this.saleValue = Math.round(this.price * 0.5);
    }, 
	Shop: function(shopWeapons, shopItems, shopMessage) {
        this.shopWeapons = shopWeapons;
        this.shopItems = shopItems;
        this.shopMessage = shopMessage;
    }
}	
    