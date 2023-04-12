
const lateRegistrationSelection = document.querySelector('#lateRegistrationSelection'),
lateamountbox = document.querySelector('#late-amount-box'),
amountreg = document.querySelector('#amount-late');

lateRegistrationSelection.addEventListener('change', ()=>{

let index = lateRegistrationSelection.selectedIndex;

if(index == 1){
    lateamountbox.style.display = 'block';
    amountreg.setAttribute('required', true);
}
if(index == 2){
    amountreg.removeAttribute('required');
    amountreg.value = "";
    lateamountbox.style.display = 'none';
} 
});
