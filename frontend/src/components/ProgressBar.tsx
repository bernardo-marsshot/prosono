interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showStats?: boolean;
}

const ProgressBar = ({
  current,
  target,
  label = 'Progresso',
  showStats = true,
}: ProgressBarProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;
  const remaining = Math.max(target - current, 0);

  return (
    <div className="w-full">
      {showStats && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-neutral-700">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">
              {current}/{target}
            </span>
            {isComplete && (
              <div className="flex items-center text-green-600">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-label="Completed"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        {/* Background track */}
        <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
          {/* Progress fill with gradient and animation */}
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
              isComplete
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-primary-500 to-primary-600'
            }`}
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />

            {/* Animated glow effect when complete */}
            {isComplete && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/50 to-green-500/50 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Status message */}
      {showStats && (
        <div className="mt-3 text-center">
          {isComplete ? (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="Target achieved"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">Meta alcançada! 🎉</span>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">
              {remaining === 1
                ? `Falta ${remaining} registo para alcançar a meta`
                : `Faltam ${remaining} registos para alcançar a meta`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
