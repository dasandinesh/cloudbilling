import "./test.css";
const Test = () => {
  return (
    <div>
      <div className="row">
        <div className="col-7">
          <h1>UNIFIED ELECTRICAL EXPERTS</h1>
          <h3>12/625c, purachi nagar, Alangulam.</h3>
        </div>
        <div className="col-5">
          <h3>FAROOQ</h3>
          <h3>8526634849</h3> .
        </div>
      </div>
      <div className="row">
        <div className="col-8">
          <div>
            <div className="row">
              <div className="col-4">
                <div>
                  <label>form date</label>
                  <input type="date" />
                </div>
                <div>
                  <label>To date</label>
                  <input type="date" />
                </div>
              </div>
              <div className="col-4">
                <div>
                  <label>secarch by name</label>
                  <input type="text" />
                </div>
                <div>
                  <label>secarch by places</label>
                  <input type="text" />
                </div>
              </div>
              <div className="col-4">
                <select>
                  <option value="">All</option>
                  <option value="option1">NAramal</option>
                  <option value="option2">Low Power Factor</option>
                </select>
              </div>
            </div>
            <table>
              <tr key="">
                <th>S.NO</th>
                <th>Date</th>
                <th>Company </th>
                <th>Place</th>
                <th>Phone</th>
                <th>KWH</th>
                <th>KVAH</th>
                <th>A.PF</th>
                <th>P.PF</th>
                <th>Status</th>
              </tr>
              <tr key="">
                {" "}
                <th>1</th>
                <th>22/07/2024</th>
                <th>Maha LAKSHMI </th>
                <th>Alangulam</th>
                <th>1986129826</th>
                <th>300</th>
                <th>380</th>
                <th>0.87</th>
                <th>0.87</th>
                <th>Low Power Factor</th>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div className="col-2">
        <table>
          <tr key="">
            <th>S.No</th>
            <th></th>
          </tr>
        </table>
      </div>
    </div>
  );
};
export default Test;
