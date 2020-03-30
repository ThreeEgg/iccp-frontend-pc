import { Tag, Input, Select } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';
import { PlusOutlined } from '@ant-design/icons';
import * as commonService from '../services/common';
import './EditableTagGroup.less';

const { Option } = Select;

class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
    allServiceLoading: false,
    allServiceTags: [],
  };

  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag.id !== removedTag.id);
    this.setState({ tags });
  };

  showInput = () => {
    const { allServiceTags } = this.state;
    if (!allServiceTags.length) {
      this.getAllServiceTag();
    }
    this.setState({ inputVisible: true }, () => console.log(this.input.current));
  };

  handleInputChange = val => {
    const { allServiceTags = {} } = this.state;
    const serviceTag = allServiceTags.find(item => item.id == val);
    if (serviceTag) {
      this.handleInputConfirm(serviceTag);
    }
  };

  handleInputConfirm = val => {
    let { tags } = this.state;
    if (val && !tags.find(item => item.id == val.id)) {
      tags = [...tags, val];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };

  saveInputRef = input => (this.input = input);

  forMap = tag => {
    const tagElem = (
      <Tag
        className="tag"
        closable
        style={{ color: '#337aff', background: 'transparent', borderColor: '#337aff' }}
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag.chineseContent}
      </Tag>
    );
    return (
      <span key={tag.id} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  getAllServiceTag = async () => {
    this.setState({ allServiceLoading: true });
    const res = await commonService.getServiceList();

    this.setState({ allServiceLoading: false });
    if (res.code === '0') {
      this.setState({
        allServiceTags: res.data,
      });
    }
  };

  componentDidMount = () => {
    if (this.props.tags) {
      this.setState({
        tags: this.props.tags,
      });
    }
    this.getAllServiceTag();
  };

  render() {
    const { tags, inputVisible, inputValue, allServiceLoading, allServiceTags } = this.state;
    const tagChild = tags.length ? tags.map(this.forMap) : '请添加您的服务标签';
    return (
      <div className="editable-tag-group">
        <div style={{ marginBottom: 16 }}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: e => {
                e.target.style = '';
              },
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        {inputVisible && (
          // <Input
          //   ref={this.saveInputRef}
          //   type="text"
          //   size="small"
          //   style={{ width: '100%' }}
          //   value={inputValue}
          //   onChange={this.handleInputChange}
          //   onBlur={this.handleInputConfirm}
          //   onPressEnter={this.handleInputConfirm}
          // />
          <Select
            ref={this.saveInputRef}
            // value={inputValue}
            style={{ width: '100%' }}
            loading={allServiceLoading}
            onChange={this.handleInputChange}
          >
            {allServiceTags.map(item => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.chineseContent}
                </Option>
              );
            })}
          </Select>
        )}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ width: '100%', textAlign: 'center', borderStyle: 'dashed' }}
          >
            <PlusOutlined /> ADD
          </Tag>
        )}
      </div>
    );
  }
}

export default EditableTagGroup;
