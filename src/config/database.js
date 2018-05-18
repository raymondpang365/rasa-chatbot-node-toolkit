const getDatabaseConfig = (environment) => {
  const configs = {
    'development': {
      db: {
        user: process.env.DB_USER,
        password: process.env.DB_USER_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: "postgres"
      }
    },
    'production': {
      db: {
        user: process.env.DB_USER,
        password: process.env.DB_USER_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: "postgres"
      }
    }
  };

  return configs[environment];
};

export default getDatabaseConfig;
