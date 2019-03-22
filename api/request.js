let header = {}
export default function request (options) {
  return new Promise((resolve, reject) => {
		uni.request({
			...options,
			success: (res) => {
				const data = res.data
				if(data.code === 200) {
					 resolve(data)
				}
				else if(data.code === 401) {
					uni.redirectTo({
						url: '/pages/auth/auth'
					})
					resolve(data)
				} else {
					reject(data)
				}
			}
		})
	})
}