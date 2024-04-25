export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 20,
      height: 20,
    },
  };

  const observers = [];

  function start() {
    const frequenciy = 4000;
    setInterval(addFruit, frequenciy);
  }

  function subscribe(observerFunction) {
    observers.push(observerFunction);
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command);
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX = "playerX" in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
    const playerY =  "playerY" in command ? command.playerY : Math.floor(Math.random() * state.screen.height);   
    const score = 0;
    const tamanho = [{x:playerX, y:playerY}];    

    state.players[playerId] = {
      playerId: playerId,
     x: playerX,
      y: playerY,    
      score,
      tamanho,
    };
    
    notifyAll({
      type: "add-player",
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,     
      score,
      tamanho
    });
  }

  function removePlayer(command) {
    const playerId = command.playerId;
    delete state.players[playerId];
    notifyAll({
      type: "remove-player",
      playerId: playerId,
    });
  }

  function addFruit(command) {
    const fruitId = command ? command.fruitId : Math.floor(Math.random() * 100000000);
    const fruitX = command  ? command.fruitX : Math.floor(Math.random() * state.screen.width);
    const fruitY = command  ? command.fruitY : Math.floor(Math.random() * state.screen.height);

    Object.entries(state.fruits).forEach(([key, value]) => {       
        if (value.x === fruitX && value.y === fruitY) {    
        delete state.fruits[key];
      }
    });

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };

    notifyAll({
      type: "add-fruit",
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY,
    });
  }

  function removeFruit(command) {      
    const fruitId = command.fruitId;
    delete state.fruits[fruitId];

    notifyAll({
      type: "remove-fruit",
      fruit: fruitId,
    });
  }

  function moverPlayer(command) {
    notifyAll(command);
    const acceptedMoves = {
      ArrowUp(player) {      
        if (player.tamanho[0].y - 1 >= 0) {
          player.tamanho[0].y = player.tamanho[0].y - 1;
       
        }
      },
      ArrowRight(player) {
        if (player.tamanho[0].x + 1 < state.screen.width) {
          player.tamanho[0].x = player.tamanho[0].x + 1;
        
        }
      },
      ArrowDown(player) {
        if (player.tamanho[0].y + 1 < state.screen.height) {
          player.tamanho[0].y = player.tamanho[0].y + 1;
       
        }
      },
      ArrowLeft(player) {
        if (player.tamanho[0].x - 1 >= 0) {
          player.tamanho[0].x = player.tamanho[0].x - 1;
         
        }
      },
    };
    const keyPressed = command.keyPressed;
    const playerId = command.playerId;
    const player = state.players[command.playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (player && moveFunction) {
      moveFunction(player);
      checkFroPlayer(player)
      checkForfruitCollision(playerId);
      move(player)
      
    }
  }

  function move(player) {
    for (let i = player.tamanho.length - 1; i > 0; i--) {
      player.tamanho[i].x = player.tamanho[i - 1].x
      player.tamanho[i].y = player.tamanho[i - 1].y

    }
  }

  function checkFroPlayer(player) {

    for (const x in state.players) {
      const playerId = state.players[x]
      console.log('playerId  ' + playerId.playerId)
      if (player.playerId != playerId.playerId) {
        if (player.tamanho[0].x === playerId.tamanho[0].x && player.tamanho[0].y === playerId.tamanho[0].y) {
          player.score += playerId.score;  

          for (let k = 1; k < playerId.tamanho.length ; k++) {            
              player.tamanho.push(playerId.tamanho[k]);             
                                 
          }
          playerId.tamanho.splice(1, playerId.tamanho.length);         
          playerId.score = 0     
          
   
        }
      }
    }
  } 

  function checkForfruitCollision(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
     // console.log(`Checking ${playerId} score ${player.score}and ${fruitId}`);
      if (player.tamanho[0].x === fruit.x && player.tamanho[0].y === fruit.y) {
      //  console.log(`COLLISION between ${playerId} and ${fruitId}`);
        removeFruit({ fruitId: fruitId });
        player.score += 1;
        player.tamanho.push({
          x: player.tamanho[0].x,
          y: player.tamanho[0].y
        });      

      }
    }
  }
  return {
    moverPlayer,
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    state,
    setState,
    subscribe,
    start,
    
  };
}
