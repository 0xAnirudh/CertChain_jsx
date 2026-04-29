import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';
import './Header.css';

const MoonIcon = () => (
  <svg className="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7.2 7.2 0 0 0 21 12.8Z" />
  </svg>
);

const SunIcon = () => (
  <svg className="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </svg>
);

export const Header = ({ isAdmin, onChainStatusClick, chainStatus }) => {
  const { addToast } = useToast();
  const [statusText, setStatusText] = useState('CHAIN VALID');
  const [statusBlocks, setStatusBlocks] = useState('0 blocks');
  const [isValid, setIsValid] = useState(true);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    if (chainStatus) {
      setStatusText(chainStatus.valid ? 'CHAIN VALID' : 'CHAIN INVALID');
      setStatusBlocks(`${chainStatus.stats?.totalBlocks || 0} blocks`);
      setIsValid(chainStatus.valid);
    } else if (!isAdmin) {
      setStatusText('ADMIN LOGIN REQUIRED');
      setStatusBlocks('locked');
      setIsValid(false);
    }
  }, [chainStatus, isAdmin]);

  useEffect(() => {
    try {
      document.body.classList.toggle('light', theme === 'light');
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore storage errors
    }
  }, [theme]);

  return (
    <header className="header">
      <div className="logo">
        <div className="logo-icon">🔗</div>
        <div>
          <div className="logo-text">
            Cert<span>Chain</span>
          </div>
          <div className="logo-sub">Blockchain Certificate Authority</div>
        </div>
      </div>

      <div className="header-right">
        <button
          className="theme-toggle btn-ghost"
          aria-pressed={theme === 'light'}
          aria-label="Toggle light and dark theme"
          onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
          title="Toggle light / dark"
        >
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </button>
        <div
          id="chain-status"
          className="chain-status"
          onClick={onChainStatusClick}
          title="Click to validate chain"
        >
          <span className={`status-dot ${isValid ? '' : 'invalid'}`}></span>
          <span className="status-text">{statusText}</span>
          <span className="status-separator">·</span>
          <span className="status-blocks">{statusBlocks}</span>
        </div>
      </div>
    </header>
  );
};
