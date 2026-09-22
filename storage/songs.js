// Container
const content_container = document.getElementById('content_container');
const scont = document.getElementById('scont');

// Songs MP3
const songsnames = [
    'M.A.I', 'Dandelions', 'Mi corazon es tuyo', 'Hadal Ahbek', 'I wanna be yours', 'A vos'
];
const songsmp3 = songsnames.map(song => 'audios/' + song + '.mp3');
const songsloaded = [];
const contents = [];

// Variables de estado
let currentAudio = null;
let currentContent = null;
let currentSongIndex = -1;
let popupWindow = null; // Referencia directa a la ventana emergente

// Estrutura HTML del reproductor
scont.innerHTML = `
    <div id="caudio-player-container" class="caudio-player-wrapper" style="display: none;">
        <button id="caudio-playBtn" class="caudio-play-btn" aria-label="Reproducir/Pausar">
            <svg id="caudio-icon-play" class="caudio-play-btn-svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            <svg id="caudio-icon-pause" class="caudio-play-btn-svg" viewBox="0 0 24 24" style="display: none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
        </button>
        <div class="caudio-progress-container">
            <input type="range" id="caudio-progressBar" class="caudio-progress-bar" value="0" min="0" max="100">
        </div>
        <span id="caudio-timeDisplay" class="caudio-time-display">0:00 / 0:00</span>
        
        <button id="caudio-menuBtn" class="caudio-menu-btn" aria-label="Opciones">
            <svg class="caudio-menu-btn-svg" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>
        </button>

        <div id="caudio-menuWrapper" class="caudio-ios-menu-wrapper">
            <div id="caudio-dropdownMenu" class="caudio-ios-menu">
                <div class="caudio-menu-section">
                    <div class="caudio-menu-label">Volumen</div>
                    <div class="caudio-volume-control">
                        <svg class="caudio-volume-svg" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"></path></svg>
                        <input type="range" id="caudio-volumeSlider" class="caudio-volume-bar" min="0" max="1" step="0.05" value="1">
                    </div>
                </div>
                <div class="caudio-menu-divider"></div>
                <div class="caudio-menu-section">
                    <div class="caudio-menu-label">Velocidad</div>
                    <div class="caudio-speed-options">
                        <button class="caudio-speed-btn" data-speed="0.5">0.5x</button>
                        <button class="caudio-speed-btn caudio-speed-active" data-speed="1">1x</button>
                        <button class="caudio-speed-btn" data-speed="1.25">1.25x</button>
                        <button class="caudio-speed-btn" data-speed="1.5">1.5x</button>
                        <button class="caudio-speed-btn" data-speed="2">2x</button>
                    </div>
                </div>
                <div class="caudio-menu-divider"></div>
                <div class="caudio-menu-section">
                    <a id="caudio-downloadLink" class="caudio-menu-action-btn" href="#" download>
                        <span>Descargar Audio</span>
                        <svg class="caudio-download-svg" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></svg>
                    </a>
                    <button id="caudio-popupBtn" class="caudio-menu-action-btn">
                        <span style="font-size: 11px; color: white;">Ver en ventana</span>
                        <svg class="caudio-download-svg" viewBox="0 0 24 24" style="fill:#ff52a0;"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

// Elementos UI
const playerContainer = document.getElementById('caudio-player-container');
const playBtn = document.getElementById('caudio-playBtn');
const iconPlay = document.getElementById('caudio-icon-play');
const iconPause = document.getElementById('caudio-icon-pause');
const progressBar = document.getElementById('caudio-progressBar');
const timeDisplay = document.getElementById('caudio-timeDisplay');
const menuBtn = document.getElementById('caudio-menuBtn');
const menuWrapper = document.getElementById('caudio-menuWrapper');
const volumeSlider = document.getElementById('caudio-volumeSlider');
const speedButtons = document.querySelectorAll('.caudio-speed-btn');
const downloadLink = document.getElementById('caudio-downloadLink');
const popupBtn = document.getElementById('caudio-popupBtn');

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function updatePlayUI(isPlaying) {
    if (isPlaying) {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
        if (currentContent) currentContent.innerHTML = `⏸️ ${songsnames[currentSongIndex]}`;
    } else {
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
        if (currentContent) currentContent.innerHTML = `▶️ ${songsnames[currentSongIndex]}`;
    }
}

// Comprueba si la emergente sigue abierta
function isPopupActive() {
    return popupWindow && !popupWindow.closed;
}

playBtn.addEventListener('click', () => {
    if (!currentAudio) return;
    if (isPopupActive()) {
        alert("El audio está reproduciéndose en la ventana emergente.");
        return;
    }
    if (currentAudio.paused) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }
});

progressBar.addEventListener('input', () => {
    if (!currentAudio || !currentAudio.duration) return;
    const seekTime = (progressBar.value / 100) * currentAudio.duration;
    currentAudio.currentTime = seekTime;
});

volumeSlider.addEventListener('input', () => {
    if (currentAudio) currentAudio.volume = volumeSlider.value;
});

speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        speedButtons.forEach(b => b.classList.remove('caudio-speed-active'));
        btn.classList.add('caudio-speed-active');
        if (currentAudio) currentAudio.playbackRate = parseFloat(btn.dataset.speed);
    });
});

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuWrapper.classList.toggle('caudio-active');
});

document.addEventListener('click', (e) => {
    if (!menuWrapper.contains(e.target) && e.target !== menuBtn) {
        menuWrapper.classList.remove('caudio-active');
    }
});

// Transferir a ventana emergente
popupBtn.addEventListener('click', () => {
    if (!currentAudio) return;

    localStorage.setItem('popup_song_path', songsmp3[currentSongIndex]);
    localStorage.setItem('popup_song_name', songsnames[currentSongIndex]);
    localStorage.setItem('popup_song_time', currentAudio.currentTime);
    localStorage.setItem('popup_song_speed', currentAudio.playbackRate);
    localStorage.setItem('popup_song_volume', currentAudio.volume);

    currentAudio.pause();
    playerContainer.style.display = 'none';
    menuWrapper.classList.remove('caudio-active');

    popupWindow = window.open('popup.html', 'AudioPlayerPopup', 'width=450,height=280,resizable=no');
});

// Escuchar retorno automático desde popup.html
window.addEventListener('storage', (e) => {
    if (e.key === 'popup_return_path') {
        const path = localStorage.getItem('popup_return_path');
        const time = parseFloat(localStorage.getItem('popup_return_time') || 0);
        const speed = parseFloat(localStorage.getItem('popup_return_speed') || 1);
        const volume = parseFloat(localStorage.getItem('popup_return_volume') || 1);

        const index = songsmp3.indexOf(path);
        if (index !== -1) {
            if (currentAudio) currentAudio.pause();
            currentAudio = songsloaded[index];
            currentSongIndex = index;
            currentContent = contents[index];

            currentAudio.currentTime = time;
            currentAudio.playbackRate = speed;
            currentAudio.volume = volume;

            downloadLink.href = path;
            volumeSlider.value = volume;
            playerContainer.style.display = 'inline-flex';
            currentAudio.play();
        }

        localStorage.removeItem('popup_return_path');
    }
});

// Cargar lista de canciones
songsnames.forEach((song, index) => {
    const mp3 = songsmp3[index];
    const audiomp3 = new Audio(mp3);
    audiomp3.loop = true;
    songsloaded.push(audiomp3);

    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = `▶️ ${song}`;
    content_container.appendChild(content);
    contents.push(content);

    audiomp3.addEventListener('timeupdate', () => {
        if (currentAudio === audiomp3 && audiomp3.duration) {
            const percentage = (audiomp3.currentTime / audiomp3.duration) * 100;
            progressBar.value = percentage;
            progressBar.style.background = `linear-gradient(to right, #ff52a0 ${percentage}%, #2a2a2a ${percentage}%)`;
            timeDisplay.textContent = `${formatTime(audiomp3.currentTime)} / ${formatTime(audiomp3.duration)}`;
        }
    });

    audiomp3.addEventListener('play', () => {
        if (currentAudio === audiomp3) updatePlayUI(true);
    });

    audiomp3.addEventListener('pause', () => {
        if (currentAudio === audiomp3) updatePlayUI(false);
    });

    content.addEventListener('click', () => {
        if (isPopupActive()) {
            alert("El audio está activo en la ventana emergente.");
            return;
        }

        if (currentAudio === audiomp3) {
            if (audiomp3.paused) {
                audiomp3.play();
            } else {
                audiomp3.pause();
            }
            return;
        }

        if (currentAudio) {
            currentAudio.pause();
            if (currentContent) currentContent.innerHTML = `▶️ ${songsnames[currentSongIndex]}`;
        }

        currentAudio = audiomp3;
        currentContent = content;
        currentSongIndex = index;

        downloadLink.href = mp3;
        downloadLink.download = `${song}.mp3`;
        volumeSlider.value = currentAudio.volume;

        playerContainer.style.display = 'inline-flex';
        audiomp3.play();
    });
});