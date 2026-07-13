//container
const content_container = document.getElementById('content_container')
const scont = document.getElementById('scont')
//songs_mp3
const songsnames = [
    'M.A.I', 'Dandelions', 'Mi corazon es tuyo', 'Hadal Ahbek', 'I wanna be yours', 'A vos'
]
const songsmp3 = songsnames.map(song => 'audios/' + song + '.mp3')
const songsloaded = []
const contents = []


songsnames.forEach((song, audio) => {
    const mp3 = songsmp3[audio]
    const audiomp3 = new Audio(mp3)
    audiomp3.controls = true
    audiomp3.loop = true
    audiomp3.className = 'caudio'
    songsloaded.push(audiomp3)
    const content = document.createElement('div')
    content.className = 'content'
    content.innerHTML = `▶️ ${song}`
    content_container.appendChild(content)
    scont.appendChild(audiomp3)
    contents.push(content)

    function playing(){
        return songsloaded.some(song => !song.paused)
    }
    audiomp3.addEventListener('timeupdate', () => {
        if(!playing()){
            content.innerHTML = `▶️ ${song}`
        }else{
            content.innerHTML = `⏸️ ${song}`
        }
    })
    content.addEventListener('click', () => {
        if(playing()){
            audiomp3.pause()
            content.innerHTML = `▶️ ${song}`
        }else{
            audiomp3.play()
            content.innerHTML = `⏸️ ${song}`
            const audios = document.querySelectorAll('audio')
            audios.forEach(audio => {
                audio.style.display = 'none'
                console.log(audio)
            })
            audiomp3.style.display = 'flex'
        }
    })
})


//SONGS
document.addEventListener('DOMContentLoaded', () => {
    console.log('loading songs')
})
