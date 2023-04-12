// mobile menu slider
let mobileslider = document.querySelector('#mobile'),
hamburger = document.querySelector('.hamburger'),
times = document.querySelector('.times');

hamburger.addEventListener('click', ()=>{
    hamburger.style.display = 'none';
    times.style.visibility = 'visible';
    mobileslider.style.transform = 'translateX(0px)';

    times.addEventListener('click', ()=>{
        hamburger.style.display = 'block';
        times.style.visibility = 'hidden';
        mobileslider.style.transform = 'translateX(980px)'
    });
});


//dark and light mode
let themebtn = document.querySelector('.theme'),
mobilethemebtn = document.querySelector('#lightmode'),
mobilethemetext = document.querySelector("#theme-text"),
whiteicon = document.querySelector("#whiteicon"),
searchicon = document.querySelectorAll('#searchicon'),
searchtext = document.querySelector('#searchtext'),
searchiconwhite = document.querySelectorAll('#searchicon-white'),
whitemenuicon = document.querySelectorAll('.whitemenuicon'),
blackmenuicon = document.querySelectorAll('.blackmenuicon');
 

themebtn.addEventListener('click', ()=>{
    document.body.classList.toggle('whitemode');

    blackmenuicon.forEach(icon =>{
        icon.style.opacity = 1;
    });
    //blackmenuicon.style.opacity = 1;
    
    // update the local storage when brightness is clicked
    if(localStorage.getItem('mode') == 'dark'){
        localStorage.setItem('mode', 'light');
        whiteicon.style.opacity = 0;

        whitemenuicon.forEach(icon =>{
            icon.style.opacity = 0;
        });
        //whitemenuicon.style.opacity = 0
        
    }
    else{
        localStorage.setItem('mode', 'dark');
        whiteicon.style.opacity = 1;

        whitemenuicon.forEach(icon =>{
            icon.style.opacity = 1;
        });
        blackmenuicon.forEach(icon =>{
            icon.style.opacity = 1;
        });
        //whitemenuicon.style.opacity = 1
        //blackmenuicon.style.opacity = 1
    }
});

if(localStorage.getItem('mode') == 'dark'){
    document.body.classList.remove('whitemode');
    whiteicon.style.opacity = 1;

    whitemenuicon.forEach(icon =>{
        icon.style.opacity = 1;
    });
    blackmenuicon.forEach(icon =>{
        icon.style.opacity = 0;
    });
    //whitemenuicon.style.opacity = 1
    //blackmenuicon.style.opacity = 0
}
else if(localStorage.getItem('mode') == 'light'){
    document.body.classList.add('whitemode');
    whiteicon.style.opacity = 0;

    whitemenuicon.forEach(icon =>{
        icon.style.opacity = 0;
    });
    blackmenuicon.forEach(icon =>{
        icon.style.opacity = 1;
    });
    whitemenuicon.style.opacity = 0
    blackmenuicon.style.opacity = 1
}
else{
    localStorage.setItem('mode', 'dark');
}

mobilethemebtn.addEventListener('click', ()=>{
    document.body.classList.toggle('whitemode');

    // update the local storage when brightness is clicked
    if(localStorage.getItem('mode') == 'dark'){
        localStorage.setItem('mode', 'light');
        mobilethemetext.innerHTML = 'DARK THEME';
        whiteicon.style.opacity = 0;
        searchiconblack.style.display = 'block';
    }
    else{
        localStorage.setItem('mode', 'dark');
        mobilethemetext.innerHTML = 'LIGHT THEME';
        whiteicon.style.opacity = 1;
        searchiconblack.style.display = 'none';
    }
});






