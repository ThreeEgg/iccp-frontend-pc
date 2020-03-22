import React from 'react';
import Router from 'next/router';
import LoginLayout from '../layouts/LoginLayout';
import Platform from './platformIndex';
import { Pagination } from 'antd';
import './platformIndex.less';
import './problems.less';

export default class RetrievePWD extends React.Component{
    state = {
        current: 1,
    };
    
    onChange = page => {
        console.log(page);
        this.setState({
          current: page,
        });
    };

    render () {
        return (
            <Platform title="problems" url="/images/ic_header_problems.png">
                <div className="content-t flex flex-align">
                    <p></p>
                    <div className="flex flex-align">
                        <img src="/images/ic_header_problems_black.png"></img>
                        <div>problems</div>
                    </div>
                    <p></p>
                </div>
                <div className="problemsContent-m">
                    <div className="coo-item">
                        <h1>《国际贸易法》解释</h1>
                        <div className="coo-text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum 
                            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. 
                            Proin sodales pulvinar sic tempor. Lorem ipsum dolor sit amet, consectetur 
                            adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet 
                            lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. 
                        </div>
                        <div className="coo-more">More</div>
                    </div>
                    <div className="coo-item">
                        <h1>《国际贸易法》解释</h1>
                        <div className="coo-text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum 
                            laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. 
                            Proin sodales pulvinar sic tempor. Lorem ipsum dolor sit amet, consectetur 
                            adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet 
                            lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. 
                        </div>
                        <div className="coo-more">More</div>
                    </div>
                </div>
                <div className="common-pagination">
                    <Pagination current={this.state.current} onChange={this.onChange} size="small" total={50} />      
                </div>
            </Platform>
        )
    }
}