export class UserModel {
  static async getAll () {
    return 'All users'
  }

  static async getById ({ id }) {
    return `User ${id}`
  }

  static async create ({ user }) {
    return `User ${user} created`
  }

  static async delete ({ id }) {
    return `User ${id} deleted`
  }

  static async update ({ id, user }) {
    return `User ${id} updated`
  }
}
