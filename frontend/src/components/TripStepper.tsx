import React from 'react';
import { Check } from 'lucide-react';

interface TripStepperProps {
  current: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: 'Trip Details' },
  { number: 2, label: 'Preferences' },
  { number: 3, label: 'Your Schedule' },
];

export default function TripStepper({ current }: TripStepperProps) {
  return (
    <div className="flex items-center justify-center mb-12 select-none">
      {steps.map((step, idx) => {
        const isDone = step.number < current;
        const isActive = step.number === current;
        return (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors
                  ${isDone ? 'bg-pink-500 border-pink-500 text-white' : ''}
                  ${isActive ? 'border-pink-500 text-pink-400 bg-white/10' : ''}
                  ${!isDone && !isActive ? 'border-white/30 text-white/50' : ''}`}
              >
                {isDone ? <Check size={18} /> : step.number}
              </div>
              <span
                className={`mt-2 text-sm ${
                  isActive ? 'text-pink-400 font-semibold' : 'text-white/60'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 md:w-28 mx-2 mb-6 transition-colors ${
                  step.number < current ? 'bg-pink-500' : 'bg-white/20'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
