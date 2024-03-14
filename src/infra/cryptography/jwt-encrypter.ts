import { type Encrypter } from '@/domain/player/application/cryptography/encrypter'
import 'dotenv/config'
import { injectable } from 'inversify'
import { sign } from 'jsonwebtoken'

@injectable()
export class JwtEncrypter implements Encrypter {
  async encrypt (subject: string): Promise<string> {
    const accessToken = sign({}, String(process.env.JWT_SECRET), {
      subject: String(subject),
      expiresIn: String(process.env.JWT_EXPIRATION)
    })

    return accessToken
  }
}
