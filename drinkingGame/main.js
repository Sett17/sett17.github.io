const startMenu = "./compos/startmenu.compo"
const preGame = "./compos/pregame.compo"

let search = window.location.search.slice(1).split('&')
for (let i = 0; i < search.length; i++) {
    search[i] = search[i].split('=')
}
search.forEach(el => {
    switch (el[0]) {
        case "page":
            switch (el[1]) {
                case "startMenu":
                    loadCompo(startMenu)
                    break
                case "pregame":
                    loadCompo(preGame)
                    if (isMobile()) {
                        document.querySelector('#pregame-playerAddBtn').classList.add('pregame-hidden')
                    }
                    break
                default:
                    break
            }
            break

        default:
            loadCompo(startMenu)
    }
})

function inpFocusIn() {
    if (isMobile()) {
        document.querySelector('#pregame-playerlist').classList.add('pregame-hidden')
        document.querySelector('#pregame-playBtn').classList.add('pregame-hidden')
        document.querySelector('#pregame-playerAddBtn').classList.remove('pregame-hidden')
    }
}
function inpFocusOut() {
    if (isMobile()) {
        document.querySelector('#pregame-playerlist').classList.remove('pregame-hidden')
        document.querySelector('#pregame-playBtn').classList.remove('pregame-hidden')
        document.querySelector('#pregame-playerAddBtn').classList.add('pregame-hidden')
    }
}

function loadCompo(filePath) {
    fetch(filePath)
        .then(res => res.text())
        .then(data => { document.querySelector('#root').innerHTML = data })
}


function isMobile() {
    let hasTouchScreen = false
    if ("maxTouchPoints" in navigator) {
        hasTouchScreen = navigator.maxTouchPoints > 0
    } else if ("msMaxTouchPoints" in navigator) {
        hasTouchScreen = navigator.msMaxTouchPoints > 0
    } else {
        var mQ = window.matchMedia && matchMedia("(pointer:coarse)")
        if (mQ && mQ.media === "(pointer:coarse)") {
            hasTouchScreen = !!mQ.matches
        } else if ('orientation' in window) {
            hasTouchScreen = true // deprecated, but good fallback
        }
    }
    return hasTouchScreen
}