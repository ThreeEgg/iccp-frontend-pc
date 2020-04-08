import React, { Component } from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../services/api';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export class ImageUpload extends Component {
  state = {
    uploadUrl: '',
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    if (fileList.length > 9) {
      message.destroy();
      message.warn('图片介绍最多9张');
      fileList = fileList.slice(0, 9);
    }

    fileList = fileList.filter(file => {
      if (file.size > 2097152) {
        message.destroy();
        message.warn('上传图片不大于2M');
        return false;
      }
      return true;
    });

    this.setState({ fileList });
    const { onChange } = this.props;
    if (onChange) {
      onChange(fileList);
    }
  };

  // 由于fileList是受控的，为了保持视图与上传逻辑一致，需要onBeforeUpload和onChange具体的实现保持一样的逻辑
  onBeforeUpload = (file, fileList) => {
    // 如果选择的文件和既有的文件相加大于9张，则只上传前9张
    if (fileList.length + this.state.fileList.length > 9) {
      // 当前文件所在index是否处于9之内，判断是否需要上传
      let index = -1;
      fileList.find((item, itemIndex) => {
        if (item.uid === file.uid) {
          index = itemIndex;
          return true;
        }
      });

      // 如果当前的文件位置大于9，则不上传
      if (index + this.state.fileList.length >= 9) {
        return false;
      }
    }
    // 本文件的大小大于2M
    if (file.size > 2097152) {
      return false;
    }
    return true;
  };

  componentDidMount = () => {
    // FIXME: 2020.3.31 此处服务端不应该需要uploadUserId
    let userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      throw new Error('userInfo not exist');
    }
    userInfo = JSON.parse(userInfo);
    const uploadUserId = userInfo.userId;
    const uploadUrl = `/api${api.fileUpload}?type=0&uploadUserId=${uploadUserId}`;

    this.setState({
      uploadUrl,
    });

    // 从images的props同步数据
    const { images } = this.props;

    if (images) {
      this.setState({
        fileList: images.map(url => ({
          uid: url,
          name: 'image',
          status: 'done',
          url,
        })),
      });
    }
  };

  render() {
    const { previewVisible, previewImage, fileList, uploadUrl } = this.state;
    const { max = 9 } = this.props;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div className="clearfix">
        <Upload
          accept="image/png, image/jpeg"
          action={uploadUrl}
          beforeUpload={this.onBeforeUpload}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          multiple
        >
          {fileList.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImageUpload;
