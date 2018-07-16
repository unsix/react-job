// var picLeader = 'http://img-bbsf.6655.la/'
var str = process.env.NODE_ENV
var picLeader = ''
str !== 'production' ? picLeader = 'http://bbsf-test-file.hzxb.net/' : picLeader = 'http://bbsf-file.hzxb.net/'
export function getPic(pic){
	if(pic == null){
		return
	}

	return picLeader + pic + '?imageslim'
}
