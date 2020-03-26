import React from 'react';
import Router from 'next/router';
import LoginLayout from '../layouts/LoginLayout';
import ContentLayout from '../layouts/ContentLayout';

export default class RetrievePWD extends React.Component {
  render() {
    return (
      <ContentLayout title="Article Title" url="/images/ic_header_classcase.png">
        <div className="content-t flex flex-align">
          <p />
          <div className="flex flex-align">
            <img src="/images/ic_header_classcase_black.png" />
            <div>Article Title</div>
          </div>
          <p />
        </div>
        <div className="platformCommonContent-m">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
            sodales pulvinar sic tempor.
          </p>
          <p>
            Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra
            justo commodo. Proin sodales pulvinar sic tempor。Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit
            amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor.
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <img src="/images/img_header_bg.png" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
            sodales pulvinar sic tempor.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
            sodales pulvinar sic tempor.
          </p>
        </div>
        <div className="platformCommonContent-b">页脚信息</div>
      </ContentLayout>
    );
  }
}
