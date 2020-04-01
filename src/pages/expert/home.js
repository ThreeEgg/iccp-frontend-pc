import React, { Component, createRef } from 'react';
import { Button, Avatar, Pagination, Modal, Input, message, Form } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import shortId from 'shortid';
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
  static async getInitialProps({ req, query }) {
    const { cookie } = req.headers;

    const { userId } = cookieToJson(cookie);

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
    information: [
      // {
      //   id
      //   images
      //   title
      //   content
      // }
    ],
  };

  editableTagRef = createRef();

  formsRef = {};

  SortableItem = SortableElement(({ value, itemIndex }) => {
    const { title, content, images, id } = value;
    if (!this.formsRef[id]) {
      this.formsRef[id] = createRef();
    }
    const formRef = this.formsRef[id];
    return (
      <div className="edit">
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
              { max: 80, message: '不超过80个字符' },
              { required: true, message: '请输入标题' },
            ]}
          >
            <div className="title flex flex-align">
              <Input
                className="title-edit flex-1"
                value={title}
                onChange={e => this.changeTitle(itemIndex, e)}
                placeholder="标题"
              />
              <i className="iconfont" onClick={() => this.removeInformation(itemIndex)}>
                &#xe695;
              </i>
            </div>
          </Form.Item>
          <Form.Item
            name="content"
            rules={[
              { max: 2000, message: '不超过2000个字符' },
              { required: true, message: '请输入内容' },
            ]}
          >
            <TextArea
              className="edit-content"
              autoSize={{ minRows: 4, maxRows: 10 }}
              value={content}
              placeholder="内容"
              onChange={e => this.changeContent(itemIndex, e)}
            />
          </Form.Item>
          {/* <Form.Item name='images'> */}
          <div className="img">
            <ImageUpload
              images={images}
              onChange={fileList => this.onImageChange(itemIndex, fileList)}
            />
          </div>
          {/* </Form.Item> */}
        </Form>
        <div className="add" onClick={() => this.addInformation(itemIndex)}>
          <i className="iconfont">&#xe694;</i>
          &nbsp; ADD
        </div>
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
    const serviceIdStr = tags.map(item => item.id).join(',');
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
      await form.validateFields();
      const fieldError = form.getFieldsError();
      // 查看是否没有异常
      const hasError = fieldError.find(item => item.errors.length >= 1);
      if (hasError) {
        return;
      }
    }

    const res = await expertService.saveExpertInformation({ content: JSON.stringify(information) });

    if (res.code === '0') {
      message.success('已更新');
    }
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
      reader.onload = evt => {
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
    const images = imageList.map(item => {
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

  addInformation = index => {
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

  removeInformation = targeIndex => {
    const information = this.state.information.filter((item, index) => index !== targeIndex);

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
      serviceTag,
      information,
    } = this.state;
    const {
      userInfo: { name, image },
      rating: { attitudeRateAVG, skillRateAVG, responseSpeed },
      cname,
    } = this.props;
    const responseRateAVG = getResponseRateAverage(responseSpeed);
    const averageRate = (attitudeRateAVG + skillRateAVG + responseRateAVG) / 3;

    const { SortableList } = this;

    return (
      <ContentLayoutExpert
        title="个人资料"
        url="/images/ic_hearder_Professor.png"
        removeContentStyle
      >
        <div className="expert-home">
          <div className="user-info flex flex-justifyBetween flex-align grey-shadow">
            <div className="flex flex-align">
              <Avatar className="avatar" size={72} src={image} />
              <div className="flex flex-column">
                <h1 className="name">{name}</h1>
                <h4 className="location flex">
                  <i className="iconfont">&#xe698;</i>
                  &nbsp;&nbsp; {cname}
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
            <div className="rating flex flex-column flex-algin flex-1 grey-shadow">
              <div className="info-header flex flex-justifyBetween flex-align">
                <strong>服务评价</strong>
                <i className="iconfont">&#xe68c;</i>
              </div>
              <div className="flex-1 rate">
                <div>
                  <span>综合评分</span>
                  <Rate value={averageRate} max={3} />
                </div>
                <div>
                  <span>服务态度</span>
                  <Rate value={attitudeRateAVG} max={3} />
                </div>
                <div>
                  <span>专业能力</span>
                  <Rate value={skillRateAVG} max={3} />
                </div>
                <div>
                  <span>回复速度</span>
                  <Rate value={responseRateAVG} max={3} />
                </div>
              </div>
            </div>
          </div>
          <div className="detail grey-shadow">
            <div className="bar flex flex-justifyBetween flex-align">
              专家详情
              <Button type="primary" size="small" onClick={this.modifyExpertInformation}>
                Save
              </Button>
            </div>
            {information.length ? (
              <SortableList
                items={information}
                onSortEnd={this.informationSortEnd}
                pressDelay={300}
              />
            ) : (
              <div className="edit">
                <div className="add" onClick={() => this.addInformation(0)}>
                  <i className="iconfont">&#xe694;</i>
                  &nbsp; ADD
                </div>
              </div>
            )}
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
