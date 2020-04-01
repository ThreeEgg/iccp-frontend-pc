import React, { Component, createRef } from 'react';
import { Button, message, Form, Input, Pagination, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import router from 'next/router';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';
import ContentHeader from '../../components/ContentHeader';
import api from '../../services/api';
import * as commonService from '../../services/common';
import * as expertService from '../../services/expert';
import { importFile, cookieToJson } from '../../utils';

import './article.less';

export class Article extends Component {
  static async getInitialProps({ req, query }) {
    const { cookie } = req.headers;

    const { userId } = cookieToJson(cookie);

    const { pageNum = 1 } = query;
    const fetch = require('isomorphic-unfetch');

    const requestUrl = `${api.baseUrl}/api${api.getExpertArticleList}`;

    const articleContentRes = await fetch(
      `${requestUrl}?pageNum=${pageNum}&pageSize=10&userId=${userId}`,
    );
    const articleContent = await articleContentRes.json();
    const articles = articleContent.data.items;
    const pageInfo = articleContent.data.pageInfo;

    return {
      articles,
      pageInfo,
      pageNum: pageNum * 1,
    };
  }

  state = {
    edit: false,
    content: '',
  };

  editorElem = createRef();
  formRef = createRef();

  initEditor = () => {
    const E = require('wangeditor');
    const elem = this.editorElem.current; //获取editorElem盒子
    const editor = new E(elem); //new 一个 editorElem富文本

    // 配置菜单
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'table', // 表格
      'image', // 插入图片
      'video', // 插入视频
      // 'code',  // 插入代码
      'undo', // 撤销
      'redo', // 重复
    ];

    // 最大同时上传数限制
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
    editor.customConfig.customUploadImg = async (files, insert) => {
      const res = await commonService.fileUpload({
        file: files[0],
        fileName: files[0].name,
      });

      if (res.code == '0') {
        insert(res.data.webUrl);
      } else {
        message.error(res.data.errorText);
      }
    };

    editor.customConfig.lang = {
      设置标题: 'Title',
      字号: 'Size',
      文字颜色: 'Color',
      设置列表: 'List',
      有序列表: '',
      无序列表: '',
      对齐方式: 'Align',
      靠左: '',
      居中: '',
      靠右: '',
      正文: 'p',
      链接文字: 'link text',
      链接: 'link',
      上传图片: 'Upload Image',
      网络图片: 'Web',
      图片link: 'image url',
      插入视频: 'Video',
      格式如: 'format',
      上传: 'Upload',
      创建: 'init',
    };
    editor.create(); //创建
    editor.txt.html(this.state.content); //设置富文本默认内容
    // FIXME: 2020.4.1 校验图片大小的提示需要改成message
    editor.customConfig.customAlert = function(info) {
      // info 是需要提示的内容
      message.error(info);
    };

    this.editor = editor;
  };

  save = async () => {
    const form = this.formRef.current;
    const article = this.editor.txt.html();
    form.setFieldsValue({ article: article.replace('<p><br></p>', '') });
    await form.validateFields();
    const fieldError = form.getFieldsError();
    // 查看是否没有异常
    const hasError = fieldError.find(item => item.errors.length >= 1);
    if (hasError) {
      return;
    }

    const { title, brief } = form.getFieldsValue();

    const res = await expertService.saveExpertArticle({
      article,
      title,
      brief,
    });

    if (res.code === '0') {
      message.success('已添加');
      this.setState({
        edit: false,
      });
    }
  };

  onChange = page => {
    router.push('/expert/article?pageNum=' + page);
  };

  remove = id => {
    Modal.confirm({
      title: '警告',
      icon: <ExclamationCircleOutlined />,
      content: '确认要删除该文章吗？',
      okText: '是的',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const res = await expertService.deleteExpertArticle({ id });

        if (res.code === '0') {
          message.success('已删除');
          window.location.reload();
        }
      },
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.edit !== this.state.edit) {
      if (this.state.edit) {
        this.initEditor();
      }
    }
  };

  componentDidMount = () => {
    if (typeof window === 'undefined') {
      return;
    }
  };

  render() {
    const { articles, pageNum, pageInfo } = this.props;
    const { edit } = this.state;

    return (
      <ContentLayoutExpert
        className="expert-article"
        title="My Article"
        url="/images/ic_professor_article.png"
      >
        {!edit ? (
          <div className="expert-article-list">
            <ContentHeader
              title="My Article"
              image="/images/ic_professor_article.png"
              actions={
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={() => this.setState({ edit: true })}
                >
                  新增文章
                </Button>
              }
            />
            {articles.map(article => {
              return (
                <div className="article-item" key={article.id}>
                  <div className="article-title flex flex-align">
                    <div className="flex-1">{article.title}</div>
                    <i className="iconfont" onClick={() => this.remove(article.id)}>
                      &#xe695;
                    </i>
                  </div>
                  <p className="article-content">{article.brief}</p>
                </div>
              );
            })}
            <div className="common-pagination">
              <Pagination
                current={pageNum}
                onChange={this.onChange}
                size="small"
                pageSize={10}
                total={pageInfo.totalResults}
              />
            </div>
          </div>
        ) : (
          <div className="rich-text-editor">
            <div className="editor-navigator flex flex-justifyBetween">
              <div
                className="editor-navigator-back flex flex-align"
                onClick={() => this.setState({ edit: false })}
              >
                <img src="/images/ic_header_leadback.png" />
                &nbsp; 返回
              </div>
              <Button type="primary" size="small" onClick={this.save}>
                Save
              </Button>
            </div>
            {/* 编辑器 */}
            {/* FIXME: 2020.3.31 需要替换为TinyMCE */}
            <Form ref={this.formRef}>
              <Form.Item
                label="标题"
                name="title"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                label="简介"
                name="brief"
                rules={[{ required: true, message: '请输入简介' }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                label="详情"
                name="article"
                rules={[{ required: true, message: '请输入详情' }]}
              >
                {/* 此处通过一个空标签，解决手动操作dom导致的dom残留问题 */}
                <div className="editor" ref={this.editorElem}>
                  <div />
                </div>
              </Form.Item>
            </Form>
          </div>
        )}
      </ContentLayoutExpert>
    );
  }
}

export default Article;
