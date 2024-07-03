import React, { Fragment, useEffect, useRef, useState } from 'react'
import { DefaultContext } from './DefaulContext'
import { request, requestGet, requestPost } from './requestFunctions';
import { ICreateAlert, IProviderProps, TAlert, TAlertValue } from './types';
import { createPortal } from 'react-dom';
import DefaulTemplate from './DefaulTemplate';
import { positions } from './options';

export const Provider = ({
    Context = DefaultContext,
    Template = DefaulTemplate,
    children,
    timeout = 3000,
    position = 'bottom right',
}: IProviderProps) => {

    const alertValue = useRef<TAlertValue | null>(null);
    const root = useRef<HTMLDivElement | null>(null);

    const [alerts, setAlerts] = useState<TAlert[]>([]);

    const requests = {
        'GET': requestGet,
        'POST': requestPost,
        'CUSTOM': request,
    }

    useEffect(() => {
        root.current = document.createElement('div');
        root.current.id = 'alert';

        document.body.appendChild(root.current);

        return () => {
            if (root.current) {
                document.body.removeChild(root.current);
            }
        }
    }, [])

    const createAlert = ({ text, options, requestOptions }: ICreateAlert) => {
        const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, '0');

        if (!text) {
            text = 'Во время обработки запроса возникла непредвиденная ошибка!';
        }

        const alertOptions = {
            id,
            text,
            close: () => removeAlert(id),
            ...options,
            position: options?.position ? positions[options?.position!] : positions[position]
        };

        const addAlert = (error: string) => {
            setAlerts((prev) => {
                prev.push({
                    ...alertOptions,
                    text: error,
                    type: 'error'
                })
                return [...prev];
            })
        }

        if (requestOptions?.requestUrl) {
            if (requestOptions.typeRequest === 'GET') {
                requests.GET({ url: requestOptions.requestUrl, requestInitData: requestOptions.requestInitInfo }).then((responseData) => {
                    if(responseData.body.success) {
                        requestOptions.getRequestData?.(responseData);                        
                    } else {
                        addAlert(responseData.message);
                    }
                })
            } else if (requestOptions.typeRequest === 'POST') {
                requests.POST({ url: requestOptions.requestUrl, requestInitData: requestOptions.requestInitInfo }).then((responseData) => {
                    if(responseData.body.success) {
                        requestOptions.getRequestData?.(responseData);                        
                    } else {
                        addAlert(responseData.message);
                    }
                });
            } else if (requestOptions.typeRequest === 'CUSTOM') {
                requests.CUSTOM({ url: requestOptions.requestUrl, requestInitData: requestOptions.requestInitInfo }).then((responseData) => {
                    if(responseData.body.success) {
                        requestOptions.getRequestData?.(responseData);                        
                    } else {
                        addAlert(responseData.message);
                    }
                })
            }
        } else {

            setAlerts((prev) => {
                prev.push(alertOptions);
                return [...prev];
            })

        }

        const createTimeout = (timeoutTime: number) => {
            const timeout = setTimeout(() => {
                removeAlert(id);
                clearTimeout(timeout);
            }, timeoutTime)
        }

        if (options?.timeout) {
            createTimeout(options.timeout)
        } else {
            createTimeout(timeout)
        }

    }

    const removeAlert = (id: string) => {
        setAlerts((prev) => {
            const index = prev.findIndex((element) => element.id === id);
            if (index !== -1) {
                prev.splice(index, 1);
            }
            return [...prev];
        })
    }

    const removeAllAlerts = () => {
        setAlerts([]);
    }

    alertValue.current = {
        createAlert,
        removeAllAlerts,
        alerts,
    }

    return (
        <Context.Provider value={alertValue.current}>
            {children}
            {root.current &&
                <Fragment>
                    {alerts.map((userAlert, ins) => {
                        return (
                            <Fragment key={`alert=${userAlert.id}=${ins}`}>
                                {createPortal(
                                    <Template {...userAlert} />,
                                    root.current!
                                )}
                            </Fragment>
                        )
                    })}
                </Fragment>
            }
        </Context.Provider>
    )
}