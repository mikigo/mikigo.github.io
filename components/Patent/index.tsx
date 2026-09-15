const patents = [
  {
    patent_num: 'CN113190455B',
    title: '一种元素定位方法及计算设备',
    file: 'CN113190455B.pdf',
  },
  {
    patent_num: 'CN113609028A',
    title: '一种页面测试方法、计算设备及可读存储介质',
    file: 'CN113609028A.pdf',
  },
  {
    patent_num: 'CN113821264B',
    title: '操作系统安装控制方法、安装控制系统及计算设备',
    file: 'CN113821264B.pdf',
  },
  {
    patent_num: 'CN113821438A',
    title: '一种应用响应性能测试方法、系统及计算设备',
    file: 'CN113821438A.pdf',
  },
  {
    patent_num: 'CN114419393B',
    title: '一种应用控件的标注方法、标注装置及计算设备',
    file: 'CN114419393B.pdf',
  },
  {
    patent_num: 'CN114880235A',
    title: '一种测试用例执行方法、计算设备及存储介质',
    file: 'CN114880235A.pdf',
  },
];

export function PatentGrid() {
  return (
    <div className="patent-section">
      <div className="patent-section__header">
        <h2 className="patent-section__title">专利成果</h2>
        <p className="patent-section__desc">国家发明专利</p>
      </div>
      <div className="patent-grid">
        {patents.map((p) => (
          <a
            key={p.patent_num}
            href={`/patent/${p.file}`}
            target="_blank"
            className="patent-card"
            rel="noreferrer"
          >
            <div className="patent-card__header">
              <span className="patent-card__number">{p.patent_num}</span>
              <svg
                className="patent-card__arrow"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="patent-card__title">{p.title}</h3>
          </a>
        ))}
      </div>
    </div>
  );
}