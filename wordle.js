var roundElem, oneCharInputs;
var tryBtn = document.querySelector('.try-btn');
var goal = "HARAM";
var matchCount = 0;
var round = 0;
var aniTime = 1000;
var prevIndex = 0;

function strFormat() {
    var args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
}
function checkShowFlag(inputs) {
    var showFlag = true;
    for(var i = 0; i < oneCharInputs.length; i++) {
        if(inputs[i].value == '') {
            showFlag = false;
        }
    }
    return showFlag;
}
function nextRount() {
    if(round < 6) {
        prevIndex = 0;
        if(oneCharInputs) {
            for(var i=0;i<oneCharInputs.length;i++) {
                oneCharInputs[i].removeEventListener('keydown', makeKeydownHandler(oneCharInputs, i));
            }
        }

        round++;
        var template = `
            <input type="text" class="char" name="c1" maxlength="1" readonly="readonly">
            <input type="text" class="char" name="c2" maxlength="1" readonly="readonly">
            <input type="text" class="char" name="c3" maxlength="1" readonly="readonly">
            <input type="text" class="char" name="c4" maxlength="1" readonly="readonly">
            <input type="text" class="char" name="c5" maxlength="1" readonly="readonly">
        `;
        var nextRoundElem = document.createElement('div');
        nextRoundElem.classList.add('round');
        nextRoundElem.id = 'r' + round;
        nextRoundElem.innerHTML = template;
        document.querySelector('.game-board').append(nextRoundElem);

        roundElem = document.querySelector('div #r'+round);
        oneCharInputs = roundElem.querySelectorAll('.char');
        roundElem.classList.add('active');
        oneCharInputs[0].focus();
        tryBtn.textContent = "ROUND " + round;
        
        function makeKeydownHandler(inputs, index) {
            return function(e) {
                prevIndex = index;
                e.preventDefault();
                if(e.keyCode == '8' || e.keyCode == '37') {
                    if(index > 0) {
                        inputs[index-1].focus();
                    }
                } else if(e.keyCode == '39') {
                    if(index < inputs.length-1) {
                        inputs[index+1].focus();
                    } else {
                        tryBtn.focus();
                    }
                } else if(e.keyCode >= 65 && e.keyCode <= 90) {
                    inputs[index].value = e.key.toUpperCase();
                    if(inputs[index].value.length == inputs[index].maxLength) {
                        if(index < inputs.length-1) {
                            inputs[index+1].focus();
                        } else {
                            if(tryBtn.disabled) {
                                if(checkShowFlag(oneCharInputs)) tryBtn.disabled = false;
                            }
                            tryBtn.focus();
                        }
                    }

                    
                    if(checkShowFlag(oneCharInputs)) {
                        tryBtn.disabled = false;
                    }
                }
            }
        }
        for(var i=0;i<oneCharInputs.length;i++) {
            oneCharInputs[i].addEventListener('keydown', makeKeydownHandler(oneCharInputs, i));
            oneCharInputs[i].addEventListener('focusin', function(e){
                prevIndex = Number(e.target.name.substring(1,2))-1;
            });
        }
    }
}

function delay(input, i) {
    return new Promise(function(resolve) {
        setTimeout(function(){
            resolve(input);
        }, i*aniTime);
    });
}

function guess() {
    tryBtn.classList.add('press');
    setTimeout(function() {
        tryBtn.disabled = true;
        for(var i = 0; i < oneCharInputs.length; i++) {
            oneCharInputs[i].disabled = true;
            delay(oneCharInputs[i], i).then(function(oneCharInput) {
                var index = Number(oneCharInput.name.substring(1,2)) - 1;
                if(oneCharInput.value == goal.substring(index, index+1)) {
                    oneCharInput.classList.add('rotate-green');
                    matchCount++;
                } else if(goal.indexOf(oneCharInput.value) > -1) {
                    oneCharInput.classList.add('rotate-yellow');
                } else {
                    oneCharInput.classList.add('rotate-gray');
                }
                if(index == 4) {
                    setTimeout(function() {
                        if(matchCount == 5) {
                            alert('정답!');
                            location.reload();
                        } else {
                            tryBtn.classList.remove('press');
                            matchCount = 0;
                            nextRount();
                        }
                    }, aniTime);
                }
            });
        }
    }, 0.5*aniTime);
}

window.onload = function() {
    nextRount(0);
    document.addEventListener('keydown', function(e) {
        if(e.keyCode == '13') {
            e.preventDefault();
            document.querySelector('.try-btn').focus();
            document.querySelector('.try-btn').click();
        }
    });
    tryBtn.addEventListener('keydown', function(e) {
        if(e.keyCode == '8' || e.keyCode == '37') {
            if(e.target == document.activeElement) {
                e.preventDefault();
                oneCharInputs[4].focus();
            }
        }
    });
    document.querySelectorAll('.key').forEach(function(keyItem){
        keyItem.addEventListener('click', function(e) {
            e.preventDefault();
            if(prevIndex != -1) {
                oneCharInputs[prevIndex].value = e.target.id.toUpperCase();
                if(prevIndex < 4) {
                    prevIndex++;
                    oneCharInputs[prevIndex].focus();
                } else {
                    prevIndex = -1;
                    if(tryBtn.disabled) {
                        if(checkShowFlag(oneCharInputs)) tryBtn.disabled = false;
                    }
                    tryBtn.focus();
                }
            } else {
                tryBtn.focus();
            }
        });
    });
}