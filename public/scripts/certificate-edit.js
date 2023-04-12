
const lateCertificateSelectionn = document.querySelector('#lateCertificateSelection'),
lateamountboxx = document.querySelector('#late-amount-box'),
amountregg = document.getElementById('amount-late'),
receiptbox = document.querySelector('#late-receipt-box'),
latereceipt = document.querySelector('#late-receipt'),
transactionbox = document.querySelector('#transaction-box'),
latetransactionnumber = document.querySelector('#late-transaction-number'),
penaltybank = document.querySelector('#bank-penalty'),
bankbox = document.querySelector('#bank-box');

// change the display of amount paid, receipt number, bank and transaction ref #
lateCertificateSelectionn.addEventListener('change', ()=>{

let index = lateCertificateSelectionn.selectedIndex;

// if yes is selected, display the boxes
if(index == 1){
    lateamountboxx.style.display = 'block';
    receiptbox.style.display = 'block';
    transactionbox.style.display = 'block';
    bankbox.style.display = 'block';  

    amountregg.setAttribute('required');
}

// if no is selected, hide the boxes and clear the values of amount, bank, receipt and transactionref
if(index == 2){
    
    lateamountboxx.style.display = 'none';
    receiptbox.style.display = 'none';
    transactionbox.style.display = 'none';
    bankbox.style.display = 'none';

    amountregg.removeAttribute('required');
    latereceipt.removeAttribute('required');
    latetransactionnumber.removeAttribute('required');
    penaltybank.removeAttribute('required');

    amountregg.value = "";
    penaltybank.value = "";
    latereceipt.value = "";
    latetransactionnumber.value = "";
}

});

window.addEventListener('load',()=>{
let newindex = lateCertificateSelectionn.selectedIndex;

    if(newindex !== 1){
        penaltybank.style.pointerEvents = 'none';
        receiptbox.style.pointerEvents = 'none';
        transactionbox.style.pointerEvents = 'none';

        amountregg.removeAttribute('required');
        latereceipt.removeAttribute('required');
        latetransactionnumber.removeAttribute('required');
        penaltybank.removeAttribute('required');
    }
})
