import { createContext } from "react";
import { TAlertValue } from "./types";


export const DefaultContext = createContext<TAlertValue | null>(null);