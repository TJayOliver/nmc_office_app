
const lateCertificateSelection = document.querySelector('#lateCertificateSelection'),
lateamountbox = document.querySelector('#late-amount-box'),
amountreg = document.getElementById('amount-late');

// change the display of amount paid, receipt number, bank and transaction ref #
lateCertificateSelection.addEventListener('change', ()=>{

let index = lateCertificateSelection.selectedIndex;

// if yes is selected, display the boxes
if(index == 1){
    lateamountbox.style.display = 'block';
}

// if no is selected, hide the boxes and clear the values of amount, bank, receipt and transactionref
if(index == 2){
    
    lateamountbox.style.display = 'none';
    amountreg.removeAttribute('required');
    amountreg.value = "";
}

});
