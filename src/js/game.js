import { WORDS, KEYBOARD_LETTER } from './consts.js';

const gameDiv = document.getElementById('game');
const logoH1 = document.getElementById('logo');

let triesLeft;
let winCount;

const cratePlaceholdersHtml = () => {
	const word = sessionStorage.getItem('word');
	const wordArray = Array.from(word);
	const placegoldersHtml = wordArray.reduce(
		(acc, curr, i) => acc + `<h1 id=letter${i} class=letter>_</h1>`,
		''
	);
	return `<div id=placeholders class=placeholders-wrapper>${placegoldersHtml}</div>`;
};

const creatKeyboard = () => {
	const keyboard = document.createElement('div');
	keyboard.classList.add('keyboard');
	keyboard.id = 'keyboard';

	const keyboardButton = KEYBOARD_LETTER.reduce((acc, curr) => {
		return (
			acc +
			`<button id='${curr}' class='button-primary keyboard-button'>${curr}</button>`
		);
	}, '');

	keyboard.innerHTML = keyboardButton;
	return keyboard;
};

const creatHangmanImg = () => {
	const hangmanImg = document.createElement('img');
	hangmanImg.classList.add('hangman-img');
	hangmanImg.id = 'hangman-img';
	hangmanImg.alt = 'hangman image';
	hangmanImg.src = 'images/hg-0.png';

	return hangmanImg;
};

const checkLetter = letter => {
	const word = sessionStorage.getItem('word');
	const inputLetter = letter.toLowerCase();
	//буквы нет
	if (!word.includes(inputLetter)) {
		const triesCounter = document.getElementById('tries-left');
		triesLeft -= 1;
		triesCounter.innerText = triesLeft;

		const hangmanImgGame = document.getElementById('hangman-img');
		hangmanImgGame.src = `images/hg-${10 - triesLeft}.png`;

		if (triesLeft === 0) {
			stopGame('lose');
		}
	} else {
		//буква есть
		const wordArray = Array.from(word);
		wordArray.forEach((currentLetter, i) => {
			if (currentLetter === inputLetter) {
				winCount += 1;
				if (winCount === word.length) {
					stopGame('win');
					return;
				}
				document.getElementById(`letter${i}`).innerText =
					inputLetter.toUpperCase();
			}
		});
	}
};

const stopGame = status => {
	document.getElementById('placeholders').remove();
	document.getElementById('tries').remove();
	document.getElementById('keyboard').remove();
	document.getElementById('quit').remove();

	const word = sessionStorage.getItem('word');

	if (status === 'win') {
		//сценарий выигрыша
		document.getElementById('hangman-img').src = 'images/hg-win.png';
		document.getElementById(
			'game'
		).innerHTML += `<p class="result">The word was: <span class="result-word">${word}</span></p><h2 class="result-header win">You won :)</h2>`;
	} else if (status === 'lose') {
		//сценарий проигрыша
		document.getElementById('game').innerHTML +=
			'<h2 class="result-header lose">You lost :(</h2>';
	} else if (status === 'quit') {
		logoH1.classList.remove('logo-sm');
		document.getElementById('hangman-img').remove();
	}

	document.getElementById('game').innerHTML +=
		'<button class="button-primary px-5 py-2 mt-3" id="play-again">Play Again</button>';
	document.getElementById('play-again').onclick = startGame;
};

export const startGame = () => {
	triesLeft = 10;
	winCount = 0;

	logoH1.classList.add('logo-sm');

	const randomIndex = Math.floor(Math.random() * WORDS.length);
	const wordToGuess = WORDS[randomIndex];
	sessionStorage.setItem('word', wordToGuess);

	gameDiv.innerHTML = cratePlaceholdersHtml();
	gameDiv.innerHTML += `<p id='tries' class='mt-2 '>TRIES LEFT:<span id='tries-left' class='ml-1 text-red-600 font-medium'>10</span></p>`;

	const keyboardDiv = creatKeyboard();
	keyboardDiv.addEventListener('click', event => {
		if (event.target.tagName.toLowerCase() === 'button') {
			event.target.disabled = true;
			checkLetter(event.target.id);
		}
	});

	const hangmanImgHtml = creatHangmanImg();
	gameDiv.prepend(hangmanImgHtml);

	gameDiv.appendChild(keyboardDiv);

	gameDiv.insertAdjacentHTML(
		'beforeend',
		`<button id="quit" class="button-secondary px-2 py-1 mt 4">Quit</button>`
	);
	document.getElementById('quit').onclick = () => {
		const isCure = confirm('Are you sure you want to quit and lose progress?');
		if (isCure) {
			stopGame('quit');
		}
	};
};
