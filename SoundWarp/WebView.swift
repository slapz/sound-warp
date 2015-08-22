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
let MAIN_BUNDLE = NSBundle.mainBundle();

/**
 * Initialize webview component
 * @param {WebView} webview
 * @return WebView
 */
func initWebView(webview: WebView) -> WebView
{
  
  /* Initialize bridge */
  let jsbridge = JSBridge(view: webview);
  
  /* Export global multiply object as instance of JSMultiply */
  jsbridge.export("bridge", value: JSBridgeExports());
  
  let url = NSURL(string: WEBVIEW_BASE_URL);
  let indexBasePath = MAIN_BUNDLE.pathForResource("index", ofType: "html");

  /* Set default content as error message */
  var htmlContent = "Error: Could not load html file!";
  
  /* Load html from file into NSString */
  do {
    htmlContent = try NSString(contentsOfFile: indexBasePath!, encoding: NSUTF8StringEncoding) as String;
  } catch {}
  
  /* Load html into WebView */
  webview.mainFrame.loadHTMLString(htmlContent, baseURL: url);
  
  return webview;
}