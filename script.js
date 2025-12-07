const verbtn = document.getElementById('ver')
const input = document.getElementById('input')
const alerta = document.getElementById('alert')
const version = '1.2'

console.log(`Update: ${version}`)

verbtn.addEventListener("click", () => {
    if (input.type === 'password'){
        input.type = 'text'
    }else{
        input.type = 'password'
    }
})


const dbURL = 'https://database-3c232-default-rtdb.firebaseio.com/'
firebase.initializeApp({ databaseURL : dbURL })
const db = firebase.database()



function verify(event){
    db.ref('users').on('value', (data) => {
        const datos = data.val()
        const clave = Object.entries(datos).map(([key, val]) => val.clave)
        if(input.value == clave){
            alerta.innerHTML = `*cargando siguiente pagina`
            alerta.style.color = 'rgb(120, 255, 120)'
            window.location.href = 'https://serpaweres.github.io/galaxy'
        }else{
            alerta.innerHTML = `*contraseña incorrecta`
            alerta.style.color = 'rgb(255, 117, 117)'
        }
    })
    event.preventDefault()
}