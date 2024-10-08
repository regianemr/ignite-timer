import { Cycle } from "./reducer"

export enum ActionTypes {
    ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
    INTERROMPER_CICLO = 'INTERROMPER_CICLO',
    FINALIZAR_CICLO = 'FINALIZAR_CICLO',
}

export function addNewCycleAction(newCycle: Cycle) {
    return {
        type: ActionTypes.ADD_NEW_CYCLE,
        payload: {
            newCycle,
        },
    }
}

export function markCurrentCycleASFinishedAction() {
    return {
        type: ActionTypes.FINALIZAR_CICLO,
    }
}

export function interruptCurrentCycleAction() {
    return {
        type: ActionTypes.INTERROMPER_CICLO,
    }
}