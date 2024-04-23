export default function createKeyBoardListener(document) {
    const state = {
        observers: [],
       
    }

    function registerPlayerId(playerId){    
            state.playerId = playerId;
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function unsubscribeAll(observerFunction) {
        state.observers = []
    }

    function notifyAll(command) {        
        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', handlekeydown)

    function handlekeydown(event) {
        const keyPressed = event.key

        const command = {
            type:'move-player',
            playerId: state.playerId,            
            keyPressed
        }

        notifyAll(command)
    }
    return {
        subscribe,
        unsubscribeAll,
        registerPlayerId
    }
}