const lateRegistrationSelectionn = document.querySelector('#lateRegistrationSelection'),
lateamountboxx = document.querySelector('#late-amount-box'),
amountregg = document.querySelector('#amount-late'),
receiptbox = document.querySelector('#late-receipt-box'),
latereceipt = document.querySelector('#late-receipt'),
transactionbox = document.querySelector('#transaction-box'),
latetransactionnumber = document.querySelector('#late-transaction-number'),
penaltybank = document.querySelector('#bank-penalty'),
bankbox = document.querySelector('#bank-box');

lateRegistrationSelectionn.addEventListener('change', ()=>{

    let index = lateRegistrationSelectionn.selectedIndex;

    if(index == 1){
        lateamountboxx.style.display = 'block';
        receiptbox.style.display = 'block';
        transactionbox.style.display = 'block';
        bankbox.style.display = 'block';
    }
    if(index == 2){
        amountregg.removeAttribute('required')
        latereceipt.removeAttribute('required')
        penaltybank.removeAttribute('required')
        latetransactionnumber.removeAttribute('required')

        amountregg.value = "";
        latereceipt.value = "";
        penaltybank.value = "";
        latetransactionnumber.value = "";

        lateamountboxx.style.display = 'none';
        receiptbox.style.display = 'none';
        transactionbox.style.display = 'none';
        bankbox.style.display = 'none';
    } 
});

window.addEventListener('load', ()=>{
    const newindex = lateRegistrationSelectionn.selectedIndex;
    if(newindex == 2){
        latereceipt.style.pointerEvents = "none";
        latetransactionnumber.style.pointerEvents = "none";
        penaltybank.style.pointerEvents = "none";
        amountregg.style.pointerEvents = "none";
    };

    lateRegistrationSelectionn.addEventListener('change', ()=>{
        let newIndex = lateRegistrationSelectionn.selectedIndex;
        if(newIndex != 2){
            amountregg.style.pointerEvents = "auto";
        } else {
            amountregg.style.pointerEvents = "none";
        }
    });
});
