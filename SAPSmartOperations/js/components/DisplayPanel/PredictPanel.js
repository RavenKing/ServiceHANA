import React from "react";
import  ReactHighCharts  from "react-highcharts";
import {Collapse,Card,Row,Col, Switch, Icon,Slider, InputNumber,Select} from "antd";
var Panel= Collapse.Panel;

export default class PredictPanel extends React.Component{
  constructor(props)
  {
    super(props)


    this.state={

      inputValue:1
    }
  }

 ChangeTime(e)
{
  this.setState({inputValue:e.target.value})

}
	render(){
		var config = {
  			xAxis: {
          categories: ['2016-06-01', '2016-07-01', '2016-08-01', '2016-09-01', '2016-10-01', '2016-11-01', '2016-12-01', '2017-01-01', '2017-02-01', '2017-03-01', '2017-04-01', '2017-05-01']
        },
  			yAxis: {
      			title: {
         			text: 'Table Size(GB)',
         			style:{
						    fontSize: '16px'
					     }

      			},
     			  plotLines: [{
         			value: 0,
         			width: 1,
         			color: '#808080'
      			}]
   			},
        title: {
          text:null
        },
        credits: {
          enabled: false
        },
  			series: [
        { 
          name:"History Value",
          data:[29.9, 71.5, 106.4, 129.2, 144.0,176]


        },
        {
  				name:"Simulated(SAP Best Practice)",
    			data: [176,211,253,304,365.438],
          pointStart:5,
          color:"red"
  			},
        {
          name:"Simulated(Current Strategy)",
          data:[176,228,297.1,386,502],
          color:'black',
          pointStart: 5
          

        }]
		};
		return (
      <Card>
			<div>
				<h2>Prediction for Archiving object</h2>
        <Collapse defaultActiveKey={['1']} >
        <Panel header="Control Panel">
        <Row gutter={16}>
      <Col className="gutter-row" span={12}>     

      <span>Retention Time:</span>
      <Slider min={1} max={20} onChange={this.ChangeTime.bind(this)} />
      </Col>
      <Col className="gutter-row" span={12}>    

      <span>Predict Time:</span>
      <Select size="large" defaultValue="lucy" style={{ width: 200 }} >
      <Option value="jack">Next Three Month</Option>
      <Option value="lucy">Next Six Month</Option>
      <Option value="disabled" >Next One Year</Option>
      </Select>
      
      </Col>
    </Row>

        </Panel>
  

        </Collapse>
				<br/>
				<ReactHighCharts config={config}/>
			</div>
</Card>

		)

	}
}