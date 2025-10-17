function doOptions(e) {
  return ContentService.createTextOutput()
    .addHeader("Access-Control-Allow-Origin", "*")
    .addHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .addHeader("Access-Control-Allow-Headers", "Content-Type");
}

function doGet(e) {
  return ContentService.createTextOutput("Script is running correctly. Use POST requests to submit data.").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  let response;
  try {
    // Parse the request body
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields for donation form
    if (!data.fullName || !data.email) {
      response = ContentService
        .createTextOutput(JSON.stringify({error: 'Full Name and Email are required'}))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Get the active sheet - replace 'YOUR_SPREADSHEET_ID' with your actual spreadsheet ID
      const sheet = SpreadsheetApp.openById('1yNORnkg7gy64VISgVOezlcz-oYO4SsKXBh4uPcpoXXo').getActiveSheet();
      
      // Prepare row data to append to the Google Sheet
      const rowData = [
        data.fullName,
        data.email,
        data.phone || '',
        data.location || '',  // Using location instead of city for consistency
        new Date() // Timestamp
      ];
      
      // Append the row to the Google Sheet
      sheet.appendRow(rowData);
      
      response = ContentService
        .createTextOutput(JSON.stringify({message: 'Donation data successfully added to Google Sheet'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in donation function:', error);
    response = ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to add donation data to Google Sheet'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  response.addHeader("Access-Control-Allow-Origin", "*");
  return response;
}