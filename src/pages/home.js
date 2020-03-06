import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import { Spin, Skeleton } from 'antd';

class Home extends React.Component {
  static async getInitialProps(props) {

    return {
    };
  }

  async componentDidMount() {
    await this.props.dispatch({ type: 'index/init' });
  }

  render() {
    const { index, loading } = this.props;
    const { name, count } = index;
    // console.log('rendered!!');
    return (
      <div>
        <Spin spinning={loading}>
          Hi,{name}!! &nbsp;
          <p>count:&nbsp; {count}</p>
        </Spin>
        <p>
          <button onClick={() => { this.props.dispatch({ type: 'index/calculateAsync', delta: 1 }); }} >
            plus
          </button>
        </p>
        <p>
          <button onClick={() => { this.props.dispatch({ type: 'index/calculateAsync', delta: -1 }); }} >
            minus
          </button>
        </p>
        <Skeleton loading={loading} active avatar>
          文章内容
        </Skeleton>
        <p>
          <Link href="/index">
            <a>back</a>
          </Link>
        </p>
      </div>
    );
  }
}

// export default Home;
export default connect(({ index, loading }) => ({ index, loading: loading.models.index }))(Home);
