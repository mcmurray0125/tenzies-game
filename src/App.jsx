import Die from "./components/Die"
import React, { useEffect } from "react";
import { useState } from "react"
import { nanoid } from "nanoid"
import Confetti from "react-confetti";


export default function App() {
    
    const allNewDice = () => {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            let randNum =  Math.floor(Math.random() * 6) + 1;
            newDice.push({value: randNum, isHeld: false, id: nanoid()})
        }
        return newDice
    }
    
    const [dice, setDice] = React.useState(allNewDice);
    const [count, setCount] = React.useState(1);
    const [tenzies, setTenzies] = React.useState(false);
    const [record, setRecord] = React.useState(() => JSON.parse(localStorage.getItem("record")) || "")

    
    function checkRecord() {
        if (record === "") {
            setRecord(count);
        } else if (typeof record === "number") {
            if (count < record) {
                setRecord(count);
            }
        }
    }
    
    useEffect(() => {
        //update record when tenzie is won
        localStorage.setItem("record", JSON.stringify(record));
      }, [tenzies,record]);

    useEffect(() => {
        let winner = dice.every(die => die.isHeld && die.value === dice[0].value);
        if (winner) {
            setTenzies(true)
            checkRecord();
        }
    })
    
    function rollDice() {
        //the function of the button changes
        //depending on if tenzies has been won or not
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld? 
                die :
                {...die, value: Math.floor(Math.random() * 6) + 1, id: nanoid()} 
            }) )
            setCount(oldCount => oldCount + 1)
        }
        if (tenzies) {
            setDice(allNewDice);
            setTenzies(false);
            setCount(1)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die value={die.value} key={die.id} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
        ))
        
    return (
        <main>
            {tenzies && <Confetti />}
            <h3 className="record">Current Record: {record}</h3>
            <div className="game-text">
                <h1>Tenzies</h1>
                <p className="info">Roll until all dice are the same. Click each die to freeze it at its current number between rolls.</p>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <button id="game-button" className="roll-dice" onClick={rollDice}>{tenzies ? 'New Game' : 'Roll Dice'}</button>
            <div className="counter">Rolls: {count}</div>
        </main>
    )
}

