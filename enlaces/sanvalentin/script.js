const img1 = document.getElementById('imagen1')
const page1 = document.getElementById('page1')
const page2 = document.getElementById('page2')
const page3 = document.getElementById('page3')
const page4 = document.getElementById('page4')
const imgtitle = document.querySelectorAll('.imgtitle')
const tulips1 = document.querySelectorAll('.pg4-1')
const tulips2 = document.querySelectorAll('.pg4-c')
const selector = document.querySelector('.selector')
const volverf = document.querySelector('.back')
const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')
const corazon = document.getElementById('corazon')
const grancora = document.getElementById('grancora')

const txtpage4 = document.getElementById('txtpage4')
const coracs = document.getElementById('corac-s')
const corazonrosa = document.getElementById('corazonrosa')

const version = '1.1'

console.log('version: ', version)

document.addEventListener('click', () => {
    if (img1.style.opacity != '0') {
        img1.style.animation = 'click 1s ease'
        animpage1()
        setTimeout(() => {
            img1.style.opacity = 0
        }, 900);
    }
})

function animpage1() {
    setTimeout(() => {
        page1.style.animation = 'intro 1s ease'
        page1.style.opacity = 1
        page1.style.visibility = 'visible'
        setTimeout(() => {
            imgtitle.forEach(title => {
                title.style.animation = 'intro 1s ease'
                title.style.opacity = 1
            })
        }, 500);
    }, 900);
}

function animpage2() {
    page1.style.animation = 'outro 1s ease'
    page1.style.opacity = 0
    setTimeout(() => {
        page1.style.visibility = 'hidden'
        page2.style.animation = 'intro 1s ease'
        page2.style.opacity = 1
        page2.style.visibility = 'visible'
    }, 900);
}

function animpage3() {
    page2.style.animation = 'outro 1s ease'
    page2.style.opacity = 0
    setTimeout(() => {
        page2.style.visibility = 'hidden'
        page3.style.animation = 'intro 1s ease'
        page3.style.opacity = 1
        page3.style.visibility = 'visible'
        selector.style.animation = 'none'
        selector.style.opacity = 0
        imgtitle.forEach(title => {
            title.style.animation = 'none'
            title.style.opacity = 0
            setTimeout(() => {
                title.style.animation = 'intro 1s ease'
                title.style.opacity = 1
                setTimeout(() => {
                    selector.style.animation = 'intro 1s ease'
                    selector.style.opacity = 1
                }, 500);
            }, 500);
        })
    }, 900);
}

function btn1press() {
    if (page1.style.opacity == '1') {
        page1.style.animation = 'outro 1s ease'
        window.location.href = window.location.href
    }else{
        if (page2.style.opacity == '1') {
            page2.style.animation = 'outro 1s ease'
            page2.style.opacity = 0
            page2.visibility = 'hidden'
            animpage1()
        }else{
            if (page3.style.opacity == '1') {
                page3.style.animation = 'outro 1s ease'
                page3.style.opacity = 0
                page3.visibility = 'hidden'
                animpage2()
            }else{
                window.location.href = window.location.href
            }
        }
    }
}


function btn2press() {
    if (page1.style.visibility == 'visible') {
        animpage2()
    }else{
        animpage3()
    }
}

corazon.addEventListener('click', () => {
    grancora.style.animation = 'none'
    grancora.style.display = 'none'
    setTimeout(() => {
        grancora.style.display = 'flex'
        grancora.style.animation = 'click 1s ease'
    }, 10);
})

grancora.addEventListener('animationend', () => {
    grancora.style.animation = 'none'
    grancora.style.display = 'none'
})

function options() {
    page3.style.animation = 'outro 1s ease'
    page3.style.opacity = 0
    page3.visibility = 'hidden'
    setTimeout(() => {
        page4.style.animation = 'spawn 1s ease'
        page4.style.opacity = 1
        page4.style.visibility = 'visible'
    }, 900);
    setTimeout(() => {
        txtpage4.style.animation = 'spawn 1s ease'
        txtpage4.style.opacity = 1
    }, 2000);
    setTimeout(() => {
        corazonrosa.style.animation = 'spawn 1s ease'
        corazonrosa.style.opacity = 1
    }, 2500);
    setTimeout(() => {
        coracs.style.animation = 'spawn 1s ease'
        coracs.style.opacity = 1
    }, 3000);
    setTimeout(() => {
        volverf.style.animation = 'spawn 1s ease'
        volverf.style.opacity = 1
    }, 3500);
    tulips1.forEach(tulip => {
        tulips2.forEach(tulip2 => {
            setTimeout(() => {
                tulip.style.animation = 'spawn 2s ease'
                tulip.style.opacity = 1
                tulip2.style.animation = 'spawn 2s ease'
                tulip2.style.opacity = 1
            }, 1500);
        })
    })
}