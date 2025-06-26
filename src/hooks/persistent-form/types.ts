
export interface PersistentFormOptions {
  // Use a custom key instead of auto-generating from path
  customKey?: string;
  // Whether to sync with URL query parameters
  syncWithUrl?: boolean;
  // Storage type to use
  storageType?: 'localStorage' | 'sessionStorage';
  // Debounce delay for saving (ms)
  debounceMs?: number;
  // Fields to exclude from persistence
  excludeFields?: string[];
}

export interface FormInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface FormSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export interface FormCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export interface FormSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
