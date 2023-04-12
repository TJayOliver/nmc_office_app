let behalfof = document.querySelector('#collected'),
takenby = document.querySelector('#takenby'),
takenphone = document.querySelector('#takenphone'),
label = document.querySelector('#lab1'),
label2 = document.querySelector('#lab2')

behalfof.addEventListener('change', ()=>{
    let behalf = behalfof.selectedIndex;
    
    if(behalf == 2){
        takenby.style.display = 'inline-block';
        takenphone.style.display = 'inline-block';
        label.style.display = 'inline-block';
        label2.style.display = 'inline-block';
    }
    if(behalf == 1){
        // if SELF is selected, hide the boxes and clear the values of taken by and phone number;
        takenby.removeAttribute('required');
        takenphone.removeAttribute('required');

        takenby.style.display = 'none';
        takenphone.style.display = 'none';
        label.style.display = 'none';
        label2.style.display = 'none';

        takenby.value = '';
        takenphone.value = ''
    }
});


