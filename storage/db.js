// Database
const dbURL = 'https://database-3c232-default-rtdb.firebaseio.com/';
if (typeof firebase !== 'undefined') {
    if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp({ databaseURL: dbURL });
    }
}

let latestMensajesData = null;

function renderMensajes(datos) {
    if (!datos && latestMensajesData) datos = latestMensajesData;
    const list = document.getElementById('md_cont');
    if (!list) return;
    list.innerHTML = "";
    if (datos) {
        Object.entries(datos).forEach(([key, val]) => {
            const cont = document.createElement('details');
            const txttit = document.createElement('summary');
            const txtmd = document.createElement('p');
            const strong = document.createElement('strong');
            cont.className = 'content';
            strong.textContent = `📪 ${val.tit}`;
            txtmd.textContent = `${val.md}`;

            list.appendChild(cont);
            cont.appendChild(txttit);
            cont.appendChild(txtmd);
            txttit.appendChild(strong);
        });
    }
}
window.renderMensajes = renderMensajes;

if (typeof firebase !== 'undefined' && firebase.database) {
    const db = firebase.database();

    window.subir = function(event) {
        if (event && event.preventDefault) event.preventDefault();
        const titulo = document.getElementById('txttitulo');
        const msg = document.getElementById('txttext');
        if (!titulo || !msg) return;
        const tit = titulo.value.trim();
        const md = msg.value.trim();
        if (tit && md) {
            db.ref('mensajes').push({ tit, md });
            titulo.value = '';
            msg.value = '';
            titulo.innerHTML = '';
            msg.innerHTML = '';
        }
    };

    db.ref('mensajes').on('value', (data) => {
        latestMensajesData = data.val();
        renderMensajes(latestMensajesData);
    });
}