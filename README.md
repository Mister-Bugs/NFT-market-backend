# 服务

1. IPFS 服务，有两个端口：8080 和 5001
2. hardhat node，提供以太坊区块链服务
3. Remix：连接到Remix网页，端口655xx，不用关心端口
4. 后端：node，端口在 3000 有两个接口，一个是上传文件，一个是提交NFT上架数据；
5. 前端：3001，对合约接口和后端接口

# 后端搭建流程

NFT后端功能：只接收用户的图片，把图片上传到IFDS，将返回的metedata，放在ERC721的URI里面

1. 实现返回主页功能；
   1. 项目初始化：npm init -y
   2. 安装 express 和 ejs：npm install express --save：express：路由、中间件、模板引擎（`ejs`或者`pug`），安装`ejs`；
   3. 先在根目录写一个js文件，app.js，导入包并设置ejs，使用express构建后端，然后写一个get测试根目录；
   4. 启动后端node.js命令：node app.js；
   5. 将后端设置为热更新方式，安装 nodemon，然后将package.json中的scripts中添加 "start": "nodemon app.js" 即可，然后 npm run start 即可；
   6. 页面数据的获取（body-parser）和文件的获取（npm i express-fileupload），相当于Java的jsp相关；去npmjs官网搜索，可以查看每个包当前的流行程度；npm i 
2. 将文件上传到 IPFS，因为上传文件的时候需要在后端保存一下才能上传到 IPFS，所以需要后端将文件在本地暂存一下才能继续上传 IPFS；
   1. 在本地搞一个文件夹，将前端收集到的文件放到文件中去，使用库 fs ，node自带的哈像是
3. 上传MetaData，在 ipfs-uploader.js 中进行操作
   1. 导入 kubo-rpc-client 库，实现上传文件和 json 的函数；
   2. 安装 wsl ，[【开发工具】适用于Windows的Linux子系统一一WSL安装使用教程-CSDN博客](https://blog.csdn.net/dl962454/article/details/129757917)
   3. 下载包，去npfs的官网上去找，用浏览器先下下来，然后再移动到wsl里面，wsl在网络里，安装，启动：npfs daemon
   4. 用配置文件的包：dotenv，然后新建一个.env文件，配置配置文件信息，然后将其添加到.gitignore中，防止私密信息上传
   5. 测试功能，前端上传文件，根据ipfs返回的hash，在路径 http://localhost:8080/ipfs/hash值/文件全名中查找
4. mint一个NFT
   1. 前端使用ethers.js库，编写用例
   2. 本地起一个以太坊区块链 npx hardhat node
   3. 将 ERC721合约部署到hardhat的环境中
   4. 导入ABI、合约
   5. 上传mint之后调用合约

# 前端

熟悉 React

- install：npm i -g create-react-app
- 创建项目：npx create-react-app marketplace-frontend

## 入门

例子：

~~~react
import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function MyComponent({ name }) {
  const [count, setCount] = useState(0);
  const nameChange = useEffect(() => {
    console.log('操作者发生变化，新操作者' + name);
  }, [name])

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>{name} 点击了 {count} 次</p>
      <button onClick={incrementCount}>点</button>
    </div>
  );
}


function App() {
  // 状态：存储输入的名称
  const [name, setName] = useState('');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <MyComponent name={name} />
        </div>

        <div>
          {/* 输入框 */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
      </header>
    </div>
  );
}

export default App;

~~~

1. 组件：一般写一个function  组件名称{ return HTML }，你要是引用ta的话，就直接将这个组件名称放在

2. JSX：在js里面写HTML，直接返回：新的写前端的一种方式，基于逻辑的，HTML和css都是嵌入在js中的

3. 状态管理

   1. 本质上是 React 有一个基类 Component ，就是Java里面的Object一样，成员变量、结构体（初始化成员变量）和setXXX()函数，当setXXX时就会对成员变量进行修改，成员变量和setXXX函数需要自己指定

      ~~~react
      import React, { Component } from 'react';
      
      class MyComponent extends Component {
        constructor(props) {
          super(props);
          this.state = {
            count: 0
          };
        }
      
        incrementCount() {
          this.setState({ count: this.state.count + 1 });
        }
      
        render() {
          return (
            <div>
              <p>Count: {this.state.count}</p>
              <button onClick={() => this.incrementCount()}>Increment</button>
            </div>
          );
        }
      }
      
      //在其他组件的HTML中调用该组件即可：
      //        <div>
      //          <MyComponent name="中本聪" />
      //        </div>
      
      ~~~

      使用函数表达式方式：useState(0)初始化；count成员变量；setCount()函数

      ~~~react
      import React, { useState } from 'react';
      
      function MyComponent() {
        const [count, setCount] = useState(0);
      
        const incrementCount = () => {
          setCount(count + 1);
        };
      
        return (
          <div>
            <p>Count: {count}</p>
            <button onClick={incrementCount}>Increment</button>
          </div>
        );
      }
      
      ~~~

4. 属性传递：父组件向子组件传递值，谁点击了按钮几次，父组件输入名字，子组件记录点击次数

5. 其他的常用函数

   1. 当一个值发生改变的时候，去渲染页面；
   2. 需要引用：useEffect，相当于一个钩子函数（回调函数），实现的功能是当名字发生改变的时候，打印出来；



## 构造流程

## 导航条钱包地址页面

1. 先添加一个连接钱包的导航条，Navbar
2. 检查浏览器是否安装了钱包插件，判断 window.ethereum 是否为空，得到目前钱包的区块链地址
3. 定义变量，目前小狐狸中的钱包地址
4. Navbar，点击绑定钱包，来绑定地址，值的传递
5. 切换地址时候，前端中加载的地址发生动态改变



## 挖NFT后上传市场页面

1. 页面就是后端实现的前端页面一样，只不过增加了一个取消按钮，取消后所有属性回归到初始状态，其他逻辑没有变
2. 需要在装两个库：react-router-dom，路由上传完成后跳转到上传完成的接口；axios：前端访问后端接口的组件，相当于ajax





# 使用流程

1. 项目部署
   1. 启动 本地 Hardhat 以太坊环境
   2. 部署合约，连接remix 部署三个合约
   3. 部署后端，用于上传图片后 mint NFT
   4. 
2. 先连接钱包
3. 通过市场进行 mint NFT；可以 mint 多个，可以在ERC721合约中查询
4. 上架，本质上就是将自己的NFT转移到Market合约中，在这个过程会触发Market合约的 onERC721Received 函数，最终保存在Market合约的账本上
   1. 授权，将自己要出售的NFT授权给Market合约，可以先通过 balance 查询出自己有几个，然后 tokenOfOwnerBylndex ，查询出NFT的TokenID，然后将 TokenId 授权给Market合约；
   2. 转账，目前使用的ERC721中的 safeTransferFrom 四个参数的函数，最终一个参数填写价格（这个价格是编码后的）
5. 购买，用 BBB 买，购买即可

