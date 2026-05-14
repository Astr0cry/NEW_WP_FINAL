
class Item{
    constructor(name,price,description){
        this.name=name;
        this.price = price
        this.description=description;
        this.img = `resources/images/items/${this.name}.png`;
    }
}

class Booster extends Item{
    constructor(name,price,description,stat,increment){
        super(name,price,description);
        this.stat = stat;
        this.increment = increment;
    }
    use(player){
        switch(this.stat){
            case "luckBoost":
                player.luckBoost+=this.increment;
            break;
            case "winBoost":
                player.winBoost+=this.increment;
            break;
        }
    }
}

class FluffyDice extends Booster{
    constructor(){
        super("Fluffy Dice",10,"Adds 0.01 to Luck Boost","luckBoost",.01);
    }
}

class TwoOfDiamonds extends Booster{
    constructor(){
        super("2 of Diamonds",50,"Adds 1 to Win Boost","winBoost",1);
    }
}

class Player{
    constructor(){
        this.money = 0;
        this.items = {
            "Booster":{}
        };
        this.tickets = {};
        this.winBoost = 0;
        this.luckBoost = 0;
    }

    addItem(item){
        if(item instanceof Item){
            if(item instanceof Booster){
                if(item.name in this.items["Booster"]){
                    this.items["Booster"][item.name][1]++
                }
                else{
                    this.items["Booster"][item.name]= [item,1];
                }
                item.use(this);
            }
        }

        else if(item instanceof Ticket){
            console.log("Ticket");
        }
    }
}

class Ticket{
    constructor(name,width,height,winning_imgs,losing_imgs,max,min,winSFX,price){
        this.name = name;
        this.price = price;
        //Dimensions
        this.width = width;
        this.height = height;

        //Images
        this.winning_imgs = winning_imgs;
        this.losing_imgs = losing_imgs;
        
        //Cell Values
        this.max = max;
        this.min = min;

        this.winSFX = winSFX;

        //Cell Class
        this.Cell = class{
            constructor(img,value){
                this.img = img;
                this.value = value;
            }
        }

        this.cellArray = this.genCellArray();
    }

    genCellArray(){
        let cellArray = []
        for(let r = 0; r<this.height;r++){
            let row = []
            for(let i = 0;i<this.width;i++){
                const chance = Math.random();
                const value = randint(this.min,this.max);
                let chosen_imgs = null
                if(chance>.95-(player.luckBoost)){
                    chosen_imgs = this.winning_imgs;
                }
                else{
                    chosen_imgs = this.losing_imgs;
                }
                const cell = new this.Cell(chosen_imgs[randint(0,chosen_imgs.length)],value);
                row.push(cell);
            }
            cellArray.push(row);
        }
        return cellArray
    }
}

class Base_Ticket extends Ticket{
    constructor(){
        const winning_imgs = [
            "resources/images/ticket_images/base_ticket/cherries.png",
            "resources/images/ticket_images/base_ticket/lemon.png",
            "resources/images/ticket_images/base_ticket/seven.png"
        ]
        const losing_imgs = [
            "resources/images/favicon/fav.png"
        ]
        const winSFX = "resources/audio/base_ticket/collect.mp3";

        super("Base Ticket",5,5,winning_imgs,losing_imgs,5,1,winSFX,0)
    }
}

class Premium_Ticket extends Ticket{
    constructor(){
        const winning_imgs = [
            "resources/images/ticket_images/premium_ticket/heart.png",
            "resources/images/ticket_images/premium_ticket/spade.png",
            "resources/images/ticket_images/premium_ticket/diamond.png"
        ]
        const losing_imgs = [
            "resources/images/ticket_images/premium_ticket/joker.png"
        ]
        const winSFX = "resources/audio/base_ticket/collect.mp3";

        super("Premium Ticket",5,5,winning_imgs,losing_imgs,50,10,winSFX,10)
    }
}

const player = new Player();

const test_ticket = new Base_Ticket();

function popupButton(element){
    const popups = document.getElementsByClassName("popup");
    for(let i =0;i<popups.length;i++){
        const popup = popups[i];
        if(popup.classList.contains("active-popup") && popup!==document.getElementById(`${element.id}-popup`)){
            popup.classList.remove("active-popup");
            popup.classList.add("deactive-popup");
        }
    }
    const popup = document.getElementById(`${element.id}-popup`);
    if(popup.classList.contains("active-popup")){
        popup.classList.remove("active-popup");
        popup.classList.add("deactive-popup");
    }
    else{
        popup.classList.remove("deactive-popup");
        popup.classList.add("active-popup");
    }
    
}

function randint(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}




function remove(element){
    const body = document.getElementsByTagName("body")[0];
    setTimeout(() => {
        body.removeChild(element);
    }, 2000);
}


function gen_inventory(){
    const inventoryContents = document.getElementById("inventory-contents");
    inventoryContents.replaceChildren();
    for(item_type in player.items){
        for(item in player.items[item_type]){
            const itemElement = document.createElement("div");
            itemElement.className = "inventory-item";
            itemElement.innerHTML = `<img src='${player.items[item_type][item][0].img}'><p>${player.items[item_type][item][1]}`;
            inventoryContents.appendChild(itemElement);
        }
    }
}

function addMoney(value){
    const addition = document.createElement("p");
    const money_amount = document.getElementById("money-amount");
    const money_amount_body = money_amount.getBoundingClientRect();
    const body = document.getElementsByTagName("body")[0];
    if(value>0){
        value = value* (1+player.winBoost);
        addition.textContent = `+$${value}`;
    }
    else{
        addition.style.color = "red";
        addition.textContent = `-$${value}`
    }
    player.money += value;
    addition.className = "addition";
    addition.style.top = `${money_amount_body.top}px`;
    addition.style.left = `${money_amount_body.left}px`;

    body.appendChild(addition);
    remove(addition);
    money_amount.textContent = player.money;
}

function setHeaderButtons(){
    const buttons = document.getElementsByClassName("header-button");
    console.log(buttons);
    for(let i =0;i<buttons.length;i++){
        const button = buttons[i];
        button.onclick = ()=>{ popupButton(button);}
    }
}

function gen_lottery(ticket){

    const width = ticket.width;
    const height = ticket.height;

    const cells = document.getElementById("cells");
    cells.replaceChildren()
    const ticket_name = document.getElementById("ticket-name");

    ticket_name.textContent = ticket.name;

    for(let r = 0;r<height;r++){

        const cell_row = document.createElement("div");
        cell_row.className = "cell-row";

        for(let i =0;i<width;i++){

            const cell = document.createElement("div");
            const cellObj = ticket.cellArray[r][i];
            cell.className = "cell";
            cell.innerHTML = `<img src = ${cellObj.img}> <p>$${cellObj.value}</p>`;

            cell.onclick = function (){

                const img = cell.getElementsByTagName("img")[0]
                const p = cell.getElementsByTagName("p")[0]

                p.style.opacity = Number(p.style.opacity) + .2;
                img.style.opacity = Number(img.style.opacity) + .2;

                if(p.style.opacity =='1'){

                    this.onclick = null;

                    if(ticket.winning_imgs.includes(cellObj.img)){

                        const winSFX = new Audio(ticket.winSFX);
                        winSFX.play();
                        addMoney(cellObj.value);
                    }
                    else{
                        
                    }
                }
                
            }

            cell.getElementsByTagName("img")[0].style.opacity = 0;
            cell.getElementsByTagName("p")[0].style.opacity = 0;
            cell_row.appendChild(cell);
        }
        cells.appendChild(cell_row);
    }
    const winners = document.getElementById("winners");
    winners.replaceChildren();
    for(let i =0;i<ticket.winning_imgs.length;i++){
        const winning_img = document.createElement("img");
        winning_img.src = ticket.winning_imgs[i];
        winners.appendChild(winning_img);
    }
}
function gen_shops(){
    const tickets = [Base_Ticket,Premium_Ticket]
    const items = [FluffyDice,TwoOfDiamonds];
    const shopItems = document.getElementById("shop-items");

    for(let i = 0;i<items.length;i++){
        const item = new items[i]();
        const shop_item = document.createElement("div");
        shop_item.className = "shop-item";
        shop_item.classList.add("handjet")
        shop_item.innerHTML = `<img src='${item.img}'>
                    <div class = "item-info">
                        <p>${item.name} ($${item.price})</p>
                        <p>${item.description}</p>
                    </div>
                    <div class = "buy-button">
                        <p>Buy</p>
                    </div>`
        const buyButton = shop_item.getElementsByClassName("buy-button")[0];
        buyButton.onclick = function (){
            if(player.money >= item.price){
                addMoney(-item.price);
                player.addItem(new items[i]());
                gen_inventory();
                
            }
        }
        shopItems.appendChild(shop_item);

    }

    const ticket_items = document.getElementById("ticket-items");

        for(let i = 0; i<tickets.length;i++){
            const ticket = new tickets[i]();
            const ticket_item = document.createElement("div");
            ticket_item.className = "shop-item"
            ticket_item.classList.add("handjet");
            ticket_item.innerHTML = `
                    <div class = "item-info">
                        <p>${ticket.name} ($${ticket.price})</p>
                    </div>
                    <div class = "buy-button">
                        <p>Buy</p>
                    </div>`
            const buyButton = ticket_item.getElementsByClassName("buy-button")[0];
            buyButton.onclick = function() {
                if(player.money >= ticket.price){
                addMoney(-ticket.price);
                gen_lottery(new tickets[i]());
                
            }
            }
            ticket_items.appendChild(ticket_item);

        }
}
gen_shops();
gen_inventory();
setHeaderButtons();
gen_lottery(test_ticket);