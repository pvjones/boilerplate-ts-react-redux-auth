const config = {

  dev: {
    api: {
      host: 'http://localhost',
      baseUrl: 'api',
      port: 3000,
    },
  },

  prod: {
    api: {
      host: 'http://localhost',
      baseUrl: 'api',
      port: 3000,
    },
  },

}

export default env => {
  const envType = env || process.env.ENV || 'dev'
  return config[envType]
}
