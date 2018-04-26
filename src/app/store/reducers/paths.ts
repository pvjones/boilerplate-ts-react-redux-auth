export const SecurityPaths = {
  session: {
    get: () => 'session',
    token: {
      get: () => ['session', 'token'],
    },
    user: {
      get: () => ['session', 'user'],
      id: {
        get: () => ['session', 'user', 'id'],
      },
      username: {
        get: () => ['session', 'user', 'username'],
      },
      firstName: {
        get: () => ['session', 'user', 'firstName'],
      },
      lastName: {
        get: () => ['session', 'user', 'lastName'],
      },
      meta: {
        get: () => ['session', 'user', 'meta'],
      },
    },
  },
}
