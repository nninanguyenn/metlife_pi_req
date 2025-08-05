// Utility to call Azure Document Intelligence REST API with a local file
// This is a minimal helper for browser-based file upload

export async function analyzeIdDocument(file: File) {
  // SECURITY: Never hardcode API keys in source code!
  //Replace with your Azure endpoint and key
  const endpoint = "https://your-resource-name.cognitiveservices.azure.com/";
  const key = "your-subscription-key-here";
  const url = `${endpoint}formrecognizer/documentModels/prebuilt-idDocument:analyze?api-version=2023-07-31`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": file.type || "application/octet-stream"
    },
    body: file
  });

  if (!response.ok) {
    throw new Error(`Initial request failed: ${response.statusText}`);
  }

  // The "operation-location" header contains the URL to poll for results
  const operationLocation = response.headers.get("operation-location");
  if (!operationLocation) throw new Error("No operation-location header returned");

  // Poll for result
  let result;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1500));
    const pollRes = await fetch(operationLocation, {
      headers: { "Ocp-Apim-Subscription-Key": key }
    });
    result = await pollRes.json();
    if (result.status === "succeeded") return result.analyzeResult;
    if (result.status === "failed") throw new Error("Analysis failed");
  }
  throw new Error("Timed out waiting for analysis result");
}
