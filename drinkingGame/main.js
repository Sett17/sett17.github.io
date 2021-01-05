cacheName = "cache-dev-v1.6"
document.querySelector('#version').innerHTML = cacheName


const startMenu = "./compos/startmenu.compo"
const preGame = "./compos/pregame.compo"
const playPage = "./compos/play.compo"
let cardCompo = ""
fetch("./compos/card.compo")
    .then(res => res.text())
    .then(data => { cardCompo = data })
const sess = new Session()

cards = {}

let gameRunning

let highestId = -1
let playerlist = []
if (sess.get('playerList')) {
    playerlist = sess.get('playerList')
}
let usedCards = []
if (sess.get('usedCards')) {
    usedCards = sess.get('usedCards')
}
let allCards = []
if (sess.get('allCards')) {
    allCards = sess.get('allCards')
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
                    // let playerCount = playerlist.length
                    let playerCount = 999
                    if (playerCount > 1) {
                        loadCompo(playPage)
                            .then(_ => {
                                loadCards()
                                    .then(data => cards = data)
                                    .then(_ => {
                                        if (allCards.length == 0) {
                                            allCards = cards.truth.concat(cards.dare.concat(cards.virus.concat(cards.minigame)))
                                            sess.set('allCards', allCards)
                                        }
                                        gameRunning = true
                                        newCard()
                                    })
                            })
                        currPage = playPage
                    } else {
                        changePage('pregame')
                    }
                default:
                    break
            }
            break

        default:
            loadCompo(startMenu)
    }
})

function newCard() {
    addCard(chooseCard())
}

let currCard = {}
function chooseCard() {
    useableCards = allCards
    usedCards.forEach(element => {
        useableCards.remove(element)
    })
    currCard = useableCards[Math.floor(Math.random() * useableCards.length)]
    usedCards.push(currCard)
    return currCard
}

function addCard(card) {
    if (currPage === playPage) {
        document.querySelector('#card').outerHTML = makeCard(card)
        document.querySelector('#card').style.transition = "all 0ms"
        document.querySelector('#card').style.transform = `matrix(0.01, 0, 0, 0.01, 0, ${offsetY})`
        document.querySelector('#card').style.opacity = "0.01"
        document.querySelector('#card').style.transition = `all ${animTimeIn}ms`
        setTimeout(() => {
            document.querySelector('#card').style.transform = `matrix(1, 0, 0, 1, 0, ${offsetY})`
            document.querySelector('#card').style.opacity = "1.0"
            setInterval(() => {
                addDrags(document.querySelector('#card'))
            }, animTimeIn)
        }, 1)
    }
}

function makeCard(use) {
    let card = cardCompo
    try {
        card = card
            .replace("*TITLE*", use.title)
            .replace("*TEXT*", use.text)
            .replace("*SET*", use.set)
            .replace("*SIPS*", use.sips)
    } catch (error) {
        card = card
            .replace("*TITLE*", "Das wars")
            .replace("*TEXT*", "Danke fürs Spielen!<br>Wische einfach diese Karte weg.")
            .replace("*SET*", "Ehre")
            .replace("*SIPS*", "&#x221e;")
        gameRunning = false
    }
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