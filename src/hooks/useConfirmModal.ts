import { useState, useCallback } from 'react';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: 'danger' | 'primary' | 'warning';
}

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    message: ''
  });
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openConfirm = useCallback((confirmOptions: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(confirmOptions);
      setIsOpen(true);
      setResolvePromise(() => resolve);
      setIsLoading(false);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(true);
      setIsOpen(false);
      setResolvePromise(null);
      setIsLoading(false);
    }
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
      setIsOpen(false);
      setResolvePromise(null);
      setIsLoading(false);
    }
  }, [resolvePromise]);

  const setLoadingState = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    isOpen,
    options,
    isLoading,
    openConfirm,
    handleConfirm,
    handleCancel,
    setLoadingState
  };
};