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
 * Estado do conversor: moeda ativa e valor digitado.
 *
 * `pressKey` aplica uma tecla do teclado ao valor (limites em
 * `applyKeypadKey`). `convertFrom` troca a moeda ativa e já preenche o
 * valor convertido, arredondado nas casas decimais da nova moeda.
 *
 * @example
 * ```tsx
 * const { base, amount, pressKey, convertFrom } = useConverter(primaryCurrency);
 * ```
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
