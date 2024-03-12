export interface Encrypter {
  encrypt: (subject: string) => Promise<string>
}
