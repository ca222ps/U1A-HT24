// Globala variabler
let optionsDialog; // Element för inställningsdialog
let rollElem; // Element för utskrift av antal omkast som återstår
let resElem; // Element för resultat
let stopBtn; // Knapp för att stanna
let playerName = "Du"; // Spelarens namn
let maxNrOfRolls = 3; // Valt max antal omkast av tärningar
let nrOfRolls = 0; // Antal omkast som återstår
let sum = 0; // Summan av kastade tärningar

// --------------------------------------------------
// ta fram referenser till element i gränssnittet och lägg till händelselyssnare.
function init() {
    console.log("init");
// Använder querySelector för att få referenser till HTML-element
optionsDialog = document.querySelector("#options");
rollElem = document.querySelector("#rollCounter");
resElem = document.querySelector("#result");
stopBtn = document.querySelector("#stopBtn");

// Lägg till eventlyssnare på knappar och tärningar
document.querySelector("#optionsBtn").addEventListener("click", showOptionsDialog);
document.querySelector("#optionsOkBtn").addEventListener("click", closeOptionsDialog);
document.querySelector("#newBtn").addEventListener("click", newGame);
stopBtn.addEventListener("click", endGame);

// Lägg till eventlyssnare för varje tärning (die1 - die5)
for (let i = 1; i <= 5; i++) {
    document.querySelector("#die" + i).addEventListener("click", throwOneDie);
}

// Gör stoppknappen inaktiv vid sidladdning
stopBtn.disabled = true;
}


// --------------------------------------------------
// Visar inställningsdialogen
function showOptionsDialog() {
    console.log("showOptionsDialog");
    optionsDialog.showModal(); //Visar dialogen
}

// --------------------------------------------------
// Döljer inställningsdialogen och sparar valen
function closeOptionsDialog() {
    console.log("closeOptionsDialog");
    optionsDialog.close(); //Stänger dialogrutan
    
    // Spara spelarens namn och max antal omkast
    playerName = document.querySelector("#player").value;
    maxNrOfRolls = parseInt(document.querySelector("#nrOfReroll").value);
}

// --------------------------------------------------
// Startar ett nytt spel
function newGame() {
    console.log("newGame");

    // Aktivera stoppknappen
    stopBtn.disabled = false;

    // Återställ spelets tillstånd
    nrOfRolls = maxNrOfRolls;
    rollElem.textContent = nrOfRolls;
    resElem.textContent = "Summa = 0";
    sum = 0;
 
    // Kasta alla tärningar initialt
    for (let i = 1; i <= 5; i++) {
        throwOneDie({ target: document.getElementById("die" + i) }, true);
    }

    // Uppdatera summavisningen efter initialt kast
    resElem.textContent = `Summa = ${sum}`;
}

// --------------------------------------------------
// Avslutar spelet och räknar poäng
function endGame() {
    console.log("endGame");

    // Inaktivera stoppknappen
    stopBtn.disabled = true;

    // Sätt återstående omkast till 0
    nrOfRolls = 0;
    rollElem.textContent = nrOfRolls;

    // Beräkna poäng
    let points = sum - 18;
    if (points < 0 || points > 3) points = 0;

    // Visa resultatet
    resElem.textContent = `${playerName}: Summan av tärningarna är ${sum}. Du fick ${points} poäng.`;
}

// --------------------------------------------------
// Kastar en enskild tärning
function throwOneDie(event, isNewGame = false) {
    console.log("throwOneDie");

    // Om inga omkast återstår, returnera omedelbart
    if (nrOfRolls <= 0 && !isNewGame) return;

    let die = event.target; // Referens till den tärning som klickades
    let result = Math.floor(Math.random() * 6) + 1; // Generera ett slumpmässigt resultat mellan 1 och 6

    // Uppdatera tärningsbilden baserat på resultatet
    die.src = "img/dice/" + result + ".png";

    // Uppdatera summan av tärningarna
    if (!isNewGame) {
        sum -= parseInt(die.getAttribute("data-value") || 0); //Ta bort gammalt värde
        sum += result; //Lägg till nytt värde
        die.setAttribute("data-value", result); //Uppdatera attribut för den tärningen

        // Minska antalet återstående omkast
        nrOfRolls--;
        rollElem.textContent = nrOfRolls;

        // Uppdatera summavisning
        resElem.textContent = `Summa = ${sum}`;

        // Kontrollera om inga omkast återstår
        if (nrOfRolls <= 0) {
            endGame();
        }

    } else {
        sum += result;
        die.setAttribute("data-value", result);
        
        // Uppdatera summavisningen
        resElem.textContent = `Summa = ${sum}`;
    }
}

window.addEventListener("load", init);
