const version = '4.00'; // no modificar

// General
document.addEventListener('DOMContentLoaded', () => {
    console.log(`Update: ${version}`);
    iniciarCuenta();
    initInternalNavigation();
});

// Tiempo de inactividad
const inactivityTimeout = 300000;

function iniciarCuenta() {
    localStorage.setItem('lastDate', Date.now());
}

['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => 
    document.addEventListener(event, () => {
        iniciarCuenta();
    })
);

function checkDate() {
    const tiempoTranscurrido = Date.now() - localStorage.getItem('lastDate');
    if (tiempoTranscurrido > inactivityTimeout) {
        localStorage.setItem('LoggedIn', null);
        location.reload();
    }
}

// -------------------------------------------------------------
// NAVEGACIÓN SPA / PJAX FLUIDA PARA MANTENER LA MÚSICA ACTIVA
// -------------------------------------------------------------

const pageRegistry = {
    'inicio.html': {
        title: 'Principal',
        icon: '📄',
        main: `
            <div id="content_container">
                <div style="background-image: url(content/texture3.png); padding: 20px; background-size: 100% 100%; font-size: 20px;" id="content1_1">
                    <strong>Mi amor 💞</strong><br><br>
                    Amo su forma de ser, amo cada momento en el que jugamos juntos, amo que usted esté conmigo y desde que la conocí se volvió una persona muy importante en mi vida ya que me apoyó cuando nadie mas lo hizo y pudo hacerme feliz por eso ahora solo quiero que usted esté bien, quiero que sea feliz en todo momento porque la amo mucho mi vida.<br><br>
                    Siempre que miro al celular espero una notificacion o mensaje suyo, cada vez que suena espero que sea usted porque hablar con usted me da mucha felicidad, aveces escucho la primera canción que me dedicó y recuerdo con detalles ese momento y lo mucho que la amo, fue la noche mas linda que he vivdo. No puedo esperar el día en en que nos veamos en persona, quiero porfin hablar sin una pantalla en medio con la persona con la que voy a compartir el resto de mi vida, la persona con la que voy a vivir, con la que me voy a casar, con la madre de mis hijos, quiero porfin estar junto al amor de mi vida, quiero porfin estar junto a usted. Pero mientras tanto seguiré esperandola y amoandola, diciendole cuanto la amo y pensandola en todo momento.<br><br>
                    No puedo esperar a ver todo lo que nos tiene preparada la vida y serán cosas buenas y cosas malas pero estaremos el uno para el otro siempre apoyandonos porque amar es seguir apoyando y queriendo a esa persona incluso en los peores momentos y yo a usted la amo mucho, por eso no pienso abandonarla ni dejar que nada nos separe, recuerde que usted es la unica niña que me importa en el mundo y la amo de aquí al infinito y mucho más.
                    <br><br><strong>💖 LA AMO MI NIÑA HERMOSA💖</strong>
                </div>
            </div>
        `
    },
    'enlaces.html': {
        title: 'Cartas',
        icon: '🗺️',
        main: `
            <div id="content_container">
                <a href="https://serpaweres.github.io/galaxy" class="content">🌐 GALAXIA</a>
                <a href="https://www.roblox.com/es/redeem" class="content">🌐 REDEEM</a>
                <a href="enlaces/sanvalentin/" class="content">🌐 14 DE FEBRERO</a>
                <a href="enlaces/hbd/" class="content">🌐 CUMPLE 🎁</a>
                <a href="enlaces/21sept/" class="content">🌐 21 de septiembre 🌻</a>
            </div>
        `
    },
    'songs.html': {
        title: 'Canciones',
        icon: '🎵',
        main: `
            <div id="content_container" style="margin-bottom: 50px;">
            </div>
        `
    },
    'mensajes.html': {
        title: 'Recordatorios',
        icon: '💌',
        main: `
            <div id="content_container">
                <div id="md_cont"></div>
                <details class="content">
                    <summary>➕ Añadir elemento</summary>
                    <form onsubmit="subir(event)" id="addelemnt">
                        <input type="text" id="txttitulo" placeholder="Titulo" autocomplete="off" required>
                        <textarea type="text" id="txttext" placeholder="Escriba el mensaje" required></textarea>
                        <button type="submit" id="submitbtn">Enviar ✅</button>
                    </form>
                </details>
            </div>
        `
    },
    'tiempos.html': {
        title: 'Tiempos',
        icon: '🕑',
        main: `
            <div id="content_container">
                <details class="content" id="content5_1">
                    loading...
                </details>
                <details class="content" id="content5_2">
                    loading...
                </details>
                <details class="content" id="content5_3">
                    loading...
                </details>
                <div class="content" id="lafecha">⏰ <strong>16:16</strong> 💗</div>
            </div>
        `
    }
};

const internalPages = Object.keys(pageRegistry);

function getCleanPageName(href) {
    if (!href) return '';
    const clean = href.split('?')[0].split('#')[0].replace(/^.*[\\\/]/, '');
    return clean || 'inicio.html';
}

function updateHeaderNav(targetPage) {
    const headerDiv = document.querySelector('header div');
    if (!headerDiv) return;

    const links = headerDiv.querySelectorAll('a');
    links.forEach(a => {
        const page = getCleanPageName(a.getAttribute('href'));
        if (pageRegistry[page]) {
            const baseIcon = pageRegistry[page].icon;
            if (page === targetPage) {
                a.textContent = `▫️${baseIcon}`;
            } else {
                a.textContent = baseIcon;
            }
        }
    });
}

function applyPageContent(targetPage, title, mainHtml) {
    document.title = title || (pageRegistry[targetPage] && pageRegistry[targetPage].title) || 'Página';

    updateHeaderNav(targetPage);

    const mainEl = document.querySelector('main');
    if (mainEl && mainHtml) {
        mainEl.innerHTML = mainHtml;
    }

    // Ejecutar ganchos específicos de página
    if (targetPage === 'songs.html') {
        if (typeof window.renderSongsList === 'function') {
            window.renderSongsList();
        }
        if (typeof window.updateSongsListUI === 'function') {
            window.updateSongsListUI();
        }
    } else if (targetPage === 'tiempos.html') {
        if (typeof window.actualizarContador === 'function') {
            window.actualizarContador();
        }
    } else if (targetPage === 'mensajes.html') {
        if (typeof window.renderMensajes === 'function') {
            window.renderMensajes();
        }
    }

    // Asegurarse de que el reproductor en #scont siga presente y listo
    if (typeof window.initPlayerUI === 'function') {
        window.initPlayerUI();
    }
}

function navigateToInternalPage(targetPage, pushState = true) {
    if (!internalPages.includes(targetPage)) {
        window.location.href = targetPage;
        return;
    }

    if (pushState) {
        try {
            window.history.pushState({ page: targetPage }, '', targetPage);
        } catch (e) {
            // Algunos navegadores locales restringen pushState en file://
        }
    }

    // Intentar obtener el contenido actualizado vía fetch (para HTTP/HTTPS o servidores locales)
    fetch(targetPage)
        .then(response => {
            if (!response.ok) throw new Error('Fetch failed');
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainHtml = doc.querySelector('main')?.innerHTML || pageRegistry[targetPage].main;
            const title = doc.querySelector('title')?.textContent || pageRegistry[targetPage].title;
            applyPageContent(targetPage, title, mainHtml);
        })
        .catch(() => {
            // Si fetch falla (ejemplo: protocolo local file:/// con restricciones CORS), usar la plantilla integrada
            const pageData = pageRegistry[targetPage];
            if (pageData) {
                applyPageContent(targetPage, pageData.title, pageData.main);
            }
        });
}

function initInternalNavigation() {
    // Interceptar clics en enlaces del encabezado y navegación interna
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // Ignorar enlaces externos o anclas
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('#') || href.startsWith('mailto:')) {
            return;
        }

        const pageName = getCleanPageName(href);
        if (internalPages.includes(pageName)) {
            e.preventDefault();
            const currentPage = getCleanPageName(window.location.pathname);
            if (pageName === currentPage && document.querySelector('main')?.children.length > 0) {
                return;
            }
            navigateToInternalPage(pageName, true);
        }
    });

    // Manejar botones atrás/adelante del navegador
    window.addEventListener('popstate', () => {
        const pageName = getCleanPageName(window.location.pathname) || 'inicio.html';
        if (internalPages.includes(pageName)) {
            navigateToInternalPage(pageName, false);
        }
    });
}

window.navigateToInternalPage = navigateToInternalPage;
