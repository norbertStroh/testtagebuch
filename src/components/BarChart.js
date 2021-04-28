import { Component } from "react";
import Plotly from 'react-plotly.js';

class BarChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      cntFfp1Chart: 0,
      cntFfp2Chart: 0,
      cntDesinfektionsmittelChart: 0,
      cntHandschuhChart: 0,
      daysBackForChart: 7
    };
      this.perpareChart = this.perpareChart.bind(this);
  }  
    render() {
   
        const {items,daysBackForChart } = this.props;
        let cntHandschuh = 0;
        let cntDesi = 0;
        let cntFfp1 = 0;
        let cntFfp2 = 0;
    
        items.forEach(element => {
          const actdate = Date.parse(new Date()) - (daysBackForChart * 1000 * 60 * 60 * 24);
          const parseddate = Date.parse(element.date);
          if (element.article !== null && parseddate >= actdate) {
            if (element.article === "ffp1") {
              cntFfp1 += parseInt(element.cntArticle);
            } else if (element.article === "ffp2") {
              cntFfp2 += parseInt(element.cntArticle);
            } else if (element.article === "desinfektionsmittel") {
              cntDesi += parseInt(element.cntArticle);
            } else if (element.article === "handschuh") {
              cntHandschuh += parseInt(element.cntArticle);
            } 
          }
        });
        //return <div>{value}</div>;
        return ( <Plotly id="lineChart" data={[
            {
              x: [cntFfp1, cntFfp2,cntDesi,cntHandschuh],
              y: ["ffp1", "ffp2","Desinfek-<br>tionsmittel","Handschuh"],
              type: 'bar',
              opacity:'0.8',
              width:'0.7',
              marker: { color: 'red' },
              orientation: 'h'
            }]}  />);
    }

    perpareChart(days, items) {
      let cntHandschuh = 0;
      let cntDesi = 0;
      let cntFfp1 = 0;
      let cntFfp2 = 0;
  
      items.forEach(element => {
        const actdate = Date.parse(new Date()) - (days * 1000 * 60 * 60 * 24);
        const parseddate = Date.parse(element.date);
        if (element.article !== null && parseddate >= actdate) {
          if (element.article === "ffp1") {
            cntFfp1 += parseInt(element.cntArticle);
          } else if (element.article === "ffp2") {
            cntFfp2 = parseInt(element.cntArticle);
          } else if (element.article === "desinfektionsmittel") {
            cntDesi = parseInt(element.cntArticle);
          } else if (element.article === "handschuh") {
            cntHandschuh = parseInt(element.cntArticle);
          } else {
            //there is something wring
          }
        }
      });
  
      this.setState({ cntDesinfektionsmittelChart: cntDesi, cntHandschuhChart: cntHandschuh, cntFfp1Chart: cntFfp1, cntFfp2Chart: cntFfp2 });
    }
}

export default BarChart;