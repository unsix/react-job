项目构建脚手架create-react-app,react全家桶+node.js+mongodb

安装与运行程序
克隆项目

> $ git clone hhttps://github.com/unsix/react-job.git
分别进入react-job目录和server目录下安装依赖包

> $ npm install
在server目录下启动后台服务 nodemon server.js

> $ npm  start
在react目录下启动webpack服务
执行完命令后，打开浏览器 http://localhost:3000/运行项目，后台服务端口为 9093

后台接口（jsonp请求）

http://localhost:9093/user/login 登入

http://localhost:9093/user/register 注册

http://localhost:9093/user/update 更新信息

http://localhost:9093/user/getmsglist 聊天信息列表获取

http://localhost:9093/user/info  验证登入权限
