import React, { Component, createRef } from 'react';
import { Button, Avatar, Pagination, Modal, Input, message } from 'antd';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';
import Rate from '../../components/Rate';
import ImageUpload from '../../components/ImageUpload';
import EditableTagGroup from '../../components/EditableTagGroup';
import api from '../../services/api';
import * as expertService from '../../services/expert';
import { importFile } from '../../utils';
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

    const informationRes = await fetch(
      `${api.baseUrl}/api${api.getExpertInformation}?userId=${id}`,
    );
    const informationContent = await informationRes.json();
    const information = informationContent.data;

    return {
      introduction,
      serviceTag,
      information,
    };
  }

  state = {
    serviceTag: [],
    serviceTagModalVisible: false,
    introduction: '',
    editIntroduction: '',
    introductionModalVisible: false,
    information: [
      {
        title: '标题',
        content: '内容',
        images: [],
      },
    ],
  };

  editableTagRef = createRef();

  SortableItem = SortableElement(({ value, itemIndex }) => {
    const { title, content, images } = value;
    return (
      <div className="edit">
        <div className="title flex flex-align">
          <Input
            className="title-edit flex-1"
            value={title}
            onChange={e => this.changeTitle(itemIndex, e)}
          />
          <i className="iconfont" onClick={() => this.removeInformation(itemIndex)}>
            &#xe695;
          </i>
        </div>
        <TextArea
          className="edit-content"
          autoSize={{ minRows: 4, maxRows: 10 }}
          value={content}
          onChange={e => this.changeContent(itemIndex, e)}
        />
        <div className="img">
          <ImageUpload onChange={fileList => this.onImageChange(itemIndex, fileList)} />
        </div>
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
          <SortableItem key={`item-${value}`} index={index} itemIndex={index} value={value} />
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
      message.success('已更新');
      this.setState({ serviceTagModalVisible: false, serviceTag: [...tags] });
    }
  };

  modifyExpertInformation = async () => {
    const { information } = this.state;
    // 选出所有需要上传的图片，然后上传
    // message.loading('正在上传');
    // console.log(information);
    // for (let i = 0; i < information.length; i++) {
    //   const currentInfo = information[i];
    //   for (let j = 0; j < currentInfo.images.length; j++) {
    //     const image = currentInfo.images[j];
    //     console.log(image);
    //     if (image.match(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/)) {
    //       continue;
    //     }

    //     // 相应去找到文件对象
    //     const file = currentInfo.files[j];
    //     console.log('竟来了');
    //     const res = await commonService.fileUpload({
    //       file,
    //     });

    //     console.log(res);
    //   }
    // }

    const res = await expertService.saveExpertInformation({ content: JSON.stringify(information) });

    if (res.code === '0') {
      console.log(res);
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
    console.log(title);
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
    console.log(itemIndex, imageList);
    const information = [...this.state.information];
    const images = imageList.map(item => {
      if (item.response && item.response.code == '0') {
        return item.response.data.webUrl;
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
      information,
    } = this.state;
    const { SortableList } = this;

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
