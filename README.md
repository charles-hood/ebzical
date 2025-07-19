# Ready-to-Deploy iCal Netlify Proxy

This folder contains only the files needed for Netlify deployment.

## Files in this folder:
- `netlify.toml` - Netlify configuration
- `package.json` - Dependencies  
- `netlify/functions/events.js` - Serverless function

## Deployment Steps:

### 1. Deploy THIS folder to Netlify
- Zip this **dist** folder OR
- Drag this **dist** folder to Netlify's deployment area

### 2. Set Environment Variable (CRITICAL)
In Netlify dashboard:
1. Go to **Site settings > Environment variables**
2. Add variable:
   - **Key:** `ICAL_URL`
   - **Value:** `REPLACE WITH YOUR VALUE`
3. **Redeploy** site after adding the variable

### 3. Test
Your function will be at:
`https://your-site-name.netlify.app/.netlify/functions/events`

## Features:
- 5-minute caching
- CORS enabled
- Environment variable security
- Error handling
