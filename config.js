module.exports = {
  port: parseInt(process.env.PORT) || 3000,
  dbConnection: process.env.DATABASE_URL || 'postgres://localhost:5432/north_nile'
};
