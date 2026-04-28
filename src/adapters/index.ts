/**
 * Platform adapter registry.
 *
 * Exports all three adapter instances and a convenience array that can be
 * iterated to perform operations across all supported platforms.
 */

export { BlinkitAdapter, blinkitAdapter } from './BlinkitAdapter';
export { ZeptoAdapter, zeptoAdapter } from './ZeptoAdapter';
export { BigBasketAdapter, bigBasketAdapter } from './BigBasketAdapter';

import { blinkitAdapter } from './BlinkitAdapter';
import { zeptoAdapter } from './ZeptoAdapter';
import { bigBasketAdapter } from './BigBasketAdapter';
import type { PlatformAdapter } from '../types';

/**
 * All supported platform adapters in display order.
 * Use this array when you need to iterate over every platform, e.g. in
 * ComparisonView's `useQueries` call.
 */
export const adapters: PlatformAdapter[] = [
  blinkitAdapter,
  zeptoAdapter,
  bigBasketAdapter,
];
