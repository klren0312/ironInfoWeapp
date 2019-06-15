class Storage {
  /**
   * 构造器
   * constructor
   */
  constructor () {
    this._isSupport = true
    try {
      const test = 'localStorage support test'
      window.localStorage.setItem('test', test)
      window.localStorage.removeItem('test')
    } catch (e) {
      this._isSupport = false
    }
  }

  /**
   * 获取时间戳
   */
  static get timestamp() {
    return new Date() / 1000
  }
  /**
   * 判断是否失效
   * @param {Object} entity 存储实例
   */
  static __isExpired(entity) {
    if(!entity) return true // 无实例, 即失效
    return Storage.timestamp - (entity.timestamp + entity.expired_second) >= 0
  }

  /**
   * 存入
   * @param {String} key 键
   * @param {String} value 值
   * @param {Number} expired_second 过期时间 单位秒
   */
  set (key, value, expired_second) {
    if (!this._isSupport) {
      return null
    }

    // 存储实例
    const entity = {
      timestamp: Storage.timestamp,
      expired_second,
      key,
      value
    }
    window.localStorage.setItem(key, JSON.stringify(entity))
    return this
  }
  
  /**
   * 读取
   * @param {String} key 键
   */
  get (key) {
    if (!this._isSupport) {
      return null
    }

    let entity
    try {
      entity = window.localStorage.getItem(key)
      if (entity) {
        entity = JSON.parse(entity)
      } else {
        return null
      }
    } catch (err) {
      console.error(err)
      return null
    }
    //没有设置过期时间, 直接返回值
    if (!entity.expired_second) return entity.value

    // 过期, 删除存储, 返回 null
    if (Storage.__isExpired(entity)) {
      this.remove(key)
      return null
    } else {
      return entity.value
    }
  }

  /**
   * 删除存储
   * @param {String} key 键
   */
  remove (key) {
    if (!this._isSupport) {
      return null
    }

    try {
      window.localStorage.removeItem(key)
    } catch (err) {
      console.error(err)
    }
    return this
  }

  /**
   * 清空存储
   */
  clear () {
    if (!this._isSupport) {
      return null
    }

    try {
      window.localStorage.clear()
    } catch (err) {
      console.error(err)
    }
    return this
  }
}

export default new Storage()