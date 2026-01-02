"use client"

import React, { useEffect, useRef, memo } from "react"

function EconomicCalendar() {
  const container = useRef()

  useEffect(() => {
    const script = document.createElement("script")
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = `
        {
          "colorTheme": "dark",
          "isTransparent": false,
          "locale": "en",
          "countryFilter": "tr",
          "importanceFilter": "-1,0,1",
        }`
    container.current.appendChild(script)

    return () => {
      container.current.removeChild(script)
    }
  }, [])

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "120px", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/economic-calendar/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Economic Calendar</span>
        </a>
      </div>
    </div>
  )
}

export default memo(EconomicCalendar)
