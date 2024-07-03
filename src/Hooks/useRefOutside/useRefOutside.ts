import React, { useEffect, useRef } from "react";

export const useRefOutside = <T>(callback: (event?: MouseEvent) => void, typeEvent?: keyof GlobalEventHandlersEventMap) => {
    const ref = useRef<T>(null);  
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if(ref.current instanceof Element) {
                if (ref.current && !ref.current.contains(event.target as Node)) callback(event);
            } 
        }  
        document.addEventListener(typeEvent ? typeEvent : 'mousedown', handleClickOutside);  
        return () => {
            document.removeEventListener(typeEvent ? typeEvent : 'mousedown', handleClickOutside);
        }
    }, [callback]);  
    return ref;
};