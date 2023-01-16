import * as React from 'react';
import { Input } from './components';
import { spinWheel } from './utils/wheelSpinner/spinWheel';

let timerId = 0;
function wait(howLong: number) {
  return new Promise((resolve) => {
    timerId = window.setTimeout(resolve, howLong);
  });
}

const INITIAL_STARTING_MONEY = 1000;
const INITIAL_BET = 250;
const WHEEL_SPIN_DELAY = 250; // ms

enum GAME_STATE {
  NOT_PLAYING = 'NOT_PLAYING',

  PLAYING_IDLE = 'PLAYING_IDLE',
  PLAYING_SPINNING = 'PLAYING_SPINNING',
  PLAYING_GAME_OVER = 'PLAYING_GAME_OVER',
}

const GAME_TEXT: Record<GAME_STATE, string> = {
  [GAME_STATE.NOT_PLAYING]:
    'Enter some starting money and click "Start playing" to begin 😘',
  [GAME_STATE.PLAYING_IDLE]: `Click the "Spin wheel" button to spin the wheel 🎲 (don't forget to bet!)`,
  [GAME_STATE.PLAYING_SPINNING]: 'Spinning the wheel...Good luck! 🤑',
  [GAME_STATE.PLAYING_GAME_OVER]:
    'You have gambled away all your money 😭 (click "Reset" to play again)',
};

const INVALID_NUMBER_INPUT_REGEX = /[^\d]+/;

function validateNumberInput(input: string): string {
  if (!input) {
    return '';
  }

  if (Number.isNaN(Number(input))) {
    return 'Must be a positive integer';
  }

  if (INVALID_NUMBER_INPUT_REGEX.test(input)) {
    return 'Must be a positive integer';
  }

  return '';
}

function validateBetInput(input: string, balance: number): string {
  const numberError = validateNumberInput(input);

  if (numberError) {
    return numberError;
  }

  if (Number(input) > balance) {
    return 'Must not be higher than balance';
  }

  return '';
}

interface HistoryItem {
  timestamp: number;
  text: string;
}

const formatter = Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function formatDate(d: Date): string {
  return formatter.format(d);
}

export default function App() {
  const [gameState, setGameState] = React.useState<GAME_STATE>(
    GAME_STATE.NOT_PLAYING
  );
  const isPlaying = gameState !== GAME_STATE.NOT_PLAYING;
  const isSpinning = gameState === GAME_STATE.PLAYING_SPINNING;

  const [startingMoneyInput, setStartingMoneyInput] = React.useState(
    `${INITIAL_STARTING_MONEY}`
  );
  const startingMoneyInputError = validateNumberInput(startingMoneyInput);
  const startingMoney = startingMoneyInputError
    ? 0
    : Number(startingMoneyInput);

  const [balance, setBalance] = React.useState<number>(startingMoney);

  const [betInput, setBetInput] = React.useState(`${INITIAL_BET}`);
  const betInputError = isPlaying ? validateBetInput(betInput, balance) : '';
  const bet = betInputError ? 0 : Number(betInput);

  const [history, setHistory] = React.useState<HistoryItem[]>([]);

  const handleSpinWheel = async () => {
    setGameState(GAME_STATE.PLAYING_SPINNING);

    await wait(WHEEL_SPIN_DELAY);

    if (isPlaying) {
      const now = new Date();
      const outcome = spinWheel();

      const winning = bet * outcome.multiplier;
      const newBalance = balance - bet + winning;

      const indicator =
        newBalance > balance ? '🟩' : newBalance < balance ? '🟥' : '⬛';
      const gameOver = newBalance <= 0;
      const betOutcomeText = `${formatDate(
        now
      )}: ${indicator} You bet ${bet} and ${
        outcome.multiplier
      }x the bet to ${winning}! New balance = ${newBalance}. ${
        gameOver ? 'GAME OVER 😭!' : ''
      }`;

      setBalance(newBalance);
      setHistory((prevHistory) => [
        { timestamp: now.getTime(), text: betOutcomeText },
        ...prevHistory,
      ]);

      if (gameOver) {
        setGameState(GAME_STATE.PLAYING_GAME_OVER);
      } else {
        setGameState(GAME_STATE.PLAYING_IDLE);
      }
    }
  };

  const cleanUp = () => {
    window.clearTimeout(timerId);
    setStartingMoneyInput(`${INITIAL_STARTING_MONEY}`);
    setBetInput(`${INITIAL_BET}`);
    setBalance(0);
    setHistory([]);
  };

  return (
    <div className="flex flex-col gap-4 items-center max-w-lg w-full mx-auto">
      <h1 className="text-3xl">Spin the Wheel 🎡</h1>

      <p className="text-center">
        <b>GAME:</b> {GAME_TEXT[gameState]}
      </p>

      <hr className="border border-gray-300 w-full" />

      <Input
        label="Starting money"
        value={startingMoneyInput}
        setValue={(newValue) => setStartingMoneyInput(newValue)}
        disabled={isPlaying}
        placeholder="Enter a positive integer"
        error={startingMoneyInputError}
      />

      <Input
        label="How much to bet"
        value={betInput}
        setValue={(newValue) => setBetInput(newValue)}
        disabled={!isPlaying || isSpinning}
        placeholder="Enter a positive integer"
        error={betInputError}
      />

      <p>
        <b>BALANCE:</b> {isPlaying ? balance : startingMoney}
      </p>

      <div className="flex gap-4 justify-center">
        <button
          className="bg-blue-500 disabled:bg-gray-300 active:bg-blue-800 text-white px-4 py-2 rounded-md"
          disabled={!startingMoney || !!startingMoneyInputError}
          onClick={() => {
            if (isPlaying) {
              cleanUp();
              setGameState(GAME_STATE.NOT_PLAYING);
            } else {
              setBalance(startingMoney);
              setGameState(GAME_STATE.PLAYING_IDLE);
            }
          }}
        >
          {isPlaying ? 'Reset' : 'Start playing'}
        </button>

        <button
          className="bg-green-500 disabled:bg-gray-300 active:bg-green-800 text-white px-4 py-2 rounded-md"
          disabled={
            !isPlaying || isSpinning || !bet || !!betInputError || !balance
          }
          onClick={() => handleSpinWheel()}
        >
          {isSpinning ? 'Spinning...' : 'Spin wheel'}
        </button>
      </div>

      <hr className="border border-gray-300 w-full" />

      <div className="flex flex-col gap-2">
        <h2 className="text-xl">History</h2>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-scroll">
          {history.map(({ timestamp, text }) => (
            <div key={timestamp}>{text}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
