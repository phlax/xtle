
import {splitPath, joinPath} from "@l10n/xtle/utils";


const pathTests = [
    ["/projects/",
     {"dir": "",
      "filename": "",
      "language": "",
      "project": "",
      "translate": false}],
    ["/projects/PROJECT/",
     {"dir": "",
      "filename": "",
      "language": "",
      "project": "PROJECT",
      "translate": false}],
    ["/LANGUAGE/PROJECT/",
     {"dir": "",
      "filename": "",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": false}],
    ["/LANGUAGE/PROJECT/DIR/",
     {"dir": "DIR",
      "filename": "",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": false}],
    ["/LANGUAGE/PROJECT/DIR1/DIR2/",
     {"dir": "DIR1/DIR2",
      "filename": "",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": false}],
    ["/LANGUAGE/PROJECT/DIR/FILE.PO",
     {"dir": "DIR",
      "filename": "FILE.PO",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": false}],
    ["/LANGUAGE/PROJECT/DIR1/DIR2/FILE.PO",
     {"dir": "DIR1/DIR2",
      "filename": "FILE.PO",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": false}],
    ["/LANGUAGE/PROJECT/FILE.PO",
     {"dir": "",
      "filename": "FILE.PO",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": false}],
    ["/LANGUAGE/PROJECT/translate/",
     {"dir": "",
      "filename": "",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": true}],
    ["/LANGUAGE/PROJECT/translate/FILE.PO",
     {"dir": "",
      "filename": "FILE.PO",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": true}],
    ["/LANGUAGE/PROJECT/translate/DIR/",
     {"dir": "DIR",
      "filename": "",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": true}],
    ["/LANGUAGE/PROJECT/translate/DIR1/DIR2/FILE.PO",
     {"dir": "DIR1/DIR2",
      "filename": "FILE.PO",
      "language": "LANGUAGE",
      "project": "PROJECT",
      "translate": true}]]


test.each(pathTests)(
    "utils.splitPath %s",
    (path, expected) => {
	expect(splitPath(path)).toEqual(expected);
    });


test.each(pathTests)(
    "utils.joinPath %s",
    (path, expected) => {
	expect(joinPath(expected)).toEqual(path);
    });
