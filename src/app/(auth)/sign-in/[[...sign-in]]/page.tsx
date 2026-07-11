'use client';

import { useState } from 'react';
import { SignIn } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'motion/react';

function FloorLamp({ isOn, onPull }: { isOn: boolean; onPull: () => void }) {
  return (
    <div className="relative flex flex-col items-center select-none" style={{ width: 120, height: 420 }}>

      {/* Lamp shade */}
      <div className="relative" style={{ marginTop: 20 }}>
        <svg width="100" height="60" viewBox="0 0 100 60">
          <polygon
            points="10,55 90,55 75,5 25,5"
            fill={isOn ? 'rgba(255,200,50,0.18)' : 'rgba(255,255,255,0.04)'}
            stroke={isOn ? '#FFB800' : '#3f3f46'}
            strokeWidth="1.5"
          />
          {/* Rim */}
          <line x1="10" y1="55" x2="90" y2="55" stroke={isOn ? '#FFB800' : '#3f3f46'} strokeWidth="2" />
          {/* Top */}
          <line x1="25" y1="5" x2="75" y2="5" stroke={isOn ? '#FFB800' : '#3f3f46'} strokeWidth="2" />

          {/* Glow inside shade */}
          {isOn && (
            <ellipse cx="50" cy="50" rx="35" ry="8"
              fill="rgba(255,200,50,0.25)" />
          )}
        </svg>

        {/* Light cone on floor when on */}
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              top: 55,
              width: 0,
              height: 0,
              borderLeft: '80px solid transparent',
              borderRight: '80px solid transparent',
              borderTop: '260px solid rgba(255,200,50,0.06)',
              filter: 'blur(8px)',
            }}
          />
        )}
      </div>

      {/* Vertical pole */}
      <div
        style={{
          width: 3,
          height: 260,
          background: isOn
            ? 'linear-gradient(to bottom, #FFB800, #a16207)'
            : 'linear-gradient(to bottom, #52525B, #27272a)',
          borderRadius: 2,
          transition: 'background 0.4s',
        }}
      />

      {/* Base horizontal bar */}
      <div style={{
        width: 100,
        height: 6,
        borderRadius: 3,
        background: isOn ? '#a16207' : '#27272a',
        transition: 'background 0.4s',
        marginTop: -2,
      }} />

      {/* Base feet */}
      <div className="flex justify-between" style={{ width: 80, marginTop: 2 }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            width: 28, height: 4, borderRadius: 2,
            background: isOn ? '#a16207' : '#27272a',
            transition: 'background 0.4s',
          }} />
        ))}
      </div>

      {/* Pull string */}
      <motion.div
        className="absolute cursor-pointer"
        style={{ top: 70, left: '50%', x: '-50%' }}
        onClick={onPull}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scaleY: 1.3, originY: 0 }}
        title="Pull string to toggle light"
      >
        {/* String line */}
        <motion.div
          style={{
            width: 1.5,
            height: 44,
            background: isOn ? '#FFB800' : '#71717a',
            margin: '0 auto',
            transition: 'background 0.3s',
          }}
        />
        {/* Pull knob */}
        <motion.div
          animate={{
            backgroundColor: isOn ? '#FFB800' : '#52525B',
            boxShadow: isOn ? '0 0 10px rgba(255,184,0,0.6)' : 'none',
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 10, height: 16, borderRadius: 4,
            margin: '0 auto',
          }}
        />
      </motion.div>

      {/* Glow from bulb area */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none"
            style={{
              top: 30, left: '50%', transform: 'translateX(-50%)',
              width: 120, height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,200,50,0.2) 0%, transparent 70%)',
              filter: 'blur(10px)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SignInPage() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 overflow-hidden">

      {/* Ambient bg glow */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 20% 50%, rgba(255,184,0,0.05) 0%, transparent 60%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Hint text */}
      <motion.p
        className="absolute top-8 left-1/2 -translate-x-1/2 text-[11px] font-mono tracking-widest uppercase"
        animate={{ color: isOn ? '#FFB800' : '#3f3f46' }}
        transition={{ duration: 0.3 }}
      >
        {isOn ? '— WORKSPACE UNLOCKED —' : 'PULL THE STRING TO LOGIN'}
      </motion.p>

      {/* Layout: lamp top on mobile, side by side on desktop */}
      <div className="flex flex-col md:flex-row md:items-end md:gap-16 w-full max-w-4xl relative z-10 gap-6 items-center">

        {/* Floor Lamp — smaller on mobile */}
        <div className="shrink-0 scale-75 md:scale-100 origin-bottom">
          <FloorLamp isOn={isOn} onPull={() => setIsOn(p => !p)} />
        </div>

        {/* Sign In Form */}
        <div className="flex-1 w-full">
          <AnimatePresence>
            {isOn ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              >
                <SignIn
                  signUpUrl="/sign-up"
                  forceRedirectUrl="/"
                  appearance={{
                    variables: {
                      colorPrimary:                '#FFB800',
                      colorBackground:             '#0D0E16',
                      colorText:                   '#FFFFFF',
                      colorTextSecondary:          '#A1A1AA',
                      colorTextOnPrimaryBackground:'#000000',
                      colorInputBackground:        'rgba(255,255,255,0.04)',
                      colorInputText:              '#FFFFFF',
                      colorNeutral:                '#FFFFFF',
                      borderRadius:                '12px',
                      fontFamily:                  'Inter, sans-serif',
                    },
                    elements: {
                      card:                         'shadow-[0_0_40px_rgba(255,184,0,0.08)] border border-[rgba(255,184,0,0.15)] bg-[#0D0E16]',
                      headerTitle:                  'text-white font-display tracking-wider',
                      headerSubtitle:               'text-[#A1A1AA] text-xs',
                      formButtonPrimary:            'bg-gradient-to-r from-[#FFB800] to-[#FF6B00] hover:opacity-90 text-black font-bold',
                      footerActionLink:             'text-[#FFB800] hover:opacity-80',
                      formFieldInput:               'border-white/10 bg-white/5 text-white',
                      formFieldLabel:               'text-[#A1A1AA] text-xs uppercase tracking-wider',
                      socialButtonsBlockButton:     'border border-white/10 bg-white/5 text-white hover:bg-white/10',
                      socialButtonsBlockButtonText: 'text-white font-medium',
                      dividerText:                  'text-[#52525B]',
                      dividerLine:                  'bg-white/10',
                    },
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 py-20"
              >
                <p className="text-4xl">💡</p>
                <p className="text-[11px] font-mono text-[#3f3f46] tracking-widest text-center">
                  PULL THE STRING<br />TO REVEAL LOGIN
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
