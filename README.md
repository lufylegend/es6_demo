# MAC版本开发流程
打开Terminal，进入工程根目录，然后按照下面流程进行准备

## npm初始化

    npm init

## 安装webpack和babel

    npm install --save-dev webpack babel-core babel-loader babel-preset-react babel-preset-es2015

## 游戏开发
游戏代码入口为assets/application.js，plugin文件夹下代码为引擎相关文件，图片及其他素材需要放到resources文件夹下

## 游戏发布
游戏开发完成之后，执行下面命令可以将es6代码打包为普通的js代码

    npm run build

## 启动本地服务器，9999是端口号，可任意修改
测试时，如果需要游戏webgl有效，则需要启动服务器，下面命令行可以启动一个简单的python服务器

    python -m SimpleHTTPServer 999

## 游戏测试
打开浏览器，输入以下URL，999是上一步中设定的端口号

    http://localhost:999/build/
    
# Windows版本开发流程
稍后更新