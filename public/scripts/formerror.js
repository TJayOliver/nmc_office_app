// close error message box
const errorclose = document.getElementById('error-close'),
errorbox = document.getElementById('errorbox');

errorclose.addEventListener('click', ()=>{
    errorbox.style.display = 'none';
});

