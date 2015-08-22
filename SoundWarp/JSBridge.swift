//
//  JSBridge.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

protocol JSBridgeProtocol {
  var webview: WebView! {get set}

  init(view: WebView);
  
  func setWebView(view:WebView) -> Self
  func getWebView() -> WebView

	func getRootScope() -> WebScriptObject
  func export(key: NSString, value: AnyObject) -> Self
}

class JSBridge: NSObject, JSBridgeProtocol {
  
  var webview: WebView!
  
  required init(view: WebView) {
    super.init();

    self.setWebView(view);
  }

  func setWebView(view:WebView) -> Self
  {
    self.webview = view;
    return self;
  }
  
  func getWebView() -> WebView
  {
    return self.webview!;
  }
  
  func getRootScope() -> WebScriptObject {
    return self.getWebView().windowScriptObject;
  }
  
  func export(dict: NSDictionary) -> Self
  {
    for (key, value) in dict {
    	self.getRootScope().setValue(value, forKey: key as! String);
    }
    return self;
  }
  
  func export(key: NSString, value: AnyObject) -> Self
  {
    self.getRootScope().setValue(value, forKey: key as String);
    return self;
  }
  
  func exec(script: NSString) -> AnyObject
  {
    return self.getRootScope().evaluateWebScript(script as String);
  }
}