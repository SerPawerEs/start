// Songs MP3 list
const songsnames = [
    'M.A.I', 'Dandelions', 'Mi corazon es tuyo', 'Hadal Ahbek', 'I wanna be yours', 'A vos'
];
const songsmp3 = songsnames.map(song => 'audios/' + song + '.mp3');
const songsloaded = [];
const contents = [];

// Variables de estado
let currentAudio = null;
let currentSongIndex = -1;
let popupWindow = null; // Referencia directa a la ventana emergente

// Inicializar elementos de audio en memoria (pre-cargados)
songsnames.forEach((song, index) => {
    const mp3 = songsmp3[index];
    const audiomp3 = new Audio(mp3);
    audiomp3.preload = 'metadata';
    // No bucle individual para permitir avanzar a la siguiente cancion automaticamente
    audiomp3.loop = false;
    songsloaded.push(audiomp3);

    audiomp3.addEventListener('ended', () => {
        playNextSong();
    });

    audiomp3.addEventListener('timeupdate', () => {
        if (currentAudio === audiomp3 && audiomp3.duration) {
            const progressBar = document.getElementById('caudio-progressBar');
            const timeDisplay = document.getElementById('caudio-timeDisplay');
            if (progressBar && timeDisplay) {
                const percentage = (audiomp3.currentTime / audiomp3.duration) * 100;
                progressBar.value = percentage;
                progressBar.style.background = `linear-gradient(to right, #ff52a0 ${percentage}%, #2a2a2a ${percentage}%)`;
                timeDisplay.textContent = `${formatTime(audiomp3.currentTime)} / ${formatTime(audiomp3.duration)}`;
            }
            updateMediaSessionPosition();
        }
    });

    audiomp3.addEventListener('play', () => {
        if (currentAudio === audiomp3) {
            updatePlayUI(true);
            updateMediaSessionState(true);
        }
    });

    audiomp3.addEventListener('pause', () => {
        if (currentAudio === audiomp3) {
            updatePlayUI(false);
            updateMediaSessionState(false);
        }
    });
});

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Media Session API para notificaciones del sistema con controles Siguiente y Anterior
function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;

    const actionHandlers = [
        ['play', () => {
            if (currentAudio && currentAudio.paused) currentAudio.play();
        }],
        ['pause', () => {
            if (currentAudio && !currentAudio.paused) currentAudio.pause();
        }],
        ['previoustrack', () => {
            playPrevSong();
        }],
        ['nexttrack', () => {
            playNextSong();
        }],
        ['seekto', (details) => {
            if (currentAudio && details.seekTime !== undefined) {
                currentAudio.currentTime = details.seekTime;
                updateMediaSessionPosition();
            }
        }],
        ['seekbackward', (details) => {
            if (currentAudio) {
                currentAudio.currentTime = Math.max(0, currentAudio.currentTime - (details.seekOffset || 10));
                updateMediaSessionPosition();
            }
        }],
        ['seekforward', (details) => {
            if (currentAudio) {
                currentAudio.currentTime = Math.min(currentAudio.duration || 0, currentAudio.currentTime + (details.seekOffset || 10));
                updateMediaSessionPosition();
            }
        }]
    ];

    actionHandlers.forEach(([action, handler]) => {
        try {
            navigator.mediaSession.setActionHandler(action, handler);
        } catch (e) {
            // Acción no soportada por el navegador
        }
    });
}

function updateMediaSessionMetadata() {
    if (!('mediaSession' in navigator) || currentSongIndex < 0) return;

    const songTitle = songsnames[currentSongIndex];
    const iconUrl = new URL('content/icon.png', window.location.href).href;

    try {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: songTitle,
            artist: 'Para Mi Niña Hermosa 💞',
            album: 'Nuestras Canciones',
            artwork: [
                { src: iconUrl, sizes: '96x96', type: 'image/png' },
                { src: iconUrl, sizes: '128x128', type: 'image/png' },
                { src: iconUrl, sizes: '192x192', type: 'image/png' },
                { src: iconUrl, sizes: '256x256', type: 'image/png' },
                { src: iconUrl, sizes: '512x512', type: 'image/png' }
            ]
        });
    } catch (e) {
        console.warn('MediaSession metadata error:', e);
    }
}

function updateMediaSessionState(isPlaying) {
    if (!('mediaSession' in navigator)) return;
    try {
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    } catch (e) {}
}

function updateMediaSessionPosition() {
    if (!('mediaSession' in navigator) || !('setPositionState' in navigator.mediaSession) || !currentAudio) return;
    if (!isNaN(currentAudio.duration) && currentAudio.duration > 0) {
        try {
            navigator.mediaSession.setPositionState({
                duration: currentAudio.duration,
                playbackRate: currentAudio.playbackRate || 1,
                position: Math.min(Math.max(0, currentAudio.currentTime), currentAudio.duration)
            });
        } catch (e) {}
    }
}

// Inicializar la estructura HTML del reproductor dentro de #scont
function initPlayerUI() {
    let scont = document.getElementById('scont');
    if (!scont) {
        scont = document.createElement('div');
        scont.id = 'scont';
        document.body.appendChild(scont);
    }

    // Si ya existe el contenedor del reproductor, no volver a crearlo para no interrumpir
    if (document.getElementById('caudio-player-container')) return;

    scont.innerHTML = `
        <div id="caudio-player-container" class="caudio-player-wrapper" style="display: none;">
            <button id="caudio-prevBtn" class="caudio-control-btn" aria-label="Canción anterior" title="Anterior">
                <svg class="caudio-control-btn-svg" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path></svg>
            </button>
            <button id="caudio-playBtn" class="caudio-play-btn" aria-label="Reproducir/Pausar" title="Reproducir/Pausar">
                <svg id="caudio-icon-play" class="caudio-play-btn-svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                <svg id="caudio-icon-pause" class="caudio-play-btn-svg" viewBox="0 0 24 24" style="display: none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
            </button>
            <button id="caudio-nextBtn" class="caudio-control-btn" aria-label="Canción siguiente" title="Siguiente">
                <svg class="caudio-control-btn-svg" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path></svg>
            </button>
            <div class="caudio-progress-container">
                <input type="range" id="caudio-progressBar" class="caudio-progress-bar" value="0" min="0" max="100">
            </div>
            <span id="caudio-timeDisplay" class="caudio-time-display">0:00 / 0:00</span>
            
            <button id="caudio-menuBtn" class="caudio-menu-btn" aria-label="Opciones" title="Opciones">
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

    bindPlayerEvents();
}

function bindPlayerEvents() {
    const playBtn = document.getElementById('caudio-playBtn');
    const prevBtn = document.getElementById('caudio-prevBtn');
    const nextBtn = document.getElementById('caudio-nextBtn');
    const progressBar = document.getElementById('caudio-progressBar');
    const volumeSlider = document.getElementById('caudio-volumeSlider');
    const speedButtons = document.querySelectorAll('.caudio-speed-btn');
    const menuBtn = document.getElementById('caudio-menuBtn');
    const menuWrapper = document.getElementById('caudio-menuWrapper');
    const popupBtn = document.getElementById('caudio-popupBtn');

    if (playBtn) {
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
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            playPrevSong();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            playNextSong();
        });
    }

    if (progressBar) {
        progressBar.addEventListener('input', () => {
            if (!currentAudio || !currentAudio.duration) return;
            const seekTime = (progressBar.value / 100) * currentAudio.duration;
            currentAudio.currentTime = seekTime;
            updateMediaSessionPosition();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            if (currentAudio) currentAudio.volume = volumeSlider.value;
        });
    }

    if (speedButtons) {
        speedButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                speedButtons.forEach(b => b.classList.remove('caudio-speed-active'));
                btn.classList.add('caudio-speed-active');
                if (currentAudio) currentAudio.playbackRate = parseFloat(btn.dataset.speed);
                updateMediaSessionPosition();
            });
        });
    }

    if (menuBtn && menuWrapper) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuWrapper.classList.toggle('caudio-active');
        });

        document.addEventListener('click', (e) => {
            if (!menuWrapper.contains(e.target) && e.target !== menuBtn) {
                menuWrapper.classList.remove('caudio-active');
            }
        });
    }

    if (popupBtn) {
        popupBtn.addEventListener('click', () => {
            if (!currentAudio || currentSongIndex < 0) return;

            localStorage.setItem('popup_song_path', songsmp3[currentSongIndex]);
            localStorage.setItem('popup_song_name', songsnames[currentSongIndex]);
            localStorage.setItem('popup_song_index', currentSongIndex);
            localStorage.setItem('popup_song_time', currentAudio.currentTime);
            localStorage.setItem('popup_song_speed', currentAudio.playbackRate);
            localStorage.setItem('popup_song_volume', currentAudio.volume);

            currentAudio.pause();
            const playerContainer = document.getElementById('caudio-player-container');
            if (playerContainer) playerContainer.style.display = 'none';
            if (menuWrapper) menuWrapper.classList.remove('caudio-active');

            popupWindow = window.open('popup.html', 'AudioPlayerPopup', 'width=450,height=280,resizable=no');
        });
    }
}

function updatePlayUI(isPlaying) {
    const iconPlay = document.getElementById('caudio-icon-play');
    const iconPause = document.getElementById('caudio-icon-pause');

    if (iconPlay && iconPause) {
        if (isPlaying) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        } else {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
        }
    }

    updateSongsListUI();
}

function updateSongsListUI() {
    contents.forEach((contentEl, idx) => {
        if (!contentEl) return;
        if (idx === currentSongIndex) {
            const isPlaying = currentAudio && !currentAudio.paused;
            contentEl.innerHTML = `${isPlaying ? '⏸️' : '▶️'} ${songsnames[idx]}`;
        } else {
            contentEl.innerHTML = `▶️ ${songsnames[idx]}`;
        }
    });
}

function isPopupActive() {
    return popupWindow && !popupWindow.closed;
}

// Reproducir canción por índice
function playSongAtIndex(index) {
    if (index < 0 || index >= songsnames.length) return;
    if (isPopupActive()) {
        alert("El audio está reproduciéndose en la ventana emergente.");
        return;
    }

    const prevAudio = currentAudio;

    if (prevAudio && prevAudio !== songsloaded[index]) {
        prevAudio.pause();
        prevAudio.currentTime = 0;
    }

    currentSongIndex = index;
    currentAudio = songsloaded[index];

    if (prevAudio) {
        currentAudio.volume = prevAudio.volume;
        currentAudio.playbackRate = prevAudio.playbackRate;
    }

    const downloadLink = document.getElementById('caudio-downloadLink');
    const volumeSlider = document.getElementById('caudio-volumeSlider');
    const playerContainer = document.getElementById('caudio-player-container');

    if (downloadLink) {
        downloadLink.href = songsmp3[index];
        downloadLink.download = `${songsnames[index]}.mp3`;
    }
    if (volumeSlider) {
        volumeSlider.value = currentAudio.volume;
    }
    if (playerContainer) {
        playerContainer.style.display = 'inline-flex';
    }

    updateMediaSessionMetadata();
    updateSongsListUI();

    const playPromise = currentAudio.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.warn("Autoplay bloqueado o reproducción interrumpida:", err);
        });
    }
}

// Siguiente canción
function playNextSong() {
    if (currentSongIndex === -1) {
        playSongAtIndex(0);
    } else {
        const nextIndex = (currentSongIndex + 1) % songsnames.length;
        playSongAtIndex(nextIndex);
    }
}

// Canción anterior
function playPrevSong() {
    if (currentSongIndex === -1) {
        playSongAtIndex(0);
    } else {
        if (currentAudio && currentAudio.currentTime > 3) {
            currentAudio.currentTime = 0;
            if (currentAudio.paused) currentAudio.play();
            updateMediaSessionPosition();
        } else {
            const prevIndex = (currentSongIndex - 1 + songsnames.length) % songsnames.length;
            playSongAtIndex(prevIndex);
        }
    }
}

// Renderizar la lista de canciones si estamos en songs.html
function renderSongsList() {
    const isSongsPage = window.location.pathname.endsWith('songs.html') ||
                        document.title.toLowerCase().includes('canciones') ||
                        document.querySelector('header div a[href="songs.html"]')?.textContent.includes('▫️');

    if (!isSongsPage) return;

    const content_container = document.getElementById('content_container');
    if (!content_container) return;

    content_container.innerHTML = '';
    contents.length = 0;

    songsnames.forEach((song, index) => {
        const content = document.createElement('div');
        content.className = 'content';
        const isCurrent = (index === currentSongIndex);
        const isPlaying = isCurrent && currentAudio && !currentAudio.paused;
        content.innerHTML = `${isCurrent ? (isPlaying ? '⏸️' : '▶️') : '▶️'} ${song}`;
        content_container.appendChild(content);
        contents.push(content);

        content.addEventListener('click', () => {
            if (isPopupActive()) {
                alert("El audio está activo en la ventana emergente.");
                return;
            }

            if (currentSongIndex === index && currentAudio) {
                if (currentAudio.paused) {
                    currentAudio.play();
                } else {
                    currentAudio.pause();
                }
            } else {
                playSongAtIndex(index);
            }
        });
    });
}

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

            currentAudio.currentTime = time;
            currentAudio.playbackRate = speed;
            currentAudio.volume = volume;

            const downloadLink = document.getElementById('caudio-downloadLink');
            const volumeSlider = document.getElementById('caudio-volumeSlider');
            const playerContainer = document.getElementById('caudio-player-container');

            if (downloadLink) {
                downloadLink.href = path;
                downloadLink.download = `${songsnames[index]}.mp3`;
            }
            if (volumeSlider) volumeSlider.value = volume;
            if (playerContainer) playerContainer.style.display = 'inline-flex';

            updateMediaSessionMetadata();
            updatePlayUI(true);
            currentAudio.play();
        }

        localStorage.removeItem('popup_return_path');
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initPlayerUI();
    setupMediaSession();
    renderSongsList();
});

// Exponer en window para acceso desde el enrutador de páginas
window.songsnames = songsnames;
window.songsmp3 = songsmp3;
window.playSongAtIndex = playSongAtIndex;
window.playNextSong = playNextSong;
window.playPrevSong = playPrevSong;
window.renderSongsList = renderSongsList;
window.updateSongsListUI = updateSongsListUI;
window.initPlayerUI = initPlayerUI;