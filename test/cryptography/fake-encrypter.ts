import { type Encrypter } from '@/domain/application/cryptography/encrypter'

export class FakeEncrypter implements Encrypter {
  async encrypt (subject: string): Promise<string> {
    return JSON.stringify(subject)
  }
}
