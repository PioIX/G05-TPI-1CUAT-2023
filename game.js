//import { WORDS } from "js/words.js"; 
const WORDS = []
/*
    'ANIMAL',
    'OCEANO',
    'CLIMAS',
    'MUERTE',
    'FUTURO',
    'ACIDOS',
    'BASURA',
]
*/
let rightGuessString= ""
async function traerPalabras() {
    try {
        const response = await fetch("/traerPalabras", {
          method: "GET", // or 'POST'
          headers: {
            "Content-Type": "application/json",
          },
        });
        //En result obtengo la respuesta
        const result = await response.json();
        for (let i = 0; i < result.palabras.length; i++) {
            WORDS.push(result.palabras[i].palabra.toUpperCase())
            
        }
        console.log(WORDS)
        rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
        console.log(rightGuessString)
        } 
    catch (error) {
    console.error("Error:", error);
      }
        
}

async function enviarPuntaje(data) {
    try {
        const response = await fetch("/traerpuntaje", {
          method: "PUT", // or 'POST'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        } 
    catch (error) {
    console.error("Error:", error);
      }
        
}
function enviarPuntos(){
    let data = {
        puntos_actuales: puntos_actuales
    }
    if (puntos_actuales>0){
        console.log(data)
        enviarPuntaje(data)
    }
  }


traerPalabras()

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;



function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 6; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}


function insertLetter (pressedKey) {
    if (nextLetter === 6) {
        return
    }
    pressedKey = pressedKey.toUpperCase()
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    box.value = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function marcarCuadrado(){
    if (nextLetter === 6) {
        return
    }
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function shadeKeyBoard(letter, color, letracolor) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            elem.style.color = letracolor
            break
        }
    }
}
function marcarCuadrado2(){
    if (nextLetter === 6) {
        return
    }
    let row = document.getElementsByClassName("keyboard-button")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

let puntos_actuales = 6

function checkGuess () {
    
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)
    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 6) {
        return
    }

    if (!WORDS.includes(guessString)) {
        swal("Palabra no encontrada")
        return
    }

    for (let i = 0; i < 6; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letra = ''
        let letter = currentGuess[i]
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'transparent'
            letra='#475569'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                letterColor = '#16a34a'
            } else {
                // shade box yellow
                letterColor = '#b45309'
            }

            rightGuess[letterPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //shade box
            box.style.backgroundColor = letterColor
            box.style.color = letra
            shadeKeyBoard(letter, letterColor, letra)
        }, delay)
    }

    if (guessString === rightGuessString) {
        guessesRemaining = 0
        swal({
            title: "Felicitaciones! Ganaste!",
            text: `su puntuacion es de: "${puntos_actuales}"`,
            icon: "success",
            button: "Ok!",
          });
          enviarPuntos()
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;
        puntos_actuales -= 1

        if (guessesRemaining === 0) {
            swal({
                title: "Perdiste!",
                text: `La palabra correcta era: "${rightGuessString}"
                       Su puntuacion final es de: "${puntos_actuales}" `,
                icon: "warning",
                button: "Ohhh!",
              });
            
        }
    }
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.value = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

function pulsarTecla(tecla) {
    
        
        let key = tecla.textContent
    
        if (key === "Del") {
            key = "Backspace"
        } 
    
        document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))

}

//document.getElementById("keyboard-cont").addEventListener("click", (e) => {

async function fetchLogin(data){
    try {
      const response = await fetch("/login", {
        method: "PUT", // or 'POST'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      //En result obtengo la respuesta
      const result = await response.json();
      console.log("Success:", result)
      
        if (result.validar == false) {
          swal({
            title: "Datos incorrectos",
            icon: "warning",
            button: "Ok!",
          });
        } 
        else if (result.validar == true) {
          if(result.admin == true){
            location.href ='/admin';
          }
          else {
            location.href ='/home';
        }}
  
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  //Esta funcion la llama el boton Ingresar que tiene que ser type button para ejecutar el onclick
  function login() {
    //Leo los datos del input
    let usuario = document.getElementById("usuarioId").value
    let contraseña = document.getElementById("passwordId").value
  
    //Creo un objeto de forma instantanea
    let data = {
        usuario: usuario,
        contraseña: contraseña
    }
  
    //data es el objeto que le paso al back
    if(data.usuario != "" && data.contraseña != ""){
      fetchLogin(data)
      
    }
    else{
      swal({
        title: "No ingreso ningun dato",
        button: "Ok!",
      });
    }
  }
  
  
  async function fetchPalabra(data){
    try {
      const response = await fetch("/admin1", {
        method: "PUT", // or 'POST'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      //En result obtengo la respuesta
      const result = await response.json();
      console.log("Success:", result)
      
        if (result.validar == false) {
          swal({
            title: "La palabra ya existe",
            icon: "warning",
            button: "Ok!",
          });
        } 
        if (result.validar == true) {
          if (result.palabrarda == true){
            swal({
              title: "La palabra se ingreso correctamente",
              icon: "success",
              button: "Ok!",
            });
          }
          else {
  
          
            swal({
              title: "La palabra debe tener 6 letras",
              icon: "warning",
              button: "Ok!",
            });
        }
    }} catch (error) {
      console.error("Error:", error);
    }
  }
  
  //Esta funcion la llama el boton Ingresar que tiene que ser type button para ejecutar el onclick
  function agregarPalabra() {
    //Leo los datos del input
    let palabra = document.getElementById("palabra").value
  
    //Creo un objeto de forma instantanea
    let data = {
        palabra: palabra
    }
    //data es el objeto que le paso al back
    if(data.palabra != "" ){
      fetchPalabra(data)
      console.log(data)
  
    }
    else{
      alert("No se ha ingresado nada")
    }
  }
  
  
  async function fetchPalabraEliminar(data){
    try {
      const response = await fetch("/admin2", {
        method: "PUT", // or 'POST'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      //En result obtengo la respuesta
      const result = await response.json();
      console.log("Success:", result)
      
        if (result.validar == false) {
          swal({
            title: "La palabra no existe",
            icon: "warning",
            button: "Ok!",
          });
        } 
        if (result.validar == true) {
          swal({
            title: "La palabra se elimino correctamente",
            icon: "success",
            button: "Ok!",
          });
            }
  } catch (error) {
      console.error("Error:", error);
    }
  }
  
  //Esta funcion la llama el boton Ingresar que tiene que ser type button para ejecutar el onclick
  function eliminarPalabra() {
    //Leo los datos del input
    let palabras = document.getElementById("palabraid").value
  
    //Creo un objeto de forma instantanea
    let data = {
        palabras: palabras
    }
    //data es el objeto que le paso al back
    if(data.palabras != "" ){
      fetchPalabraEliminar(data)
      console.log(data)
    }
    else{
      alert("No se ha ingresado nada")
    }
  }
  
  function irAPuntos(){
    location.href ='/puntuacion';
  }
  function enviarFormIrAJuego() {
    location.href ='/home';
  }
