function openNav(){
    sideNav = document.getElementById("sideNav");
    main = document.getElementById("main");
    links = document.getElementsByClassName("links");
    sideNav.style.width = "250px";
    main.style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    // for(link of links){
    //     link.style.backgroundColor = "rgba(0,0,0,0.4)";
    // }
}

function closeNav(){
    sideNav = document.getElementById("sideNav");
    main = document.getElementById("main");
    links = document.getElementsByClassName("links");
    sideNav.style.width = "0";
    main.style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
    // for(link of links){
    //     link.style.backgroundColor = "white";
    // }
}