module.exports = {
  port: 8060,
  session:{
    key:"blog",
    secret:'blog',
    maxAge:60000
  },
  mongodb:'mongodb://localhost:27017/upgradeblog'
}