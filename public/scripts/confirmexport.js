const confirmYes = document.getElementById('confirm-yes');
const confirmClose = document.getElementById('confirm-close');
const confirmExport = document.getElementById('confirm-export');
const exportbtn = document.getElementById('export');

exportbtn.addEventListener('click', ()=>{
    confirmExport.style.display = 'block';
});

confirmClose.addEventListener('click', ()=>{
    confirmExport.style.display = 'none';
});
