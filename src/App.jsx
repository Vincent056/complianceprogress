import React,{useState,useEffect} from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';

function PlannedStats(props) {
  const total = props.total
  const planned = props.planned
  const unplanned = props.unplanned
  if (props.renderWarning) {
    return <p><b>Warning:</b> Unable to get planned/unplanned controls</p>
  } else {
    return (<div><p>Planned controls:</p>
      <ProgressBar variant="success" now={planned.length} label={`${planned.length} controls`} max={total} />
      <br />
      <RenderControls controls={planned} />
      <hr />

      <p>Unplanned controls:</p>
      <ProgressBar variant="danger" now={unplanned.length} label={`${unplanned.length} controls`} max={total} />
      <br />
      <RenderControls controls={unplanned} />
      <hr />
    </div>);
  }
}

function RenderControls(props) {
  return props.controls.sort().map(function(item, i) {
    const baseCtrl = item.replace(/\(.*\)/, '')
    return <a href={`https://csrc.nist.gov/Projects/risk-management/sp800-53-controls/release-search#!/control?version=5.1&number=${baseCtrl}`} target="_blank" rel="noreferrer">
        <Button className="ControlButton" >{item}</Button>
      </a>
  });
}

function calculateAddressed(data) {
  if (!data["addressed_controls"]) {
    return 0
  }
  const total = data["total_controls"];
  return Number((data["addressed_controls"]["assessed"].length / total) * 100).toFixed()
}

function App() {
  const [data, setData] = useState([]);
  const getData = () => {
    fetch('data/high.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    )
      .then(function (response) {
        console.log(response)
        return response.json();
      })
      .then(function (myJson) {
        console.log(myJson);
        setData(myJson)
      });
  }


  useEffect(()=>{
    getData()
  },[])

  if (!data || Object.keys(data).length === 0) {
    return (<div className="App">
      <p>There's no data to show.</p>
    </div>);
  }
  const blocked = ["AC-10","SA-11","SA-11(2)","SA-11(8)","SC-21","SI-7(5)"];
  const total = data["total_controls"];
  const now = calculateAddressed(data);
  const addressed = data["addressed_controls"]["assessed"];
  const imet = data["addressed_controls"]["inherently"];
  const automated = data["addressed_controls"]["automated"];
  const partial = data["addressed_controls"]["partial"];
  const na_ctrl = data["addressed_controls"]["notapplicable"];
  const unaddressed = data["addressed_controls"]["pending"].filter(n => !blocked.includes(n));
  console.log(unaddressed)


  return (
    <div className="App">
      <div className="AppInner">
        <h1>{data["product_name"].toUpperCase()}:
        Progress for {data["benchmark"]["name"]} {data["benchmark"]["baseline"]}</h1>
        <p>
          This is the progress that the ISC team is doing on evaluating and working
          on the {data["benchmark"]["name"]} {data["benchmark"]["baseline"]} benchmark.
        </p>

        <p>
          If you have any more questions regarding the progress, please contact the team.
        </p>
        <hr />

        <div className="Stats">
          <p>Total progress made, all assessed controls:</p>
          <ProgressBar animated variant="sucess" now={now} label={`${now}%`} />
          <br />
          <RenderControls controls={addressed} />
          <hr />

          <p>Inherently met controls:</p>
          <ProgressBar variant="info" now={imet.length} label={`${imet.length} controls`} max={total} />
          <br />
          <RenderControls controls={imet} />
          <hr />

          <p>Addressed by automated check:</p>
          <ProgressBar variant="info" now={automated.length} label={`${automated.length} controls`} max={total} />
          <br />
          <RenderControls controls={automated} />
          <hr />

          <p>Partially addressed controls:</p>
          <ProgressBar variant="info" now={partial.length} label={`${partial.length} controls`} max={total} />
          <br />
          <RenderControls controls={partial} />
          <hr />

          <p>Unaddressed controls:</p>
          <ProgressBar variant="warning" now={unaddressed.length} label={`${unaddressed.length} controls`} max={total} />
          <br />
          <RenderControls controls={unaddressed} />
          <hr />

          <p>Blocked controls:</p>
          <ProgressBar variant="danger" now={blocked.length} label={`${blocked.length} controls`} max={total} />
          <br />
          <RenderControls controls={blocked} />
          <hr />
          
          <p>Addressed controls not applicable to the benchmark: <b>{na_ctrl.length} controls</b></p>
          <br />
          <RenderControls controls={na_ctrl} />
          <hr />



        </div>
      </div>
    </div>
  );
}

export default App;
