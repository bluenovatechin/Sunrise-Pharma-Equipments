import { createContext, useContext } from 'react';

/** Lets any button open the site-wide quotation form: openQuote(productName?). */
export const QuoteContext = createContext({ openQuote: () => {} });
export const useQuote = () => useContext(QuoteContext);
