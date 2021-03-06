import React from 'react';
import './Footer.less';

export default class Footer extends React.Component {
  render() {
    return (
      <div className="footer flex flex-align flex-justifyBetween">
        <div className="ft-l flex flex-justifyCenter">
          <img src="/images/ic_footer_phone.png" />
          <div className="ft-l-t">
            <p>电话咨询</p>
            <div>0532-53232532</div>
            <p>邮箱：lianxinjituan@lxjt.net</p>
            <p>业务时间：周一到周六 9:00-18:00</p>
            <p>联系地址：百盛商务中心#楼</p>
          </div>
        </div>
        <div className="ft-m">
          <div className="flex flex-justifyAround">
            <p>相关链接</p>
            <h1 />
            <h1 />
          </div>
          <div className="flex flex-justifyAround">
            <a className="fz-qingke" href="/aboutUs">
              平台介绍
            </a>
            <a className="fz-qingke" href="/problems">
              常见问题
            </a>
            <a className="fz-qingke" href="/classic">
              经典案例
            </a>
          </div>
          <div className="flex flex-justifyAround">
            <a className="fz-qingke" href="/business">
              业务介绍
            </a>
            <a className="fz-qingke" href="/cooperative">
              合作伙伴
            </a>
            <a className="fz-qingke" href="/regulation">
              条款规定
            </a>
          </div>
          <div className="ft-copy">
            Copyright © 2020 青岛联信商务咨询有限公司 | ICP证: 鲁ICP备xxxxxxxx号-n
          </div>
        </div>
        <div className="ft-r flex flex-justifyCenter">
          <img src="/images/qrcode.png" />
          <img src="/images/qrcode.png" />
        </div>
      </div>
    );
  }
}
