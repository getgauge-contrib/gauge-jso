var Table = require("../src/table");
var expect = require("chai").expect;
const timer = require("timers/promises");

describe("ProtoTable parsing", function() {

  var protoTable = {
    headers: {
      cells: [ "Product", "Description" ]
    },
    rows: [
      { cells: [ "Gauge", "Test automation with ease" ] },
      { cells: [ "Mingle", "Agile project management" ] },
      { cells: [ "Snap", "Hosted continuous integration" ] },
      { cells: [ "Gocd", "Continuous delivery platform" ] }
    ]
  };

  var table = new Table(protoTable);

  let getRowData = async function(entry) {
    const rowData = {cells: [entry["Product"], entry["Description"]]};
    await timer.setTimeout(500);
    return rowData;

  };

  it("Should get headers", function () {
    expect(table.headers).to.deep.equal(protoTable.headers);
  });

  it("Should get rows", function () {
    expect(table.rows).to.deep.equal(protoTable.rows);
  });

  describe("Table entries", function () {

    it("Should have correct number of entries", function () {
      var result = [];
      table.entries(entry => result.push(entry));
      expect(result.length).to.equal(4);
    });

    it("Should have correct entry object", function () {
      var result = [];
      table.entries(entry => result.push(entry));
      expect(result[1]).to.deep.equal({
        "Product": "Mingle",
        "Description": "Agile project management"
      });
    });
    it("Should process asynchronous callback action using asyncEntries", async function () {
      let data = [];

      await table.asyncEntries(async function (entry) {
        data.push(await getRowData(entry));
      });

      expect(data).to.deep.equal(protoTable.rows);
    }).timeout(10000);

    it("Should not process asynchronous callback action using entries", async function () {
      let data = [];

      await table.entries(async function (entry) {
        data.push(await getRowData(entry));
      });

      expect(data).to.be.empty;
    });
  });

});
