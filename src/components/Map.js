import React, { Component } from 'react';
import { Button } from 'antd';
import echarts from 'echarts/lib/echarts';
// 引入柱状图（这里放你需要使用的echarts类型 很重要）
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/geo';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/map';
import 'echarts/map/js/world';
import 'echarts/extension/bmap/bmap';

import './Map.less';

import Head from 'next/head';

var defaultZoomScale = 3;

export default class extends Component {
  id = 'map_';
  myChart = null;
  zoomScale = defaultZoomScale;
  option = {
    animationDurationUpdate: 150,
    bmap: {
      center: [120.13066322374, 30.240018034923],
      zoom: defaultZoomScale,
      roam: false,
      mapStyle: {
        styleJson: [
          {
            featureType: 'water',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1',
            },
          },
          {
            featureType: 'land',
            elementType: 'all',
            stylers: {
              color: '#f3f3f3',
            },
          },
          {
            featureType: 'railway',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'highway',
            elementType: 'all',
            stylers: {
              color: '#fdfdfd',
            },
          },
          {
            featureType: 'highway',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'arterial',
            elementType: 'geometry',
            stylers: {
              color: '#fefefe',
            },
          },
          {
            featureType: 'arterial',
            elementType: 'geometry.fill',
            stylers: {
              color: '#fefefe',
            },
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'green',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'subway',
            elementType: 'all',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'manmade',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1',
            },
          },
          {
            featureType: 'local',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1',
            },
          },
          {
            featureType: 'arterial',
            elementType: 'labels',
            stylers: {
              visibility: 'off',
            },
          },
          {
            featureType: 'boundary',
            elementType: 'all',
            stylers: {
              color: '#fefefe',
            },
          },
          {
            featureType: 'building',
            elementType: 'all',
            stylers: {
              color: '#d1d1d1',
            },
          },
          {
            featureType: 'label',
            elementType: 'labels.text.fill',
            stylers: {
              color: '#999999',
            },
          },
        ],
      },
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: [[120, 30, 10], [125, 39, 3], [120, 30, 1], [53, 6, 1]],
        symbolSize(val) {
          return val[2] * 10;
        },
        itemStyle: {
          normal: {
            color: '#ddb926',
          },
        },
      },
    ],
  };

  /**
   * 手动加载百度地图API
   */
  initMap = () => {
    window.initMap = () => {
      this.updateMap();
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'http://api.map.baidu.com/api?v=2.0&ak=RsyPXj9APuxPHxDTR5nPQkz6no2C4Rv2&callback=initMap'; //<-注意 callback回调，同步加载没有&callback
    document.body.appendChild(script);
  };

  updateMap = () => {
    if (!this.myChart) {
      this.myChart = echarts.init(document.getElementById(this.id));
    }
    // 绘制图表
    this.myChart.setOption(this.option);
  };

  updateArea = () => {
    this.option.bmap.zoom = 6;
    this.option.bmap.center = [Math.random() * 180, Math.random() * 90];
    this.updateMap();
  };

  blurArea = () => {
    this.option.bmap.zoom = defaultZoomScale;
    this.updateMap();
  };

  componentWillMount = () => {
    if (typeof window === 'undefined') {
      return;
    }
    this.initMap();
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div id={this.id} style={{ width: '100%', height: '100%' }} />

        {/* 测试那妞 */}
        <div style={{ position: 'absolute', right: 20, top: 100 }}>
          <Button onClick={this.updateArea}>选中随机区域</Button>
          <Button onClick={this.blurArea}>取消选中</Button>
        </div>
      </div>
    );
  }
}
