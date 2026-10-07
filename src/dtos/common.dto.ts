import { z } from 'zod';

export const currencyCodeSchema = z.string().regex(/^[A-Z]{3}$/);

export const dateOnlySchema = z.iso.date();

export const dateTimeSchema = z.iso.datetime({ offset: true });
