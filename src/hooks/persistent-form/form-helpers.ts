
import { useCallback } from 'react';
import { FormInputProps, FormSelectProps, FormCheckboxProps, FormSwitchProps } from './types';

export function createFormHelpers<T extends Record<string, any>>(
  formValues: T,
  handleChange: (field: keyof T, value: any) => void,
  initialValues: T
) {
  const getInputProps = useCallback((field: keyof T): FormInputProps => ({
    value: String(formValues[field] || ''),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      handleChange(field, e.target.value)
  }), [formValues, handleChange]);

  const getSelectProps = useCallback((field: keyof T): FormSelectProps => ({
    value: String(formValues[field] || ''),
    onValueChange: (value: string) => handleChange(field, value)
  }), [formValues, handleChange]);

  const getCheckboxProps = useCallback((field: keyof T): FormCheckboxProps => ({
    checked: Boolean(formValues[field]),
    onCheckedChange: (checked: boolean) => handleChange(field, checked)
  }), [formValues, handleChange]);

  const getSwitchProps = useCallback((field: keyof T): FormSwitchProps => ({
    checked: Boolean(formValues[field]),
    onCheckedChange: (checked: boolean) => handleChange(field, checked)
  }), [formValues, handleChange]);

  const clearField = useCallback((field: keyof T) => {
    handleChange(field, initialValues[field]);
  }, [handleChange, initialValues]);

  return {
    getInputProps,
    getSelectProps,
    getCheckboxProps,
    getSwitchProps,
    clearField
  };
}
