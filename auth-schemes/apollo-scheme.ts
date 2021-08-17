import loginUserGql from '../gql/loginUser.gql';
import meGql from "~/graphql/queries/me.gql";

export default class ApolloScheme {


  constructor(auth, options) {
    this.$auth = auth
    this.$apollo = auth.ctx.app.apolloProvider.defaultClient
    this.$apolloHelpers = auth.ctx.app.$apolloHelpers
    this._name = options._name
  }



  async login({ data, tokenKey = 'token', userKey = 'user' }) {
    return this.$apollo
      .mutate({
        mutation: loginUserGql,
        variables: data,
      })
      .then(({ data }) => Promise.resolve(Object.values(data)[0]))
      .then(data => this.setUserToken(data.token))
  }

  setToken(tokenValue) {
    return this.$apolloHelpers.onLogin(tokenValue)
      .then(() => this.$auth.setToken(this._name, tokenValue))
  }

  setUser(user) {
    return this.$auth.setUser(user)
  }

  setUserToken(tokenValue) {
    return this.setToken(tokenValue).then(() => this.fetchUser())
  }
  check() {
    let status = !!this.$auth.getToken(this._name) && this.$auth.getToken(this._name) !== this._name
    return status;
  }
  fetchUser() {
    if (!this.check()) {
      return Promise.reject(false)
    }

    return this.$apollo.query({ query: meQuery })
      .then(({ data }) => Promise.resolve(Object.values(data)[0]))
      .then(data => this.setUser(data))
  }

  logout() {
    return this.$apolloHelpers.onLogout()
      .then(() => this.reset())
  }

  reset() {
    return this.setToken(this._name, null).then(() => this.setUser(null))
  }
}