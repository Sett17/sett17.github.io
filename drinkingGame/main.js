const startMenu = "./compos/startmenu.compo"
const preGame = "./compos/pregame.compo"
let currPage

let search = window.location.search.slice(1).split('&')
for (let i = 0; i < search.length; i++) {
    search[i] = search[i].split('=')
}
search.forEach(el => {
    switch (el[0]) {
        case "page":
            switch (el[1]) {
                case "startmenu":
                    loadCompo(startMenu)
                    currPage = startMenu
                    break
                case "pregame":
                    loadCompo(preGame)
                        .then(_ => {
                            if (isMobile()) {
                                document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')
                            }
                        })
                    currPage = preGame
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
        document.querySelector('#pregame-addPlayerBtn').classList.remove('pregame-hidden')
    }
}
function inpFocusOut() {
    if (isMobile()) {
        document.querySelector('#pregame-playerlist').classList.remove('pregame-hidden')
        document.querySelector('#pregame-playBtn').classList.remove('pregame-hidden')
        document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')
    }
}

function loadCompo(filePath) {
    return fetch(filePath)
        .then(res => res.text())
        .then(data => { document.querySelector('#root').innerHTML = data })
}

function changePage(pageName) {
    // window.location.search = window.location.search.replace(currPage.split('/')[-1].split('.')[0], pageName)
    window.location.search = `?page=${pageName}`
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