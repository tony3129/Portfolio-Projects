/*Button to auto scroll back to top of page*/
let btnBackToTop = document.getElementById("btnBackToTop");
/**
 * if user scrolls past 20px from top, show button
 */
window.onscroll = function(){
    scrollFunction();
}

function scrollFunction(){
    /**
     * two ifs for safari, chrome, firefox, etc
     */
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop >20){
        btnBackToTop.style.display = "block";
    }
    else{
        btnBackToTop.style.display = "none"
    }
}

function backToTop(){
    window.scroll({top: 0, behavior: "smooth"})
}

