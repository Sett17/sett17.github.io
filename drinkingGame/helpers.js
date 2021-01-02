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

let oriX = 0, oriY = 0, dX = 0, dY = 40, angle = 0
let isReturning = false
function handleDragStart(e) {
    if (!isReturning) {
        oriX = e.touches[0].clientX
        oriY = e.touches[0].clientY
    }
}

function handleDragEnd(e) {
    //TODO check where it is
    isReturning = true
    document.querySelector('#card').style.transition = "all 100ms"
    document.querySelector('#card').style.transform = getMatrix(0, 0, 40)
    setTimeout(() => {
        isReturning = false
        document.querySelector('#card').style.transition = "all 0ms"
    }, 100)
}

function handleDragMove(e) {
    if (!isReturning) {
        let dX = e.touches[0].clientX - oriX
        let dY = e.touches[0].clientY - oriY
        document.querySelector('#card').style.transform = getMatrix(angle, dX, dY)
    }
}

function addDrags(el) {
    el.addEventListener('touchstart', handleDragStart, false)
    el.addEventListener('touchend', handleDragEnd, false)
    el.addEventListener('touchmove', handleDragMove, false)
}

function getMatrix(angle, tx, ty) {
    return `matrix(1, 0, 0, 1, ${tx}, ${ty})`
}