import React from 'react';

interface SimpleIconProps {
  /** SVG path data from simple-icons */
  path: string;
  /** Icon size in pixels */
  size?: number;
  /** Icon color */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Simple wrapper component for rendering simple-icons SVG icons
 */
const SimpleIcon: React.FC<SimpleIconProps> = ({
  path,
  size = 24,
  color = 'currentColor',
  className = ''
}) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} />
    </svg>
  );
};

export default SimpleIcon;
