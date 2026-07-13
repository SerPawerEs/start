const version = '2.01' //no modificar


//General
document.addEventListener('DOMContentLoaded', () => {
    //version
    console.log(`Update: ${version}`)
    //Comprobar
    //if(localStorage.getItem('LoggedIn') == 'true'){checkDate()}else{window.location.href = 'https://serpaweres.github.io/start'}
    //Volver a comprobar
    iniciarCuenta()
})


//Tiempo de inactividad
const inactivityTimeout = 300000

function iniciarCuenta() {
    localStorage.setItem('lastDate', Date.now())
}

['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => 
    document.addEventListener(event, () => {
        //checkDate()
        iniciarCuenta()
    })
)

function checkDate() {
    const tiempoTranscurrido = Date.now()-localStorage.getItem('lastDate')
    if(tiempoTranscurrido > inactivityTimeout){
        localStorage.setItem('LoggedIn', null)
        location.reload()
    }
}

