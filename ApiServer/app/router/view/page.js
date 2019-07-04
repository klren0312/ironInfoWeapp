'use strict'

module.exports = app => {
  const { controller, router } = app
  router.get('/', controller.view.page.name)
}
