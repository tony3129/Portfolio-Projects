function openNav(){
    let sideNav = document.getElementById("sideNav");
    let main = document.getElementById("main");
    let screenWidth = window.innerWidth;


    if(screenWidth <= 480){
        sideNav.style.width = "100%";

    }
    else{
        sideNav.style.width = "250px";
        main.style.marginLeft = "250px";
    }

    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav(){
    let sideNav = document.getElementById("sideNav");
    let main = document.getElementById("main");

    sideNav.style.width = "0";
    main.style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
}

function logout(){
    let logout = document.getElementById("logout");

    logout.style.display = "none";
}