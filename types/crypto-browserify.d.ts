/// <reference types="node" />

declare module "crypto-browserify" {
  import { Hash, Hmac, Cipher, Decipher, Signer, Verifier } from "crypto";

  export function createHash(algorithm: string): Hash;
  export function createHmac(algorithm: string, key: string | Buffer): Hmac;
  export function createCipher(
    algorithm: string,
    password: string | Buffer
  ): Cipher;
  export function createDecipher(
    algorithm: string,
    password: string | Buffer
  ): Decipher;
  export function createSign(algorithm: string): Signer;
  export function createVerify(algorithm: string): Verifier;

  export function publicEncrypt(publicKey: string, buffer: Buffer): Buffer;
}
