'use strict'

module.exports = app => {
  if (app.config.env === 'local') {
    app.beforeStart(async () => {
      // await app.model.sync({ force: true })
    })
  }
}
