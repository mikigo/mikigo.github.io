import './index.css';

import Theme from 'rspress/theme';

const myStyle = {
  fontSize: '2em',
  fontWeight: 'bold',
  center: true,
}

const Layout = () => (
    <Theme.Layout
        afterHero={
          <div>
            <h1 align="center"  style={myStyle}>
              我创建的开源项目
            </h1>
          </div>
        }
        afterOutline={
            <div style={{fontSize: "0.8em", color: "gray"}}>
                ----<br />阅读量 <span id="busuanzi_page_pv" style={{color: "#1cc088"}}>加载中...</span> 次 <br />
            </div>
        }
    />
);

export default {
  ...Theme,
  Layout,
};

export * from 'rspress/theme';