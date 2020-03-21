import React from 'react';
import Router from 'next/router';
import LoginLayout from '../layouts/LoginLayout';
import Platform from './platformIndex';
import './platformIndex.less';

export default class RetrievePWD extends React.Component{
    render () {
        return (
            <Platform title="Article Title" url="/images/ic_header_classcase.png">
                <div className="content-t flex flex-align">
                    <p></p>
                    <div className="flex flex-align">
                        <img src="/images/ic_header_classcase_black.png"></img>
                        <div>Article Title</div>
                    </div>
                    <p></p>
                </div>
                <div className="platformCommonContent-m">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod 
                        bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra 
                        justo commodo. Proin sodales pulvinar sic tempor.
                    </p>
                    <p>
                        Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan 
                        et viverra justo commodo. Proin sodales pulvinar sic tempor。Lorem ipsum dolor 
                        sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin 
                        gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales 
                        pulvinar sic tempor. 
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    </p>
                    <img src="/images/img_header_bg.png"></img>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod 
                        bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra 
                        justo commodo. Proin sodales pulvinar sic tempor.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod 
                        bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra 
                        justo commodo. Proin sodales pulvinar sic tempor.
                    </p>
                </div>
                <div className="platformCommonContent-b">页脚信息</div>
            </Platform>
        )
    }
}
