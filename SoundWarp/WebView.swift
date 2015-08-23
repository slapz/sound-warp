//
//  WebView.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

func setWebViewContent(webview: WebView, content: String)
{
  let url = NSURL(string: WEBVIEW_BASE_URL);
  webview.mainFrame.loadHTMLString(content, baseURL: url);
}