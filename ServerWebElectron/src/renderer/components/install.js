import Vue from 'vue'
import MyTitle from './MyTitle'
import whiteSpace from './WhiteSpace'
const Components  = [
  MyTitle,
  whiteSpace
]

Components.map(c => {
  Vue.component(c.name, c)
})