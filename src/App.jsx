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

      <p>Unplanned controls:</p>
      <ProgressBar variant="danger" now={unplanned.length} label={`${unplanned.length} controls`} max={total} />
      <br />
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

const getData = () => {
  try {
    return require("./data/moderate.json")
  } catch {
    return {}
  }
}

function calculateAddressed(data) {
  if (!data["addressed_controls"]) {
    return 0
  }
  const total = data["total_controls"];
  return Number((data["addressed_controls"]["all"].length / total) * 100).toFixed()
}

function App() {
  var data = getData()

  if (!data || Object.keys(data).length === 0) {
    return (<div className="App">
      <p>There's no data to show.</p>
    </div>);
  }

  const total = data["total_controls"];
  const now = calculateAddressed(data);
  const addressed = data["addressed_controls"]["all"];
  const imet = data["addressed_controls"]["inherently"];
  const scap = data["addressed_controls"]["xccdf"];
  const na_ctrl = data["addressed_controls"]["not applicable"];
  const unaddressed = data["unaddressed"];
  let planned = [];
  const hasPlanned = Object.keys(data["planned"]).length !== 0
  if (hasPlanned) {
    planned = data["planned"];
  }
  const unplanned = data["unplanned"];

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
          <p>Total progress made:</p>
          <ProgressBar animated variant="sucess" now={now} label={`${now}%`} />
          <br />
          <RenderControls controls={addressed} />
          <hr />

          <p>Inherently met controls:</p>
          <ProgressBar variant="info" now={imet.length} label={`${imet.length} controls`} max={total} />
          <br />
          <RenderControls controls={imet} />
          <hr />

          <p>Addressed by OpenSCAP rules:</p>
          <ProgressBar variant="info" now={scap.length} label={`${scap.length} controls`} max={total} />
          <br />
          <RenderControls controls={scap} />
          <hr />

          <p>Addressed controls not applicable to the benchmark: <b>{na_ctrl.length} controls</b></p>
          <br />
          <RenderControls controls={na_ctrl} />
          <hr />

          <p>Unaddressed controls:</p>
          <ProgressBar variant="warning" now={unaddressed.length} label={`${unaddressed.length} controls`} max={total} />
          <br />
          <RenderControls controls={unaddressed} />
          <hr />

          <PlannedStats renderWarning={!hasPlanned} planned={planned} unplanned={unplanned} total={total} />
        </div>
      </div>
    </div>
  );
}

export default App;
