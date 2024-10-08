import { createContext, ReactNode, useState, useReducer } from "react";

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined;
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    creatNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}

interface CyclesState {
    cycles: Cycle[]
    activeCycleId: string | null

}

export function CyclesContextProvider({
    children, 
}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (state: CyclesState, action: any) => {
            switch(action.type){
                case 'ADD_NEW_CYCLE':
                    return {
                        ...state, 
                        cycles: [...state.cycles, action.payload.newCycle],
                        activeCycleId: action.payload.newCycle.id
                    }
                case 'INTERROMPER_CICLO':
                    return {
                        ...state,
                        cycles: state.cycles.map((cycle) => {
                            if (cycle.id === state.activeCycleId) {
                                return {...cycle, interruptedDate: new Date() }
                            } else {
                                return cycle
                            }
                        }),
                        activeCycleId: null,
                    }
                case 'FINALIZAR_CICLO':
                    return {
                        ...state,
                        cycles: state.cycles.map((cycle) => {
                            if (cycle.id === state.activeCycleId) {
                                return {...cycle, finishedDate: new Date() }
                            } else {
                                return cycle
                            }
                        }),
                        activeCycleId: null,
                    }
                default:
                    return state
            }
        }, 
        {
            cycles: [],
            activeCycleId: null
        },
    )

    const [amountSecondsPassed, setAmountSecondPassed] = useState(0)

    const {cycles, activeCycleId } = cyclesState
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        dispatch({
            type: 'FINALIZAR_CICLO',
            payload: {
                activeCycleId,
            },
        })
    }

    function creatNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id, 
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            },
        })
        setAmountSecondPassed(0)

    }

    // função para pausar o ciclo
    function interruptCurrentCycle() {
        dispatch({
            type: 'INTERROMPER_CICLO',
            payload: {
                data: activeCycleId,
            },
        })
    }

    return (
        <CyclesContext.Provider
            value={{ 
                cycles,
                activeCycle, 
                activeCycleId, 
                markCurrentCycleAsFinished, 
                amountSecondsPassed, 
                setSecondsPassed,
                creatNewCycle,
                interruptCurrentCycle,
            }}
        >
            { children }
        </CyclesContext.Provider>
    )
}