import React, { Component, createRef } from 'react';
import { Button, Avatar, Pagination, Modal, Input, message } from 'antd';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';
import Rate from '../../components/Rate';
import EditableTagGroup from '../../components/EditableTagGroup';
import api from '../../services/api';
import * as expertService from '../../services/expert';
import './home.less';

const { TextArea } = Input;

export default class extends Component {
  static async getInitialProps({ req, query }) {
    const { id = 'A000001' } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.getExpertIndividualIntroduce}`;

    const introductionRes = await fetch(`${requestUrl}?userId=${id}`);
    const introductionContent = await introductionRes.json();
    const introduction = introductionContent.data.introduction;

    const serviceTagRes = await fetch(`${api.baseUrl}/api${api.getServiceTagList}?userId=${id}`);
    const serviceTagContent = await serviceTagRes.json();
    const serviceTag = serviceTagContent.data;

    return {
      introduction,
      serviceTag,
    };
  }

  state = {
    serviceTag: [],
    introduction: '',
    editIntroduction: '',
    introductionModalVisible: false,
    serviceTagModalVisible: false,
  };

  editableTagRef = createRef();

  modifyIntroduction = async () => {
    const { editIntroduction } = this.state;
    const res = await expertService.saveExpertIndividualIntroduce({
      introduction: editIntroduction,
    });

    if (res.code === '0') {
      console.log(res);
      message.success('已更新');
      this.setState({ introductionModalVisible: false, introduction: editIntroduction });
    }
  };

  modifyServiceTag = async () => {
    const tags = this.editableTagRef.current.state.tags;
    const serviceIdStr = tags.map(item => item.id).join(',');
    const res = await expertService.saveServiceTagList({ serviceIdStr });

    if (res.code === '0') {
      console.log(res);
      message.success('已更新');
      this.setState({ serviceTagModalVisible: false });
    }
  };

  componentDidMount = () => {
    const { introduction, serviceTag } = this.props;
    this.setState({
      introduction,
      serviceTag,
    });
  };

  render() {
    const {
      introductionModalVisible,
      serviceTagModalVisible,
      introduction,
      editIntroduction,
      serviceTag,
    } = this.state;
    return (
      <ContentLayoutExpert
        title="Classic Case"
        url="/images/ic_header_classcase.png"
        removeContentStyle
      >
        <div className="expert-home">
          <div className="user-info flex flex-justifyBetween flex-align grey-shadow">
            <div className="flex flex-align">
              <Avatar
                className="avatar"
                size={72}
                src="https://wph-1256148406.cos.ap-shanghai.myqcloud.com/brainselling/65649a1545829.576a7eb99921c.jpg"
              />
              <div className="flex flex-column">
                <h1 className="name">Steven Jackson</h1>
                <h4 className="location flex">
                  <i className="iconfont">&#xe698;</i>
                  &nbsp;&nbsp; North America
                </h4>
              </div>
            </div>
            {/* <i className='iconfont'>&#xe693;</i> */}
          </div>
          <div className="infos flex">
            <div className="introduction flex flex-column flex-1 grey-shadow">
              <div className="info-header flex flex-justifyBetween flex-align">
                <strong>个人简介</strong>
                <i className="iconfont">&#xe683;</i>
              </div>
              <p className="flex-1">{introduction}</p>
              <div
                className="action flex flex-justifyEnd"
                onClick={() =>
                  this.setState({ introductionModalVisible: true, editIntroduction: introduction })
                }
              >
                <i className="iconfont">&#xe693;</i>
              </div>
            </div>
            <div className="service-tag flex flex-column flex-1 grey-shadow">
              <div className="info-header flex flex-justifyBetween flex-align">
                <strong>服务标签</strong>
                <i className="iconfont">&#xe68a;</i>
              </div>
              <p className="flex-1">
                {serviceTag.map(item => {
                  const { id, chineseContent, englishContent } = item;
                  return <span key={id}>{chineseContent}</span>;
                })}
              </p>
              <div className="action flex flex-justifyEnd">
                <i
                  className="iconfont"
                  onClick={() => this.setState({ serviceTagModalVisible: true })}
                >
                  &#xe693;
                </i>
              </div>
            </div>
            <div className="rating flex flex-column flex-algin flex-1 grey-shadow">
              <div className="info-header flex flex-justifyBetween flex-align">
                <strong>服务评价</strong>
                <i className="iconfont">&#xe68c;</i>
              </div>
              <p className="flex-1 rate">
                <div>
                  <span>综合评分</span>
                  <Rate value={2.1} max={3} />
                </div>
                <div>
                  <span>服务态度</span>
                  <Rate value={2.6} max={3} />
                </div>
                <div>
                  <span>专业能力</span>
                  <Rate value={1} max={3} />
                </div>
                <div>
                  <span>回复速度</span>
                  <Rate value={1.6} max={3} />
                </div>
              </p>
            </div>
          </div>
          <div className="detail grey-shadow">
            <div className="bar flex flex-justifyBetween flex-align">
              专家详情
              <Button type="primary" size="small">
                Save
              </Button>
            </div>
            <div className="edit">
              <div className="title flex flex-align">
                <div className="title-edit flex-1" contentEditable />
                <i className="iconfont">&#xe695;</i>
              </div>
              <div className="content">
                Consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor
                sit amet lacus accumsan et viverra justo commodo Aenean euismod bibendum laoreet.
                Proin gravida dolor sit amet lacus accumsan et viverra justo commodo
              </div>
              <div className="img flex">
                {[1, 2, 3].map(item => {
                  return (
                    <div
                      key={item}
                      className="img-item"
                      style={{
                        backgroundImage:
                          'url(https://wph-1256148406.cos.ap-shanghai.myqcloud.com/brainselling/65649a1545829.576a7eb99921c.jpg)',
                      }}
                    >
                      <div className="close flex flex-align flex-justifyCenter">－</div>
                    </div>
                  );
                })}
              </div>
              <div className="add">
                <i className="iconfont">&#xe694;</i>
                &nbsp; ADD
              </div>
            </div>
            <div className="common-pagination">
              <Pagination current={1} onChange={this.onChange} size="small" total={50} />
            </div>
          </div>
        </div>

        <Modal
          title="编辑个人简介"
          centered
          visible={introductionModalVisible}
          maskClosable={false}
          wrapClassName="expert-introduction-modal"
          onOk={this.modifyIntroduction}
          onCancel={() => this.setState({ introductionModalVisible: false })}
        >
          <TextArea
            value={editIntroduction}
            autoSize={{ minRows: 7, maxRows: 12 }}
            allowClear
            onChange={e => this.setState({ editIntroduction: e.target.value.slice(0, 400) })}
          />
          <div className="count-limit flex flex-justifyEnd">{editIntroduction.length} / 400</div>
        </Modal>

        <Modal
          title="编辑服务标签"
          centered
          visible={serviceTagModalVisible}
          maskClosable={false}
          wrapClassName="expert-introduction-modal"
          onOk={this.modifyServiceTag}
          onCancel={() => this.setState({ serviceTagModalVisible: false })}
        >
          <EditableTagGroup ref={this.editableTagRef} tags={serviceTag} />
        </Modal>
      </ContentLayoutExpert>
    );
  }
}
