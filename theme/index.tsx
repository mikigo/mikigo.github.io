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
        afterDocContent={
            <div align="left" style={{fontSize: "0.8em", color: "gray"}}>
                声明：本站所有文章，均为本站原创发布。任何个人或组织，在未征得本站同意时，禁止复制、盗用、采集、发布本站内容到任何网站、书籍等各类媒体平台。
                <a href="https://github.com/mikigo/" style={{color: "#1cc088"}}>-- mikigo</a>
            </div>
        }
    />
);

export default {
  ...Theme,
  Layout,
};

export * from 'rspress/theme';