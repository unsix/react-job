export default function getCro(jud,cur) {
  if(jud === 251){
    localStorage.removeItem('nowCompanyId');
    localStorage.removeItem('nowCompanyName');
    localStorage.removeItem('personnelId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cur.$router.push({ path: '/login' });
    cur.$message.error('您的帐号在别处登录，请等3分钟后重新登陆');
  } else if(jud == 252){
    localStorage.removeItem('nowCompanyId');
    localStorage.removeItem('nowCompanyName');
    localStorage.removeItem('personnelId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cur.$router.push({ path: '/login' });
    cur.$message.error('用户会话已过期，请重新登录');
  }
}
