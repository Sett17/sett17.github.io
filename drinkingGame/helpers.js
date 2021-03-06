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

class Session extends Map {
    set(id, value) {
        if (typeof value === 'object') value = JSON.stringify(value)
        sessionStorage.setItem(id, value)
    }

    get(id) {
        const value = sessionStorage.getItem(id)
        try {
            return JSON.parse(value)
        } catch (e) {
            return value
        }
    }
}

function coerce(num, min, max) {
    if (num < min) {
        return min
    } else if (num > max) {
        return max
    } else {
        return num
    }
}

let oriX = 0, oriY = 0, dX = 0, dY = 40, offsetX = 0, offsetY = 40, angle = 0
let isMoving = false
function handleDragStart(e) {
    document.querySelector('#card').style.transition = `all ${turnTime}ms`
    dX = 0
    dY = 0
    if (!isMoving) {
        oriX = e.touches[0].clientX
        oriY = e.touches[0].clientY
    }
}

const animTimeRet = 100
const animTimeBounce = 80
const animTimeOut = 150
const animTimeIn = 100

function handleDragEnd(e) {
    let zoneSize = [document.body.clientWidth * .3, document.body.clientHeight * .33]
    if (dX < zoneSize[0] &&
        dX > -zoneSize[0] &&
        dY < zoneSize[1]) {
        isMoving = true
        document.querySelector('#card').style.transition = `all ${animTimeRet}ms`
        document.querySelector('#card').style.transform = getMatrix(0, -Math.sign(dX) * 15, -Math.sign(dY) * 15 + offsetY)
        setTimeout(() => {
            document.querySelector('#card').style.transition = `all ${animTimeBounce}ms`
            document.querySelector('#card').style.transform = getMatrix(0, 0, offsetY)
            setTimeout(() => {
                isMoving = false
                document.querySelector('#card').style.transition = `all ${turnTime}ms`
            }, animTimeBounce)
        }, animTimeRet)
    } else if (gameRunning) {
        if (dY > zoneSize[1] &&
            dX < zoneSize[0] &&
            dX > -zoneSize[0]) {
            isMoving = true
            document.querySelector('#card').style.transition = `all ${animTimeOut}ms`
            document.querySelector('#card').style.transform = getMatrix(angle, dX, dY + zoneSize[1] * 1.5)
        } else {
            isMoving = true
            document.querySelector('#card').style.transition = `all ${animTimeOut}ms`
            document.querySelector('#card').style.transform = getMatrix(angle, dX + Math.sign(dX) * zoneSize[0] * 2.2, dY + offsetY)
        }
        setTimeout(() => {
            newCard()
            isMoving = false
        }, animTimeOut * 1.5)
    } else {
        setTimeout(() => {
            changePage('startmenu')
        }, 1000)
    }
}

let lastDx = oriX
let lastCoord = [0, 0]

let turnTime = 5
let turn = true
function handleDragMove(e) {
    if (!isMoving) {
        if (turn) {
            turn = false
            setTimeout(() => { turn = true }, turnTime)
            lastCoord = [e.touches[0].clientX, e.touches[0].clientY]
            dX = e.touches[0].clientX - oriX
            dY = e.touches[0].clientY - oriY
            lastDx = dX
            if (dX >= 0) {
                angle = ((coerce(dX, 0, 200) - 0) / (200 - 0) * (20 - 0) + 0) * Math.PI / 180
            } else {
                angle = -((coerce(-dX, 0, 200) - 0) / (200 - 0) * (20 - 0) + 0) * Math.PI / 180
            }
            document.querySelector('#card').style.transform = getMatrix(angle, dX + offsetX, dY + offsetY)
        }
    }
}

function addDrags(el) {
    el.addEventListener('touchstart', handleDragStart, false)
    el.addEventListener('touchend', handleDragEnd, false)
    el.addEventListener('touchmove', handleDragMove, false)
}

function getMatrix(angle, tx, ty) {
    return `matrix(${Math.cos(angle)}, ${Math.sin(angle)}, ${-Math.sin(angle)}, ${Math.cos(angle)}, ${tx}, ${ty})`
}

function loadCards() {
    return fetch('./assets/cards.json')
        .then(d => d.json())
}

String.prototype.hash = function () {
    var hash = 0
    for (var i = 0; i < this.length; i++) {
        var code = this.charCodeAt(i)
        hash = ((hash << 5) - hash) + code
        hash = hash & hash // Convert to 32bit integer
    }
    return hash
}

Array.prototype.remove = function (obj) {
    const index = this.indexOf(obj)
    if (index > -1) {
        this.splice(index, 1)
    }
}

function reloadFresh() {
    navigator.serviceWorker.getRegistration().then(function (reg) {
        if (reg) {
            reg.unregister().then(function () { location.reload() })
        } else {
            location.reload()
        }
    })
}