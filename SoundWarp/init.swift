//
//  WebView.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

let ENV = NSProcessInfo.processInfo().environment;
let WEBVIEW_BASE_URL = "";

func initApp(app: AppDelegate)
{
  
  /* Initialize JS bridge */
  initJSBridge(app);
  
  if ENV["DEBUG_ENV"] != nil {
    debugPrint("Debugging mode ON");
  }
  
  enableWebInspector(ENV["DEBUG_ENV"] != nil);
  
  /* Load WebView content */
  let content = readHTMLToString(getResourcePath("index", type: "html"), encoding: DEFAULT_ENCODING);
  setWebViewContent(app.webview, content: content as String);
  
  /* Set webview as window's content view */
  app.webview.drawsBackground = false;
  app.window.contentView = app.webview;
}

func initJSBridge(app: AppDelegate)
{
  app.jsBridge = JSBridge(view: app.webview);
  app.jsBridgeExports = JSBridgeExports(jsBridge: app.jsBridge, app: app);

  /* Export global JS object */
  app.jsBridge.export("chrome", value: app.jsBridgeExports);
}