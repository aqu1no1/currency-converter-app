import type Decimal from 'decimal.js';
import { useCallback, useState } from 'react';

import type { CurrencyCodeValue } from '@enums/currency-code.enum';
import {
  applyKeypadKey,
  INITIAL_AMOUNT,
  type KeypadKey,
  toInputAmount,
} from '@utils/converter.util';
/**
 * Keeps the active currency and the typed amount of the converter.
 * Guarda a moeda ativa e o valor digitado no conversor.
 */

export function useConverter(initialBase: CurrencyCodeValue) {
  const [base, setBase] = useState(initialBase);
  const [amount, setAmount] = useState(INITIAL_AMOUNT);

  const pressKey = useCallback((key: KeypadKey) => {
    setAmount((current) => applyKeypadKey(current, key));
  }, []);

  const convertFrom = useCallback((currency: CurrencyCodeValue, value: Decimal) => {
    setBase(currency);
    setAmount(toInputAmount(value, currency));
  }, []);

  return { base, amount, pressKey, convertFrom };
}
