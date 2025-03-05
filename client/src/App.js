import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import axios from 'axios';

// Animation keyframes
const slideIn = keyframes`
  from {
    transform: translateY(-20px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const shine = keyframes`
  0% {
    background-position: -100px;
  }
  40%, 100% {
    background-position: 300px;
  }
`;

const rollAnimation = keyframes`
  0% {
    transform: translateX(-50%) rotate(0deg);
  }
  100% {
    transform: translateX(-50%) rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -5px);
  }
  100% {
    transform: translate(-50%, 0);
  }
`;

const winningAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
`;

const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
`;

const shakeAnimation = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const glowPulse = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
  }
  100% {
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.2);
  }
`;

const explosionAnimation = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  50% {
    transform: scale(2);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

const numberRollAnimation = keyframes`
  0% { transform: translateY(-100%); opacity: 0; }
  10% { transform: translateY(0); opacity: 1; }
  90% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
`;

const glowRipple = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 50px rgba(76, 175, 80, 0);
    transform: scale(1.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    transform: scale(1);
  }
`;

// Add new keyframes for enhanced animations
const sliderGlow = keyframes`
  0% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
`;

const markerPulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const slideAnimation = keyframes`
  0% {
    transform: translateX(-50%) scale(0.95);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
`;

const trailAnimation = keyframes`
  0% {
    transform: scaleX(0.3) translateY(0);
    opacity: 0.8;
  }
  100% {
    transform: scaleX(1) translateY(0);
    opacity: 0;
  }
`;

const searchingMotion = keyframes`
  0% { transform: translateX(-50%) translateX(-8px); }
  40% { transform: translateX(-50%) translateX(6px); }
  70% { transform: translateX(-50%) translateX(-3px); }
  90% { transform: translateX(-50%) translateX(1px); }
  100% { transform: translateX(-50%) translateX(0); }
`;

const travelAnimation = keyframes`
  0% { left: 0%; }
  60% { left: ${props => props.$resultPosition * 0.8}%; }
  100% { left: ${props => props.$resultPosition}%; }
`;

// Styled components with enhanced animations
const Container = styled.div`
  min-height: 100vh;
  background-color: #1a1d24;
  color: white;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const GameContainer = styled.div`
  max-width: 1800px;
  margin: 0 auto;
  background-color: #242830;
  border-radius: 16px;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.4s ease;

  @media (min-width: 1024px) {
    grid-template-columns: 420px 1fr;
    padding: 2.5rem;
  }
`;

const LeftPanel = styled.div`
  background-color: #1e2126;
  border-radius: 16px;
  padding: 1.5rem;
  height: fit-content;
`;

const RightPanel = styled.div`
  flex: 1;
  padding: 1rem;
  
  @media (min-width: 1024px) {
    padding: 1.5rem;
  }
`;

const ModeToggle = styled.div`
  display: flex;
  background-color: #2c3038;
  border-radius: 25px;
  padding: 4px;
  margin-bottom: 1.5rem;
  width: fit-content;
`;

const ModeButton = styled.button`
  background-color: ${props => props.$active ? '#1e2126' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#8f96a3'};
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.$active ? '#1e2126' : '#363b45'};
    color: white;
  }
`;

const BetSection = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.div`
  color: #8f96a3;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const BetInputContainer = styled.div`
  background-color: #2c3038;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;

  &:focus-within {
    background-color: #363b45;
  }
`;

const BetInput = styled.input`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  width: 100%;
  padding-right: 0.5rem;
  font-weight: 500;
  
  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #8f96a3;
  }
`;

const CurrencyIcon = styled.span`
  color: #ffd700;
  font-size: 1.1rem;
  margin-right: 0.5rem;
  font-weight: bold;
`;

const QuickBetContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const QuickBetButton = styled.button`
  background-color: #2c3038;
  color: #8f96a3;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #363b45;
    color: white;
  }
`;

const BetButton = styled.button`
  background-color: ${props => props.disabled ? '#2c3038' : '#4caf50'};
  background-image: ${props => props.$rolling ? 
    'linear-gradient(90deg, #4caf50 0%, #45a049 50%, #4caf50 100%)' : 
    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
  };
  background-size: 200px 100%;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 1rem;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    background-color: #45a049;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }
  
  &:disabled {
    opacity: 0.8;
  }

  &:after {
    content: '${props => props.$errorMessage || ''}';
    position: absolute;
    bottom: -24px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 0.8rem;
    color: #ff4444;
    font-weight: normal;
  }

  ${props => props.$rolling && css`
    animation: ${shine} 1s linear infinite;
  `}
`;

const WinningAmount = styled.div`
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  color: #4caf50;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: ${winningAnimation} 2s ease-out forwards;
  z-index: 10;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, transparent 70%);
    animation: ${glowPulse} 1s infinite;
  }
`;

const GameSlider = styled.div`
  position: relative;
  height: 120px;
  margin: 4rem 0;
  padding: 0 1rem;
  background: transparent;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  background: rgba(20, 23, 34, 0.7);
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 0 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(20, 23, 34, 0.8);
  }
`;

const SliderTrack = styled.div`
  width: 100%;
  height: 16px;
  background: linear-gradient(90deg, 
    #ff443a 0%, 
    #ff443a ${props => props.$position}%, 
    #3fca6d ${props => props.$position}%,
    #3fca6d 100%
  );
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 100%
    );
  }
`;

const SliderHandle = styled.div`
  width: 28px;
  height: 28px;
  background: #4c7eff;
  border-radius: 4px;
  position: absolute;
  top: 6px;
  left: ${props => props.$position}%;
  transform: translateX(-50%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:before {
    content: '';
    position: absolute;
    top: 6px;
    left: 8px;
    width: 12px;
    height: 16px;
    background: repeating-linear-gradient(
      to right,
      rgba(255, 255, 255, 0.5) 0px,
      rgba(255, 255, 255, 0.5) 2px,
      transparent 2px,
      transparent 6px
    );
  }
  
  ${props => props.$rolling && css`
    animation: ${slideAnimation} 0.3s ease-out;
  `}

  &:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 4px 12px rgba(76, 126, 255, 0.3);
  }
`;

const SliderMarkers = styled.div`
  position: absolute;
  width: calc(100% - 2rem);
  display: flex;
  justify-content: space-between;
  left: 1rem;
  top: -25px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;

  span {
    position: relative;
    padding: 0.25rem;
    transition: all 0.3s ease;
    opacity: 0.7;
    
    &:hover {
      opacity: 1;
      transform: translateY(-1px);
    }
  }
`;

const ResultBox = styled.div`
  position: absolute;
  top: -50px;
  left: ${props => props.$resultPosition}%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  color: ${props => props.$won ? '#3fca6d' : '#ff443a'};
  width: 80px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 600;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  z-index: 3;
  animation: ${props => props.$rolling ? css`${travelAnimation} 1s ease-out forwards` : css`${floatAnimation} 2s ease-in-out infinite`};
  backdrop-filter: blur(5px);
  opacity: 0.98;
  
  &:before {
    content: '';
    position: absolute;
    inset: 2px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0.3) 100%
    );
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    z-index: -1;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    width: 200px;
    height: 15px;
    background: ${props => props.$won ? 
      'radial-gradient(ellipse at center, rgba(63, 202, 109, 0.6) 0%, rgba(63, 202, 109, 0) 70%)' : 
      'radial-gradient(ellipse at center, rgba(255, 68, 58, 0.6) 0%, rgba(255, 68, 58, 0) 70%)'
    };
    transform: translateX(-50%);
    filter: blur(8px);
    opacity: 0.9;
    z-index: 1;
  }

  ${props => props.$won && css`
    box-shadow: 0 0 40px rgba(63, 202, 109, 0.4);
  `}

  ${props => !props.$won && css`
    box-shadow: 0 0 40px rgba(255, 68, 58, 0.4);
  `}
`;

const ResultTrail = styled.div`
  position: absolute;
  top: 30px;
  left: ${props => props.$resultPosition}%;
  width: 200px;
  height: 6px;
  background: ${props => props.$won ? 
    'linear-gradient(90deg, rgba(63, 202, 109, 0) 0%, rgba(63, 202, 109, 0.7) 50%, rgba(63, 202, 109, 0) 100%)' : 
    'linear-gradient(90deg, rgba(255, 68, 58, 0) 0%, rgba(255, 68, 58, 0.7) 50%, rgba(255, 68, 58, 0) 100%)'
  };
  transform-origin: center;
  transform: translateX(-50%) scaleX(0.8);
  filter: blur(4px);
  z-index: 1;
  opacity: 0.8;
  animation: ${props => props.$rolling ? css`${travelAnimation} 1s ease-out forwards` : 'none'};
`;

const TopNumbers = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-right: 1rem;
  flex-wrap: wrap;
`;

const NumberBox = styled.div`
  background-color: ${props => props.$won ? '#4caf50' : '#ff4444'};
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 24px;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.3s ease;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
`;

const Unit = styled.span`
  color: #8f96a3;
  font-size: 0.9em;
  font-weight: 500;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 3rem;
  background-color: #1e2126;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const StatBox = styled.div`
  padding: 1rem;
  text-align: center;
  background-color: #242830;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  h3 {
    color: #8f96a3;
    font-size: 1rem;
    margin-bottom: 0.75rem;
    font-weight: 500;
  }
  
  p {
    font-size: 1.5rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const AutoBetPanel = styled.div`
  display: ${props => props.$visible ? 'block' : 'none'};
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #2c3038;
  border-radius: 8px;
  position: relative;
`;

const AutoBetRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
`;

const AutoBetInput = styled(BetInput)`
  width: 80px;
  text-align: center;
  background-color: #1e2126;
  padding: 0.35rem;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const AutoBetLabel = styled(Label)`
  margin: 0;
  min-width: 90px;
  font-size: 0.85rem;
`;

const StopConditionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: #1e2126;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.5rem;
`;

const StopConditionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem;
  background-color: ${props => props.$active ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const StopConditionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$disabled ? '#8f96a3' : 'white'};
  font-weight: 500;
  font-size: 0.85rem;
  
  svg {
    width: 14px;
    height: 14px;
    color: ${props => props.$win ? '#4caf50' : '#ff4444'};
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  margin-right: 8px;
`;

const ToggleSlider = styled.div`
  position: absolute;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.$checked ? '#4caf50' : '#1e2126'};
  transition: 0.4s;
  border-radius: 34px;
  opacity: ${props => props.$disabled ? '0.5' : '1'};

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${props => props.$checked ? 'translateX(18px)' : 'translateX(0)'};
  }
`;

const AutoBetStatus = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: ${props => props.$isRunning ? '#4caf50' : '#ff4444'};
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: ${pulse} 2s infinite;
`;

const BudgetSection = styled(BetSection)`
  background-color: #2c3038;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const BudgetControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const BudgetButton = styled(QuickBetButton)`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: ${props => props.$active ? '#4caf50' : '#1e2126'};
  color: ${props => props.$active ? 'white' : '#8f96a3'};

  &:hover {
    background-color: ${props => props.$active ? '#45a049' : '#363b45'};
    color: white;
  }
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

function App() {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('balance');
    const initialBalance = saved ? parseFloat(saved) : 1000;
    if (isNaN(initialBalance) || initialBalance <= 0) {
      localStorage.setItem('balance', '1000');
      return 1000;
    }
    return initialBalance;
  });
  const [betAmount, setBetAmount] = useState(() => {
    const saved = localStorage.getItem('betAmount');
    return saved || '';
  });
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [clientSeed] = useState(() => {
    const saved = localStorage.getItem('clientSeed');
    if (saved) return saved;
    const newSeed = Math.random().toString(36).substring(7);
    localStorage.setItem('clientSeed', newSeed);
    return newSeed;
  });
  const [nonce, setNonce] = useState(() => {
    const saved = localStorage.getItem('nonce');
    return saved ? parseInt(saved) : 0;
  });
  const [sliderPosition, setSliderPosition] = useState(() => {
    const saved = localStorage.getItem('sliderPosition');
    return saved ? parseFloat(saved) : 50;
  });
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('mode');
    return saved || 'Manual';
  });
  const [profitOnWin, setProfitOnWin] = useState(() => {
    const saved = localStorage.getItem('profitOnWin');
    return saved || '0.00';
  });
  const [recentResults, setRecentResults] = useState(() => {
    const saved = localStorage.getItem('recentResults');
    return saved ? JSON.parse(saved) : [88.02, 58.35, 68.71];
  });
  const [winAmount, setWinAmount] = useState(null);
  const [sounds] = useState(() => ({
    roll: new Audio('/sounds/roll.mp3'),
    win: new Audio('/sounds/win.mp3'),
    lose: new Audio('/sounds/lose.mp3')
  }));
  const [autoBetConfig, setAutoBetConfig] = useState(() => {
    const saved = localStorage.getItem('autoBetConfig');
    return saved ? JSON.parse(saved) : {
      numberOfBets: 0,
      stopOnWin: false,
      stopOnLoss: false,
      interval: 1000,
      isRunning: false,
      remainingBets: 0
    };
  });
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? parseFloat(saved) : 5000;
  });
  const [activeBudget, setActiveBudget] = useState(() => {
    const saved = localStorage.getItem('activeBudget');
    return saved ? parseFloat(saved) : 1000;
  });
  const [winChance, setWinChance] = useState(49.5);
  const [multiplier, setMultiplier] = useState(2.0);
  const [isSliding, setIsSliding] = useState(false);
  const slideSound = useRef(new Audio('/sounds/slide.mp3'));

  // Add useEffect hooks for localStorage persistence
  useEffect(() => {
    localStorage.setItem('balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('betAmount', betAmount);
  }, [betAmount]);

  useEffect(() => {
    localStorage.setItem('nonce', nonce.toString());
  }, [nonce]);

  useEffect(() => {
    localStorage.setItem('sliderPosition', sliderPosition.toString());
  }, [sliderPosition]);

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('profitOnWin', profitOnWin);
  }, [profitOnWin]);

  useEffect(() => {
    localStorage.setItem('recentResults', JSON.stringify(recentResults));
  }, [recentResults]);

  useEffect(() => {
    localStorage.setItem('autoBetConfig', JSON.stringify(autoBetConfig));
  }, [autoBetConfig]);

  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('activeBudget', activeBudget.toString());
  }, [activeBudget]);

  useEffect(() => {
    if (betAmount) {
      const profit = parseFloat(betAmount) * 2;
      setProfitOnWin(profit.toFixed(2));
    } else {
      setProfitOnWin('0.00');
    }
  }, [betAmount]);

  // Preload sounds
  useEffect(() => {
    Object.values(sounds).forEach(sound => {
      sound.load();
      sound.volume = 0.5; // Set volume to 50%
    });
  }, [sounds]);

  useEffect(() => {
    if (slideSound.current) {
      slideSound.current.loop = true;
      slideSound.current.volume = 0.2;
    }
    return () => {
      if (slideSound.current) {
        slideSound.current.pause();
      }
    };
  }, []);

  const handleQuickBet = (multiplier) => {
    const currentAmount = parseFloat(betAmount || 0);
    const newAmount = currentAmount ? currentAmount * multiplier : balance * 0.01 * multiplier;
    if (newAmount <= balance) {
      setBetAmount(newAmount.toFixed(2));
    }
  };

  const handleBetChange = (e) => {
    const value = e.target.value;
    console.log('Bet input value:', value);
    if (value === '' || (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0)) {
      setBetAmount(value);
    }
  };

  const calculateSliderPosition = (roll) => {
    // Convert roll (1-6) to percentage (0-100)
    return (roll / 6) * 100;
  };

  const isButtonDisabled = () => {
    const isRolling = rolling;
    const hasNoBetAmount = !betAmount;
    const isBetTooHigh = parseFloat(betAmount) > balance || parseFloat(betAmount) > budget;
    const isBetValid = !isNaN(parseFloat(betAmount)) && parseFloat(betAmount) > 0;

    console.log('Button state:', {
      isRolling,
      hasNoBetAmount,
      isBetTooHigh,
      isBetValid,
      betAmount,
      balance
    });

    return isRolling || hasNoBetAmount || isBetTooHigh || !isBetValid;
  };

  const getButtonErrorMessage = () => {
    if (rolling) return 'Rolling in progress...';
    if (!betAmount) return 'Please enter a bet amount';
    if (parseFloat(betAmount) > balance) return 'Insufficient balance';
    if (parseFloat(betAmount) > budget) return 'Exceeds budget limit';
    if (!(!isNaN(parseFloat(betAmount)) && parseFloat(betAmount) > 0)) return 'Invalid bet amount';
    return '';
  };

  const handleRoll = async () => {
    const betValue = parseFloat(betAmount);
    if (!betAmount || rolling || betValue <= 0 || betValue > balance) {
      return;
    }

    setRolling(true);
    setResult(null); // Clear previous result
    playSound('roll');

    try {
      const response = await axios.post('http://localhost:5000/api/roll-dice', {
        clientSeed,
        nonce,
        betAmount: betValue,
        target: sliderPosition // Send the current slider position as target
      });

      const { roll, won, payout } = response.data;
      
      if (autoBetConfig.isRunning) {
        if ((won && autoBetConfig.stopOnWin) || (!won && autoBetConfig.stopOnLoss)) {
          stopAutoBetting();
        }
      }
      
      // Show result without moving the slider
      await new Promise(resolve => setTimeout(resolve, 400));
      setResult(roll);
      playSound(won ? 'win' : 'lose');
      
      setBalance(prev => prev - betValue + payout);
      setNonce(prev => prev + 1);
      
      if (won) {
        setWinAmount(payout);
        setTimeout(() => setWinAmount(null), 2000);
      }
      
      setRecentResults(prev => [parseFloat(roll), ...prev.slice(0, 2)]);

    } catch (error) {
      console.error('Error rolling dice:', error);
      stopAutoBetting();
    } finally {
      setTimeout(() => {
        setRolling(false);
      }, 1000);
    }
  };

  // Update playSound function
  const playSound = (type) => {
    const sound = sounds[type];
    if (sound) {
      sound.currentTime = 0; // Reset sound to start
      sound.play().catch(error => console.log('Sound play error:', error));
    }
  };

  // Add auto betting functions
  const startAutoBetting = () => {
    if (!betAmount || parseFloat(betAmount) <= 0 || parseFloat(betAmount) > balance) {
      return;
    }

    // Save current settings to localStorage before starting
    const newConfig = {
      ...autoBetConfig,
      isRunning: true,
      remainingBets: autoBetConfig.numberOfBets,
      startTime: Date.now()
    };
    
    setAutoBetConfig(newConfig);
    localStorage.setItem('autoBetConfig', JSON.stringify(newConfig));
  };

  const stopAutoBetting = () => {
    const newConfig = {
      ...autoBetConfig,
      isRunning: false,
      remainingBets: 0
    };
    
    setAutoBetConfig(newConfig);
    localStorage.setItem('autoBetConfig', JSON.stringify(newConfig));
  };

  useEffect(() => {
    let autoBetInterval;

    if (autoBetConfig.isRunning && autoBetConfig.remainingBets > 0 && !rolling) {
      autoBetInterval = setTimeout(() => {
        handleRoll();
        setAutoBetConfig(prev => ({
          ...prev,
          remainingBets: prev.remainingBets - 1
        }));
      }, autoBetConfig.interval);
    }

    if (autoBetConfig.remainingBets === 0 && autoBetConfig.isRunning) {
      stopAutoBetting();
    }

    return () => clearTimeout(autoBetInterval);
  }, [autoBetConfig.isRunning, autoBetConfig.remainingBets, rolling]);

  const handleBudgetSelect = (amount) => {
    setActiveBudget(amount);
    setBalance(amount);
    localStorage.setItem('balance', amount.toString());
  };

  const handleSliderChange = (newPosition) => {
    if (rolling) return;
    
    // Clamp position between 4 and 96 (for reasonable betting ranges)
    const clampedPosition = Math.min(Math.max(newPosition, 4), 96);
    setSliderPosition(clampedPosition);
    
    // Calculate win chance based on position
    const newWinChance = 100 - clampedPosition;
    setWinChance(newWinChance);
    
    // Calculate multiplier (house edge of 1%)
    const newMultiplier = (99 / newWinChance).toFixed(4);
    setMultiplier(parseFloat(newMultiplier));
    
    // Update profit on win
    if (betAmount) {
      const profit = parseFloat(betAmount) * parseFloat(newMultiplier);
      setProfitOnWin(profit.toFixed(2));
    }
  };

  const handleSliderClick = (e) => {
    if (rolling) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = (x / rect.width) * 100;
    handleSliderChange(newPosition);
  };

  const handleSliderDrag = (e, sliderTrack) => {
    if (rolling) return;
    const rect = sliderTrack.getBoundingClientRect();
    const x = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const newPosition = (x / rect.width) * 100;
    handleSliderChange(newPosition);

    // Play sliding sound if not already playing
    if (!isSliding) {
      setIsSliding(true);
      if (slideSound.current) {
        slideSound.current.play().catch(error => console.log('Slide sound play error:', error));
      }
    }
  };

  const stopSlideSound = () => {
    setIsSliding(false);
    if (slideSound.current) {
      slideSound.current.pause();
      slideSound.current.currentTime = 0;
    }
  };

  // Update GameSliderSection
  const GameSliderSection = () => {
    const sliderTrackRef = React.useRef(null);

    return (
      <GameSlider>
        <SliderMarkers>
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </SliderMarkers>
        <SliderContainer>
          <SliderTrack 
            ref={sliderTrackRef}
            $position={sliderPosition}
            onClick={handleSliderClick}
            onMouseMove={(e) => e.buttons === 1 && handleSliderDrag(e, sliderTrackRef.current)}
            onMouseUp={stopSlideSound}
            onMouseLeave={stopSlideSound}
          />
          <SliderHandle 
            $position={sliderPosition} 
            $rolling={rolling}
            onMouseDown={(e) => {
              e.preventDefault();
              const handleMouseMove = (e) => {
                if (sliderTrackRef.current) {
                  handleSliderDrag(e, sliderTrackRef.current);
                }
              };
              const handleMouseUp = () => {
                stopSlideSound();
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />
          {result && (
            <>
              <ResultTrail 
                $resultPosition={parseFloat(result)}
                $won={parseFloat(result) >= sliderPosition}
                $rolling={rolling}
              />
              <ResultBox 
                $resultPosition={parseFloat(result)}
                $won={parseFloat(result) >= sliderPosition}
                $rolling={rolling}
              >
                {result}
              </ResultBox>
            </>
          )}
        </SliderContainer>
      </GameSlider>
    );
  };

  return (
    <Container>
      <GameContainer>
        <LeftPanel>
          <BudgetSection>
            <Label>Select Budget (Current: ₹{activeBudget.toFixed(2)})</Label>
            <BudgetControls>
              <BudgetButton 
                $active={activeBudget === 1000}
                onClick={() => handleBudgetSelect(1000)}
              >
                ₹1,000
              </BudgetButton>
              <BudgetButton 
                $active={activeBudget === 5000}
                onClick={() => handleBudgetSelect(5000)}
              >
                ₹5,000
              </BudgetButton>
              <BudgetButton 
                $active={activeBudget === 10000}
                onClick={() => handleBudgetSelect(10000)}
              >
                ₹10,000
              </BudgetButton>
              <BudgetButton 
                $active={activeBudget === 50000}
                onClick={() => handleBudgetSelect(50000)}
              >
                ₹50,000
              </BudgetButton>
            </BudgetControls>
          </BudgetSection>

          <ModeToggle>
            <ModeButton $active={mode === 'Manual'} onClick={() => setMode('Manual')}>Manual</ModeButton>
            <ModeButton $active={mode === 'Auto'} onClick={() => setMode('Auto')}>Auto</ModeButton>
          </ModeToggle>

          <BetSection>
            <Label>Bet Amount (Balance: ₹{balance.toFixed(2)})</Label>
            <BetInputContainer>
              <CurrencyIcon>₹</CurrencyIcon>
              <BetInput
                type="text"
                value={betAmount}
                onChange={handleBetChange}
                placeholder="0.00"
              />
            </BetInputContainer>
            <QuickBetContainer>
              <QuickBetButton onClick={() => handleQuickBet(0.5)}>½×</QuickBetButton>
              <QuickBetButton onClick={() => handleQuickBet(2)}>2×</QuickBetButton>
            </QuickBetContainer>
          </BetSection>

          <BetSection>
            <Label>Profit on Win</Label>
            <BetInputContainer>
              <CurrencyIcon>₹</CurrencyIcon>
              <BetInput
                type="text"
                value={profitOnWin}
                readOnly
                placeholder="0.00"
              />
            </BetInputContainer>
          </BetSection>

          <AutoBetPanel $visible={mode === 'Auto'}>
            <AutoBetStatus $isRunning={autoBetConfig.isRunning}>
              {autoBetConfig.isRunning ? 'Running' : 'Stopped'}
            </AutoBetStatus>
            <AutoBetRow>
              <AutoBetLabel>Number of Bets</AutoBetLabel>
              <AutoBetInput
                type="number"
                min="1"
                max="100"
                value={autoBetConfig.numberOfBets}
                onChange={(e) => setAutoBetConfig(prev => ({
                  ...prev,
                  numberOfBets: parseInt(e.target.value) || 0
                }))}
                disabled={autoBetConfig.isRunning}
              />
            </AutoBetRow>
            <AutoBetRow>
              <AutoBetLabel>Interval (sec)</AutoBetLabel>
              <AutoBetInput
                type="number"
                min="1"
                max="10"
                value={autoBetConfig.interval / 1000}
                onChange={(e) => setAutoBetConfig(prev => ({
                  ...prev,
                  interval: (parseInt(e.target.value) || 1) * 1000
                }))}
                disabled={autoBetConfig.isRunning}
              />
            </AutoBetRow>
            <StopConditionContainer>
              <StopConditionRow $active={autoBetConfig.stopOnWin}>
                <StopConditionLabel $win $disabled={autoBetConfig.isRunning}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12M22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z" />
                  </svg>
                  Stop on Win
                </StopConditionLabel>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={autoBetConfig.stopOnWin}
                    onChange={(e) => setAutoBetConfig(prev => ({
                      ...prev,
                      stopOnWin: e.target.checked
                    }))}
                    disabled={autoBetConfig.isRunning}
                  />
                  <ToggleSlider 
                    $checked={autoBetConfig.stopOnWin}
                    $disabled={autoBetConfig.isRunning}
                  />
                </ToggleSwitch>
              </StopConditionRow>
              <StopConditionRow $active={autoBetConfig.stopOnLoss}>
                <StopConditionLabel $disabled={autoBetConfig.isRunning}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                  </svg>
                  Stop on Loss
                </StopConditionLabel>
                <ToggleSwitch>
                  <ToggleInput
                    type="checkbox"
                    checked={autoBetConfig.stopOnLoss}
                    onChange={(e) => setAutoBetConfig(prev => ({
                      ...prev,
                      stopOnLoss: e.target.checked
                    }))}
                    disabled={autoBetConfig.isRunning}
                  />
                  <ToggleSlider 
                    $checked={autoBetConfig.stopOnLoss}
                    $disabled={autoBetConfig.isRunning}
                  />
                </ToggleSwitch>
              </StopConditionRow>
            </StopConditionContainer>
          </AutoBetPanel>

          <BetButton 
            onClick={mode === 'Auto' ? (autoBetConfig.isRunning ? stopAutoBetting : startAutoBetting) : handleRoll}
            disabled={isButtonDisabled()}
            $rolling={rolling}
            $errorMessage={getButtonErrorMessage()}
            style={{
              backgroundColor: mode === 'Auto' && autoBetConfig.isRunning ? '#ff4444' : undefined,
              transition: 'all 0.3s ease'
            }}
          >
            {rolling ? 'Rolling...' : mode === 'Auto' 
              ? (autoBetConfig.isRunning 
                ? `Stop Auto Betting (${autoBetConfig.remainingBets} remaining)` 
                : 'Start Auto Betting')
              : `Bet ${betAmount ? `₹${betAmount}` : ''}`}
          </BetButton>
        </LeftPanel>

        <RightPanel>
          <TopNumbers>
            {recentResults.map((num, index) => (
              <NumberBox 
                key={index}
                $won={num >= 50}
              >
                {num.toFixed(2)}
              </NumberBox>
            ))}
          </TopNumbers>

          <GameSliderSection />

          <StatsContainer>
            <StatBox>
              <h3>Multiplier</h3>
              <p>{multiplier.toFixed(4)}<Unit>×</Unit></p>
            </StatBox>
            <StatBox>
              <h3>Roll Over</h3>
              <p>{sliderPosition.toFixed(2)}</p>
            </StatBox>
            <StatBox>
              <h3>Win Chance</h3>
              <p>{winChance.toFixed(4)}<Unit>%</Unit></p>
            </StatBox>
          </StatsContainer>
        </RightPanel>
      </GameContainer>
    </Container>
  );
}

export default App;