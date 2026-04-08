import { useState } from 'react';

/**
 * Hook for managing form field touched state and validation
 * Tracks which fields have been blurred so errors only show after user interaction
 */
export function useFormTouched() {
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const isTouched = (fieldName: string): boolean => {
    return touchedFields[fieldName] || false;
  };

  const resetTouched = (fieldNames?: string[]) => {
    if (fieldNames) {
      const updated = { ...touchedFields };
      fieldNames.forEach((name) => {
        delete updated[name];
      });
      setTouchedFields(updated);
    } else {
      setTouchedFields({});
    }
  };

  return {
    touchedFields,
    handleBlur,
    isTouched,
    resetTouched,
  };
}
