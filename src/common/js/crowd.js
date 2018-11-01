export default function getCro(jud,cur) {
  if(jud === 251){
    localStorage.removeItem('nowCompanyId');
    localStorage.removeItem('nowCompanyName');
    localStorage.removeItem('personnelId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cur.$router.push({ path: '/login' });
    cur.$message.error('您的账户在另一设备登录, 您被挤下线');
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
