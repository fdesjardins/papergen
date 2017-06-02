const fs = require('fs')
const printer = require('printer')

const config = {
  printer: {
    name: 'Brother_HL-L2300D_series'
  }
}

const formats = {
  JPEG: 'JPEG',
  PDF: 'PDF',
  TEXT: 'TEXT'
}

const printImage = (printer, img, options) => {
  return new Promise((resolve, reject) => {
    return printer.printDirect({
      printer,
      data: img,
      options,
      success: resolve,
      error: reject
    })
  })
}

const getPrinterOptions = () => printer.getPrinters()
  .map(p => ({
    name: p.name,
    options: printer.getPrinterDriverOptions(p.name),
    pageSize: printer.getSelectedPaperSize(p.name),
    formats: printer.getSupportedPrintFormats(p.name)
  }))

if (!module.parent) {
  const img = fs.readFileSync('./out.jpg')
  const options = {
    media: 'Letter',
    PageRegion: {
      Letter: true
    }
  }
  printImage(config.printer.name, img, options)
  console.log(JSON.stringify(getPrinterOptions(), null, 2))
}

//
// printer.printDirect({
//     data: fs.readFileSync('./out.jpg'), // or simple String: "some text"
// 	printer:printerName, // printer name
// 	type: printerFormat, // type: RAW, TEXT, PDF, JPEG, .. depends on platform
//     options: // supported page sizes may be retrieved using getPrinterDriverOptions, supports CUPS printing options
//     {
//         media: 'Letter',
//         'fit-to-page': true
//     },
// 	success:function(jobID){
// 		console.log("sent to printer with ID: "+jobID);
//         var jobInfo = printer.getJob(printerName, jobID);
//         console.log("current job info:"+util.inspect(jobInfo, {depth: 10, colors:true}));
//         if(jobInfo.status.indexOf('PRINTED') !== -1)
//         {
//             console.log('too late, already printed');
//             return;
//         }
//         console.log('cancelling...');
//         var is_ok = printer.setJob(printerName, jobID, 'CANCEL');
// 		console.log("cancelled: "+is_ok);
// 		try{
// 			console.log("current job info:"+ printer.getJob(printerName, jobID), {depth: 10, colors:true});
// 		}catch(err){
// 			console.log('job deleted. err:'+err);
// 		}
// 	},
// 	error:function(err){console.log(err);}
// });
