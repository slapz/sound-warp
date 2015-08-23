//
//  JSBridgeExports.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

class JSBridgeExports : NSObject {
  
  var jsBridge: JSBridge!
  var events: NSMutableDictionary!
  
  init(jsBridge: JSBridge)
  {
    self.jsBridge = jsBridge;
    self.events = NSMutableDictionary();
  }
  
  func on(eventName: String, callback: AnyObject) -> Bool
  {
    self.events[eventName] = callback;
    return true;
  }
  
  func off(eventName: String) -> Bool
  {
    self.events[eventName] = nil;
    return true;
  }
  
  func emit(eventName: String) -> AnyObject
  {
		return self.jsBridge.execWebScript(self.events[eventName] as! WebScriptObject);
  }
  
  override class func webScriptNameForSelector(aSelector: Selector) -> String!  {
    switch aSelector {
    case Selector("on:callback:"): return "on"
    case Selector("off:"): return "off"
    default: return nil
    }
  }
  
  override class func isSelectorExcludedFromWebScript(selector: Selector) -> Bool {
    switch selector {
    case Selector("on:callback:"): return false
    case Selector("off:"): return false
    default: return true
    }
  }
}