// console.log("Music Player");

document.title = "Music Player"

let currentsong = new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
    
    const minutes = Math.floor(seconds/60)
    const remainingSeconds = Math.floor(seconds%60)

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedMinutes}:${formattedSeconds}`
}


async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a") || element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}`)[1]);
        }
    }

    //show songs in playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music-note-03.svg" alt="music logo" class="invert">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Artist</div>
                            </div>
                            
        </li>`
    }

    //attach event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
    
    
}


const playMusic = (track) =>{
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currFolder}/` + track
    currentsong.play();
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ")
}

async function main() {
    
    
    //get the song list
    await getSongs("songs/Hindi/");
    // console.log(songs);
    currentsong.src = `/${currFolder}` + songs[0]
    document.querySelector(".songinfo").innerHTML = songs[0].replaceAll("%20", " ")
    document.querySelector(".songtime").innerHTML = `00:00/00:00`

    //attach event listener to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "pause.svg"
        }else{
            currentsong.pause()
            play.src = "play_arrow.svg"
        }
    })


    //liesten for time update event
    currentsong.addEventListener("timeupdate", ()=>{
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    //add event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", (e)=>{
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
        currentsong.currentTime = currentsong.duration * (e.offsetX/e.target.getBoundingClientRect().width);
    })

    //add an event listener to hamburger

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
        document.querySelector(".left").style.backgroundColor = "#black"
    })

    //add event listener to close

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
    })

    //add an event listener to previous and next
    previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currentsong.src.split("/").splice(-1) [0])
        if(index-1 >= 0){
            playMusic(songs[index-1])
        }
    })


    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currentsong.src.split("/").splice(-1) [0])
        if(index+1 >= length){
            playMusic(songs[index+1])
        }
    })


    //add event listener to volume range bar
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentsong.volume = parseInt(e.target.value)/100
    })



    //load the playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            // console.log(item.currentTarget.dataset.folder);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`)
        })
    })


    

}

main();
