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
                    break
                default:
                    break
            }
            break

        default:
            loadCompo(startMenu)
    }
})

function loadCompo(filePath) {
    fetch(filePath)
        .then(res => res.text())
        .then(data => { document.querySelector('#root').innerHTML = data })
}