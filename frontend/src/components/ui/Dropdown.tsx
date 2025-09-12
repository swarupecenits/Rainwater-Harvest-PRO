import React, { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
interface Option {
  value: string;
  label: string;
}
interface DropdownProps {
  label: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}
const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  return <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button type="button" className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" onClick={() => setIsOpen(!isOpen)}>
          <span className={`block truncate ${!selectedOption ? 'text-gray-400' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </span>
        </button>
        {isOpen && <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 max-h-60 overflow-auto">
            {options.map(option => <div key={option.value} className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}`} onClick={() => {
          onChange?.(option.value);
          setIsOpen(false);
        }}>
                {option.label}
              </div>)}
          </div>}
      </div>
    </div>;
};
export default Dropdown;