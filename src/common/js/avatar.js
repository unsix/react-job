var picLeader = 'http://img-bbsf.6655.la/'
//var picLeader = 'http://bbsf-file.hzxb.net/'
export function getAvatar(pic){
	if(pic == null){
		return 
	}
	
	return picLeader + pic +'?imageView2/1/w/50/h/50'
}
