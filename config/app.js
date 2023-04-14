
// 本地访问域名
// const testUrl = "https://likeshopb2b2c.yixiangonline.com"
const testUrl = "http://demo.coilai.com/api"
// const testUrl = "https://likeshopb2cplus.yixiangonline.com"

//线上域名
const productUrl = ''
const config = {
  baseUrl:  process.env.NODE_ENV == 'production' ? productUrl : testUrl
}

// export default config

module.exports = {
	version: '1.6.1',			// 版本号
	config,
}
