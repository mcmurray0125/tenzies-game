import React from "react"

export default function Die(props) {

    return (
        <img className={`${props.isHeld ? 'die-face-green' : 'die-face'}`}
        src={`assets/${props.value}.svg`} onClick={props.holdDice}>
        </img>
    )
}
