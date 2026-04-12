//timers
const timer1 = document.getElementById('content5_1')
const timer2 = document.getElementById('content5_2')
const timer3 = document.getElementById('content5_3')
const lafecha = document.getElementById('lafecha')

//TIMES

const fechaObjetivo1 = '2025-11-26'
const fechaObjetivo2 = '2026-04-27'

function diasEntre(fechaFin) {
    const hoy = new Date();
    const fin = new Date(fechaFin);

    // Normalizamos ambas fechas a UTC al inicio del día (00:00:00)
    const hoyUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finUTC = Date.UTC(fin.getFullYear(), fin.getMonth(), fin.getDate());

    // Diferencia en milisegundos → convertir a días
    const diffMs = finUTC - hoyUTC;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function countup(fechaFin) {
    const hoy = new Date();
    const fin = new Date(fechaFin);

    // Normalizamos ambas fechas a UTC al inicio del día (00:00:00)
    const hoyUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const finUTC = Date.UTC(fin.getFullYear(), fin.getMonth(), fin.getDate());

    // Diferencia en milisegundos → convertir a días
    const diffMs = hoyUTC - finUTC;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function actualizarContador() {
    const objetivo1 = countup(fechaObjetivo1);
    const objetivo2 = diasEntre(fechaObjetivo2);


    const fecha = new Date()
    const dia = fecha.getDate()+1
    const mes = fecha.getMonth()+1
    const año = fecha.getFullYear()
    const hora = fecha.getHours()+1
    const min = fecha.getMinutes()+1
    const seg = fecha.getSeconds()+1
    //su cumple (a):
    const horaa = 24-hora
    const mina = 60-min
    const sega = 60-seg
    //mostrar

    function titulo(tit, timer){
        const title = document.createElement('summary')
        title.innerHTML = tit
        timer.appendChild(title)
    }

    timer1.innerHTML = `<br> ${dia-1}/${mes}/${año} <br>Hora: ${hora-1}:${min-1}:${seg-1}`
    titulo('<strong>⌛ Fecha actual</strong>', timer1)

    if (objetivo1) {
        timer2.innerHTML = `<br>Hace ${objetivo1} dias <br>${hora-1} horas <br>${min-1} minutos <br>${seg-1} segundos`
    }else{
        timer2.innerHTML = `<br>Ya llegó la fecha!`
    }
    titulo('<strong>⌛ Estamos juntos</strong> 🍃', timer2)

    if (objetivo2 >= 0) {
        timer3.innerHTML = `<br>Faltan ${objetivo2} dias <br>${horaa} horas <br>${mina} minutos <br>${sega} segundos`
    }else{
        timer3.innerHTML = `<br>Ya llegó la fecha!`
    }
    titulo('<strong>⌛ Su cumple 🎂</strong>', timer3)

    if (hora-1 == 16 && min-1 == 16) {
        lafecha.style.background = 'linear-gradient(90deg, rgb(255, 116, 116), rgba(255, 70, 218, 0.5)'
        lafecha.style.textAlign = 'center'
        lafecha.innerHTML = '⏰ 🦖 <strong>16:16</strong> 🦖 💗'
    } else {
        lafecha.style.background = 'linear-gradient(90deg, rgb(133, 133, 133), rgba(255, 255, 255, 0.5)'
        lafecha.style.textAlign = 'unset'
        lafecha.innerHTML = '⏰ <strong>16:16</strong> 💗'
    }
}

actualizarContador()
setInterval(actualizarContador, 1000)