const fs = require("fs");
var path = require("path");
const CRUDConfigurations = require("../../../../CRUD_Config");

let instance = null;
let tableFolderPath =
  __dirname +
  "../../../../../" +
  CRUDConfigurations.reactAppCodeFolderName +
  "/components/table";

class tableCodeService {
  constructor() {} //i am also here if you need me

  static getInstance() {
    if (!instance) {
      instance = new tableCodeService();
    }
    return instance;
  }

  GenerateTableCode(schemaTable, schemaRelations) {
    let tblName = schemaTable.name;
    var tableCode = this.getImports(tblName); //imports
    tableCode += this.generateClassAndState(tblName);
    tableCode += this.generateMethods(tblName);
    tableCode += this.getTableMethods();
    tableCode += this.generateRenderMethod(tblName);
    tableCode += this.generateTableCode(schemaTable, schemaRelations);
    tableCode += this.getPaginationAndCloseBraces(tblName);
    return tableCode;
  }

  getImports(tblName) {
    var filePath = tableFolderPath + "/imports.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    code = code.concat(
      "import { get" +
        tblName +
        "s, delete" +
        tblName +
        ' } from "../../services/' +
        tblName.toLowerCase() +
        'Service";\n\n'
    );
    return code;
  }

  generateClassAndState(tblName) {
    let code = "class " + tblName + "s extends Component{\n";
    code += "  state = {\n";
    code += "    records: [],\n";
    code += "    pageSize: 5,\n";
    code += "    currentPage: 1\n";
    code += "  };\n\n";
    return code;
  }

  generateMethods(tblName) {
    let code = "  async componentDidMount() {\n";
    code +=
      "    const { data:" +
      tblName.toLowerCase() +
      "s } = await get" +
      tblName +
      "s();\n";
    code += "    this.setState({ records:" + tblName.toLowerCase() + "s });\n";
    code += "  }\n\n";

    code += "  handleDelete = async id => {\n";
    code +=
      "    const all" + tblName.toLowerCase() + "s = this.state.records; \n";
    code +=
      "    const " +
      tblName.toLowerCase() +
      "s = all" +
      tblName.toLowerCase() +
      "s.filter(m => m._id !== id);\n";
    code += "    this.setState({ records:" + tblName.toLowerCase() + "s });\n";
    code += "    try {\n";
    code += "      await delete" + tblName + "(id);\n";
    code += '      console.log("Record Successfully deleted.");\n';
    code += "    } catch (ex) {\n";
    code += "      if (ex.response && ex.response.status === 404) {\n";
    code += '         console.log("The record has already been deleted");\n';
    code += "      }\n";
    code +=
      "      this.setState({ records: all" + tblName.toLowerCase() + "s });\n";
    code += "    }\n";
    code += "};\n";

    return code;
  }

  getTableMethods() {
    var filePath = tableFolderPath + "/tableMethods.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    return code;
  }

  generateRenderMethod(tblName) {
    let code = "  render() {\n\n";
    code +=
      "    const { totalCount, data: paginated" +
      tblName +
      "s } = this.getPagedData();\n\n";
    code += "    return (\n";
    code += "      <React.Fragment>\n";
    code += '            <div className="row mt-4">\n';
    code += '              <div className="col-sm-5">\n';
    code += "                    <Link\n";
    code += '                      to="/' + tblName.toLowerCase() + 's/new"\n';
    code += '                      className="btn btn-primary custom-btn"\n';
    code += "                      style={{ marginBottom: 20 }}\n";
    code += "                    >\n";
    code += "                     New " + tblName + "\n";
    code += "                    </Link>\n";
    code += "              </div>\n";
    code += "              { (totalCount === 0)?\n";
    code += '                <div className="col-sm-4">\n';
    code +=
      "                   <p>There are no records to show create a record</p>\n";
    code += "                </div>\n";
    code += "                : \n";
    code += '                <div className="col-sm-2">\n';
    code +=
      "                   <p>There are {totalCount} " +
      tblName.toLowerCase() +
      "s</p>\n";
    code += "                </div>\n";
    code += "              }\n";
    code += "          </div>\n";
    return code;
  }

  generateTableCode(schemaTable, schemaRelations) {
    let tblName = schemaTable.name;
    let tblColumns = schemaTable.columns;
    let firstTable, secondTable, relationType;
    let tableCode = "";
    let keyValue = 0;
    tableCode += '            <div className="table-responsive">\n\n';
    tableCode += '              <table className="table">\n';
    tableCode += "                <thead>\n";
    tableCode += "                    <tr>\n";
    for (var column in tblColumns) {
      keyValue = keyValue + 1;
      tableCode = tableCode.concat(
        '                    <th scope="col" key="' +
          keyValue +
          '" style={{ cursor: "pointer" }}>\n                      '
      );
      tableCode = tableCode.concat(
        tblColumns[column].name + "\n                    </th>\n"
      );
    }
    /*
    if(schemaRelations != null){
      for (var index in schemaRelations) {
        firstTable = schemaRelations[index].firstTable; // get each realtions firstTable 
        if( tblName == firstTable){ // if its same as the currentTable i.e tblName then this relation belongs to current table
          secondTable = schemaRelations[index].secondTable; 
          relationType = schemaRelations[index].relationType; 
          keyValue = keyValue + 1;
          tableCode = tableCode.concat(
            '                    <th scope="col" key="' +
                        keyValue +
              '" style={{ cursor: "pointer" }}>\n                      '
          );

          if(relationType.toLowerCase() == "checkbox" || relationType.toLowerCase() == "multiselect" || relationType.toLowerCase() == "manytomany"){
            tableCode = tableCode.concat(
              "Selected "+ secondTable + "s\n                    </th>\n"
            );
          }
          else if(relationType.toLowerCase() == "radio" || relationType.toLowerCase() == "select"  || relationType.toLowerCase() == "onetomany"){
            tableCode = tableCode.concat(
              secondTable + "\n                    </th>\n"
            );
          }
        }
      }
    }

    */

    tableCode +=
      '                    <th scope="col" key="' +
      (keyValue + 1) +
      '" style={{ cursor: "pointer" }}>\n';
    tableCode += "                      Actions\n";
    tableCode += "                    </th>\n";
    tableCode += "                  </tr>\n";
    tableCode += "                </thead>\n";

    tableCode += "                <tbody>\n";
    tableCode +=
      "                  {paginated" + tblName + "s.map(record => (\n";
    tableCode += "                    <tr key={record._id}>\n";

    keyValue = 0;
    for (var column in tblColumns) {
      keyValue = keyValue + 1;
      tableCode = tableCode.concat(
        '                      <td key="' + keyValue + '">'
      );
      tableCode = tableCode.concat(
        "{record." + tblColumns[column].name + "}</td>\n"
      );
    }

    /*
    
    if(schemaRelations != null){
      for (var index in schemaRelations) {
        firstTable = schemaRelations[index].firstTable; // get each realtions firstTable 
        if( tblName == firstTable){ // if its same as the currentTable i.e tblName then this relation belongs to current table
          secondTable = schemaRelations[index].secondTable; 
          relationType = schemaRelations[index].relationType; 
          
          keyValue = keyValue + 1;
          tableCode = tableCode.concat(
            '                      <td key="' + keyValue + '">'
          );

          if(relationType.toLowerCase() == "checkbox" || relationType.toLowerCase() == "multiselect"  || relationType.toLowerCase() == "manytomany"){
            tableCode = tableCode.concat(
              "{record." + secondTable + "s.length}</td>\n"
            );
          }
          else if(relationType.toLowerCase() == "radio" || relationType.toLowerCase() == "select"  || relationType.toLowerCase() == "onetomany"){
            tableCode = tableCode.concat(
              "{record." + secondTable + ".Name}</td>\n"
            );
          }
        }  
      }
    }

    */

    tableCode = tableCode.concat(
      '                      <td key="' + (keyValue + 1) + '">\n'
    );
    tableCode = tableCode.concat(
      "                              <Link\n" +
        "                                to={`/view" +
        tblName.toLowerCase() +
        "/${record._id}`}\n" +
        '                                className="btn btn-info btn-sm m-1"\n' +
        "                                >\n" +
        "                                View\n" +
        "                              </Link>\n" +
        "                              <Link\n" +
        "                                to={`/" +
        tblName.toLowerCase() +
        "s/${record._id}`}\n" +
        '                                className="btn btn-warning btn-sm m-1"\n' +
        "                                >\n" +
        "                                Update\n" +
        "                              </Link>\n" +
        "                            <button\n" +
        "                              onClick={() => this.handleDelete(record._id)}\n" +
        '                              className="btn btn-danger btn-sm m-1"\n' +
        "                              >\n" +
        "                              Delete\n" +
        "                            </button>\n" +
        "                       </td>\n" +
        "                    </tr>\n" +
        "                  ))}\n" +
        "                </tbody>\n" +
        "              </table>\n" +
        "            </div>\n\n"
    );
    return tableCode;
  }

  getPaginationAndCloseBraces(tblName) {
    var filePath = tableFolderPath + "/paginationAndClose.txt";
    var code = fs.readFileSync(path.resolve(filePath), "utf8");
    code = code.concat("export default " + tblName + "s;\n");
    return code;
  }
}

module.exports = tableCodeService;
