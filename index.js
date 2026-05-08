let money = 0;
class Ticket{
    constructor(name,width,height,winning_imgs,losing_imgs,max,min){
        this.name = name;

        //Dimensions
        this.width = width;
        this.height = height;

        //Images
        this.winning_imgs = winning_imgs;
        this.losing_imgs = losing_imgs;
        
        //Cell Values
        this.max = max;
        this.min = min;

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
                if(chance>.95){
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
        super("Base Ticket",5,5,winning_imgs,losing_imgs,5,1)
    }
}

const test_ticket = new Base_Ticket();
function randint(min,max){
    return Math.floor(Math.random()*(max-min)+min);
}

function addMoney(value){
    money += value;
    const addition = document.createElement("p");
    const money_amount = document.getElementById("money-amount");
    const body = document.getElementsByTagName("body")[0];
    addition.className = "addition";
    addition.style.top = money_amount.style.top;
    addition.style.left = money_amount.style.left;
    addition.textContent = `+${value}`;

    body.appendChild(addition);
    money_amount.textContent = money;
}
function gen_lottery(ticket){
    console.log(ticket);
    const width = ticket.width;
    const height = ticket.height;
    const cells = document.getElementById("cells");
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
                    console.log(cellObj);
                    addMoney(cellObj.value);
                }
                
            }

            cell.getElementsByTagName("img")[0].style.opacity = 0;
            cell.getElementsByTagName("p")[0].style.opacity = 0;
            cell_row.appendChild(cell);
        }
        cells.appendChild(cell_row);
    }
    for(let i =0;i<ticket.winning_imgs.length;i++){
        const winners = document.getElementById("winners");
        const winning_img = document.createElement("img");
        winning_img.src = ticket.winning_imgs[i];
        winners.appendChild(winning_img);
    }
}
console.log(test_ticket);
gen_lottery(test_ticket);