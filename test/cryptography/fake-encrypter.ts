import { type Encrypter } from '@/domain/player/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt (subject: string): Promise<string> {
    return JSON.stringify(subject)
  }
}
