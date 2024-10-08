import { createContext, ReactNode, useState, useReducer } from "react";
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleASFinishedAction } from "../reducers/cycles/actions";

interface CreateCycleData {
    task: string
    minutesAmount: number
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



export function CyclesContextProvider({
    children, 
}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer(cyclesReducer, 
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
        dispatch(markCurrentCycleASFinishedAction())
    }

    function creatNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id, 
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))
        setAmountSecondPassed(0)
    }

    // função para pausar o ciclo
    function interruptCurrentCycle() {
        dispatch(interruptCurrentCycleAction())
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