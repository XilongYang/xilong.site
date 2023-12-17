var bonus = 0;
var money = 100;

var clearFlag = false;

const bonusList = [5, 10, 20, 100, 500, 1000, 5000, 10000, 100000];

function randomBonusList() {
    var tempList = Array.from(bonusList);
    var randomList = [];
    while (tempList.length > 0) {
        var randomInt = Math.floor(Math.random() * (tempList.length));
        randomList.push(tempList[randomInt]);
        tempList.splice(randomInt, 1);
    }
    return randomList;
}

function GenerateNumbers() {
    var rows = document.getElementsByClassName("rows");
    var randomBonus = randomBonusList();
    for (var i = 1; i < rows.length; ++i) {
        var row = rows[i];
        var numbers = Array.from(row.childNodes).filter(function(item){return item.className == "number-box";});
        var winFlag = false;

        numbers[numbers.length - 1].innerText = randomBonus[i - 1];
        for (var j = 0; j < numbers.length - 1; ++j) {
            var randomInt = Math.floor(Math.random() * 99) + 1;
            if (numbers[numbers.length - 1].innerText >= 5000 && (randomInt == 8 || randomInt == 29)) {
                randomInt++;
            }
            if (randomInt < 10) {
                randomInt = '0' + randomInt;
            }
            numbers[j].innerText = randomInt;
            if (numbers[j].innerText == '08' || numbers[j].innerText == '29') {
                winFlag = true;
            }
        }

        if (numbers[0].innerText == numbers[1].innerText && numbers[1].innerText == numbers[2].innerText) {
            winFlag = true;
        }

        if (winFlag) {
            bonus += randomBonus[i - 1];
        }
    }
}

function ClearRect(e) {
    if (!clearFlag) {
        return;
    }

    var rect = e.target.getBoundingClientRect();
    var ctx = e.target.getContext('2d');

    var eventX = (e.type == "touchmove") ? e.touches[0].clientX : e.clientX;
    var eventY = (e.type == "touchmove") ? e.touches[0].clientY : e.clientY;

    var x = (eventX - rect.left) * (e.target.width / rect.width);
    var y = (eventY - rect.top) * (e.target.height / rect.height);

    ctx.clearRect(x - 5, y - 5, 10, 10);
}

function Redeem() {
    money += bonus;
    bonus = 0;
    moneyDisplay = document.getElementById("money");
    moneyDisplay.innerText = money;
}

function Replay() {
    if (money < 10) {
        alert("钱不够了，刷新页面重来吧");
        return;
    }
    money -= 10;
    moneyDisplay = document.getElementById("money");
    moneyDisplay.innerText = money;

    GenerateNumbers();
    var canvas = document.getElementById('fill');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#207f4c';
    ctx.fillRect(0, 0, 500, 500);
}

function init() {
    GenerateNumbers();
    var canvas = document.getElementById('fill');
    canvas.addEventListener("mousemove", ClearRect);
    canvas.addEventListener("mousedown", () => {clearFlag = true});
    canvas.addEventListener("mouseup", () => {clearFlag = false});
    canvas.addEventListener("touchmove", ClearRect);
    canvas.addEventListener("touchstart", () => {clearFlag = true});
    canvas.addEventListener("touchend", () => {clearFlag = false});
    var ctx = canvas.getContext('2d');
  
    ctx.fillStyle = '#207f4c';
    ctx.fillRect(0, 0, 500, 500);
}
