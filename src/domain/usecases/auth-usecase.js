const { MissingParamError } = require('../../utils/errors')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypterSpy, tokenGenerator) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypterSpy = encrypterSpy
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailRepository.load(email)

    if (!user) {
      return null
    }

    const isValid = await this.encrypterSpy.compare(password, user.password)

    if (!isValid) {
      return null
    }

    const accessToken = await this.tokenGenerator.generate(user.id)
    return accessToken
  }
}
