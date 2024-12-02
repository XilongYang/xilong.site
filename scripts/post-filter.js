// State Transfer
const ST = {
    INIT   : 0,
    NORMAL : 1,
    AND_OR : 2,
    NOT    : 3,
    PL     : 4,
    PR     : 5,
    ESC    : 6
};

const OPT_MISS      = "Operator Missing"
const OPT_DUPL      = "Duplidate Operator"
const EMP_FIELD     = "Empty Field"
const INVALID_ESC   = "Invalid Escape"
const UNMATCH_P     = "Unmatched Parenthesis"

//             [init   , normal     , and or   , not   , left parenthesis, right parenthesis, escape   ]
const init   = [ST.INIT, ST.NORMAL  , EMP_FIELD, ST.NOT   , ST.PL           , ST.PR            , ST.ESC   ]
const normal = [ST.INIT, ST.NORMAL  , ST.AND_OR, OPT_MISS , OPT_MISS        , ST.PR            , ST.ESC   ]
const andOr  = [ST.INIT, ST.NORMAL  , OPT_DUPL , ST.NOT   , ST.PL           , EMP_FIELD        , ST.ESC   ]
const not    = [ST.INIT, ST.NORMAL  , EMP_FIELD, ST.NOT   , ST.PL           , EMP_FIELD        , ST.ESC   ]
const pl     = [ST.INIT, ST.NORMAL  , EMP_FIELD, ST.NOT   , ST.PL           , EMP_FIELD        , ST.ESC   ]
const pr     = [ST.INIT, OPT_MISS   , ST.AND_OR, OPT_MISS , OPT_MISS        , ST.PR            , ST.ESC   ]
const esc    = [ST.INIT, INVALID_ESC, ST.NORMAL, ST.NORMAL, ST.NORMAL       , ST.NORMAL        , ST.NORMAL]

class JudgeNode {
    exp;
    successNext;
    failureNext;
    constructor() {
        this.exp = ""
        this.successNext = true
        this.failureNext = false
    }
}

function toggleInput() {
    var filterIcon = document.getElementById("post-filter")
    var input = document.getElementById("post-filter-input")
    if(filterIcon.classList.contains("icon-active")) {
        filterIcon.classList.add("icon")
        filterIcon.classList.remove("icon-active")
        input.style.display = "none"
        input.innerHTML = ""
    } else {
        filterIcon.classList.add("icon-active")
        filterIcon.classList.remove("icon")
        input.style.display = "inline-block"
    }
}

function moveCursorToEnd(target) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

function inputFilter(e) {
    if (e.type == "keypress" && e.key == "enter") {
        e.preventDefault();
        moveCursorToEnd(e.target)
    }

    if (e.type == "input") {
        const input = e.target
        if (input.innerText.includes('\n')) {
            input.innerText = input.innerText.replace(/\n/g, '');
            moveCursorToEnd(input)
        }
    }
}

function clearErrorMsg() {
    var input = document.getElementById("post-filter-input")
    var errs = input.getElementsByClassName('error')
    for (var err of errs) {
        var msgs = err.getElementsByClassName('error-msg')
        for (var msg of msgs) {
            err.removeChild(msg)
        }
    }
    var exp = input.innerText.replace("\n", "")
    input.innerHTML = exp
}

function refreshFilter() {
    var input = document.getElementById("post-filter-input")
    var exp = input.innerText.replace("\n", "")
    if (exp == "") {
        input.innerHTML = ""
        return
    }

    if (!expressionValidate(exp)) {
        return
    }

    var matchTree = expressionParse(exp)


}

function expressionValidate(exp) {
    exp = exp.trim()
    if (exp == "") {
        return false
    }

    var states = [init, normal, andOr, not, pl, pr, esc]
    var curST = ST.INIT

    var openParenthesisIndex = []

    for (var i = 0; i < exp.length; ++i) {
        var c = exp[i]
        var result = "null"

        switch (c) {
            case " ":
                continue
            case "&":
            case "|":
                result = states[curST][ST.AND_OR]
                break
            case "~":
                result = states[curST][ST.NOT]
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
                    result = UNMATCH_P
                }
                break
            case "\\":
                result = states[curST][ST.ESC]
                break
            default:
                result = states[curST][ST.NORMAL]
        }

        if (typeof(result) == "string") {
            errorMsg(result, exp, i)
            return false
        }

        curST = result
    }

    if (curST == ST.AND_OR || curST == ST.NOT) {
        errorMsg(EMP_FIELD, exp, exp.length - 1)
        return false
    }

    if (openParenthesisIndex.length > 0) {
        errorMsg(UNMATCH_P, exp, openParenthesisIndex.pop())
        return false
    }

    return true
}

function expressionParse(exp) {
    exp = exp.trim()


}

function errorMsg(msg, exp, index) {
    var errorMsg = "Error: " + msg
    var markedInput = exp.slice(0, index) + "<span class='error'>" + exp[index] + "<span class='error-msg'>" + errorMsg + "</span></span><span class = 'invalid-expression'>" + exp.slice(index + 1) + "</span>"
    document.getElementById("post-filter-input").innerHTML = markedInput
}

export {toggleInput, refreshFilter, clearErrorMsg, inputFilter}