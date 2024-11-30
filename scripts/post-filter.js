// State Transfer
const ST = {
    INIT   : 0,
    NORMAL : 1,
    LOGIC  : 2,
    PL     : 3,
    PR     : 4,
    ESC    : 5
};

const OPT_MISS      = "operator missing"
const OPT_DUPL      = "duplidate operator"
const EMP_FIELD     = "empty field"
const INVALID_TRANS = "invalid transfer"

const PRE_ST        = "move to previous"

//             [init   , normal       , logic    , left parenthesis, right parenthesis, escape]
const init   = [ST.INIT, ST.NORMAL    , EMP_FIELD, ST.PL           , ST.PR            , ST.ESC]
const normal = [ST.INIT, ST.NORMAL    , ST.LOGIC , OPT_MISS        , ST.PR            , ST.ESC]
const logic  = [ST.INIT, ST.NORMAL    , OPT_DUPL , ST.PL           , EMP_FIELD        , ST.ESC]
const pl     = [ST.INIT, ST.NORMAL    , EMP_FIELD, ST.PL           , EMP_FIELD        , ST.ESC]
const pr     = [ST.INIT, OPT_MISS     , ST.LOGIC , OPT_MISS        , ST.PR            , ST.ESC]
const esc    = [ST.INIT, INVALID_TRANS, PRE_ST   , PRE_ST          , PRE_ST           , PRE_ST]

function toggleInput() {
    var filterIcon = document.getElementById("post-filter")
    var input = document.getElementById("post-filter-input")
    var info = document.getElementById("post-filter-info")
    if(filterIcon.classList.contains("icon-active")) {
        filterIcon.classList.add("icon")
        filterIcon.classList.remove("icon-active")
        input.style.display = "none"
        info.style.display = "none"
        input.value = ""
        info.innerHTML = ""
    } else {
        filterIcon.classList.add("icon-active")
        filterIcon.classList.remove("icon")
        input.style.display = "inline-block"
        info.style.display = "block"
    }
}

function refreshFilter() {
    var input = document.getElementById("post-filter-input")
    if (!expressionValidate(input.value)) {
        return
    }

    var matchExp = expressionParse(input.value)


}

function expressionValidate(exp) {
    exp = exp.trim()
    if (exp == "") {
        return false
    }

    var info = document.getElementById("post-filter-info")
    info.innerHTML = ""

    var states = [init, normal, logic, pl, pr, esc]
    var curST = ST.INIT
    var preST = ST.INIT

    var openParenthesisIndex = []

    for (var i = 0; i < exp.length; ++i) {
        var c = exp[i]
        var result = "null"

        switch (c) {
            case " ":
                continue
            case "&":
            case "|":
                result = states[curST][ST.LOGIC]
                break
            case "(":
                result = states[curST][ST.PL]
                if (curST != ST.ESC) {
                    openParenthesisIndex.push(i)
                }
                break
            case ")":
                result = states[curST][ST.PR]
                if (curST != ST.ESC && undefined == openParenthesisIndex.pop()) {
                    result = "unmatched parentheses"
                }
                break
            case "\\":
                result = states[curST][ST.ESC]
                break
            default:
                result = states[curST][ST.NORMAL]
        }

        if (result == PRE_ST) {
            result = preST
        }

        if (typeof(result) == "string") {
            info.innerHTML = errorMsg(result, exp, i)
            return false
        }

        preST = curST
        curST = result
    }

    if (curST == ST.LOGIC) {
        info.innerHTML = errorMsg(EMP_FIELD, exp, exp.length - 1)
        return false
    }

    if (openParenthesisIndex.length > 0) {
        info.innerHTML = errorMsg("unmatched parentheses", exp, openParenthesisIndex.pop())
        return false
    }

    return true
}

function expressionParse(exp) {
    exp = exp.trim()


}

function errorMsg(msg, exp, index) {
    return "Error: " + msg + ": " + exp.slice(0, index) + "<span class='error'>" + exp[index] + "</span>" + exp.slice(index + 1)
}

export {toggleInput, refreshFilter}