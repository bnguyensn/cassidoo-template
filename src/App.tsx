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
const WHEEL_SPIN_DELAY = 1000; // ms

enum GAME_STATE {
  NOT_PLAYING = 'NOT_PLAYING',

  PLAYING_IDLE = 'PLAYING_IDLE',
  PLAYING_SPINNING = 'PLAYING_SPINNING',
}

const GAME_TEXT: Record<GAME_STATE, string> = {
  [GAME_STATE.NOT_PLAYING]:
    'Enter some starting money and click "Start playing" to begin 😘',
  [GAME_STATE.PLAYING_IDLE]:
    'Click the "Spin wheel" button to spin the wheel 🎲',
  [GAME_STATE.PLAYING_SPINNING]: 'Spinning the wheel...Good luck! 🤑',
};

const INVALID_NUMBER_INPUT_REGEX = /[^\d]+/;

function validateNumberInput(input: string): boolean {
  if (!input) {
    return true;
  }

  if (Number.isNaN(Number(input))) {
    return false;
  }

  if (INVALID_NUMBER_INPUT_REGEX.test(input)) {
    return false;
  }

  return true;
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
  const startingMoneyError = validateNumberInput(startingMoneyInput)
    ? ''
    : 'Starting money must be a positive integer';
  const startingMoney = startingMoneyError ? null : Number(startingMoneyInput);

  const handleSpinWheel = async () => {
    setGameState(GAME_STATE.PLAYING_SPINNING);

    await wait(WHEEL_SPIN_DELAY);

    if (isPlaying) {
      setGameState(GAME_STATE.PLAYING_IDLE);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center max-w-lg w-full mx-auto">
      <h1 className="text-3xl">Spin the Wheel 🎡</h1>

      <Input
        label="Starting money"
        value={startingMoneyInput}
        setValue={(newValue) => setStartingMoneyInput(newValue)}
        disabled={isPlaying}
        placeholder="Enter a positive integer"
        error={startingMoneyError}
      />

      <button
        className="bg-blue-500 disabled:bg-gray-300 active:bg-blue-800 text-white px-4 py-2 rounded-md"
        disabled={!startingMoney || !!startingMoneyError}
        onClick={() => {
          window.clearTimeout(timerId);

          if (isPlaying) {
            setGameState(GAME_STATE.NOT_PLAYING);
          } else {
            setGameState(GAME_STATE.PLAYING_IDLE);
          }
        }}
      >
        {isPlaying ? 'Reset' : 'Start playing'}
      </button>

      <hr className="border border-gray-300 w-full" />

      <p className="text-center">{GAME_TEXT[gameState]}</p>

      <button
        className="bg-green-500 disabled:bg-gray-300 active:bg-green-800 text-white px-4 py-2 rounded-md"
        disabled={!isPlaying || isSpinning}
        onClick={() => handleSpinWheel()}
      >
        {isSpinning ? 'Spinning...' : 'Spin wheel'}
      </button>
    </div>
  );
}
