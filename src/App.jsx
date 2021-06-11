import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

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

function App() {
  // This is a trusted file and will be deployed alongside
  // the app
  var data = require('./moderate.json');
  const capitalized_product = data["product_name"].toUpperCase();
  const total = data["total_controls"];
  const now = Number((data["addressed_controls"]["all"].length / total) * 100).toFixed();
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
      <h1>{capitalized_product}: Progress for {data["benchmark"]["name"]} {data["benchmark"]["baseline"]}</h1>

        <div className="Stats">
          <hr />
          <p>Total progress made:</p>
          <ProgressBar animated variant="sucess" now={now} label={`${now}%`} />
          <br/>

          <p>Inherently met controls:</p>
          <ProgressBar variant="info" now={imet.length} label={`${imet.length} controls`} max={total} />
          <br/>

          <p>Addressed by OpenSCAP rules:</p>
          <ProgressBar variant="info" now={scap.length} label={`${scap.length} controls`} max={total} />
          <br/>

          <p>Addressed controls not applicable to the benchmark: <b>{na_ctrl.length} controls</b></p>
          <br/>

          <p>Unaddressed controls:</p>
          <ProgressBar variant="warning" now={unaddressed.length} label={`${unaddressed.length} controls`} max={total} />
          <br/>

          <PlannedStats renderWarning={!hasPlanned} planned={planned} unplanned={unplanned} total={total} />
        </div>
      </div>
    </div>
  );
}

export default App;
