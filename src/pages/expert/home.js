import React, { Component, createRef } from 'react';
import { Button, Avatar, Pagination, Modal, Input, message, Form, Popconfirm, Tag } from 'antd';
import {
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import shortId from 'shortid';
import classNames from 'classnames';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';
import { getResponseRateAverage } from '../../common';
import Rate from '../../components/Rate';
import ImageUpload from '../../components/ImageUpload';
import EditableTagGroup from '../../components/EditableTagGroup';
import api from '../../services/api';
import * as expertService from '../../services/expert';
import { importFile, cookieToJson } from '../../utils';
import './home.less';

const { TextArea } = Input;

export default class extends Component {
  static async getInitialProps({ req, res, query }) {
    let userId;
    if (req) {
      // SSR
      const { cookie } = req.headers;

      userId = cookieToJson(cookie).userId;

      if (!userId) {
        // 301 重定向
        res.statusCode = 301;
        if (res.headers) {
          res.headers.location = 'http://baidu.com';
        }
      }
    } else {
      // 客户端
      if (localStorage.userInfo) {
        userId = JSON.parse(localStorage.userInfo).userId;
      } else {
        router.replace('/expert/login');
        return;
      }
    }

    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.getExpertHomePage}`;

    const expertInfoRes = await fetch(`${requestUrl}?userId=${userId}`);
    const expertInfoContent = await expertInfoRes.json();
    const {
      schedule,
      serviceTagList,
      attitudeRateAVG,
      skillRateAVG,
      responseSpeed,
      content,
      introduction,
      cname,
      name,
      image,
    } = expertInfoContent.data;

    return {
      introduction: introduction,
      serviceTag: serviceTagList,
      information: content ? JSON.parse(content) : [],
      userInfo: {
        name,
        image,
      },
      schedule,
      rating: {
        attitudeRateAVG,
        skillRateAVG,
        responseSpeed,
      },
      cname,
    };
  }

  state = {
    serviceTag: [],
    serviceTagModalVisible: false,
    introduction: '',
    editIntroduction: '',
    introductionModalVisible: false,
    editMode: false,
    information: [
      // {
      //   id
      //   images
      //   title
      //   content
      // }
    ],
    currentRate: '综合评分',
  };

  editableTagRef = createRef();

  formsRef = {};

  SortableHandlerItem = SortableHandle(() => <i className="iconfont drag-handler">&#xe6a4;</i>);

  SortableItem = SortableElement(({ value, itemIndex }) => {
    const { SortableHandlerItem } = this;
    const { editMode } = this.state;
    const { title, content, images, id } = value;
    if (!this.formsRef[id]) {
      this.formsRef[id] = createRef();
    }
    const formRef = this.formsRef[id];
    return (
      <div className="expert-home-edit-item">
        <Form
          ref={formRef}
          initialValues={{
            title,
            content,
            images,
          }}
        >
          <Form.Item
            name="title"
            rules={[
              { max: 80, message: '标题在1-80个字符之间' },
              { required: true, message: '请输入标题' },
            ]}
          >
            <div className="title flex flex-align">
              <Input
                className="title-edit flex-1"
                value={title}
                onChange={(e) => this.changeTitle(itemIndex, e)}
                placeholder="标题"
                readOnly={!editMode}
              />
              {/* 移动锚点 */}
              {editMode ? (
                <React.Fragment>
                  <SortableHandlerItem />
                  &nbsp; &nbsp;
                  <Popconfirm
                    title="确认删除？"
                    overlayClassName="expert-home-edit-popover"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => this.removeInformation(itemIndex)}
                  >
                    <i className="iconfont">&#xe695;</i>
                  </Popconfirm>
                </React.Fragment>
              ) : null}
            </div>
          </Form.Item>
          <Form.Item
            name="content"
            rules={[
              { max: 2000, message: '介绍在1-2000个字符之间' },
              { required: true, message: '请输入介绍' },
            ]}
          >
            <TextArea
              className="edit-content"
              autoSize={{ minRows: 4, maxRows: 10 }}
              value={content}
              placeholder="内容"
              onChange={(e) => this.changeContent(itemIndex, e)}
              readOnly={!editMode}
            />
          </Form.Item>
          {/* <Form.Item name='images'> */}
          <div className="img">
            <ImageUpload
              images={images}
              onChange={(fileList) => this.onImageChange(itemIndex, fileList)}
              disabled={!editMode}
            />
          </div>
          {/* </Form.Item> */}
        </Form>
        {editMode ? (
          <div className="add" onClick={() => this.addInformation(itemIndex)}>
            <i className="iconfont">&#xe694;</i>
            &nbsp; ADD
          </div>
        ) : null}
      </div>
    );
  });

  SortableList = SortableContainer(({ items }) => {
    const { SortableItem } = this;
    return (
      <div>
        {items.map((value, index) => (
          // 此处的index会被SortableElement hoc消费掉，不会被传递到SortableItem中
          <SortableItem key={`item-${value.id}`} index={index} itemIndex={index} value={value} />
        ))}
      </div>
    );
  });

  modifyIntroduction = async () => {
    const { editIntroduction } = this.state;
    if (!editIntroduction) {
      return message.error('个人简介不能为空');
    }
    const res = await expertService.saveExpertIndividualIntroduce({
      introduction: editIntroduction,
    });

    if (res.code === '0') {
      message.success('已更新');
      this.setState({ introductionModalVisible: false, introduction: editIntroduction });
    }
  };

  modifyServiceTag = async () => {
    const tags = this.editableTagRef.current.state.tags;
    const serviceIdStr = tags.map((item) => item.id).join(',');
    const res = await expertService.saveServiceTagList({ serviceIdStr });

    if (res.code === '0') {
      message.success('已更新');
      this.setState({ serviceTagModalVisible: false, serviceTag: [...tags] });
    }
  };

  modifyExpertInformation = async () => {
    const { information } = this.state;

    // 检查表单是否都有效
    for (let id in this.formsRef) {
      // 主动触发验证
      const form = this.formsRef[id].current;
      if (!form) {
        continue;
      }
      await form.validateFields();
      const fieldError = form.getFieldsError();
      // 查看是否没有异常
      const hasError = fieldError.find((item) => item.errors.length >= 1);
      if (hasError) {
        message.warn('请按照提示检查您输入的内容');
        return;
      }
    }

    const res = await expertService.saveExpertInformation({ content: JSON.stringify(information) });

    if (res.code === '0') {
      message.success('已更新');
    }

    this.setState({
      editMode: false,
    });
  };

  informationSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ information }) => ({
      information: arrayMove(information, oldIndex, newIndex),
    }));
  };

  changeTitle = (itemIndex, e) => {
    const title = e.target.value.trim();
    const information = [...this.state.information];
    information[itemIndex] = {
      ...information[itemIndex],
      title,
    };

    this.setState({
      information,
    });
  };

  changeContent = (itemIndex, e) => {
    const content = e.target.value.trim();
    const information = [...this.state.information];
    information[itemIndex] = {
      ...information[itemIndex],
      content,
    };

    this.setState({
      information,
    });
  };

  selectImage = async (item, index) => {
    const result = await importFile(['image/png', 'image/jpeg'], true);

    const information = [...this.state.information];
    let files;
    if (!information[index].files) {
      files = [];
    } else {
      files = [...information[index].files];
    }
    const images = [...information[index].images];
    const imageLength = images.length;
    Array.from(result).forEach((file, fileIndex) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const imageUrl = evt.target.result;
        // 控制显示顺序
        const targeIndex = imageLength + fileIndex;

        images[targeIndex] = imageUrl;
        files[targeIndex] = file;

        information[index].images = images;

        this.setState({
          information: information,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  removeImage = (itemIndex, imgIndex) => {
    const information = [...this.state.information];
    const images = [...information[itemIndex].images];

    images.splice(imgIndex, 1);

    information[itemIndex].images = images;

    this.setState({
      information,
    });
  };

  // 图片上传发生变化，就保存到state中
  onImageChange = (itemIndex, imageList) => {
    const information = [...this.state.information];
    const images = imageList.map((item) => {
      if (item.response && item.response.code == '0') {
        return item.response.data.webUrl;
      } else {
        return item.url;
      }
    });

    information[itemIndex].images = images;

    this.setState({
      information,
    });
  };

  addInformation = (index) => {
    const information = [...this.state.information];

    information.splice(index + 1, 0, {
      id: shortId.generate(),
      title: '标题',
      content: '内容',
      images: [],
    });

    this.setState({
      information,
    });
  };

  removeInformation = (targeIndex) => {
    const information = this.state.information.filter((item, index) => {
      // 删除引用，避免内存残留
      delete this.formsRef[item.id];

      return index !== targeIndex;
    });

    this.setState({
      information,
    });
  };

  componentDidMount = () => {
    const { introduction, serviceTag, information } = this.props;
    this.setState({
      introduction,
      serviceTag,
      information,
    });
  };

  render() {
    const {
      introductionModalVisible,
      serviceTagModalVisible,
      introduction,
      editIntroduction,
      serviceTag = [],
      information = [],
      editMode,
      currentRate,
    } = this.state;
    const {
      userInfo: { name, image },
      rating: { attitudeRateAVG, skillRateAVG, responseSpeed },
      cname,
    } = this.props;
    const responseRateAVG = getResponseRateAverage(responseSpeed);
    const averageRate = (attitudeRateAVG + skillRateAVG + responseRateAVG) / 3 || 0;
    const rates = [
      {
        name: '综合评分',
        rate: averageRate,
        text: averageRate.toFixed(1),
        color: '#337AFF',
      },
      {
        name: '服务态度',
        rate: attitudeRateAVG,
        text: attitudeRateAVG.toFixed(1),
        color: '#45D49D',
      },
      {
        name: '专业能力',
        rate: skillRateAVG,
        text: skillRateAVG.toFixed(1),
        color: '#BE1E36',
      },
      {
        name: '回复速度',
        rate: responseRateAVG,
        text: responseRateAVG.toFixed(1),
        color: '#FF8B2F',
      },
    ];

    const { SortableList } = this;

    return (
      <ContentLayoutExpert
        title="个人资料"
        url="/images/ic_hearder_Professor.png"
        removeContentStyle
      >
        <div className="expert-home">
          <div className="user-info flex flex-justifyBetween">
            <div className="user-profile-container flex flex-1 flex-justifyBetween grey-shadow">
              <Avatar shape="square" className="user-profile-avatar" size={206} src={image} />
              <div className="user-profile flex flex-column flex-1">
                {/* 用户信息 */}
                <div className="flex flex-justifyBetween flex-align">
                  <h1 className="name">{name}</h1>
                  <h4 className="location flex">
                    <i className="iconfont">&#xe698;</i>
                    &nbsp;&nbsp; {cname}
                  </h4>
                </div>

                {/* 个人简介 */}
                <div className="brief">
                  <div className="flex flex-justifyBetween">
                    <span className="title">个人简介</span>
                    <span
                      className="action"
                      onClick={() =>
                        this.setState({
                          introductionModalVisible: true,
                          editIntroduction: introduction,
                        })
                      }
                    >
                      <i className="iconfont">&#xe693;</i>
                      &nbsp; Edit
                    </span>
                  </div>
                  <div className="body text-overflow-2">{introduction}</div>
                </div>

                <div className="divider"></div>

                {/* 服务标签 */}
                <div className="service">
                  <div className="flex flex-justifyBetween">
                    <span className="title">服务标签</span>
                    <span
                      className="action"
                      onClick={() => this.setState({ serviceTagModalVisible: true })}
                    >
                      <i className="iconfont">&#xe693;</i>
                      &nbsp; Edit
                    </span>
                  </div>
                  <div className="body text-overflow-2">
                    {serviceTag.map((item) => {
                      const { id, chineseContent, englishContent } = item;
                      return (
                        <Tag type="" key={id}>
                          {chineseContent}
                        </Tag>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="rating flex flex-column flex-algin  grey-shadow"
              onMouseLeave={() => this.setState({ currentRate: '综合评分' })}
            >
              {rates.map((item) => {
                const active = currentRate === item.name;
                return (
                  <div
                    key={item.name}
                    onMouseOver={() => this.setState({ currentRate: item.name })}
                    className={classNames('rating-item flex', {
                      'flex-justifyBetween flex-1 flex-align': !active,
                      'rating-header flex-column': active,
                    })}
                    style={{
                      background: active ? item.color : 'white',
                    }}
                  >
                    {active ? (
                      <React.Fragment>
                        <i className="iconfont decoration">&#xe6af;</i>
                        <b>{item.name}</b>
                        <div className="flex flex-align flex-justifyBetween">
                          <Rate
                            color="white"
                            dismissColor="rgba(255,255,255,0.5)"
                            value={item.rate || 0}
                            max={3}
                          />
                          <strong>{item.text}</strong>
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <span className="text">{item.name}</span>
                        <span className="num">{item.text}</span>
                      </React.Fragment>
                    )}
                  </div>
                );
              })}

              {/* <div className='rating-item flex flex-justifyBetween flex-1 flex-align'>
                <span className='text'>服务态度</span>
                <span className='num'>{attitudeRateAVG.toFixed(1)}</span>
              </div>
              <div className='rating-item flex flex-justifyBetween flex-1 flex-align'>
                <span className='text'>专业能力</span>
                <span className='num'>{skillRateAVG.toFixed(1)}</span>
              </div>
              <div className='rating-item flex flex-justifyBetween flex-1 flex-align'>
                <span className='text'>回复速度</span>
                <span className='num'>{responseRateAVG.toFixed(1)}</span>
              </div> */}
            </div>
          </div>
          {/* <div className="infos flex">
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
                {serviceTag.map((item) => {
                  const { id, chineseContent, englishContent } = item;
                  return <span key={id}>{chineseContent} &nbsp;&nbsp;</span>;
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
            </div> */}
          <div className="detail grey-shadow">
            <div className="bar flex flex-justifyBetween flex-align">
              专家详情
              {!editMode ? (
                <i className="bar-tip iconfont" onClick={() => this.setState({ editMode: true })}>
                  &#xe693;
                </i>
              ) : (
                <div className="bar-tip flex flex-align">
                  请保存您的更改 &nbsp; &nbsp;
                  <ArrowRightOutlined />
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <Button type="primary" size="small" onClick={this.modifyExpertInformation}>
                    Save
                  </Button>
                </div>
              )}
            </div>
            {information.length ? (
              <SortableList
                items={information}
                onSortEnd={this.informationSortEnd}
                pressDelay={300}
                useDragHandle
                lockAxis="y"
                helperClass="dragging"
              />
            ) : editMode ? (
              <div className="expert-home-edit-item">
                <div className="add" onClick={() => this.addInformation(0)}>
                  <i className="iconfont">&#xe694;</i>
                  &nbsp; ADD
                </div>
              </div>
            ) : null}
            {/* <div className="common-pagination">
              <Pagination current={1} onChange={this.onChange} size="small" total={50} />
            </div> */}
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
            onChange={(e) => this.setState({ editIntroduction: e.target.value.slice(0, 400) })}
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
