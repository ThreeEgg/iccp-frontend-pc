/*
 * @Descripttion:
 * @version:
 * @Author: 毛翔宇
 * @Date: 2020-03-19 14:11:19
 * @LastEditors: 毛翔宇
 * @LastEditTime: 2020-04-07 18:13:39
 * @FilePath: \PC端-前端\src\modules\NIM\components\CaseInfo.js
 */
import React, { createRef } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Layout, Form, Input, Button, message } from 'antd';
const { TextArea } = Input;
const { Sider } = Layout;
import PropTypes from 'prop-types';
class CaseInfo extends React.Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    canSave: PropTypes.bool,
    userInfo: PropTypes.object,
    myInfo: PropTypes.object,
  };

  static defaultProps = {
    canSave: false,
    collapsed: true,
    userInfo: {},
    myInfo: {},
  };

  state = {
    clientUserId: '',
    expertUserId: '',
    isEdit: false,
    caseInfo: {},
    deleteFileIndex: null,
  };
  // 表单
  formRef = createRef();

  // 进入该页面，文档被挂载
  async componentDidMount() {
    this.initCaseInfo()
  }
  componentDidUpdate = (prevProps, prevState) => {
    // if (prevProps.collapsed !== this.props.collapsed) {
    //   this.setState({
    //     collapsed,
    //   });
    // }
    if (prevProps.userInfo !== this.props.userInfo) {
      this.initCaseInfo()
    }
  };

  initCaseInfo = () => {
    const form = this.formRef.current;
    let clientUserId = ''
    let expertUserId = ''
    let expertUserName = ''
    if (this.props.myInfo.type === 'user' || this.props.myInfo.type === 'guest') {
      clientUserId = this.props.myInfo.userId
    }
    else if (this.props.myInfo.type === 'expert') {
      expertUserId = this.props.myInfo.userId
      expertUserName = this.props.myInfo.name
    }

    if (this.props.userInfo.userType === 'user' || this.props.userInfo.userType === 'guest') {
      clientUserId = this.props.userInfo.userId
    }
    else if (this.props.userInfo.userType === 'expert') {
      expertUserId = this.props.userInfo.userId
      expertUserName = this.props.userInfo.name
    }
    this.setState({
      clientUserId,
      expertUserId,
    })
    if (clientUserId && expertUserId) {
      this.props.dispatch({
        type: 'chat/getCaseInfo',
        clientUserId,
        expertUserId,
        callback: (res) => {
          if (res.code === '0') {
            res.data.clientUserId = clientUserId;
            res.data.expertUserId = expertUserId;
            res.data.expertUserName = expertUserName;
            form.setFieldsValue(res.data)
            this.setState({
              caseInfo: res.data
            })
          } else {
            // message.error(res.errorInfo);
          }
        }
      });
    }
  };

  replaceFile = (index) => {
    let ipt = this.refs.fileToSent;
    ipt.click()
    this.setState({
      deleteFileIndex: index,
    });
  };

  deleteFile = (index) => {
    let caseInfo = this.state.caseInfo;
    caseInfo.iccpCaseEnclosureList[index].isValid = 0;
    this.setState({
      caseInfo,
    });
  };

  downloadCaseBatch = () => {
    let caseId = this.state.caseInfo.caseId
    // let caseId = '39ffc00816344654969da7825ee3fb46'
    if (caseId) {
      this.props.dispatch({
        type: 'chat/downloadCaseBatch',
        caseId,
        callback: (res) => {
          console.log(res);
          const blobUrl = window.URL.createObjectURL(res)
          const eleLink = document.createElement('a')
          eleLink.download = '案件附件.zip'
          eleLink.style.display = 'none'
          eleLink.href = blobUrl
          // 触发点击
          document.body.appendChild(eleLink)
          eleLink.click()
          // 然后移除
          document.body.removeChild(eleLink)
        }
      });
    }

  };

  saveCaseInfo = async () => {
    const form = this.formRef.current;
    try {
      if (this.state.isEdit) {
        const values = await form.validateFields();
        this.props.dispatch({
          type: 'chat/saveCaseInfo',
          extIccpCase: this.state.caseInfo,
          callback: (res) => {
            if (res.code === '0') {
              this.setState({
                isEdit: false,
              });
              this.props.dispatch({
                type: 'chat/getCaseInfo',
                clientUserId: this.state.clientUserId,
                expertUserId: this.state.expertUserId,
                callback: (res) => {
                  if (res.code === '0') {
                    this.setState({
                      caseInfo: res.data
                    })
                  } else {
                    // message.error(res.errorInfo);
                  }
                }
              });
            } else {
              // message.error(res.errorInfo);
            }
          },
        })
      } else {
        this.setState({
          isEdit: true,
        });
      }
    } catch (errorInfo) {
    }
  };

  addFile = () => {
    let caseInfo = this.state.caseInfo;
    caseInfo.iccpCaseEnclosureList = caseInfo.iccpCaseEnclosureList || []
    let ipt = this.refs.fileToSent;
    if (ipt.value) {
      let file = ipt.files[0]
      // 大于50Mb不可上传
      if(file.size>52428800){
        message.error('上传文件不要大于50Mb');
        return
      }
      this.props.dispatch({
        type: 'chat/fileUpload',
        clientUserId: this.state.clientUserId,
        expertUserId: this.state.expertUserId,
        uploadUserId: this.state.expertUserId,
        file,
        fileName: file.name,
        fileType: 1,
        callback: (res) => {
          if (res.code === '0') {
            caseInfo.iccpCaseEnclosureList.push(res.data)
            this.setState({
              caseInfo,
            });
            if (this.state.deleteFileIndex !== null) {
              caseInfo.iccpCaseEnclosureList[this.state.deleteFileIndex].isValid = 0;
              this.setState({
                caseInfo,
                deleteFileIndex: null,
              });
            }
          } else {
            // message.error(res.errorInfo);
          }
        },
      })
    }
  };

  render() {
    const { caseInfo, isEdit } = this.state;
    const { collapsed, toggleCaseInfo, canSave } = this.props;
    return (
      <Sider
        theme='light'
        width='280'
        collapsed={collapsed}
        collapsedWidth={0}
        collapsible={true}
        defaultCollapsed={true}
        trigger={null}
        className='case-info'
      >
        <div className='case-header'>
          <Button className='csae-back' type="primary" onClick={toggleCaseInfo}>
            返回消息列表
      </Button>
          {canSave &&
            <Button className='csae-save' type="primary" onClick={this.saveCaseInfo}>{isEdit ? '保存' : '编辑'}</Button>
          }
        </div>
        <Form name="caseForm" className="case-form" ref={this.formRef} layout="vertical">
          <div className='form-title'> 案件信息表 </div>
          {caseInfo.updateTime && <div className='form-title-2'> 最后更新 {moment(new Date(caseInfo.updateTime)).format('YYYY/MM/DD HH:mm')}</div>}
          <div className='form-title-2'> 法务专家 {caseInfo.expertUserName}</div>
          <div className='form-title-3'> 案件基本信息 </div>
          <Form.Item label={`债权人`} name="creditor" rules={[{ required: false, message: '请输入债权人!' }]}>
            <Input
              disabled={!canSave || !isEdit}
              placeholder="请输入债权人"
              value={caseInfo.creditor}
              onChange={e => {
                caseInfo.creditor = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`公司名称`} name="companyName" rules={[{ required: false, message: '请输入公司名称!' }]}>
            <TextArea
              disabled={!canSave || !isEdit}
              rows={3}
              placeholder="请输入公司名称"
              value={caseInfo.companyName}
              onChange={e => {
                caseInfo.companyName = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            > {caseInfo.companyName} </TextArea>
          </Form.Item>
          <Form.Item label={`公司地址`} name="companyAddress" rules={[{ required: false, message: '请输入公司地址!' }]}>
            <TextArea
              disabled={!canSave || !isEdit}
              rows={3}
              placeholder="请输入公司地址"
              value={caseInfo.companyAddress}
              onChange={e => {
                caseInfo.companyAddress = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`国家`} name="country" rules={[{ required: false, message: '请输入国家!' }]}>
            <Input
              disabled={!canSave || !isEdit}
              placeholder="请输入国家"
              value={caseInfo.country}
              onChange={e => {
                caseInfo.country = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`联系方式`} name="contactInformation" rules={[{ required: true, message: '请输入联系方式!' }]}>
            <Input
              disabled={!canSave || !isEdit}
              placeholder="请输入联系方式"
              value={caseInfo.contactInformation}
              onChange={e => {
                caseInfo.contactInformation = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`债务人`} name="obligor" rules={[{ required: true, message: '请输入债务人!' }]}>
            <Input
              disabled={!canSave || !isEdit}
              placeholder="请输入债务人"
              value={caseInfo.obligor}
              onChange={e => {
                caseInfo.obligor = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`国家/地区`} name="obligorCountry" rules={[{ required: true, message: '请输入国家/地区!' }]}>
            <Input
              disabled={!canSave || !isEdit}
              placeholder="请输入国家/地区"
              value={caseInfo.obligorCountry}
              onChange={e => {
                caseInfo.obligorCountry = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`账龄`} name="ageOfAccount" rules={[{ required: true, message: '请输入账龄!' }]}>
            <Input
              disabled={!canSave || !isEdit}
              placeholder="请输入账龄"
              value={caseInfo.ageOfAccount}
              onChange={e => {
                caseInfo.ageOfAccount = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`债务金额`} name="debtOfAmount" rules={[{ required: true, message: '请输入债务金额!' }]}>
            <Input
              disabled={!canSave || !isEdit}
              type='number'
              placeholder="请输入债务金额"
              value={caseInfo.debtOfAmount}
              onChange={e => {
                caseInfo.debtOfAmount = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`货币类型`} name="currencyType" rules={[{ required: true, message: '请输入货币类型!' }]}>
            <Input
              disabled={!canSave || !isEdit}
              placeholder="请输入货币类型"
              value={caseInfo.currencyType}
              onChange={e => {
                caseInfo.currencyType = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <Form.Item label={`案情简介`} name="caseIntroduction" rules={[{ required: true, message: '请输入案情简介!' }]}>
            <TextArea
              disabled={!canSave || !isEdit}
              rows={3}
              placeholder="请输入案情简介"
              value={caseInfo.caseIntroduction}
              onChange={e => {
                caseInfo.caseIntroduction = e.target.value;
                this.setState({
                  caseInfo,
                })
              }}
            />
          </Form.Item>
          <span className='form-title-4'> 案件附件 </span>
          {!isEdit && caseInfo.iccpCaseEnclosureList && (<span className='file-download' onClick={this.downloadCaseBatch}>下载全部</span>)}
          <div className='clear'></div>
          {caseInfo.iccpCaseEnclosureList && caseInfo.iccpCaseEnclosureList.map((file, index) => {
            return file.isValid === 1 && (
              <div className='file-item' key={index}>
                <div className='file-box'><img className='file-icon' src='/im/ic_im_file.svg' /><span>{file.oldFileName}</span></div>
                <span className='file-tool'><a href={file.webUrl} target="_blank"><img src='/im/ic_im_download.svg' />下载</a></span>
                {canSave && isEdit && <span className='file-tool' onClick={this.replaceFile.bind(this, index)}><img src='/im/ic_im_replace.svg' />替换</span>}
                {canSave && isEdit && <span className='file-tool' onClick={this.deleteFile.bind(this, index)}><img src='/im/ic_im_delete.svg' />删除</span>}
                <div className='clear'></div>
              </div>
            );
          })}
          {canSave && isEdit && <div className='file-item' >
            <div className='file-box'>
              <img className='file-add' src='/im/ic_im_add.svg' />
              <input className='add-file' type="file" ref="fileToSent" onChange={this.addFile} />
            </div>
          </div>}
        </Form>
      </Sider>
    );
  }
}
export default connect(({ chat, user }) => ({
  chat,
  user,
}))(CaseInfo);
