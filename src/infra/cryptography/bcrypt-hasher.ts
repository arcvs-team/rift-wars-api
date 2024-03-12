import { type HashComparer } from '@/domain/application/cryptography/hash-comparer'
import { type HashGenerator } from '@/domain/application/cryptography/hash-generator'
import { compare, hash } from 'bcrypt'
import { injectable } from 'inversify'

@injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly HASH_SALT_LENGTH = 8

  async compare (plain: string, hash: string): Promise<boolean> {
    const isValid = await compare(plain, hash)
    return isValid
  }

  async hash (plain: string): Promise<string> {
    const hashedValue = await hash(plain, this.HASH_SALT_LENGTH)
    return hashedValue
  }
}
