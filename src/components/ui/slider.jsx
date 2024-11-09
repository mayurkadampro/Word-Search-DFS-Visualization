import React, { useState, useRef, useEffect } from 'react';


const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  value: controlledValue,
  onChange,
  className = '',
}) => {
  const [value, setValue] = useState(controlledValue || 0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  // Handle controlled component case
  const currentValue = controlledValue !== undefined ? controlledValue : value;

  // Calculate percentage for slider position
  const percentage = ((currentValue - min) / (max - min)) * 100;

  const handleMove = (clientX) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const width = rect.width;
    const left = rect.left;
    let percentage = (clientX - left) / width;

    // Clamp percentage between 0 and 1
    percentage = Math.min(Math.max(percentage, 0), 1);

    // Calculate new value based on percentage
    let newValue = min + percentage * (max - min);

    // Apply step
    newValue = Math.round(newValue / step) * step;

    // Clamp value between min and max
    newValue = Math.min(Math.max(newValue, min), max);

    if (controlledValue === undefined) {
      setValue(newValue);
    }

    onChange?.(newValue);
  };

  const handleMouseDown = (e) => {
    console.log("handleMouseDown disabled :- ", disabled)
    if (disabled) return;
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e) => {
    console.log("handleTouchStart disabled :- ", disabled)
    if (disabled) return;
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      handleMove(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div
      className={`relative w-full h-6 flex items-center ${className}`}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={currentValue}
      tabIndex={0}
      ref={sliderRef}
    >
      {/* Track background */}
      <div className="absolute h-2 w-full rounded-full bg-gray-100">
        {/* Filled track */}
        <div
          className={`absolute h-full bg-blue-600 rounded-full
            ${disabled ? 'bg-slate-200' : ''}
            `}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb */}
      <div
        className={`absolute h-5 w-5 rounded-full bg-white border-2 border-blue-600 cursor-pointer transform -translate-x-1/2 transition-shadow
          ${isDragging ? 'shadow-lg' : 'shadow-md'}
          ${disabled ? 'border-2 border-slate-200' : ''}
          hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
        style={{ left: `${percentage}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
    </div>
  );
};

export { Slider };