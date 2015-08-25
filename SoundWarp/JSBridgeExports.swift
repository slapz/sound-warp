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
  var app: AppDelegate!
  var events: Dictionary<String, WebScriptObject>!
  
  init(jsBridge: JSBridge, app: AppDelegate)
  {
    self.jsBridge = jsBridge;
    self.app = app;
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
  
  func emit(eventName: NSString, data: NSDictionary) throws -> AnyObject
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
  
  func setTitleVisibility(flag: Bool)
  {
    if flag {
      self.app.window.titleVisibility = NSWindowTitleVisibility.Visible;
    } else {
      self.app.window.titleVisibility = NSWindowTitleVisibility.Hidden;
    }
  }
  
  func setWindowAppearance(flag: Int)
  {
    var appearance: String;
    switch flag {
    case 0: appearance = NSAppearanceNameVibrantLight;
    case 1: appearance = NSAppearanceNameVibrantDark;
    default: appearance = NSAppearanceNameAqua;
    }
    self.app.window.appearance = NSAppearance(named: appearance);
  }
  
  func configureSearchInput(config: WebScriptObject)
  {
    let cfg: NSDictionary = convertJSONToDict(config);

    if cfg["actionOnEndEditing"] != nil {
      self.app.search.sendsActionOnEndEditing = cfg["actionOnEndEditing"] as! Bool;
    }
    if cfg["searchStringImmediately"] != nil {
      self.app.search.sendsSearchStringImmediately = cfg["searchStringImmediately"] as! Bool;
    }
    if cfg["wholeSearchString"] != nil {
      self.app.search.sendsWholeSearchString = cfg["wholeSearchString"] as! Bool;
    }
  }
  
  func setWindowTitle(title: String) -> String
  {
    self.app.window.title = title;
    return self.getWindowTitle();
  }
  
  func getWindowTitle() -> String
  {
    return self.app.window.title;
  }
  
  override class func webScriptNameForSelector(aSelector: Selector) -> String!  {
    switch aSelector {
    case Selector("on:callback:"): return "on"
    case Selector("off:"): return "off"
    case Selector("configureSearchInput:"): return "configureSearchInput"
    case Selector("setTitleVisibility:"): return "setTitleVisibility"
    case Selector("setWindowAppearance:"): return "setWindowAppearance"
    case Selector("setWindowTitle:"): return "setWindowTitle"
    case Selector("getWindowTitle"): return "updateWindowTitle"
    default: return nil
    }
  }
  
  override class func isSelectorExcludedFromWebScript(selector: Selector) -> Bool {
    switch selector {
    case Selector("on:callback:"): return false
    case Selector("off:"): return false
    case Selector("configureSearchInput:"): return false
    case Selector("setTitleVisibility:"): return false
    case Selector("setWindowAppearance:"): return false
    case Selector("updateWindowTitle"): return false
    case Selector("setWindowTitle:"): return false
    case Selector("getWindowTitle"): return false
    default: return true
    }
  }
}