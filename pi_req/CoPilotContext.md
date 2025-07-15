###
I want to achieve a working example of Azure's Document Intelligence service with dynamic local files. For example, a user would upload a file (that matches the expected format) and Azure's Document Intelligence would return the expected data about the document. I'm specifically targeting identity related documents, like: driver's licenses, passports, etc. A user can begin the upload process by clicking a button, which will bring up the native file explorer. Then, after processing, the associated data will be printed to the console and rendered on the screen. That's it for now. 
###
Below, you can find my Azure Document Intelligence service information.

Key1
04f13d2b4faa4529a90dad6909440373
Key2
d38d2bb7b4994e488fced9c0a51c3d67
Location
eastus
Endpoint
https://met-pi-req-resource1.cognitiveservices.azure.com/

###
Sample using plain JS:
/*
  This code sample shows Prebuilt ID Document operations with the Azure AI Document Intelligence client library. 

  To learn more, please visit the documentation - Quickstart: Document Intelligence (formerly Form Recognizer) SDKs
 https://learn.microsoft.com/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?pivots=programming-language-javascript
*/
 
const DocumentIntelligence = require("@azure-rest/ai-document-intelligence").default,
{ getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-document-intelligence");

/*
  Remember to remove the key from your code when you're done, and never post it publicly. For production, use
  secure methods to store and access your credentials. For more information, see 
  https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp#environment-variables-and-application-configuration
*/
const key = "YOUR_FORM_RECOGNIZER_KEY";
const endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT";

// sample document
const idDocumentURL = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/Passport.png"  

async function main() {
 const client = DocumentIntelligence(endpoint, {key:key});
 const initialResponse = await client
     .path("/documentModels/{modelId}:analyze", "prebuilt-idDocument")
     .post({
         contentType: "application/json",
         body: {
             urlSource: idDocumentURL
         },
     });
 
     if (isUnexpected(initialResponse)) {
     throw initialResponse.body.error;
 }

 const poller = getLongRunningPoller(client, initialResponse);
 const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

 const documents = analyzeResult?.documents;
 const result = documents && documents[0];

  if (result) {
    // The identity document model has multiple document types, so we need to know which document type was actually
    // extracted.
    if (result.docType === "idDocument.driverLicense") {
      const { FirstName, LastName, DocumentNumber, DateOfBirth, DateOfExpiration } = result.fields;

      // For the sake of the example, we'll only show a few of the fields that are produced.
      console.log("Extracted a Driver License:");
      console.log("  Name:", FirstName && FirstName.valueString, LastName && LastName.valueString);
      console.log("  License No.:", DocumentNumber && DocumentNumber.valueDate);
      console.log("  Date of Birth:", DateOfBirth && DateOfBirth.valueDate);
      console.log("  Expiration:", DateOfExpiration && DateOfExpiration.valueDate);
    } else if (result.docType === "idDocument.passport") {

      const {
        FirstName,
        LastName,
        DateOfBirth,
        Nationality,
        DocumentNumber,
        CountryRegion,
        DateOfExpiration,
      } = result.fields;

      console.log("Extracted a Passport:");
      console.log("  Name:", FirstName && FirstName.valueString, LastName && LastName.valueString);
      console.log("  Date of Birth:", DateOfBirth && DateOfBirth.valueDate);
      console.log("  Nationality:", Nationality && Nationality.valueCountryRegion);
      console.log("  Passport No.:", DocumentNumber && DocumentNumber.valueString);
      console.log("  Issuer:", CountryRegion && CountryRegion.valueCountryRegion);
      console.log("  Expiration Date:", DateOfExpiration && DateOfExpiration.valueDate);
    } else {
      // The only reason this would happen is if the client library's schema for the prebuilt identity document model is
      // out of date, and a new document type has been introduced.
      console.error("Unknown document type in result:", result);
    }
  } else {
    throw new Error("Expected at least one receipt in the result.");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

###
Sample using Python
/*
  This code sample shows Prebuilt ID Document operations with the Azure AI Document Intelligence client library. 

  To learn more, please visit the documentation - Quickstart: Document Intelligence (formerly Form Recognizer) SDKs
 https://learn.microsoft.com/azure/ai-services/document-intelligence/quickstarts/get-started-sdks-rest-api?pivots=programming-language-javascript
*/
 
const DocumentIntelligence = require("@azure-rest/ai-document-intelligence").default,
{ getLongRunningPoller, isUnexpected } = require("@azure-rest/ai-document-intelligence");

/*
  Remember to remove the key from your code when you're done, and never post it publicly. For production, use
  secure methods to store and access your credentials. For more information, see 
  https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp#environment-variables-and-application-configuration
*/
const key = "YOUR_FORM_RECOGNIZER_KEY";
const endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT";

// sample document
const idDocumentURL = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/Passport.png"  

async function main() {
 const client = DocumentIntelligence(endpoint, {key:key});
 const initialResponse = await client
     .path("/documentModels/{modelId}:analyze", "prebuilt-idDocument")
     .post({
         contentType: "application/json",
         body: {
             urlSource: idDocumentURL
         },
     });
 
     if (isUnexpected(initialResponse)) {
     throw initialResponse.body.error;
 }

 const poller = getLongRunningPoller(client, initialResponse);
 const analyzeResult = (await poller.pollUntilDone()).body.analyzeResult;

 const documents = analyzeResult?.documents;
 const result = documents && documents[0];

  if (result) {
    // The identity document model has multiple document types, so we need to know which document type was actually
    // extracted.
    if (result.docType === "idDocument.driverLicense") {
      const { FirstName, LastName, DocumentNumber, DateOfBirth, DateOfExpiration } = result.fields;

      // For the sake of the example, we'll only show a few of the fields that are produced.
      console.log("Extracted a Driver License:");
      console.log("  Name:", FirstName && FirstName.valueString, LastName && LastName.valueString);
      console.log("  License No.:", DocumentNumber && DocumentNumber.valueDate);
      console.log("  Date of Birth:", DateOfBirth && DateOfBirth.valueDate);
      console.log("  Expiration:", DateOfExpiration && DateOfExpiration.valueDate);
    } else if (result.docType === "idDocument.passport") {

      const {
        FirstName,
        LastName,
        DateOfBirth,
        Nationality,
        DocumentNumber,
        CountryRegion,
        DateOfExpiration,
      } = result.fields;

      console.log("Extracted a Passport:");
      console.log("  Name:", FirstName && FirstName.valueString, LastName && LastName.valueString);
      console.log("  Date of Birth:", DateOfBirth && DateOfBirth.valueDate);
      console.log("  Nationality:", Nationality && Nationality.valueCountryRegion);
      console.log("  Passport No.:", DocumentNumber && DocumentNumber.valueString);
      console.log("  Issuer:", CountryRegion && CountryRegion.valueCountryRegion);
      console.log("  Expiration Date:", DateOfExpiration && DateOfExpiration.valueDate);
    } else {
      // The only reason this would happen is if the client library's schema for the prebuilt identity document model is
      // out of date, and a new document type has been introduced.
      console.error("Unknown document type in result:", result);
    }
  } else {
    throw new Error("Expected at least one receipt in the result.");
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

