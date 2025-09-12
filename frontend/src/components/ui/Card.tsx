import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false
}) => {
  return <div className={`bg-white rounded-xl shadow-sm p-4 ${hoverable ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </div>;
};
export default Card;