import "dotenv/config";
import http from "http";

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000";

const code = process.argv[2];
if (!code) {
  const scope = "https://www.googleapis.com/auth/drive";
  const url = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  console.log("1. Visit this URL in your browser and authorize:");
  console.log(url);
  console.log("\n2. After authorizing, you'll be redirected to localhost:3000");
  console.log("   Copy the FULL redirect URL from your browser's address bar.");
  console.log("\n3. Run the script with that URL:");
  console.log('   npx tsx scripts/get-google-token.ts "http://localhost:3000/?code=4/0...&scope=..."');
  process.exit(0);
}

async function main() {
  const url = new URL(code.startsWith("http") ? code : `http://localhost?${code}`);
  const authCode = url.searchParams.get("code");
  if (!authCode) {
    console.log("No code found in the URL. Make sure to pass the full redirect URL.");
    process.exit(1);
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      code: authCode,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const data = await res.json();
  if (data.refresh_token) {
    console.log("\n✅ Success! Add these to your .env file:");
    console.log(`GOOGLE_DRIVE_CLIENT_ID="${CLIENT_ID}"`);
    console.log(`GOOGLE_DRIVE_CLIENT_SECRET="${CLIENT_SECRET}"`);
    console.log(`GOOGLE_DRIVE_REFRESH_TOKEN="${data.refresh_token}"`);
  } else {
    console.log("Error:", JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
