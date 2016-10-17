import React from "react";
import DataBlock  from "./DataBlock";




export default class DataPanel extends React.Component {
    
    render() {
		const { articles } = this.props

        return (
 			<div className="data-panel">
            
        		<DataBlock  articles = { articles }> </DataBlock>
        		
 			</div>
            
      );
  }
}
