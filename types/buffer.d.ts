// type augmentation to fix Buffer compatibility between bun and node.js crypto
// this is a known issue where bun's type definitions for ArrayBufferView
// are incompatible with node.js crypto type definitions
//
// at runtime, Buffer is compatible with all these types, but typescript's
// strict type checking sees an incompatibility between ArrayBuffer and SharedArrayBuffer
// in the generic parameter of Uint8Array
//
// this helper provides a type-safe way to work with Buffer in crypto operations

declare global {
  /**
   * type-safe helper to convert Buffer to a type compatible with node.js crypto functions.
   * Buffer extends Uint8Array at runtime, so this is safe.
   */
  function toUint8Array<T extends Uint8Array>(buffer: T): Uint8Array<ArrayBuffer>;
}

export {};
