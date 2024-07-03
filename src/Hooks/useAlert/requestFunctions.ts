import { IRequestArguments, TAlert, TOptions } from "./types";


const defaultRequestInit: RequestInit = {
    credentials: "include",
    mode: 'cors',
    cache: 'default',
    referrerPolicy: 'strict-origin-when-cross-origin',
    headers: {
        'Content-Type': 'application/json',
    }
}

export const requestPost = async ({ url, requestInitData }: IRequestArguments) => {
    try {
        return await fetch(`${url}`, {
            method: 'POST',
            ...defaultRequestInit,
            ...requestInitData
        }).then(response => {
            return response.json();
        });
    } catch (error: any) {

    }
}

export const requestGet = async ({ url, requestInitData }: IRequestArguments) => {
    try {
        return await fetch(`${url}`, {
            method: 'GET',
            ...defaultRequestInit,
            ...requestInitData
        }).then(response => {
            return response.json();
        });
    } catch (error: any) {
        return error;
    }
}

export const request = async ({ url, requestInitData }: IRequestArguments) => {
    try {
        return await fetch(`${url}`, requestInitData).then((response) => {
                return response.json();
        });
    } catch (error: any) {
        return error;
    }
}