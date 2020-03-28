import React from 'react';
import { Button } from 'antd';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';

export default () => (
  <ContentLayoutExpert
    title="Classic Case"
    url="/images/ic_header_classcase.png"
    removeContentStyle
  >
    <div>
      <div className="flex grey-shadow">
        <img src="https://wph-1256148406.cos.ap-shanghai.myqcloud.com/brainselling/65649a1545829.576a7eb99921c.jpg" />
        <div className="flex flex-column">
          <h1>Steven Jackson</h1>
          <h4>North America</h4>
        </div>
      </div>
      <div className="flex">
        <div className="grey-shadow">个人简介</div>
        <div className="grey-shadow">服务标签</div>
        <div className="grey-shadow">服务评价</div>
      </div>
      <div className="grey-shadow">
        <div className="flex flex-justifyBetween flex-align">
          <h1>专家详情</h1>
          <Button type="primary" size="small">
            Save
          </Button>
        </div>
        <div>编辑区域</div>
      </div>
    </div>
  </ContentLayoutExpert>
);
