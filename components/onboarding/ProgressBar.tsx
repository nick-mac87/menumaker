'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Name', 'Location', 'Delivery', 'Design', 'Menu', 'Specials', 'Launch'];

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full px-6 py-5">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                  step < currentStep && 'bg-teal-500 text-white',
                  step === currentStep && 'bg-primary text-primary-foreground shadow-lg shadow-red-200/50 scale-110',
                  step > currentStep && 'bg-muted text-muted-foreground'
                )}
              >
                {step < currentStep ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={cn(
                  'text-xs mt-1.5 font-medium hidden sm:block',
                  step === currentStep ? 'text-primary font-semibold' : step < currentStep ? 'text-teal-600' : 'text-muted-foreground'
                )}
              >
                {stepLabels[step - 1]}
              </span>
            </div>
            {step < totalSteps && (
              <div className="flex-1 mx-2 mt-[-1.25rem] sm:mt-[-0.5rem]">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500 ease-out',
                      step < currentStep ? 'bg-teal-500 w-full' : 'w-0'
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
