let currentSong = new Audio();
let songs;
let currFolder;
function SecondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Round to the nearest second
  seconds = Math.round(seconds);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}




async function getsongs(folder) {
  currFolder = folder;
    let a = await fetch(`${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
  
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split(`/${folder}/`)[1]);
      }
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = ""
    
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML += `<li>
        <img  class= "invert img" src="music.svg" alt="" width="25px" height="25px">
        <div class="info">
        <div> ${decodeURIComponent(song)} </div>

        <div >  </div>
           </div>
           <div class="playnow">
            <span> Play Now </span>
    <img class="invert" src="play.svg" alt="" width="25px" height="25px">
</div>  </li>`; }
    
    Array.from (document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
      e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

      })
   })
   
    return songs;
  }
   const playMusic = (track, pause=false)=>{
      currentSong.src = `/${currFolder}/`+ track
      if(!pause){
        currentSong.play()
        play.src = "pause.svg"
      }  
      document.querySelector(".songinfo").innerHTML = decodeURI(track)   
       document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
   }
      async function displayAlbums(){
        
        let a = await fetch(`songs`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
         let anchors =div.getElementsByTagName("a")
        Array.from (anchors).forEach(async e=> { 
          if(e.href.includes("songs")){
          let folder = e.href.split("/").slice(-2)[0]
          
          }
        })
        console.log(anchors)
     
      }
  async function main() {
     
  displayAlbums()

    songs = await getsongs("songs/ncs");
    playMusic(songs[0],true)
  
      play.addEventListener("click",() => {
        if(currentSong.paused){
          currentSong.play()
          play.src = "pause.svg"
        }
        else{
          currentSong.pause()
          play.src = "play.svg"
        }
      })
   currentSong.addEventListener("timeupdate" ,() =>{
    // console.log(currentSong.currentTime , currentSong.duration);
     document.querySelector(".songtime").innerHTML = 
     `${SecondsToMinutesSeconds(currentSong.currentTime)} 
      / ${SecondsToMinutesSeconds(currentSong.duration)}`;
     document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)
     * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
      const circle = document.querySelector(".circle");
    
      if (circle) {
        let percent = (e.offsetX / e.currentTarget.clientWidth) * 100;
        circle.style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
      }
    });
    document.querySelector(".hamburger").addEventListener("click",() =>{
           document.querySelector(".left").style.left = "0"
    })
          
    document.querySelector(".close").addEventListener("click",() =>{
      document.querySelector(".left").style.left = "-120%"
})
previous.addEventListener("click", () => {
  console.log("Previous Clicked");
  console.log("currentSong.src:", currentSong?.src);
  let index = songs.lastIndexOf(currentSong?.src.split("/").slice(-1)[0]); 
  console.log("songs:", songs, "index:", index);
  if (index >= 1) {
    playMusic(songs[index - 1]);
  }   
});        
next.addEventListener("click", () => {
  console.log("Next Clicked");
  let index = songs.lastIndexOf(currentSong?.src.split("/").slice(-1)[0]);
  console.log("songs:", songs, "index:", index);
  if (index < songs.length - 1) {
    playMusic(songs[index + 1]);
  }
});
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("setting volume to" ,e.target.value, "/100");
    currentSong.volume = parseInt(e.target.value) / 100;
});

Array.from(document.getElementsByClassName("card")).forEach(e => { 
  console.log(e);
  e.addEventListener("click", async item => {
    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    playMusic(songs[0]);
})

});
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
  console.log("Setting volume to", e.target.value, "/ 100");
  currentSong.volume = parseInt(e.target.value) / 100;

  // Check if volume is zero, then replace the volume icon with mute icon
  if (currentSong.volume === 0) {
    document.querySelector(".volume>img").src = "mute.svg";
  } else {
    document.querySelector(".volume>img").src = "volume.svg";
  }
});
if (currentSong.volume === 0) {
  document.querySelector(".volume>img").src = "mute.svg";
} else {
  document.querySelector(".volume>img").src = "volume.svg";
}

document.querySelector(".volume>img").addEventListener("click", e=>{ 
  if(e.target.src.includes("volume.svg")){
      e.target.src = e.target.src.replace("volume.svg", "mute.svg")
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
      e.target.src = e.target.src.replace("mute.svg", "volume.svg")
      currentSong.volume = .10;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
  }

})

}
  main();
  