const startMenu = "./compos/startmenu.compo"
const preGame = "./compos/pregame.compo"
const playPage = "./compos/play.compo"
let cardCompo = ""
fetch("./compos/card.compo")
    .then(res => res.text())
    .then(data => { cardCompo = data })
const sess = new Session()

let playerlist = []
let highestId = -1
if (sess.get('playerList')) {
    playerlist = sess.get('playerList')
}
for (let i = 0; i < playerlist.length; i++) {
    if (playerlist[i].id > highestId) {
        highestId = playerlist[i].id
    }
}
highestId++

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
                            updatePlayerList()
                        })
                    currPage = preGame
                    break
                case "play":
                    loadCompo(playPage)
                        .then(_ => {
                            //DBG
                            addCard()
                            // 
                            addDrags(document.querySelector('#card'))

                        })
                    currPage = playPage
                // TODO check for player count

                default:
                    break
            }
            break

        default:
            loadCompo(startMenu)
    }
})

function addCard() {
    if (currPage === playPage) {
        document.querySelector('#card').outerHTML = makeCard()
    }
}

function makeCard() {
    let card = cardCompo
    card = card
        .replace("*TITLE*", "Titel")
        .replace("*TEXT*", "Ey du wichser")
        .replace("*SET*", "Virus")
        .replace("*SIPS*", "17")
    return card
}

function addPlayer() {
    let player = {
        id: highestId,
        name: document.querySelector('#pregame-playernameInp').value.trim(),
    }
    console.log(player)
    if (player.name.length > 1) {
        playerlist.push(player)
        highestId++
        sess.set('playerList', playerlist)
        document.querySelector('#pregame-playernameInp').value = ""
        inpFocusOut()
    }
}

function removePlayer(el) {
    let toRemove = -1
    for (let i = 0; i < playerlist.length; i++) {
        if (playerlist[i].id == el.getAttribute('dataid')) {
            toRemove = i
            break
        }
    }
    if (toRemove > -1) {
        playerlist.splice(toRemove, 1)
        sess.set('playerList', playerlist)
        updatePlayerList()
    }
}

function inpFocusIn() {
    if (isMobile()) {
        document.querySelector('#pregame-playerlist').classList.add('pregame-hidden')
        document.querySelector('#pregame-playBtn').classList.add('pregame-hidden')
        document.querySelector('#pregame-addPlayerBtn').classList.remove('pregame-hidden')
    }
}

function inpFocusOut() {
    if (isMobile() && document.querySelector('#pregame-playernameInp').value.trim().length <= 1) {
        document.querySelector('#pregame-playerlist').classList.remove('pregame-hidden')
        document.querySelector('#pregame-playBtn').classList.remove('pregame-hidden')
        document.querySelector('#pregame-addPlayerBtn').classList.add('pregame-hidden')

        updatePlayerList()
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

function updatePlayerList() {
    let playLi = sess.get('playerList')
    if (playLi) {
        document.querySelector('#pregame-playerlist').innerHTML = ""
        playLi.forEach(el => {
            document.querySelector('#pregame-playerlist').innerHTML += `<span dataid="${el.id}" onclick="removePlayer(this)">${el.name}</span>`
        })
    }
}