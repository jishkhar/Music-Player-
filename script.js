// console.log("Music Player");

// document.title = "Music Player"

async function getSongs(){

    let a  = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    
    let songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".m4a")){
            songs.push(element.href)
        }
    }
    return songs;
}

getSongs()