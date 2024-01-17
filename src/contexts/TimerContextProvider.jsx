import { createContext,  useEffect, useState } from "react";
import { useTimer }  from '@mzaleski/use-timer';


export const TimerContext = createContext({});


export default function TimerContextProvider({ children }) {
    
    const timerSetting = {
        "work-mode" :0.1,
        "short-break": 10,
        "long-break" : 20
    }
    const [timerMode, setTimerMode] = useState("work-mode");
    //BUG: TIMER SESSION RESETS ONCE WE RELOD THE PAGE
    const [timerSession, setTimerSession] = useState(0);
    const [timerCompleted, setTimerCompleted] = useState(false);
    const [initialTimer, setInitialTimer] = useState(timerSetting["work-mode"]);

    useEffect(() => {
        setInitialTimer(timerSetting[timerMode])
        console.log(timerSession);
    },[timerMode,timerSession])

    const { secondsRemaining, setFreeze, resetTimer, isFrozen } =
    useTimer(initialTimer*60, true,
        () => {
            setTimerCompleted(true);
            if (timerMode === "work-mode") {
                setTimerSession(timerSession + 1);
            }
        }
    );

    let timeObj = new Date(secondsRemaining * 1000);
    var minutes = timeObj.getUTCMinutes()
    var seconds = timeObj.getSeconds();

    const handleTimerState = () => {
        if (timerCompleted == false) {
            isFrozen ? setFreeze(false) : setFreeze(true);
        }
        else if (timerCompleted == true) {
            resetTimer(true);
            setTimerCompleted(false);
        }
        
    }

   const stateObjects = {minutes,seconds,handleTimerState,resetTimer,isFrozen,setTimerMode,initialTimer,secondsRemaining,timerCompleted,setTimerCompleted,timerSession}
    return (
        <TimerContext.Provider value={stateObjects}>
            {children}
        </TimerContext.Provider>
    )
}
