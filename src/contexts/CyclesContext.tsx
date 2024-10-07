import { createContext, ReactNode, useState } from "react";

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

export function CyclesContextProvider({
     children, 
    }: CyclesContextProviderProps) {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondPassed] = useState(0)

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondPassed(seconds)
    }

    function markCurrentCycleAsFinished() {
        setCycles((state) => 
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return {...cycle, finishedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )
    }

    function creatNewCycle(data: CreateCycleData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id, 
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondPassed(0)

    }

    // função para pausar o ciclo
    function interruptCurrentCycle() {
        setCycles((state) => 
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return {...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            }),
        )
        setActiveCycleId(null)
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