import React, { Component, createRef } from 'react';
import { Button, message, Form, Input, Pagination, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import router from 'next/router';
import moment from 'moment';
import classNames from 'classnames';
import ContentLayoutExpert from '../../layouts/ContentLayoutExpert';
import ContentHeader from '../../components/ContentHeader';
import api from '../../services/api';
import * as commonService from '../../services/common';
import * as expertService from '../../services/expert';
import { cookieToJson, sizeofString } from '../../utils';

import './article.less';

export class Article extends Component {
  static async getInitialProps({ req, query }) {
    let userId;
    if (req) {
      // SSR
      const { cookie } = req.headers;

      userId = cookieToJson(cookie).userId;
    } else {
      // 客户端
      if (localStorage.userInfo) {
        userId = JSON.parse(localStorage.userInfo).userId;
      } else {
        router.replace('/expert/login');
      }
    }

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
    previewMode: false,
    canEdit: false,
    content: '',
    targetArticleId: null,
  };

  editorElem = createRef();
  editorBarElem = createRef();
  formRef = createRef();

  initEditor = () => {
    const E = require('wangeditor');
    const editor = new E(this.editorBarElem.current, this.editorElem.current); //new 一个 editorElem富文本

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

    // 最大同时上传数限制，不超过2M
    editor.customConfig.uploadImgMaxLength = 1;
    editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024;
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
    editor.customConfig.customAlert = function (info) {
      // info 是需要提示的内容
      message.error(info);
    };

    this.editor = editor;
  };

  save = async () => {
    const { targetArticleId } = this.state;
    const form = this.formRef.current;
    const article = this.editor.txt.html();

    // 默认空白，富文本的html为<p><br></p>，去掉这种情况
    form.setFieldsValue({ article: article.replace('<p><br></p>', '') });
    await form.validateFields();

    // 查看是否没有异常
    const fieldError = form.getFieldsError();
    const hasError = fieldError.find((item) => item.errors.length >= 1);
    if (hasError) {
      return;
    }

    const { title, brief } = form.getFieldsValue();

    const body = {
      article,
      title,
      brief,
    };

    let isUpdate = false;
    // 如果有id，则传id
    if (targetArticleId) {
      body.id = targetArticleId;
      isUpdate = true;
    }

    const res = await expertService.saveExpertArticle(body);

    if (res.code === '0') {
      message.success(isUpdate ? '已更新' : '已添加');

      // FIXME: 2020.4.3 此处考虑不在第一页的话，刷新页面会导致看不到自己刚刚新增的文章
      router.reload();
    }

    this.setEditable(false);
  };

  onChange = (page) => {
    router.push('/expert/article?pageNum=' + page);
  };

  add = () => {
    this.setState({
      previewMode: true,
      targetArticleId: null,
    });
  };

  remove = (id) => {
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

  previewArticle = (articleId, canEdit = false) => {
    const articleData = this.props.articles.find((item) => item.id === articleId);

    if (!articleData) {
      console.log('article not find');
      return;
    }

    const { title, brief, article } = articleData;

    this.setState(
      {
        previewMode: true,
        targetArticleId: articleId,
      },
      () => {
        this.editor.txt.html(article);
        this.setEditable(canEdit);

        this.formRef.current.setFieldsValue({
          title,
          brief,
        });
      },
    );
  };

  setEditable = (canEdit = true) => {
    this.setState(
      {
        canEdit,
      },
      () => {
        this.editor.$textElem.attr('contenteditable', canEdit);
      },
    );
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.previewMode !== this.state.previewMode) {
      if (this.state.previewMode) {
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
    const { previewMode, canEdit } = this.state;

    return (
      <ContentLayoutExpert
        className="expert-article"
        title="My Article"
        url="/images/ic_header_classcase1.png"
      >
        {!previewMode ? (
          <div className="expert-article-list">
            <ContentHeader
              title="My Article"
              image="/images/ic_professor_article.png"
              actions={
                <Button type="link" icon={<PlusOutlined />} onClick={this.add}>
                  新增文章
                </Button>
              }
            />
            {articles.map((article) => {
              return (
                <div
                  className="article-item"
                  key={article.id}
                  onClick={() => this.previewArticle(article.id)}
                >
                  <div className="article-title flex flex-align">
                    <div className="flex-1">{article.title}</div>
                    <span>{moment(new Date(article.updateTime)).format('YYYY/MM/DD')}</span>
                    <i
                      className="iconfont"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.previewArticle(article.id, true);
                      }}
                    >
                      &#xe6a3;
                    </i>
                    <i
                      className="iconfont"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.remove(article.id);
                      }}
                    >
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
          <div className={classNames('rich-text-editor', { 'read-only': !canEdit })}>
            <div className="editor-navigator flex flex-justifyBetween">
              <div
                className="editor-navigator-back flex flex-align"
                onClick={() => this.setState({ previewMode: false })}
              >
                <img src="/images/ic_header_leadback.png" />
                &nbsp; 返回
              </div>
              {canEdit ? (
                <Button type="primary" size="small" onClick={this.save}>
                  Save
                </Button>
              ) : (
                <i className="bar-tip iconfont" onClick={() => this.setEditable(true)}>
                  &#xe693;
                </i>
              )}
            </div>
            {/* 编辑器 */}
            {/* FIXME: 2020.3.31 需要替换为TinyMCE */}
            <Form ref={this.formRef}>
              <Form.Item
                label="标题"
                name="title"
                rules={[
                  { required: true, message: '请输入标题' },
                  { max: 50, message: '最多输入50个字符' },
                ]}
              >
                <Input type="text" readOnly={!canEdit} />
              </Form.Item>
              <Form.Item
                label="简介"
                name="brief"
                rules={[
                  { required: true, message: '请输入简介' },
                  { max: 400, message: '最多输入400个字符' },
                ]}
              >
                <Input.TextArea readOnly={!canEdit} />
              </Form.Item>
              <Form.Item
                label="详情"
                name="article"
                rules={[
                  { required: true, message: '请输入详情' },
                  // 字节数不超过2M
                  ({ getFieldValue }) => ({
                    validator: (rule, value) => {
                      const article = this.editor.txt.html();
                      // 字节数不超过2M
                      const sizeOfArticleRichContent = sizeofString(article);
                      if (sizeOfArticleRichContent <= 2048) {
                        return Promise.resolve();
                      }
                      return Promise.reject('内容不超过2M');
                    },
                  }),
                ]}
              >
                <div>
                  {/* 工具栏 */}
                  <div
                    className="custom-editor-bar"
                    style={{ display: canEdit ? 'flex' : 'none' }}
                    ref={this.editorBarElem}
                  >
                    <div />
                  </div>
                  {/* 此处通过一个空标签，解决手动操作dom导致的dom残留问题 */}
                  <div className="custom-editor-content ant-input" ref={this.editorElem}>
                    <div />
                  </div>
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
