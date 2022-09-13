let transfers;
let table = document.getElementById('tablebody');

// ------------------------------------------ For fetching data -------------------------------------
document.addEventListener("DOMContentLoaded", getCustomerInfo)
document.addEventListener("", getCustomerInfo)

function getCustomerInfo(){
    fetch('/trans').then(response => response.json()).then(function(data){
        transfers = data;
        console.log(transfers);
        updateTable();
    }).catch(err => console.log(err))
}

// -------------------------------------------- for updating table --------------------------------------
function updateTable(){
    table.innerHTML = "";
    transfers.forEach(element => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${element.id1}</td>
            <td>${element.id2}</td>
            <td>${element.transferred_amount}</td>
            <td>${element.date_of_transfer}</td>
        `
        table.appendChild(row);
    });
}