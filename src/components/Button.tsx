import React from 'react';

type ButtonColor = 'primary' | 'outline' | 'white' | 'outline-white';

type Props = {
  text: string;
  onClick?: () => void;
  color?: ButtonColor;
  type?: 'button' | 'submit';
  className?: string;
  icon?: React.ReactNode;
};

export default function Button({ text, onClick, color = 'primary', type = 'button', className = '', icon }: Props) {
  const baseClass = `btn btn-${color}`;
  const withIcon = icon ? ' gap-2' : '';
  const fullClass = [baseClass, withIcon, className].filter(Boolean).join(' ');
  return (
    <button type={type} onClick={onClick} className={fullClass}>
      {icon && <span className="flex shrink-0 [&>svg]:w-5 [&>svg]:h-5">{icon}</span>}
      {text}
    </button>
  );
}
