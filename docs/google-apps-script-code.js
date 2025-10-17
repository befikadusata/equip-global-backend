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
    
    // Validate required fields
    if (!data.fullName || !data.email) {
      response = ContentService
        .createTextOutput(JSON.stringify({error: 'Full Name and Email are required'}))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Get the active sheet - replace 'YOUR_SPREADSHEET_ID' with your actual spreadsheet ID
      const sheet = SpreadsheetApp.openById('1yNORnkg7gy64VISgVOezlcz-oYO4SsKXBh4uPcpoXXo').getActiveSheet();
      
      // Check if it's a contact form submission (has connectionType and consent fields)
      if (data.connectionType !== undefined && data.consent !== undefined) {
        // This is a contact form submission
        // Map connection type to readable format
        const connectionTypeMap = {
          'learn-more': "I'd like to learn more about Equip International",
          'partner-donate': "I want to partner or donate",
          'equip-seminars': "I'm interested in attending Equip Seminars",
          'general-inquiry': "I have a general inquiry"
        };
        
        const connectionTypeReadable = connectionTypeMap[data.connectionType] || data.connectionType;

        // Prepare row data to append to the Google Sheet for contact form
        const rowData = [
          data.fullName,
          data.email,
          data.phone || '',
          data.location || '',
          data.organization || '',
          connectionTypeReadable,
          data.message || '',
          data.contactMethod || 'either',
          data.consent ? 'Yes' : 'No',
          new Date() // Timestamp
        ];
        
        // Append the row to the Google Sheet
        sheet.appendRow(rowData);
        
        response = ContentService
          .createTextOutput(JSON.stringify({message: 'Contact data successfully added to Google Sheet'}))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        // This is a donation form submission (only has basic fields)
        // Prepare row data to append to the Google Sheet for donation form
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
    }
  } catch (error) {
    console.error('Error in function:', error);
    response = ContentService
      .createTextOutput(JSON.stringify({error: 'Failed to add data to Google Sheet'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  response.addHeader("Access-Control-Allow-Origin", "*");
  return response;
}