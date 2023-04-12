const selectionbox1 = document.getElementById('selectionbox1'),
selectionbox2 = document.getElementById('selectionbox2'),
selectrecordbox = document.getElementById('selectrecordbox'),
exportrecordbox = document.getElementById('exportrecordbox'),
box1cancel = document.getElementById('box1-cancel'),
box2cancel = document.getElementById('box2-cancel'),
detailedreportbox = document.getElementById('detailedreportbox'),
detailedbox = document.getElementById('detailedbox'),
detailedcancel = document.getElementById('detailedcancel')
;

detailedreportbox.addEventListener('click', ()=>{
    detailedbox.style.display = 'block';
});

detailedcancel.addEventListener('click', ()=>{
    detailedbox.style.display = 'none';
});

selectrecordbox.addEventListener('click', ()=>{
    selectionbox1.style.display = 'block';
});

exportrecordbox.addEventListener('click', ()=>{
    selectionbox2.style.display = 'block';
});

box1cancel.addEventListener('click', ()=>{
    selectionbox1.style.display = 'none';
});

box2cancel.addEventListener('click', ()=>{
    selectionbox2.style.display = 'none';
});
