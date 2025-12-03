const verbtn = document.getElementById('ver')
const input = document.getElementById('input')
const alerta = document.getElementById('alert')
const cds = 'Rawr'
const version = '1.0'

console.log(`Update: ${version}`)

verbtn.addEventListener("click", () => {
    if (input.type === 'password'){
        input.type = 'text'
    }else{
        input.type = 'password'
    }
})

function verify(event){
    if(input.value === cds){
        alerta.innerHTML = `*cargando siguiente pagina`
        alerta.style.color = 'rgb(120, 255, 120)'
        window.location.href = 'http://serpawer.servegame.com'
        event.preventDefault()
    }else{
        alerta.innerHTML = `*contraseña incorrecta`
        alerta.style.color = 'rgb(255, 117, 117)'
        event.preventDefault()
    }
}