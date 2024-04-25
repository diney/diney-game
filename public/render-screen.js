
export function setupScreen(canvas, game) {
    const { screen: {width, height} } = game.state
    canvas.width = width
    canvas.height = height
}
export default function renderScreen(screen,scoreTable,game,requestAnimationFrame,currentPlayerId) {

    const context = screen.getContext('2d');
    context.fillStyle = 'white'
    context.clearRect(0, 0, 20, 20)
   
    for (const playerId in game.state.players) {        
        const player = game.state.players[playerId]

        for (let j = 0; j < player.tamanho.length; j++) {
            //corpo da cobra do outro jogador
            //maron        
            context.fillStyle = '#996600';
            context.globalAlpha = 0.50;
            context.fillRect(player.tamanho[j].x, player.tamanho[j].y, 1, 1);    
        }

        if (playerId === currentPlayerId) {
          for (let j = 0; j < player.tamanho.length; j++) {
            //cabeça da cobra do jogador
            //Blue
            context.fillStyle = '#0000ff';
            context.globalAlpha = 0.90;
            context.fillRect(player.tamanho[j].x, player.tamanho[j].y, 1, 1);
          }
          context.fillStyle = '#999966';
           context.globalAlpha = 0.90;
            context.fillRect(player.tamanho[0].x, player.tamanho[0].y, 1, 1);
        } 
        if (playerId !== currentPlayerId) {
            //cabeça da cobra do outro jogador
            //Aqua
          context.fillStyle = "#00ffff";
          context.globalAlpha = 1;
          context.fillRect(player.tamanho[0].x, player.tamanho[0].y, 1, 1);
        }       
      }     
    
    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }    

    updateScoreTable(scoreTable, game, currentPlayerId)

    requestAnimationFrame(()=>{
        renderScreen(screen,scoreTable,game,requestAnimationFrame,currentPlayerId)
    })

    function updateScoreTable(scoreTable, game, currentPlayerId) {
        const maxResults = 10
    
        let scoreTableInnerHTML = `
            <tr class="header">
                <td>Top 10 Jogadores</td>
                <td>Pontos</td>
            </tr>
        `
    
        const playersArray = []
    
        for (let socketId in game.state.players) {
            const player = game.state.players[socketId]
            playersArray.push({
                playerId: socketId,
                x: player.x,
                y: player.y,
                tamanho:player.tamanho,
                score: player.score,
            })
        }
        
        const playersSortedByScore = playersArray.sort( (first, second) => {
            if (first.score < second.score) {
                return 1
            }
    
            if (first.score > second.score) {
                return -1
            }
    
            return 0
        })
    
        const topScorePlayers = playersSortedByScore.slice(0, maxResults)
    
        scoreTableInnerHTML = topScorePlayers.reduce((stringFormed, player) => {
            return stringFormed + `
                <tr ${player.playerId === currentPlayerId ? 'class="current-player"' : ''}>
                    <td>${player.playerId}</td>
                    <td>${player.score}</td>
                </tr>
            `
        }, scoreTableInnerHTML)
    
        const currentPlayerFromTopScore = topScorePlayers[currentPlayerId]
    
        if (currentPlayerFromTopScore) {
            scoreTableInnerHTML += `
                <tr class="current-player bottom">
                    <td >${currentPlayerFromTopScore.id} EU </td>
                    <td >${currentPlayerFromTopScore.score}</td>
                </tr>
            `
        }
    
        scoreTable.innerHTML = scoreTableInnerHTML
    }
}