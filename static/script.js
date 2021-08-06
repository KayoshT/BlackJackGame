let blackjackdict = {
  player: { roundScore: "#player-result", div: "#player-box", score: 0 },
  dealer: { roundScore: "#dealer-result", div: "#dealer-box", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  type: ["C", "D", "S", "H"],
  cardValue: {"2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "10":10, "J":10, "Q":10, "K":10, "A":[1,11]},
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'isStand': false,
  'isTurnOver': false,
};
const PLAYER = blackjackdict["player"];
const DEALER = blackjackdict["dealer"];

document.querySelector("#hit").addEventListener("click", hit);
document.querySelector("#deal").addEventListener("click", deal);
document.querySelector("#stand").addEventListener("click", stand);

function hit() {
  if (blackjackdict['isStand'] === false) {
    let card = randomCard();
    let type = randomType();
    showCard(card, type, PLAYER);
    updateScore(card, PLAYER);
    showScore(PLAYER);
  }
}

function showCard(card, type, active) {
  if (active['score'] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `static/images/Cards/${card}${type}.png`;
    document.querySelector(active["div"]).appendChild(cardImage);
  }
}

function deal() {
  if(blackjackdict['isTurnOver'] === true) {
    let playerCards = document
    .querySelector("#player-box")
    .querySelectorAll("img");

  let dealerCards = document
    .querySelector("#dealer-box")
    .querySelectorAll("img");
  for (i = 0; i < playerCards.length; i++) {
    playerCards[i].remove();
  }
  for (i = 0; i < dealerCards.length; i++) {
    dealerCards[i].remove();
  }
  PLAYER['score'] = 0;
  DEALER['score'] = 0;

  document.querySelector(PLAYER['roundScore']).style.color = 'white';
  document.querySelector(DEALER['roundScore']).style.color = 'white';
  document.querySelector(PLAYER['roundScore']).textContent = 0;
  document.querySelector(DEALER['roundScore']).textContent = 0;
  
  document.querySelector('#result').textContent = 'Lets Play';
  document.querySelector('#result').style.color = 'white';

  blackjackdict['isStand'] = false;
  blackjackdict['isTurnOver'] = true;
  }
  
}

function randomCard() {
  let random = Math.floor(Math.random() * 13);
  return blackjackdict["cards"][random];
}

function randomType() {
  let random = Math.floor(Math.random() * 4);
  return blackjackdict["type"][random];
}

function updateScore(card, active) {
  if ( card === 'A') {
    if (active['score'] + blackjackdict['cardValue'][card][1] <= 21) {
      active['score'] += blackjackdict['cardValue'][card][1];
      return;
    } else {
      active['score'] += blackjackdict['cardValue'][card][0];
      return;
    }
  }
  active['score'] += blackjackdict['cardValue'][card];
}

function showScore(active) {
  if (active['score'] > 21) {
    document.querySelector(active['roundScore']).textContent = 'BUST';
    document.querySelector(active['roundScore']).style.color = 'red';
    return;
  }
  document.querySelector(active['roundScore']).textContent = active['score'];
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function stand() {
  blackjackdict['isStand'] = true;

  while (DEALER['score'] < 16 && blackjackdict['isStand'] === true) {
    let card = randomCard();
    let type = randomType();
    showCard(card, type, DEALER);
    updateScore(card, DEALER); 
    showScore(DEALER);
    await sleep(500);
  }

  blackjackdict['isTurnOver'] = true;
  showResult(Winner());


}

function Winner() {
  let winner;

  if(PLAYER['score'] <= 21) {
    if (PLAYER['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
      winner = PLAYER;
      blackjackdict['wins']++;
      document.querySelector('#wins').textContent = blackjackdict['wins'];
    } else if (PLAYER['score'] < DEALER['score']) {
      winner = DEALER;
      blackjackdict['losses']++;
      document.querySelector('#losses').textContent = blackjackdict['losses'];

    } else if (PLAYER['score'] === DEALER['score']) {
      blackjackdict['draws']++;
      document.querySelector('#draws').textContent = blackjackdict['draws'];

    }
  } else if (PLAYER['score'] > 21 && DEALER['score'] <=21) {
    winner = DEALER
    blackjackdict['losses']++;
    document.querySelector('#losses').textContent = blackjackdict['losses'];

  } else if (PLAYER['score'] > 21 && DEALER['score'] > 21) {
    blackjackdict['draws']++;
    document.querySelector('#draws').textContent = blackjackdict['draws'];

  }
  return winner;
}

function showResult(winner) {
  if (blackjackdict['isTurnOver'] === true) {
    let message, messageColour;
    if (winner === PLAYER) {
      message = 'You won!';
      messageColour = 'white';
      
    } else if (winner === DEALER) {
      message = 'You Lost!';
      messageColour = 'dark red';
    } else {
      message = 'You drew!';
      messageColour = 'black';
    }
  
    document.querySelector('#result').textContent = message;
    document.querySelector('#result').style.color = messageColour;
  }

}