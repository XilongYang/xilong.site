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

class Ptr {
    value
    constructor(value) {
        this.value = value
    }
}

class MatchNode {
    exp
    successNext
    failureNext
    constructor() {
        this.exp = ""
        this.successNext = new Ptr(new Ptr(true))
        this.failureNext = new Ptr(new Ptr(false))
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
        refreshFilter()
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
    var exp = input.innerText.replace("\n", "").trim()
    if (exp == "") {
        input.innerHTML = ""
        var postYears = document.getElementsByClassName('post-year-wrapper')
        for (var postYear of postYears) {
            var posts = postYear.getElementsByClassName('post-wrapper')
            for (var post of posts) {
                post.style.display = 'block'
            }
            postYear.style.display = 'block'
        }
        return
    }

    if (!expressionValidate(exp)) {
        return
    }

    var matchTree = expressionParse(exp)

    var postYears = document.getElementsByClassName('post-year-wrapper')
    for (var postYear of postYears) {
        var atLeastOne = false
        var posts = postYear.getElementsByClassName('post-wrapper')
        for (var post of posts) {
            var isSuccess = expressionMatch(matchTree, post.innerText)
            atLeastOne = atLeastOne || isSuccess
            post.style.display = isSuccess ? 'block' : 'none'
        }
        postYear.style.display = atLeastOne ? 'block' : 'none'
    }

}

function expressionValidate(exp) {
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
    var stack      = []
    var head       = new MatchNode()
    var cur        = head

    for (var i = 0; i < exp.length; ++i) {
        var c = exp[i]
        switch (c) {
            case "&":
                var next = new MatchNode()
                if (cur.successNext.value.value == true) {
                    next.failureNext = cur.failureNext
                    next.successNext.value = cur.successNext.value
                    cur.successNext.value = new Ptr(next)
                } else {
                    next.failureNext = cur.successNext
                    next.successNext.value = cur.failureNext.value
                    cur.failureNext.value = new Ptr(next)
                }
                cur = next
                break;
            case "|":
                var next = new MatchNode()
                if (cur.successNext.value.value == true) {
                    next.successNext = cur.successNext
                    next.failureNext.value = cur.failureNext.value
                    cur.failureNext.value = new Ptr(next)
                } else {
                    next.successNext = cur.failureNext
                    next.failureNext.value = cur.successNext.value
                    cur.successNext.value = new Ptr(next)
                }
                cur = next
                break
            case "~":
                var temp = cur.failureNext
                cur.failureNext = cur.successNext
                cur.successNext = temp
                break
            case "(":
                stack.push([head, cur])
                head = new MatchNode()
                cur = head
                break
            case ")":
                var target = stack.pop()
                var head0  = target[0]
                var cur0   = target[1]

                cur.failureNext.value = cur0.failureNext.value
                cur.successNext.value = cur0.successNext.value

                cur0.failureNext = head.failureNext
                cur0.successNext = head.successNext
                cur0.exp = head.exp

                head = head0
                break
            case "\\":
                i++;
                cur.exp += exp[i]
                break
            default:
                cur.exp += c
        }
    }

    return head
}

function expressionMatch(matchTree, str) {
    var matchingExp = matchTree.exp.trim()
    var isSuccess = str.includes(matchingExp)

    if (isSuccess) {
        var next = matchTree.successNext.value.value
        if (typeof(next) == 'boolean') {
            return next;
        }
        return expressionMatch(next, str)
    }

    var next = matchTree.failureNext.value.value
    if (typeof(next) == 'boolean') {
        return next;
    }
    return expressionMatch(next, str)
}

function errorMsg(msg, exp, index) {
    var errorMsg = "Error: " + msg
    var markedInput = exp.slice(0, index) + "<span class='error'>" + exp[index] + "<span class='error-msg'>" + errorMsg + "</span></span><span class = 'invalid-expression'>" + exp.slice(index + 1) + "</span>"
    document.getElementById("post-filter-input").innerHTML = markedInput
}

export {toggleInput, refreshFilter, clearErrorMsg, inputFilter}
