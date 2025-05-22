import {
  guessWord,
  hangmanState,
  restartButton,
  clicks,
  hangmanAscii,
} from './elements.js';
import { stages } from './state.js';

let word = [];
let guess = [];
let lives;
let newWord;

clicks.addEventListener('click', (e) => {
  if (e.target.matches('button[data-letter]')) {
    if (lives > 0) {
      const letter = e.target.dataset.letter;
      e.target.disabled = true;
      guess.push(letter);
      if (!newWord.includes(letter)) {
        lives--;
        hangmanState.textContent = `You now have ${lives} lives`;
        hangmanAscii.textContent = stages[lives];
      }
      updateWord();
    }
  }
});

restartButton.addEventListener('click', init);

async function fetchWord() {
  const data = await fetch('https://random-word-api.herokuapp.com/word');
  const word = await data.json();
  return word[0];
}

function updateWord() {
  word = [];
  for (const letter of newWord) {
    if (guess.includes(letter.toLowerCase())) {
      word.push(letter);
    } else {
      word.push('_');
    }
  }

  if (!word.includes('_')) {
    hangmanState.textContent = `You win! The word was ${newWord}`;
  } else if (lives <= 0) {
    hangmanState.textContent = `You lost! The word was ${newWord}`;
  }
  guessWord.textContent = word.toString().split(',').join('');
}

async function init() {
  word = [];
  guess = [];
  lives = 6;
  newWord = await fetchWord();
  const buttons = clicks.querySelectorAll('button[data-letter]');
  buttons.forEach((button) => {
    button.disabled = false;
  });
  hangmanState.textContent = `You now have ${lives} lives`;
  hangmanAscii.textContent = stages[lives];
  updateWord();
}

init();
