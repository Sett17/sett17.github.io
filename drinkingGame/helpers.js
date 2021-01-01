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