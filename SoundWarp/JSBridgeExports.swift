//
//  JSBridgeExports.swift
//  SoundWarp
//
//  Created by Dmitry Kholodilin on 23/08/2015.
//  Copyright © 2015 Dmitry Kholodilin. All rights reserved.
//

import Foundation
import WebKit

enum JSBridgeError: ErrorType {
  case NoEventHandler
}

class JSBridgeExports : NSObject {
  
  var jsBridge: JSBridge!
  var events: Dictionary<String, WebScriptObject>!
  
  init(jsBridge: JSBridge)
  {
    self.jsBridge = jsBridge;
    self.events = Dictionary();
  }
  
  func on(eventName: String, callback: WebScriptObject) -> Bool
  {
    self.events[eventName] = callback;
    return true;
  }
  
  func off(eventName: String) -> Bool
  {
    self.events[eventName] = nil;
    return true;
  }
  
  func emit(eventName: NSString, data: NSMutableDictionary) throws -> AnyObject
  {
    if (self.events[eventName as String] != nil) {
      let callback: WebScriptObject = self.events[eventName as String]!;
      let event = self.jsBridge.createJSEvent(data);
      return self.jsBridge.exec(callback, event: event);
    }
    throw JSBridgeError.NoEventHandler;
  }
  
  func emit(eventName: NSString) throws -> AnyObject
  {
    let data = NSMutableDictionary();
    return try self.emit(eventName, data: data);
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