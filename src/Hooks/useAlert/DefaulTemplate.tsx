import React, { CSSProperties, FC } from 'react'
import { TAlert } from './types'

import ui from './alertStyle.module.css';

const DefaulTemplate: FC<TAlert> = ({
    id,
    text,
    position,
    timeout,
    type,
    close
}) => {

    return (
        <div style={position ? position as CSSProperties : {}}>
            <div className={`${ui['alert']} ${ui[`alert-${type}`]}`} >
                {text}
            </div>
        </div>
    )
}

export default DefaulTemplate