import React from 'react';
interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}
const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  required = false
}) => {
  return <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} 
            py-2 ${icon ? 'pl-10' : 'pl-3'} pr-3 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-transparent transition-all`} />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>;
};
export default Input;