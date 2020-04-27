import React, { Component } from 'react';
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

var defaultZoomScale = 3;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    if (typeof window === 'undefined') {
      return;
    }
    this.initMap();
  }

  id = 'map_';
  myChart = null;
  zoomScale = defaultZoomScale;
  option = {
    animationDurationUpdate: 150,
    bmap: {
      zoom: defaultZoomScale,
      roam: true,
      mapStyle: {
        styleJson: [
          {
            featureType: 'water',
            elementType: 'all',
            stylers: {
              color: '#b5c8cc',
            },
          },
          {
            featureType: 'land',
            elementType: 'all',
            stylers: {
              color: '#e0ebf0',
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
              color: '#cdd9dd',
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
    tooltip: {
      showContent: true,
      alwaysShowContent: true,
      triggerOn: 'none',
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      textStyle: {
        color: '#000',
      },
      zIndex: 501,
      padding: 10,
      formatter: (params, ticket) => {
        var name = params.data.name;

        return `
          <div class='map-avatar-container flex'>
            <img src="https://test-my-bucket-01.oss-cn-qingdao.aliyuncs.com/skm/2020-03-26/dedfe29a14c0433381895c4e98a68483-CRM0000011.jpg"/>
          </div>
        `;
      },
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: [
          [120, 30, 3],
          [125, 39, 3],
          [110, 25, 2],
          [53, 6, 2],
        ],
        symbolSize(val) {
          return val[2] * 10;
        },
        symbol: (value, params) => {
          return 'image://data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg1MTU2MDAxOTE2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1OTIiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4wLmk0IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjgxIiBoZWlnaHQ9IjgxIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik01MTIgMTUzLjZjLTE1NS4yNjQgMC0yODEuNiAxMjMuMjg5Ni0yODEuNiAyNzQuODE2YTI2OS45NTIgMjY5Ljk1MiAwIDAgMCA0MS4wNDk2IDE0Mi44NDhMNDkyLjU0NCA4ODUuNTI5NmM0LjM2NDggNi41NjY0IDExLjY2MDggMTAuNDgzMiAxOS40NTYgMTAuNDgzMiA3LjgwOCAwIDE1LjEwNC0zLjk0MjQgMTkuNDU2LTEwLjQ4MzJsMjIxLjY0NDgtMzE1LjA3MkEyNjkuMzg4OCAyNjkuMzg4OCAwIDAgMCA3OTMuNiA0MjguNDI4OEM3OTMuNiAyNzYuODY0IDY2Ny4yNzY4IDE1My42IDUxMiAxNTMuNnogbTAgNDI4LjMxMzZjLTc3Ljc2IDAtMTQwLjgtNjMuOTIzMi0xNDAuOC0xNDIuNzcxMnM2My4wNC0xNDIuNzcxMiAxNDAuOC0xNDIuNzcxMiAxNDAuOCA2My45MTA0IDE0MC44IDE0Mi43NzEyYzAgNzguODQ4LTYzLjA0IDE0Mi43NzEyLTE0MC44IDE0Mi43NzEyeiIgZmlsbD0iIzMzN0FGRiIgcC1pZD0iMTU5MyIgZGF0YS1zcG0tYW5jaG9yLWlkPSJhMzEzeC43NzgxMDY5LjAuaTMiIGNsYXNzPSJzZWxlY3RlZCI+PC9wYXRoPjwvc3ZnPg==';
        },
      },
    ],
    brush: {
      // throttleType: 'debounce',
      // throttleDelay: 300,
    },
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

  getUserGeolocation = () => {
    //判断是否支持 获取本地位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        if (res.coords) {
          this.option.bmap.center = [res.coords.longitude, res.coords.latitude];
          // this.updateArea(res.coords.longitude, res.coords.altitude);
          this.updateMap();
        }
      });
    } else {
      // 这里可以上报数据
      console.log('该浏览器不支持定位');
    }
  };

  updateMap = () => {
    if (!this.myChart) {
      // 第一次获取用户地址
      this.getUserGeolocation();
      this.myChart = echarts.init(document.getElementById(this.id));
      this.myChart.on('brushselected', () => {
        console.log('数据放缩了');
        this.myChart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: 0,
        });
      });
    }
    // 绘制图表
    this.myChart.setOption(this.option);
  };

  updateArea = (longitude, latitude, count = 2) => {
    this.option.bmap.zoom = 6;
    this.option.bmap.center = [longitude, latitude];
    this.option.series[0].data = [[longitude, latitude, count]];
    this.updateMap();

    this.myChart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: 0,
      // // 屏幕上的 x 坐标
      // x: longitude,
      // // 屏幕上的 y 坐标
      // y: latitude,
    });
  };

  blurArea = () => {
    this.option.bmap.zoom = defaultZoomScale;
    this.updateMap();
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div id={this.id} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
}
