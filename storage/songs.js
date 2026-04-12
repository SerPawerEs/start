//container
const content_container = document.getElementById('content_container')
//songs_mp3
const songsnames = [
    'M.A.I', 'Dandelions', 'Mi corazon es tuyo', 'Hadal Ahbek', 'I wanna be yours'
]
const songsmp3 = songsnames.map(song => 'audios/' + song + '.mp3')
const songsloaded = []
const contents = []


songsnames.forEach((song, audio) => {
    const mp3 = songsmp3[audio]
    const audiomp3 = new Audio(mp3)
    audiomp3.loop = true
    songsloaded.push(audiomp3)
    const content = document.createElement('div')
    content.className = 'content'
    content.innerHTML = `▶️ ${song}`
    content_container.appendChild(content)
    contents.push(content)

    function playing(){
        return songsloaded.some(song => !song.paused)
    }

    content.addEventListener('click', () => {
        if(playing()){
            audiomp3.pause()
            content.innerHTML = `▶️ ${song}`
        }else{
            audiomp3.play()
            content.innerHTML = `⏸️ ${song}`
        }
    })
})


//SONGS
document.addEventListener('DOMContentLoaded', () => {
    console.log('loading songs')
})
