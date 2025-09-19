import "./test.css";
const Test2 = () => {
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
          <h3>Reading Update</h3>
          <form className="form">
            <table>
                <tr key=""></tr>
            </table>
            <div>
              <label>KWH</label>
              <input type="text" />
            </div>
            <div>
              <label>KVAH</label>
              <input type="text" />
            </div>
            <div>
              <label>A.PF</label>
              <input type="text" />
            </div>
            <div>
              <label>P.PF</label>
              <input type="text" />
            </div>
            <div>
              <label>Differnt Power Factor</label>
              <input type="text" />
            </div>
            <button>submit</button>
          </form>
        </div>
      </div>
      <div className="col-2"></div>
    </div>
  );
};
export default Test2;
