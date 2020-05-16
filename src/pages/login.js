import React from 'react';
import intl from 'react-intl-universal';
import LoginLayout from '../layouts/LoginLayout';
import { Tabs, Form, Input, Button, Checkbox, message, Modal } from 'antd';
import { MailOutlined, LockOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import router from 'next/router';
import './login.less';
const { TabPane } = Tabs;

class Login extends React.Component {
  static async getInitialProps({ req, query }) {
    return {
      activeTab: query.register ? 'register' : 'login',
    };
  }

  state = {
    lang: '',
    agreeRegister: false,
    agreementVisible: false,
  };

  loginFormRef = React.createRef();
  registerFormRef = React.createRef();
  //注册昵称
  goToNickname = () => {
    // Router.push('/registerNickname');
  };
  goToMap = () => {
    // Router.push('/map');
  };

  login = () => {
    const { password, userName } = this.loginFormRef.current.getFieldsValue();
    this.props.dispatch({
      type: 'user/login',
      payload: { password, userName },
    });
  };

  register = () => {
    if (!this.state.agreeRegister) {
      message.warn('请您认真阅读并同意《注册协议》');
      // this.setState({
      //   agreementVisible: true,
      // });
      return;
    }

    const { password, email } = this.registerFormRef.current.getFieldsValue();

    this.props.dispatch({
      type: 'user/register',
      payload: { password, email },
    });
  };

  changLang = () => {
    localStorage.lang = localStorage.lang == 'en-US' ? 'zh-CN' : 'en-US';
    window.location.reload();
  };

  onChangeTab = (value) => {
    if (value === 'login') {
      router.replace('/login');
    }
    if (value === 'register') {
      router.replace('/login?register=1');
    }
  };

  componentDidMount = () => {
    this.setState({
      lang: intl.determineLocale({
        urlLocaleKey: 'lang',
        localStorageLocaleKey: 'lang',
      }),
    });
  };

  render() {
    const { activeTab, registerValidateStatus } = this.props;
    const { agreeRegister, agreementVisible } = this.state;

    return (
      <LoginLayout>
        <Tabs activeKey={activeTab} onChange={this.onChangeTab}>
          {/* 注册 */}
          <TabPane tab="注册" key="register">
            <Form
              ref={this.registerFormRef}
              name="register"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={this.register}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱' },
                  { min: 1, max: 30, message: '邮箱为1-30个字符' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 8, max: 20, message: '密码大于8位且小于20位' },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="请设置密码"
                />
              </Form.Item>
              <Form.Item
                name="confirm-password"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请再次输入您的密码' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('两次输入密码不一致');
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<CheckSquareOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="请确认密码"
                />
              </Form.Item>
              <div className="agreement-check">
                <Checkbox
                  checked={agreeRegister}
                  onChange={(e) => this.setState({ agreeRegister: e.target.checked })}
                />
                &nbsp;&nbsp; 我已认真阅读并同意
                <a onClick={() => this.setState({ agreementVisible: true })}>《注册协议》</a>
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  立即注册
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          {/* 登录 */}
          <TabPane tab="登录" key="login">
            <Form
              ref={this.loginFormRef}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={this.login}
            >
              <Form.Item
                name="userName"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱' },
                  { min: 1, max: 30, message: '邮箱为1-30个字符' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="请输入邮箱"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 8, max: 20, message: '密码大于8位且小于20位' },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="请输入密码"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  立即登录
                </Button>
              </Form.Item>
              <Form.Item>
                <a className="login-form-forgot" href="/retrievePWD">
                  找回密码
                </a>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>

        {/* 注册协议 */}
        <Modal
          visible={agreementVisible}
          width="40%"
          title={<strong>免责声明</strong>}
          okText="同意"
          cancelText="关闭"
          cancelButtonProps={{
            type: 'danger',
          }}
          onOk={() => this.setState({ agreeRegister: true, agreementVisible: false })}
          onCancel={() => this.setState({ agreementVisible: false })}
        >
          <div className="agreement-doc-container">
            访问者在浏览本站信息、注册本站会员或接受本网站服务之前，请务必仔细阅读本条款并同意本声明。访问者访问本网站的行为以及通过各类方式利用本网站的行为，都将被视作是对本声明全部内容的无异议的认可；如有异议，请立即跟本网站协商，并取得本网站的书面同意意见。
            <br />
            第一条
            访问者在从事与本网站相关的所有行为（包括但不限于访问浏览、利用、转载、宣传介绍）时，必须以善意且谨慎的态度行事；访问者不得故意或者过失的损害或者弱化本网站的各类合法权利与利益，不得利用本网站以任何方式直接或者间接的从事违反中国法律、国际公约以及社会公德的行为，且访问者应当恪守下述承诺：
            <br />
            1、传输和利用信息符合中国法律、国际公约的规定、符合公序良俗；
            <br />
            2、不将本网站以及与之相关的网络服务用作非法用途以及非正当用途；
            <br />
            3、不干扰和扰乱本网站以及与之相关的网络服务；
            <br />
            4、遵守与本网站以及与之相关的网络服务的协议、规定、程序和惯例等。
            <br />
            <br />
            第二条
            除我们另有明确说明或者中国法律有强制性规定外，本网站用户原创的作品，本网站及作者共同享有版权，其他网站及传统媒体如需使用，须取得本网站的书面授权，未经授权严禁转载或用于其它商业用途。
            <br />
            第三条
            访问者在本网站发布任何作品（包括但不限于各类文章、案例、咨询以及评论等），须遵守本网站制定的规章制度以及发布说明，如违反发布，则相关责任发布者自负，与华律网无关。
            <br />
            第四条
            本网站各类作品（包括但不限于各类文章、评论、专家答复、公众留言等）仅代表作者本人的观点，不代表本网站的观点和看法，与本网站立场无关，因其使用国际风险平台网络服务而产生的一切后果由用户自己承担，国际风险平台不承担任何相关责任。
            <br />
            第五条
            本网站有权将在本网站内发表的作品用于其他用途，包括网站、电子杂志等，作品有附带版权声明者除外。
            <br />
            第六条
            未经国际风险平台和作者共同同意，其他任何机构不得以任何形式侵犯其作品著作权，包括但不限于：擅自复制、链接、非法使用或转载，或以任何方式建立作品镜像。
            <br />
            第七条
            本网站所刊载的各类形式（包括但不仅限于文字、图片、图表）的作品仅供参考使用，并不代表本网站同意其说法或描述。对于访问者根据本网站提供的信息所做出的一切行为，除非另有明确的书面承诺文件，否则本网站不承担任何形式的责任。
            <br />
            第八条
            当本网站以链接形式推荐其他网站内容时，本网站并不对这些网站或资源的可用性负责，且不保证从这些网站获取的任何内容、产品、服务或其他材料的真实性、合法性，对于任何因使用或信赖从此类网站或资源上获取的内容、产品、服务或其他材料而造成（或声称造成）的任何直接或间接损失，本网站均不承担任何责任。
            <br />
            第九条
            当政府部门、司法机关等依照法定程序要求本网站披露个人资料时，本网站将根据执法单位之要求或为公共安全之目的提供个人资料。在此情况下之任何披露，本网站均得免责。
            <br />
            第十一条
            由于用户将个人密码告知他人或与他人共享注册账户，由此导致的任何个人资料泄露，本网站不负任何责任。
            <br />
            第十二条
            任何由于计算机问题、黑客攻击、计算机病毒侵入或发作、因政府管制而造成的暂时性关闭等影响网络正常经营的不可抗力而造成的个人资料泄露、丢失、被盗用或被窜改等，本网站均得免责。
            <br />
            第十三条
            由于与本网站链接的其他网站所造成之个人资料泄露及由此而导致的任何法律争议和后果，本网站均得免责。
            <br />
            第十四条
            本网站若因线路及非本公司控制范围外的硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，本网站不负任何责任。
            <br />
            第十五条
            除本网站注明之服务条款外，其他一切因使用本网站而引致之任何意外、疏忽、诽谤、版权或知识产权侵犯及其所造成的损失（包括因下载而感染电脑病毒），本网站概不负责，亦不承担任何法律责任。
            <br />
            第十六条
            若因本网站产生任何诉诸于诉讼程序的法律争议，将以本网站所有者所在的法院为管辖法院，除非中国法律对此有强制性规定。
            <br />
            第十七条 本网站之声明以及其修改权、更新权及最终解释权均属青岛联信商务咨询有限公司所有。
            <br />
            第十八条 兹有以上网站法律声明于2020年5月1日公布并生效，访问者须仔细阅读并同意本声明。
            <br />
          </div>
        </Modal>
      </LoginLayout>
    );
  }
}

export default connect(({ user }) => ({}))(Login);
