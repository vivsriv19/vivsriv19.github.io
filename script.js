

(function(){

    function c(param){
        console.log(param);
    }
    function selId(id,qSel){
        if(!qSel){
            return document.getElementById(id);
        }else{
            return document.getElementById(id).querySelector(qSel);
        }
    }
    

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function addClass(elem, cls){
        elem.classList.add(cls);
    }

    function removeClass(elem, cls){
        elem.classList.remove(cls);
    }

    

    function setStart(e){
        var token = e.target.getAttribute('data-token');
        removeClass(e.target,appState.turn+"-token");        
        addTokenCell(moveOrder[appState.turn][appState.zone[appState.turn][token]["index"]], appState.turn+"-token", ".cell-0", e.target.getAttribute('data-token'));
        appState[appState.turn][token] = "cell-0";                
    }

    function addTokenCell(zone, token, cell, token_num, target){       

        var tokenElem = document.getElementById(zone).querySelector(cell).querySelector("."+token);

        if(!token_num){
            token_num = target.getAttribute('data-token').substring(0,7);
        }

        if(tokenElem){
            token_num = tokenElem.getAttribute("data-token")+" "+token_num;
            var tokenMatch = token_num.match(new RegExp(" ", "g"));
            var tokenCount = (tokenMatch && tokenMatch.length)*1 + 1;
            tokenElem.setAttribute('data-token', token_num);
            tokenElem.innerHTML= "<span>"+tokenCount+"</span>";
        }else{
            document.getElementById(zone).querySelector(cell).insertAdjacentHTML('beforeend','<span data-token="'+token_num+'" class="'+token+'"></span>');
        }
        
    }

    function removeTokenCell(target){
        var dataTokenAttr = target.getAttribute('data-token');
        var tokenMatch = dataTokenAttr.match(new RegExp(" ", "g"));
        if((tokenMatch && tokenMatch.length) > 0){
            target.setAttribute('data-token',dataTokenAttr.slice(8));
            var tokenCount = target.querySelector('span').innerText*1 - 1;
            if(tokenCount <= 1){
                target.querySelector('span').innerText = "";
            }else{
                target.querySelector('span').innerText = tokenCount;
            }
        }else{
            target.remove();
        }

    }

    function moveToken(e){
        var target = e.target || e;
        //e.stopPropagation
        diceNum.innerText = "";
        // && !appState[turn]["token-1"] && !appState[turn]["token-2"] && !appState[turn]["token-3"] && !appState[turn]["token-4"]
        var turn = appState.turn;
        var start = "#"+turn+"-start";
        var turn_token = turn+"-token";
        var token = target.getAttribute('data-token').substring(0,7);

        

        if(appState.num == 6 && target.closest(start)){                        
            setStart(e);  
            return;      
        }
        
        if(!target.closest(start) && target.classList.contains(turn_token)){

            var currSel = appState[turn][token] && appState[turn][token].replace("cell-","")*1;
            
            var destCell = currSel+appState.num;
            
            //console.log(destCell, appState[turn][token], appState[turn][token].replace("cell-",""), appState.num, appState.red, appState.zone.red);

            if(appState.zone[turn][token].index == 4 && appState.zone[turn][token].reset == 1 && destCell > 11){

                if(currSel < 13) destCell = destCell + 1;

                if(destCell == 18) {
                    appState.zone[turn][token].home = 1;
                    // removeClass(target,turn_token);                      
                    // selId("home").querySelector("#"+turn+"-home").innerText = appState.zone[turn].home;                    

                    selId("home").querySelector("#"+turn+"-home").innerText = (appState.zone[turn]["token-1"].home + 
                                                                               appState.zone[turn]["token-2"].home + 
                                                                               appState.zone[turn]["token-3"].home + 
                                                                               appState.zone[turn]["token-4"].home);                    
                    removeTokenCell(target);

                }else if(destCell < 18){
                    // removeClass(target,turn_token);  
                    // addClass(selId(redMove[appState.zone[turn]["index"]], ".cell-"+destCell), turn_token, null, target);
                    
                    addTokenCell(moveOrder[turn][appState.zone[turn][token]["index"]], turn_token, ".cell-"+destCell,null,target);
                    removeTokenCell(target);

                }else{
                    destCell = currSel;
                }

                appState[turn][token] = "cell-"+destCell;   
                return;

            }else if(destCell > 4 && destCell <= 12){

                if(appState.zone[turn][token].reset == 0){
                    appState.zone[turn][token].reset = 1;
                    appState.zone[turn][token]["index"]++;
                }

            }else if(destCell > 12){
                
                destCell = destCell - 12 - 1;
                if(destCell > 4){                    
                    appState.zone[turn][token]["index"]++;
                    appState.zone[turn][token].reset = 1;
                }else{
                    appState.zone[turn][token].reset = 0;
                }
                
            }     

            
            addTokenCell(moveOrder[turn][appState.zone[turn][token]["index"]], turn_token, ".cell-"+destCell,null,target);
            removeTokenCell(target);

            appState[turn][token] = "cell-"+destCell;            
        }
    }

    var diceNum = selId('diceNum');

    var moveOrder = {
        "red" : ["red","green","yellow","blue","red"],
        "green" : ["green","yellow","blue","red","green"],
        "blue" : ["blue","red","green","yellow","blue"],
        "yellow" : ["yellow","blue","red","green","yellow"]
    };

    var turnOrder = ["red","green","yellow","blue"];

    var appState = {  
                       turn: "red",
                       red: {"token-1":false,"token-2":false,"token-3":false,"token-4":false},
                       zone : {"red" : {
                                        "token-1" : {index : 0, reset : 0, home:0}, 
                                        "token-2" : {index : 0, reset : 0, home:0}, 
                                        "token-3" : {index : 0, reset : 0, home:0}, 
                                        "token-4" : {index : 0, reset : 0, home:0} 
                                       } 
                               },
                       num:0
                       
                    };
    

    function showRandomNum(e){
        
        if(e.target.classList.value == 'diceClick'){        
            appState.num = e.target.innerText*1;//getRndInteger(1,7);
            diceNum.innerText = " : "+appState.num;        
        }
    }

    document.getElementById("container").addEventListener("click", function(element){
        //console.log(element.target.classList);
        if(element.target.classList.contains(appState.turn+'-token')){
            moveToken(element);
            appState.num = 0;
        }else if(element.target.parentNode && element.target.parentNode.classList.contains(appState.turn+'-token')){
           
            moveToken(element.target.parentNode);
            appState.num = 0;
        }
    })

    selId('right').addEventListener("click", showRandomNum);

    window.appState = appState;

})();