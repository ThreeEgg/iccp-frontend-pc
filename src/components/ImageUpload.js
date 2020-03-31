import React, { Component } from 'react';
import { Upload, Modal } from 'antd';
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
    this.setState({ fileList });
    const { onChange } = this.props;
    if (onChange) {
      onChange(fileList);
    }
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
  };

  render() {
    const { previewVisible, previewImage, fileList, uploadUrl } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={uploadUrl}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default ImageUpload;
