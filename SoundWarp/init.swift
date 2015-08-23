//
//  WebView.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

let WEBVIEW_BASE_URL = "";
let USER_DEFAULTS = NSUserDefaults.standardUserDefaults();

func initApp(app: AppDelegate)
{
  
  /* Initialize JS bridge */
  initJSBridge(app);
  
  /* Load WebView content */
  let content = readHTMLToString(getResourcePath("index", type: "html"), encoding: DEFAULT_ENCODING);
  setWebViewContent(app.webview, content: content as String);
  
  /* Set webview as window's content view */
  app.window.contentView = app.webview;
}

func initJSBridge(app: AppDelegate)
{
  app.jsBridge = JSBridge(view: app.webview);
  app.jsBridgeExports = JSBridgeExports(jsBridge: app.jsBridge);
  
  /* Export bridge as global JS object */
  app.jsBridge.export("bridge", value: app.jsBridgeExports);
}