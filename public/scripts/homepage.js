//Slide Show

let nextslide = document.querySelector('#nextslide'),
prevslide = document.querySelector('#prevslide'),
slides = document.querySelectorAll('.slide');

let slidecount = 0;

nextslide.addEventListener('click',()=>{
    prevslide.style.display = 'block';
    nextslide.style.display = 'none';
    slidecount++;
    reveal()
});
prevslide.addEventListener('click',()=>{
    prevslide.style.display = 'none';
    nextslide.style.display = 'block';
    slidecount--;
    reveal()
});

function reveal(){
    slides.forEach(slide =>{
        if(slide.classList.contains('active')){
            slide.classList.remove('active')
        }
    })
    slides[slidecount].classList.add('active');
}