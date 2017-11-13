export function getAvatar(str) {
	if(str.indexOf('jpg') !== -1) {
		return 'http://img-bbsf.6655.la/FnF0MmO7g-WONz-QYU6BsWMTwNR_'
	} else {
		return 'http://img-bbsf.6655.la/' + str
	}
}