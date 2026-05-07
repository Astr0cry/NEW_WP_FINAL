
class Ticket{
    constructor(name,width,height,winning_imgs,losing_imgs){
        this.name = name;
        this.width = width;
        this.height = height;
        this.winning_imgs = winning_imgs;
        this.losing_imgs = losing_imgs;
        this.cellArray = this.genCellArray();
    }

    genCellArray(){
        let cellArray = []
        for(let r = 0; r<this.height;r++){
            let row = []
            for(let i = 0;i<this.width;i++){
                const chance = Math.random();
                let chosen_imgs = null
                if(chance>.95){
                    chosen_imgs = this.winning_imgs;
                }
                else{
                    chosen_imgs = this.losing_imgs;
                }
                const cell = chosen_imgs[randint(0,chosen_imgs.length)];
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
        super("Base Ticket",5,5,winning_imgs,losing_imgs)
    }
}

const test_ticket = new Base_Ticket();
function randint(min,max){
    return Math.floor(Math.random()*(max-min)+min);
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
            cell.className = "cell";
            cell.innerHTML = `<img src = ${ticket.cellArray[r][i]}>`;
            
            cell.getElementsByTagName("img")[0].style.opacity = 10;
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