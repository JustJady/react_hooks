import { useContext, useMemo } from "react";
import { DefaultContext } from "./DefaulContext"
import { TAlertValue } from "./types";


export const useAlert = () => {
    const alertContext = useContext(DefaultContext);
    const alert = useMemo(() => {
        return alertContext!;
    }, [alertContext]);
    return alert;
}