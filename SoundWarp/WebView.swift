//
//  WebView.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

let USER_DEFAULTS = NSUserDefaults.standardUserDefaults();

func setWebViewContent(webview: WebView, content: String)
{
  let url = NSURL(string: WEBVIEW_BASE_URL);
  webview.mainFrame.loadHTMLString(content, baseURL: url);
}

func enableWebInspector(flag: Bool)
{
  USER_DEFAULTS.setBool(flag, forKey: "WebKitDeveloperExtras");
  USER_DEFAULTS.synchronize();
}