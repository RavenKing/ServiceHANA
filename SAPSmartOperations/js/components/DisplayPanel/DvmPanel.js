import React from "react";

import TableCharts from "./TableCharts";
import StrategyPanel from "./StrategyPanel";
import PredictPanel from "./PredictPanel";

import BestPanel from "./BestPanel";
export default class DvmPanel extends React.Component {
    
    render() {
    const { Page } = this.props;
    const { Article} = this.props;
    var displaydata ;
    
    if(Page == 1)
    {
      displaydata =  <TableCharts Article={Article}></TableCharts>
    }
    else if(Page == 2)
    {

      displaydata =  <StrategyPanel Strategy = { Article }> </StrategyPanel>

    }
    else if(Page == 3)
    {
          displaydata = <BestPanel archobj={Article.ARCHOBJ} articleid={Article.ARTICLE_ID} customerid={Article.CUSTOMER_ID} bestpractice={Article.bestpractice}></BestPanel>
    
    }
    else if(Page == 4){
        displaydata = <PredictPanel/>
    }

        return (
        <div> 
          {displaydata}
        </div>
      );
  }
}

