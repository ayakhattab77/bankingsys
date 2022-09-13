let customers_data;
let table = document.getElementById('tablebody');

// ------------------------------------------ For fetching data -------------------------------------
document.addEventListener("DOMContentLoaded", getCustomerInfo)

function getCustomerInfo(){
    fetch('/cust').then(response => response.json()).then(function(data){
        customers_data = data;
        updateTable()
        rowclick()
    }).catch(err => console.log(err))
}

// -------------------------------------------- for updating table --------------------------------------
function updateTable(){
    table.innerHTML = "";
    customers_data.forEach(element => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.email}</td>
            <td>$${element.current_balance}</td>
        `
        table.appendChild(row);
    });
    let minid = customers_data[0].id;
    let maxid = customers_data[customers_data.length - 1].id;
    for(let element of document.getElementsByClassName('minmax')){
        element.setAttribute('min', minid);
        element.setAttribute('max', maxid);
    }
}

// -----------------------------------------------for highlighting input --------------------------------
document.addEventListener("DOMContentLoaded", function(){ //for dynamic autofocus
    document.getElementById('id1').focus();
}); 

document.querySelectorAll('input[type=number]').forEach(element => element.addEventListener('focus', function(e){
    e.target.classList.remove('unhighlighted');
}));

document.querySelectorAll('input[type=number]').forEach(element => element.addEventListener('blur', function(e){
    e.target.classList.add('unhighlighted');
}));

// ----------------------------------------- for submitting data ---------------------------------------------
function hidevalidation(){
    let messages = document.querySelectorAll('.validation-messages span');
    forEach.call(messages, function(x){
        x.classList.add('hide');
    });
}

document.getElementById('submit').addEventListener('click', function(e){
    hidevalidation();
    if(document.getElementById('main-form').checkValidity())
    {
        e.preventDefault();  
        let id1 = document.getElementById('id1').value;
        let id2 = document.getElementById('id2').value;
        if(id1 != id2){
            let transfer_amount = document.getElementById('transferamount').value;

            let cust1, cust2;
            customers_data.forEach(element => {
                if(element.id == id1)
                    cust1 = element;
                else if (element.id == id2)
                    cust2 = element;
            });
            if(transfer_amount > cust1.current_balance)
                alert("Transfer amount cannot be larger than sender's current balance.")
            else {
                let id1balance = cust1.current_balance - transfer_amount;
                let id2balance = cust2.current_balance + +transfer_amount;
                
                let updatefirst = {id: id1, balance: id1balance};
                let updatesecond = {id: id2, balance: id2balance};
                postData('/updateCust', updatesecond).then(function(){postData('/updateCust', updatefirst);}).then(function(){
                    getCustomerInfo();
                    updateTable()}).then(function(){
                        let datetime = new Date();
                        postData('/updateTransfer', {id_1: id1, id_2: id2, transferred_amount: transfer_amount, date_of_transfer: datetime.toLocaleString().replace(',', '')})
                    });;
            }
        }
        else alert("You can't transfer to the same person.");
    }
});

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),      
    });
    try {
        const newData = await response.json();
        return newData; 
    }catch(error) {
    console.log('post error', error);
    }
};

// ------------------------------------------------ for validating data -----------------------------------------

let ruleNames = [];
let forEach = Array.prototype.forEach;

forEach.call(document.querySelectorAll('span[data-rule]'), function(e){
    let ruleName = e.getAttribute('data-rule');
    if(ruleNames.indexOf(ruleName) < 0){
        ruleNames.push(ruleName);
    }
});

let validate = function(){
    hidevalidation();
    document.getElementById('main-form').checkValidity();
}

let validationFail = function(e){
    let element = e.target;
    let validity = element.validity;

    if(!validity.valid){
        ruleNames.forEach(function(ruleName){
            checkRule(validity, ruleName, element);
        })
        e.preventDefault();
    }    
}

let checkRule = function(state, ruleName, element){
    if(state[ruleName]){
        let rules = element
                   .nextElementSibling
                   .querySelectorAll('[data-rule="' + ruleName + '"]');
        forEach.call(rules, function(rule){
            rule.classList.remove('hide');
      });
    }
}

let allInputElements = document.querySelectorAll('input:not(button)');
forEach.call(allInputElements, function(e){
    e.oninvalid = validationFail;
    e.onblur = validate;
})

document.getElementById('submit').addEventListener('mouseover', function(e){
    if(!document.getElementById('main-form').checkValidity())
        e.target.style.cursor = "not-allowed";
    else e.target.style.cursor = "pointer";
})

// ---------------------------------For filling in form by clicking table-----------------------------------------

function rowclick(){
    document.querySelectorAll('tr').forEach(row=>{
    row.addEventListener('click', fillID);
})};

function fillID(e){
    let id1 = document.getElementById('id1');
    let id2 = document.getElementById('id2');
    let id = e.composedPath()[1].querySelector(':first-child').innerText;
    if(!id1.value){
        id1.value = id;
        id1.focus();
    }
    else if (!id2.value){
        id2.value = id;
        id2.focus();
    }
    else {
        document.getElementById('transferamount').focus();
    }
};