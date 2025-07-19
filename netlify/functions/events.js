
const fetch = require('node-fetch');
const ICAL = require('ical.js');

let cachedEvents = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

exports.handler = async function (event, context) {
  const icsUrl = process.env.ICAL_URL;
  
  if (!icsUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'ICAL_URL environment variable not set' }),
    };
  }

  try {
    // Check cache first
    const now = Date.now();
    if (cachedEvents && cacheTime && (now - cacheTime) < CACHE_DURATION) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300',
        },
        body: JSON.stringify(cachedEvents),
      };
    }

    const res = await fetch(icsUrl);
    if (!res.ok) throw new Error(`Failed to fetch calendar: ${res.status}`);

    const icsText = await res.text();
    const jcalData = ICAL.parse(icsText);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const events = vevents.map(evt => {
      const e = new ICAL.Event(evt);
      return {
        summary: e.summary,
        description: e.description,
        location: e.location,
        start: e.startDate.toString(),
        end: e.endDate.toString(),
      };
    });

    // Cache the results
    cachedEvents = events;
    cacheTime = now;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
      body: JSON.stringify(events),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
