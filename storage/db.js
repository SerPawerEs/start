//Database
const titulo = document.getElementById('txttitulo')
const msg = document.getElementById('txttext')

const dbURL = 'https://database-3c232-default-rtdb.firebaseio.com/'
firebase.initializeApp({databaseURL:dbURL})
const db = firebase.database()

function subir(){
    const tit = titulo.value.trim()
    const md = msg.value.trim()
    if (tit && md) {
        db.ref('mensajes').push({tit, md})
        titulo.innerHTML = ''
        msg.innerHTML = ''
    }
}

db.ref('mensajes').on('value', (data) => {
    const list = document.getElementById('md_cont')
    list.innerHTML = ""
    const datos = data.val()
    if(datos){
        Object.entries(datos).forEach(([key, val]) => {
            const cont = document.createElement('details')
            const txttit = document.createElement('summary')
            const txtmd = document.createElement('p')
            const strong = document.createElement('strong')
            cont.className = 'content'
            strong.textContent = `📪 ${val.tit}`
            txtmd.textContent = `${val.md}`

            list.appendChild(cont)
            cont.appendChild(txttit)
            cont.appendChild(txtmd)
            txttit.appendChild(strong)
        })
    }
})